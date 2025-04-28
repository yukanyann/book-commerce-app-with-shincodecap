// "use client";
import { getServerSession } from "next-auth";
import Book from "./components/Book";
import { getAllBooks } from "./lib/microcms/client";
import { nextAuthOptions } from "./lib/next-auth/options";
import { BookType, User } from "./types/type";

export default async function Home() {
  const { contents } = await getAllBooks();
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  let purchaseBookIds: string[] = [];

  if (user) {
    try {
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

      const apiUrl = `${baseUrl}/api/purchases/${user.id}`;
      console.log("User ID:", user.id);
      console.log("Request URL:", apiUrl);

      const response = await fetch(apiUrl, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response received:", {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        // レスポンスの内容を直接文字列として取得
        const rawResponse = await response.text();
        console.log("Raw error response:", rawResponse);

        const errorInfo = {
          userId: user.id,
          requestUrl: apiUrl,
          status: response.status,
          statusText: response.statusText,
          rawResponse: rawResponse,
        };

        console.error("Detailed API Error:", errorInfo);
        throw new Error(
          `API Error: Status ${response.status} - ${
            rawResponse || "No response body"
          }`
        );
      }

      const purchasesData = await response.json();
      console.log("Response data:", purchasesData);

      purchaseBookIds = Array.isArray(purchasesData)
        ? purchasesData.map(
            (purchaseBook: { bookId: string }) => purchaseBook.bookId
          )
        : [];
    } catch (error) {
      console.error("Fetch error:", error);
      purchaseBookIds = [];
    }
  }

  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book Commerce
        </h2>
        {contents.map((book: BookType) => (
          <Book
            key={book.id}
            book={book}
            user={
              user
                ? {
                    id: user.id,
                    name: user.name ?? undefined,
                    email: user.email ?? undefined,
                    image: user.image ?? undefined,
                  }
                : {}
            }
            isPurchased={purchaseBookIds?.includes(book.id)}
          />
        ))}
      </main>
    </>
  );
}
