import { useEffect, useState } from 'react';
import { ArticleCardProps } from '../../types';
import { fetchFavoritePosts } from '../../services/post';

const useFetchFavoritePosts = () => {
  const [posts, setPosts] = useState<ArticleCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(false);

      try {
        const favPosts = await fetchFavoritePosts();
        setPosts(favPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};

export default useFetchFavoritePosts;
