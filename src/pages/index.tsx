// src/pages/index.tsx

import { useState, useEffect } from "react";
import { Page } from "../models/models";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import { useGameheadsContext } from "../context/context";
import usersSDK from "../sdk/usersAPI";
import SignIn from "./SignIn";
import Dashboard from "./Dashboard";
import PresentationQueue from "./PresentationQueue";
import IdentityCenter from "./IdentityCenter";
import Onboard from "./Onboard";
import AccessRestricted from "../components/utilities/AccessRestricted";

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

  const renderContent = () => {

    if (user && user.profile.users_endorsed_by.length === 0) {
      return <AccessRestricted />
    }
  
    if (!isLoggedIn) {
      return <SignIn />;
    }

    if (user && user.profile.is_new_user) {
      return <Onboard setCurrentPage={setCurrentPage}/>;
    }

    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard projects={projects} user={user} getProjects={async () => { }} />;
      case Page.IdentityCenter:
        return <IdentityCenter user={user} />;
      case Page.PresentationQueue:
        return <PresentationQueue user={user} />;
      default:
        return <Dashboard projects={projects} user={user} getProjects={async () => { }} />;
    }
  };

  return (
    <main>
      <div className="w-full">
        <Navbar user={user} isLoggedIn={isLoggedIn} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        {renderContent()}
      </div>
    </main>
  );
}
