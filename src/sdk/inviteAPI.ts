// src/sdk/inviteAPI.ts

const INVITE_API_ENDPOINT = '/api/endorsements/invite';

interface InviteData {
    endorsingUserGameheadsId: string;
    endorsingUserEmail: string;
    endorsedUserEmail: string;
}

export const inviteUser = async (inviteData: InviteData) => {
    return fetch(INVITE_API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(inviteData),
    });
}
