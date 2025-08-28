import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {Inter} from "next/font/google";
import {GoogleOAuthProvider} from "@react-oauth/google"
    
import {Toaster} from "react-hot-toast";

const interFont = Inter({ subsets: ["latin"]});

export default function App({ Component, pageProps }: AppProps) {
  return (
  <div className={interFont.className}>
    <GoogleOAuthProvider clientId="825393117376-sudbk69j634eb2ufguofq3icimacjep8.apps.googleusercontent.com">
      <Component {...pageProps} />
       <Toaster />
      </GoogleOAuthProvider>
     
  </div>
  );
}
