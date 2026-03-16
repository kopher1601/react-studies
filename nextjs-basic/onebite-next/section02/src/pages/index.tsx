import SearchableLayout from "@/components/searchable-layout";
import styles from "./index.module.css";
import books from "@/mock/books.json"
import BookItem from "@/components/book-item";
import { InferGetServerSidePropsType } from "next";

// 컴포넌트보다 먼저 실행되어서, 컴포넌트에 필요한 데이터를 불러오는 함수
// 오직 서버측에서 실행되는 함수.
export const getServerSideProps = async () => {
  const data = "hello"

  // 반드시 props를 포함하는 객체를 반환해야한다.
  return {
    props: {
      data
    }
  }
}

export default function Home({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(data)
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