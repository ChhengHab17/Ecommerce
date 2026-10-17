import { useQuery } from '@tanstack/react-query';
import axiosInstance  from '../utils/axoisInstance';

const fetchSeller = async () => {
  const response = await axiosInstance.get('/api/logged-in-seller');
  return response.data.data.seller;
};

const useSeller = () => {
  const {
    data: seller,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['seller'],
    queryFn: fetchSeller,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return { seller, isLoading, isError, error };
};

export default useSeller;
