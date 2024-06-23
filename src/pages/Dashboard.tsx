import React, { useEffect, useState } from 'react';
import { ProfileView } from '../components/ProfileView';
import AccessRestricted from '../components/utilities/AccessRestricted';

const Dashboard = ({ projects, user, getProjects }: { getProjects: any, projects: any, user: any }) => {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        // console.log("User: " + JSON.stringify(user));
        if (user && user.profile) {
            // console.log("Profile is" + JSON.stringify(user.profile));
            setProfile(user.profile);
        } else {
            setProfile({
                full_name: user?.data?.username ?? 'Insert your name',
                email: 'Insert your email',
                gameheadsID: '',
                bio: 'Insert your bio',
                profile_picture: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                social_links: [],
                projects: [],
                other_links: [],
                users_endorsed: [],
                users_endorsed_by: [],
                contacts_more_info: undefined,
            });
        }
    }, [user]);


    useEffect(() => {
        getProjects();
    }, [getProjects]);

    // Only render once profile is not null and claims are available
    if (!profile || !projects) {
        return <div>Loading...</div>; // Replace with your preferred loading indicator
    }

    return (
        <div className="mt-0 sm:mt-10">
            {profile.users_endorsed_by.length > 0 ?
                <ProfileView editable={true} setProfile={setProfile} profile={profile} projects={projects} />
                :
                <AccessRestricted />}
        </div>
    );
};

export default Dashboard;
