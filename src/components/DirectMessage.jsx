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
        } rounded rounded-br-3xl pb-2  pl-3 pr-8 pt-3`}
      >
        <p className="">{message.message}</p>
      </div>
    </div>
  );
};

export default DirectMessage;
