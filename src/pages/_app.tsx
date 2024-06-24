import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react"
import { GameheadsIdProvider } from "../context/context";
import ToasterProvider from "../providers/ToasterProvider";
import NextNProgress from 'nextjs-progressbar';

export default function App({ Component, pageProps: {
  session,
  ...pageProps
} }: AppProps) {
  return ( 
    <div className="w-full">
      <SessionProvider session={session}>
        <ToasterProvider />
        <NextNProgress />
        <GameheadsIdProvider>
          <Component {...pageProps} />
        </GameheadsIdProvider>
      </SessionProvider>
    </div>
    
  );
}
