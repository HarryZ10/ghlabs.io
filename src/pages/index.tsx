import { useState, useEffect } from "react";
// import { Page } from "../models/models";
import { useSession } from "next-auth/react";

import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();

  return (
    <main
      className={`w-full`}
    >
    </main>
  );
}
