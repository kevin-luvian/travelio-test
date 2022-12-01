import { BookDetail } from "../model/BookAPI";

interface FetchedBooksResponse {
  books: Array<BookDetail>;
  total: number;
}

export async function FindAll(
  q: string,
  startIndex: number
): Promise<FetchedBooksResponse> {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${q}&startIndex=${startIndex}`
  );
  const jsonData = await res.json();

  if (res.ok) {
    const bookData = jsonData?.items ?? [];
    const books = bookData.map((d: any) => parseToBookDetail(d));
    const res: FetchedBooksResponse = {
      books: books,
      total: jsonData?.totalItems ?? books.length,
    };
    return res;
  } else {
    throw new Error(jsonData?.error?.message ?? "unknown error");
  }
}

export async function FindByID(id: string): Promise<BookDetail> {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
  const data = await res.json();

  if (res.ok) {
    return parseToBookDetail(data);
  } else {
    throw new Error(data?.error?.message ?? "unknown error");
  }
}

function parseToBookDetail(data: any): BookDetail {
  const detail = new BookDetail();
  detail.id = data?.id ?? "";
  detail.title = data?.volumeInfo?.title ?? "";
  detail.authors = data?.volumeInfo?.authors ?? [];
  detail.rating = data?.volumeInfo?.rating ?? 0;
  detail.thumbnail = data?.volumeInfo?.imageLinks?.thumbnail ?? "";
  return detail;
}
