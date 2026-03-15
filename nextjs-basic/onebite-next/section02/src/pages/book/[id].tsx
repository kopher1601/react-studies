import { useRouter } from "next/router";
import books from "@/mock/books.json"
import styles from "./[id].module.css"

const mockData = books[0];

export default function Page() {
    const router = useRouter();
    const { id } = router.query;

    const { title, subTitle, description, author, publisher, coverImgUrl } = mockData;

    return <div className={styles.container}>
        <div style={{ backgroundImage: `url('${coverImgUrl}')` }} className={styles.cover_img_container}>
            <img src={coverImgUrl} alt={title} />
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.subTitle}>{subTitle}</div>
        <div className={styles.author}>{author} | {publisher}</div>
        <div className={styles.description}>{description}</div>
    </div>
}