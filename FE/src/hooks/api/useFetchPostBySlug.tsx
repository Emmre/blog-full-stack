import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArticleCardProps } from '../../types';
import { fetchPostBySlug } from '../../services/post';
import { DEFAULT_POST } from '@/src/constant';

interface UseFetchPostBySlugProps {
  slug: string;
}

const useFetchPostBySlug = ({ slug }: UseFetchPostBySlugProps) => {
  const [post, setPost] = useState<ArticleCardProps>(DEFAULT_POST);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(false);

      try {
        const data = await fetchPostBySlug(slug);
        setPost(data);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          router.push('/blog');
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
};

export default useFetchPostBySlug;
