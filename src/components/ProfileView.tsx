import React from 'react';
import { useState, useEffect } from 'react';
import usersAPI from '../sdk/usersAPI';
import toast from 'react-hot-toast';
// import LinkAccountsModal from './modals/linkAccountsModal';
// import OtherSitesModal from './modals/otherSitesModal';
import { UserProfile } from './appearance/profileView/UserProfile';
// import ContactsModal from './modals/contactsModal';
import AccessRestricted from './utilities/AccessRestricted';

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

            {!profile.full_name && (
                <AccessRestricted />
            )}
            
            {/* <Feed sections={sections} editable={editable} projects={projects} /> */}

            {/* Provided Modals
            <LinkAccountsModal profile={profile} setProfile={setProfile} />
            <OtherSitesModal profile={profile} setProfile={setProfile} />
            <ContactsModal profile={profile} setProfile={setProfile} /> */}
        </div>
    );
};
