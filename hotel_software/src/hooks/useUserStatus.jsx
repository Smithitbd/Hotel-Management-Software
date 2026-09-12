import useAuth from "./useAuth";
import useAxios from "./useAxios";
import { useQuery } from "@tanstack/react-query";

const useUserStatus = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosInstance = useAxios();

  const {
    data: status = "Pending",
    isLoading: statusLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userStatus", user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      console.log("Fetching status for:", user.email);

      try {
        const res = await axiosInstance.get(`/users/${user.email}/status`);
        console.log("Status response:", res.data);
        return res.data.status; // "Pending" | "Approved" | "Admin" | "Due"
      } catch (err) {
        // Backend returns 404 + { status: "Pending" } when hotel not found
        if (err.response?.status === 404) {
          console.log("Hotel not found → treating as Pending");
          return "Pending";
        }
        console.error("Status fetch error:", err);
        throw err; // real errors will show in isError
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 2, // optional
  });

  return {
    status,
    statusLoading: authLoading || statusLoading,
    isError,
    error,
    refetch,
  };
};

export default useUserStatus;
