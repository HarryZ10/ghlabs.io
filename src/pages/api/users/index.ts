// import { getUser } from "../oldauth/[...thirdweb]";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../models/models";
import { connectToDatabase, getUserFromToken } from '../../../models/mongodb';
import { getToken } from "next-auth/jwt";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'GET') {

        const token = await getToken({ req });

        if (!token) {
            return res.status(401).json({
                message: "Not authorized 1.",
            });
        }
        if (!token?.email) {
            return res.status(401).json({
                message: "Not authorized 2.",
            });
        }
        const user = await getUserFromToken(token);

        if (!user) {
            return res.status(401).json({
                message: "Not authorized 3.",
            });
        }

        return res.status(200).json({
            profile: user
        });

    }

    if (req.method === 'PUT') {
        // Your PUT method logic
        try {
            const token = await getToken({ req });

            if (!token || !token.email) {
                return res.status(401).json({
                    message: "Not authorized.",
                });
            }

            const user = await getUserFromToken(token);

            if (!user) {
                return res.status(401).json({
                    message: "Not authorized.",
                });
            }

            const body = req.body;
            const {
                fullName,
                email,
                teamId,
                pronouns,
                siteName,
                ghLevel,
                color1,
                color2,
                contactsMoreInfo,
                role1,
                role2,
                notes
            } = body;

            const { traceDb } = await connectToDatabase();
            const usersCollection = traceDb.collection('users');
            const userObj = await usersCollection.findOne({ email: user.email });

            if (!userObj || !userObj.profile?.fullName) {
                return res.status(401).json({
                    message: "Not authorized.",
                });
            }

            const currentProfile = userObj.profile || new User({
                email: "",
                full_name: "",
                team_id: "",
                pronouns: "",
                site_name: "",
                gh_level: "",
                color_1: "",
                color_2: "",
                contacts_more_info: "",
                role_1: "",
                role_2: "",
                notes: ""
            });

            const newProfile = new User({
                email: email || currentProfile.email,
                full_name: fullName || currentProfile.full_name,
                team_id: teamId || currentProfile.team_id,
                pronouns: pronouns || currentProfile.pronouns,
                site_name: siteName || currentProfile.site_name,
                gh_level: ghLevel || currentProfile.gh_level,
                color_1: color1 || currentProfile.color_1,
                color_2: color2 || currentProfile.color_2,
                contacts_more_info: contactsMoreInfo || currentProfile.contacts_more_info,
                role_1: role1 || currentProfile.role_1,
                role_2: role2 || currentProfile.role_2,
                notes: notes || currentProfile.notes
            });

            await usersCollection.updateOne({ email: user.email }, { $set: { profile: newProfile } });

            return res.status(200).json({
                message: `Updated profile for ${user.email}.`,
            });

        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ message: "Server error." });
        }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
};

export default handler;
