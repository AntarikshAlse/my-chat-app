import Layout from "../../components/Layout";
import Message from "../../components/Message";
import DirectMessage from "../../components/DirectMessage";
import MessageInput from "../../components/MessageInput";
import { useRouter } from "next/router";
import { useStore, addMessage, addDM } from "../../lib/Store";
import { useContext, useEffect, useMemo, useRef } from "react";
import UserContext from "../../lib/UserContext";

const ChannelsPage = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const { user, authLoaded, signOut } = useContext(UserContext);
  const userId = useMemo(() => user?.id, [user]);
  const messagesEndRef = useRef(null);

  // Else load up the page
  const { id: channelId } = router.query;
  let senderId = "";
  if (channelId?.length > 1) {
    senderId = channelId;
  }
  const { messages, channels, directMsg } = useStore(
    senderId ? { senderId, userId } : { channelId }
  );
  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages, directMsg]);

  // redirect to public channel when current channel is deleted
  useEffect(() => {
    // Only Execute when no DM is set i.e: no senderId
    if (!senderId) {
      if (!channels.some((channel) => channel.id === Number(channelId))) {
        router.push("/channels/1");
      }
    }
  }, [channels, channelId]);

  // Render the channels and messages
  return (
    <Layout
      channels={channels}
      activeChannelId={senderId ? senderId : channelId}
    >
      <div className="relative h-screen">
        <div className="Messages h-full pb-16">
          <div className="p-2 overflow-y-auto">
            {senderId
              ? directMsg.map((x) => <DirectMessage key={x.id} message={x} />)
              : messages.map((x) => (
                  <Message key={x.id} message={x} userId={user?.id} />
                ))}
            <div ref={messagesEndRef} style={{ height: 0 }} />
          </div>
        </div>
        <div className="p-2 absolute bottom-0 left-0 w-full">
          <MessageInput
            onSubmit={async (text) => {
              if (senderId) return addDM(text, senderId, user.id);

              return addMessage(text, channelId, user?.id);
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ChannelsPage;
