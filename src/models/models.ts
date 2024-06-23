import sha256 from 'crypto-js/sha256';

export enum Page {
    PresentationQueue,
    Dashboard,
    NewProject,
    ProjectIdentity,
    SignIn,
}

export type UpdateProfileData = {
    email: string;
    full_name?: string;
    pronouns?: string;
    site_name?: string;
    gh_level?: string;
    color_1?: string;
    color_2?: string;
    contacts_more_info?: string;
    role_1?: string;
    role_2?: string;
    notes?: string;
    social_links?: string[];
    other_sites?: string[];
    bio?: string;
}

export type SectionType = {
    title: string;
    projects: Project[];
}

export interface Project {
    project_name: string;
    project_link?: string;
    project_title?: string;
    team_id: string;
    project_image?: File;
}
