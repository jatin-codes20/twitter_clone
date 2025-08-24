import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {Inter} from "next/font/google";

const interFont = Inter({ subsets: ["latin"]});

export default function App({ Component, pageProps }: AppProps) {
  return (
  <div className={interFont.className}>
  <Component {...pageProps} />
  </div>
  );
}
