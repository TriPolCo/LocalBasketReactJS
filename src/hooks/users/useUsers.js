import { useQuery } from "@tanstack/react-query";
import { UserService } from "../../api/services/userService"; 

export function useUsers() {
  const {
    data: response,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return await UserService.getUsers();
    },
  });

  const rawData = response?.data !== undefined ? response.data : response;
  const users = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data)
    ? rawData.data
    : [];

  return {
    users,
    loading,
    error: error?.message || null,
    refetch,
  };
}