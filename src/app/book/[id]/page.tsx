import { getDetailBook } from "@/app/lib/microcms/client";
import Image from "next/image";

const DetailBook = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  console.log("params.id in DetailBook:", params.id);
  const book = await getDetailBook(params.id); // ID を使って記事を取得

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <Image
          className="w-full h-80 object-cover object-center"
          src={book.thumnail.url}
          alt={book.title}
          width={700}
          height={700}
        />
        <div className="p-4">
          <h2 className="text-2xl font-bold">{book.title}</h2>
          <div
            className="text-gray-700 mt-2"
            dangerouslySetInnerHTML={{ __html: book.content }}
          />

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              公開日: {new Date(book.createdAt).toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              最終更新: {new Date(book.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailBook;
