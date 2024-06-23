import { useState, useEffect } from "react";
import { Page } from "../models/models";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import { useGameheadsContext } from "../context/context";
import usersSDK from "../sdk/usersAPI";
import SignIn from "./SignIn";
import Dashboard from "./Dashboard";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<any>([]);
  
  const {
    setCurrentPage,
    currentPage,
    setIsLoggedIn,
    isLoggedIn,
    setUser,
    user
  } = useGameheadsContext();

  useEffect(() => {
    if (session) {
      setIsLoggedIn(true);
      usersSDK.getCurrentUser().then(async (res) => {
        const data = await res.json();
        setUser(data);
      });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [session, setIsLoggedIn, setUser]);

  // const getClaims = async () => {
  //   const res = await claimsApi.getUserClaims();
  //   const data = await res.json();
  //   if (data.claims) {
  //     setClaims(data.claims);
  //   }
  // };

  return (
    <main>
      <div className="w-full">
        <Navbar user={user} isLoggedIn={isLoggedIn} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        {!isLoggedIn ? (
          <SignIn />
        ) : (
          <>
            {currentPage === Page.Dashboard && <Dashboard projects={projects} user={user} getProjects={async () => {}}/>}
            {currentPage === Page.NewProject && <></>}
            {currentPage === Page.PresentationQueue && <></>}
          </>
        )}
      </div>
    </main>
  );
}
