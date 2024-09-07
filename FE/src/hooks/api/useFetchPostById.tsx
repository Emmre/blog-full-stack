import { useEffect, useState } from 'react';
import { ArticleCardProps } from '../../types';
import { fetchPostById } from '../../services/post';
import { DEFAULT_POST } from '@/src/constant';

interface UseFetchPostByIdProps {
  slug: string;
}

const useFetchPostById = ({ slug }: UseFetchPostByIdProps) => {
  const [post, setPost] = useState<ArticleCardProps>(DEFAULT_POST);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(false);

      try {
        const fetchedPost = await fetchPostById(slug);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Failed to fetch post:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
};

export default useFetchPostById;
