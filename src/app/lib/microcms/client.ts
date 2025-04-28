import { BookType } from "@/app/types/type";
import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN!,
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
});

export const getAllBooks = async () => {
  const allBooks = await client.getList<BookType>({
    endpoint: "bookcommerce",
    customRequestInit: {
      cache: "no-store",
    },
  });

  return allBooks;
};

export const getDetailBook = async (contentId: string) => {
  console.log("Fetching book with ID:", contentId);
  const detailBook = await client.getListDetail<BookType>({
    endpoint: "bookcommerce",

    contentId,
  });

  return detailBook;
};
