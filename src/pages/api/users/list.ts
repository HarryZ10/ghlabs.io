import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken, getUserList } from '../../../models/mongodb';
import { getToken } from "next-auth/jwt";

function isGameheadsEmail(email: string) {
    return email.endsWith("@gameheadsoakland.org") || email.endsWith('harryzhu11@gmail.com');
}

export const config = {
    maxDuration: 10,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === 'GET') {

        const token = await getToken({ req });

        // console.log(req.headers.cookie);
        console.log(`Token: ${JSON.stringify(token)}`)

        if (!token || !token?.email) {
            return res.status(401).json({
                message: "Not authorized. You must sign in.",
            });
        }

        const user: any = await getUserFromToken(token);

        if (!isGameheadsEmail(user?.email)) {
            return res.status(401).json({
                message: "Not authorized. You are not an administrator.",
            });
        }

        const userList = await getUserList();

        return res.status(200).json({
            userList: userList
        });
    }
}

export default handler;
