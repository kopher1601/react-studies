import SearchableLayout from "@/components/searchable-layout";
import styles from "./index.module.css";
import books from "@/mock/books.json"
import BookItem from "@/components/book-item";
import { InferGetServerSidePropsType } from "next";
import fetchBooks from "@/lib/fetch-books";

// 컴포넌트보다 먼저 실행되어서, 컴포넌트에 필요한 데이터를 불러오는 함수
// 오직 서버측에서 실행되는 함수.
export const getServerSideProps = async () => {
  const allBooks = await fetchBooks();

  // 반드시 props를 포함하는 객체를 반환해야한다.
  return {
    props: {
      allBooks
    }
  }
}

export default function Home({ allBooks }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(allBooks)
  return (
    <div className={styles.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {books.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {books.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
    </div>
  );
}

Home.getLayout = (page: React.ReactNode) => {
  return <SearchableLayout>
    {page}
  </SearchableLayout>
}