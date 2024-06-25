
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import { useGameheadsContext } from "../../context/context";
import { ProfileView } from '../../components/ProfileView';
import usersSDK from '../../sdk/usersAPI';

const Profile = () => {
    const router = useRouter();
    const { profileId } = router.query;
    const [profile, setProfile] = useState<any>();

    const { setCurrentPage, currentPage,
        setIsLoggedIn, isLoggedIn, setUser, user } = useGameheadsContext();
 
    const getProfile = async (gameheadsId: string) => {
        const data = await usersSDK.getUserByGameheadsId(gameheadsId);
        setProfile(data.profile);
    }

    useEffect(() => {
        if (profileId) {
            getProfile(profileId.toString().substring(2));
        }
    }, [profileId]);

    return (
        <div className="">
            <Navbar user={user} isLoggedIn={isLoggedIn} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {profile &&
                <div className="mt-0 sm:mt-10">
                    <ProfileView profile={profile} setProfile={null} editable={false} projects={null} />
                </div>
            }
        </div>
    );
};

export default Profile;
