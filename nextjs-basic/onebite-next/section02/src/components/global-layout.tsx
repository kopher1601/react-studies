import Link from "next/link";
import styles from "./global-layout.module.css"

type Props = {
    children: React.ReactNode
}
export default function GlobalLayout({ children }: Props) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/">📚 ONEBITE BOOKS</Link>
            </header>
            <main className={styles.main}>
                {children}
            </main>
            <footer className={styles.footer}>
                제작 @Kopher
            </footer>
        </div >
    );
}