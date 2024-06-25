import React from 'react';
import { useEffect } from 'react';
import { UserProfile } from './appearance/profileView/UserProfile';

// import LinkAccountsModal from './modals/linkAccountsModal';
// import OtherSitesModal from './modals/otherSitesModal';
// import ContactsModal from './modals/contactsModal';

interface ProfileViewProps {
    profile: any,
    setProfile: any,
    editable: boolean,
    projects: any
}

export const ProfileView: React.FC<ProfileViewProps> = ({
    profile,
    setProfile,
    editable = false,
    projects,
}) => {

    useEffect(() => {
        const image = new window.Image();
        image.src = '/pinned3.png';
    }, []);

    return (
        <div className="container mx-0 sm:mx-auto ">
            <UserProfile profile={profile} setProfile={setProfile} editable={editable} />

            {/* <Feed sections={sections} editable={editable} projects={projects} />
            <LinkAccountsModal profile={profile} setProfile={setProfile} />
            <OtherSitesModal profile={profile} setProfile={setProfile} />
            <ContactsModal profile={profile} setProfile={setProfile} /> */}
        </div>
    );
};
