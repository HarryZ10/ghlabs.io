import { UpdateProfileData } from "../models/models";

const USERS_API_ENDPOINT = '/api/users';

const getCurrentUser = async () => {
    return fetch(USERS_API_ENDPOINT, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    })
}

const updateUsername = async (username: string) => {
    return fetch("/api/usernames", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }
        ),
    });
}

const getUserByGameheadsId = async (gameheadsID: string) => {
    const res = await fetch(`${USERS_API_ENDPOINT}/gameheadsID/${gameheadsID}`);
    return res.json();
}

const getUserList = async () => {
    const res = await fetch(`${USERS_API_ENDPOINT}/list`);
    return res.json();
}

const getTeams = async () => {
    const res = await fetch("/api/teams");
    return res.json();
}

const updateProfile = async (updateObject: UpdateProfileData) => {
    console.log("UPDATING PROFILE: " + JSON.stringify(updateObject));
    return fetch(USERS_API_ENDPOINT, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateObject)
    })
}

const usersSDK = {
    getCurrentUser,
    updateUsername,
    getUserByGameheadsId,
    updateProfile,
    getUserList,
    getTeams
};

export default usersSDK;
