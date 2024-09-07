import { useEffect, useState } from 'react';
import { ArticleCardProps } from '../../types';
import { fetchAllPosts } from '../../services/post';

const useFetchAllPosts = () => {
  const [posts, setPosts] = useState<ArticleCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(false);

      try {
        const fetchedPosts = await fetchAllPosts();
        setPosts(fetchedPosts.posts || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error, setPosts };
};

export default useFetchAllPosts;
