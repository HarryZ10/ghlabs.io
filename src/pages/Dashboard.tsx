import React, { useEffect, useState } from 'react';
import { ProfileView } from '../components/ProfileView';

const Dashboard = ({ projects, user, getProjects }: { getProjects: any, projects: any, user: any }) => {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        if (user && user.profile) {
            setProfile(user.profile);
        } else {
            setProfile({
                full_name: user?.profile?.full_name ?? '',
                email: '',
                gameheadsID: '',
                bio: '',
                profile_picture: '/graphics/default-profile.png',
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

    if (!profile || !projects) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-0 sm:mt-10">
            {profile.users_endorsed_by.length > 0 ?
                <ProfileView editable={true} setProfile={setProfile} profile={profile} projects={projects} />
                :
                <ProfileView editable={false} setProfile={setProfile} profile={profile} projects={projects} />}
        </div>
    );
};

export default Dashboard;
