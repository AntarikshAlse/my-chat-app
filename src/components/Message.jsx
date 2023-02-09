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
          }   p-2  pr-4 rounded`}
        >
          <p className="text-blue-700 font-bold">{message.author.username}</p>
          <p className="">{message.message}</p>
        </div>
      </>
    </div>
  );
};

export default Message;
