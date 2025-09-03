import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {Inter} from "next/font/google";
import {GoogleOAuthProvider} from "@react-oauth/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
    
import {Toaster} from "react-hot-toast";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const interFont = Inter({ subsets: ["latin"]});
const queryClient=new QueryClient
export default function App({ Component, pageProps }: AppProps) {
  return (
  <div className={interFont.className}>
    <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId="825393117376-sudbk69j634eb2ufguofq3icimacjep8.apps.googleusercontent.com">
      <Component {...pageProps} />
       <Toaster />
       <ReactQueryDevtools></ReactQueryDevtools>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </div>
  );
}
