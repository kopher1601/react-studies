import { useRouter } from "next/router";

export default function Page() {
    const router = useRouter();
    const { query } = router.query

    return <h1>Search {query}</h1>;
}