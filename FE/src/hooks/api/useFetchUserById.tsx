import { useEffect, useState } from 'react';
import { IUser } from '../../types';
import { fetchUserById } from '@/src/services/user';
import { DEFAULT_USER } from '@/src/constant';

interface UseFetchUserByIdProps {
  userId: string;
}

const useFetchUserById = ({ userId }: UseFetchUserByIdProps) => {
  const [user, setUser] = useState<IUser>(DEFAULT_USER);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      setError(false);

      try {
        const fetchedUser = await fetchUserById(userId);
        setUser(fetchedUser.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};

export default useFetchUserById;
