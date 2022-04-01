export type PostCardListProps = {
  listTitle: string;
  posts: Post[];
};

export type Post = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  isTop?: boolean;
};
