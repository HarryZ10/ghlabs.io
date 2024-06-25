// src/models/models.ts

export enum Page {
    PresentationQueue,
    Dashboard,
    NewProject,
    ProjectIdentity,
    SignIn,
    IdentityCenter,
    Onboarding,
}

export type UpdateProfileData = {
    full_name?: string;
    pronouns?: string;
    site?: string;
    level?: string;
    color1?: string;
    color2?: string;
    discord?: string;
    phone_number?: string;
    role1?: string;
    role2?: string;
    notes?: string;
    social_links?: string[];
    other_links?: string[];
    bio?: string;
    queueColor?: string;
    currentTeamId?: number;
    currentTeamName?: string;
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
