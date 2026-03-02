import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <header>
      <Link href="/">index</Link>
      &nbsp;
      <Link href="/search">search</Link>
      &nbsp;
      <Link href="/book/1">book/1</Link>
    </header>
    <Component {...pageProps} />
  </>;
}
