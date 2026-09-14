import { use } from "react";
import { StatusContext } from "../contexts/StatusContext";

const useUserStatus = () => {
  const statusInfo = use(StatusContext);
  return statusInfo;
};

export default useUserStatus;
