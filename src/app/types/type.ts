type BookType = {
  id: string;
  title: string;
  content: string;
  price: number;
  thumnail: { url: string };
  createdAt: string;
  updatedAt: string;
};

type User = {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

export type Purchase = {
  id: string;
  userId: string;
  bookId: string;
  createdAt: string;
};

export type { BookType, User };
