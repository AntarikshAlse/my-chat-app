import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import UserContext from "../lib/UserContext";
import { addChannel, deleteChannel, supabase } from "../lib/Store";
import TrashIcon from "./TrashIcon";
import { useRouter } from "next/router";
export default function Layout(props) {
  const { signOut, user, userRoles } = useContext(UserContext);
  const router = useRouter();
  const { id } = router.query;

  const [users, setUsers] = useState([]);
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  };

  const newChannel = async () => {
    const slug = prompt("Enter Channel name");
    if (slug) {
      addChannel(slugify(slug), user.id);
    }
  };

  const fetchUsers = async () => {
    try {
      let { data } = await supabase.from("users").select(`*`);
      setUsers(data);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="main flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <nav
        className="w-64 bg-gray-900 text-gray-100 overflow-scroll "
        style={{ maxWidth: "20%", minWidth: 150, maxHeight: "100vh" }}
      >
        <div className="p-2 ">
          <div className="p-2">
            <button
              className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"
              onClick={() => newChannel()}
            >
              New Channel
            </button>
          </div>
          <hr className="m-2" />
          <div className="p-2 flex flex-col space-y-2">
            <p className="font-semibold">{user?.email}</p>
            <button
              className="bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded w-full transition duration-150"
              onClick={() => signOut()}
            >
              Log out
            </button>
          </div>
          <hr className="m-2" />
          <h4 className="font-bold">Channels</h4>
          <ul className="channel-list">
            {props.channels.map((x, index) => (
              <SidebarItem
                channel={x}
                keyId={index}
                isActiveChannel={x.id === Number(props.activeChannelId)}
                user={user}
                userRoles={userRoles}
              />
            ))}
          </ul>
          <hr className="m-2" />
          <h4 className="font-bold">Users Online</h4>
          <Users
            users={users}
            activeChannelId={props.activeChannelId}
            currentUser={user?.email}
            supabase={supabase}
          />
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1  h-screen">{props.children}</div>
    </main>
  );
}

const SidebarItem = ({ channel, isActiveChannel, user, keyId, userRoles }) => (
  <>
    <li
      className={`flex items-center justify-between my-1 ${
        isActiveChannel && "text-green-400 border rounded p-1 "
      }`}
      key={keyId}
    >
      <Link href="/channels/[id]" as={`/channels/${channel.id}`}>
        <span>{channel.slug}</span>
      </Link>
      {channel.id !== 1 &&
        (channel.created_by === user?.id || userRoles.includes("admin")) && (
          <button onClick={() => deleteChannel(channel.id)}>
            <TrashIcon />
          </button>
        )}
    </li>
  </>
);
export const Users = ({ users, currentUser, supabase, activeChannelId }) => {
  const [onlineUsers, setOnline] = useState([]);
  const [id, setId] = useState("");
  const onlinePresense = supabase.channel("presence");
  useEffect(() => {
    onlinePresense.on("presence", { event: "sync" }, async () => {
      let userOnline = onlinePresense.presenceState();
      let activeUser = Object.values(userOnline).map((key) => key[0].user);
      setOnline(activeUser);
    });
    onlinePresense.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await onlinePresense.track({ user: currentUser });
      }
    });

    console.log("🚀 ~ file: Layout.jsx:116 ~ Users ~ onlineUsers", onlineUsers);
  }, [activeChannelId]);
  return (
    <>
      <ul className="text-md">
        {users?.map((item, index) => (
          <>
            <li
              key={index}
              className={
                item.id === activeChannelId
                  ? "border rounded text-green-400 flex pl-1"
                  : "flex"
              }
            >
              <Link href={`/channels/${item.id}`}>
                <p className={item.id === activeChannelId ? "text-lg" : ""}>
                  {item.username}
                </p>
              </Link>
              <span className="p-1">
                <svg height="20" width="20">
                  <circle
                    cx="10"
                    cy="10"
                    r="5"
                    strokeWidth="3"
                    fill={
                      onlineUsers.includes(item.email) ? "#3BA55C" : "#AF3C40"
                    }
                  />
                </svg>
              </span>
            </li>
          </>
        ))}
      </ul>
    </>
  );
};
