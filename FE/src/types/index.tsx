export interface ArticleCardProps {
  id: string;
  title: string;
  backgroundImage: string;
  content: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  actions?: {
    bookmarkColor?: string;
    shareColor?: string;
  };
  slug: string;
  categories: ICategory[];
  isFavorite?: boolean;
  extraFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: number;
  name: string;
}

export interface IUser {
  id: string;
  username: string;
  password: string;
  fullname: string;
  image: string;
  createdAt: string;
  posts: ArticleCardProps[];
}

export type ISkeletonStyle = 'postLists' | 'postDetail' | 'editPost' | 'editPostList' | 'editProfile';
