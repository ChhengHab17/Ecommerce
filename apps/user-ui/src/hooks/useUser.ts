import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../app/utils/axoisInstance";


const fetchUser = async () => {
    const response = await axiosInstance.get("/api/loggedinUser");
    return response.data.user;
}

const useUser = () => {
    const { data: user, isLoading, isError, error } = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
    return { user, isLoading, isError, error };
}

export default useUser;