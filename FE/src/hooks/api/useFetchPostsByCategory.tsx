import { useEffect, useState } from 'react';
import { ArticleCardProps } from '../../types';
import { fetchPostsByCategory } from '../../services/post';

interface UseFetchPostsByCategoryProps {
  slug: string;
}

const useFetchPostsByCategory = ({ slug }: UseFetchPostsByCategoryProps) => {
  const [posts, setPosts] = useState<ArticleCardProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!slug) return;

    const fetchPosts = async () => {
      setLoading(true);
      setError(false);

      try {
        const tagPosts = await fetchPostsByCategory(slug);
        setPosts(tagPosts.posts || []);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [slug]);

  return { posts, loading, error, setPosts };
};

export default useFetchPostsByCategory;
