import { useContext } from "react";
import UserContext from "../lib/UserContext";
const Message = ({ message, userId }) => {
  const { user, userRoles } = useContext(UserContext);

  return (
    <div className="py-1 flex items-center space-x-2">
      <>
        <div
          className={`${
            message.user_id === userId
              ? "bg-green-400 ml-5 "
              : "border ml-auto mr-5"
          } pr-8 rounded p-2 rounded rounded-br-3xl pb-2 pl-3 py-6`}
        >
          <p className="text-blue-700 font-bold">{message.author.username}</p>
          <p className="">{message.message}</p>
        </div>
      </>
    </div>
  );
};

export default Message;
