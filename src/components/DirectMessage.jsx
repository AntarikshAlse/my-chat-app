import { useContext } from "react";
import UserContext from "../lib/UserContext";

const DirectMessage = ({ message }) => {
  const { user, userRoles } = useContext(UserContext);

  return (
    <div className="py-1 flex items-center space-x-2">
      <div
        className={`${
          user?.id === message.sender_id
            ? "bg-green-400 ml-5"
            : "border ml-auto mr-5"
        } p-2  pr-4 rounded`}
      >
        <p className="">{message.message}</p>
      </div>
    </div>
  );
};

export default DirectMessage;
