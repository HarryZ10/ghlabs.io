import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import InviteModal from '../components/modals/InviteModal';
import useInviteModal from '../hooks/useInviteModal';
import Button from '../components/Button';
import { MdEmail } from 'react-icons/md';
import AccessRestricted from '../components/utilities/AccessRestricted';
import usersSDK from '../sdk/usersAPI';

type UserComponentProps = {
    gameheadsID: string;
};

const EndorserCard: React.FC<UserComponentProps> = ({ gameheadsID }) => {
    const [userData, setUserData] = useState<any | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Assuming you have an API to fetch user data by gameheadsID
                const data = await usersSDK.getUserByGameheadsId(gameheadsID);
                setUserData(data);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchUserData();
    }, [gameheadsID]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    const profilePicture = userData.profile.profile_picture || '/graphics/default-profile.png';
    const fullName = userData.profile.full_name || '';

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Image
                className="h-14 w-14"
                src={profilePicture}
                width={50}
                height={50}
                alt={`${fullName}'s profile picture`}
                style={{ borderRadius: '50%' }}
            />
            <span className="text-sm sm:text-md text-links" style={{ marginLeft: '10px' }}>
                {fullName}
            </span>
        </div>
    );
};

const IdentityCenter = ({ user }: { user: any }) => {

    const inviteModal = useInviteModal();

    const userProfile = {
        full_name: user?.full_name ?? '',
        email: user?.email ?? '',
        gameheadsID: user?.gameheadsID ?? '',
        bio: user?.bio ?? '',
        profile_picture: user?.profile_picture ?? '/graphics/default-profile.png',
        social_links: user?.social_links ?? [],
        other_links: user?.other_links ?? [],
        projects: user?.projects ?? [],
        users_endorsed: user?.users_endorsed ?? [],
        users_endorsed_by: user?.users_endorsed_by ?? []
    };

    // console.log(user)
    const [profile, setProfile] = useState(user.profile || userProfile);

    return (
        <div className="mx-0 sm:mx-28 sm:my-10 shadow-md sm:rounded-md">
            {profile.users_endorsed_by.length > 0 ? (
                <div>
                    <div className="w-full h-12 sm:h-36 lg:bg-cover bg-center bg-[url('/graphics/default-header.png')] p-8">
                    </div>
                    <div className="bg-cream p-8">
                        <h1 className="text-2xl sm:text-3xl font-bold my-4 text-center sm:text-left text-headings">Identity Center</h1>
                        <p className="text-body mb-8 text-sm sm:text-base">This is your home base for keeping your identity verified with Gameheads.</p>
                        <Button
                            label="Endorse via Email"
                            icon={MdEmail}
                            onClick={inviteModal.onOpen}
                        />
                        <div className="flex flex-col gap-3 mt-8">
                            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>Endorsed By</p>
                            {profile.users_endorsed_by.length > 0 ? profile.users_endorsed_by.map((gameheadsID: string) => (
                                <EndorserCard key={gameheadsID} gameheadsID={gameheadsID} />
                            )) : <div>Looks like you haven{"'"}t been endorsed by anyone yet! Time to make some phone calls...</div>}

                            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>Endorsements Made</p>
                            {profile.users_endorsed.length > 0 ? profile.users_endorsed.map((gameheadsID: string) => (
                                <EndorserCard key={gameheadsID} gameheadsID={gameheadsID} />
                            )) : <div>You{"'"}ve yet to make your first endorsement</div>}
                        </div>
                    </div>
                    <InviteModal user={user} profile={profile} setProfile={setProfile} />
                </div>
            ) : <AccessRestricted />}
        </div>
    );
};

export default IdentityCenter;