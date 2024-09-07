import { ArticleCardProps, IUser } from '../types';

export const DEFAULT_POST: ArticleCardProps = {
  id: '',
  title: '',
  content: '',
  categories: [],
  backgroundImage: '',
  slug: '',
  author: {
    id: '',
    name: '',
    image: '',
  },
  createdAt: '',
  updatedAt: '',
};

export const DEFAULT_USER: IUser = {
  id: '',
  username: '',
  fullname: '',
  image: '',
  createdAt: '',
  posts: [],
  password: '',
};
