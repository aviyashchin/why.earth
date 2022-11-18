import { db, auth } from "@/libs/firebase-admin";
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/interfaces/User";
import { getErrorMessageForCode } from "@/libs/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    if (req.method != "POST") {
      return res
        .status(400)
        .json({ error: { message: "It should be POST method." } });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: { message: "Email and password are invalid." },
      });
    }

    let idToken = req.headers.authorization!;
    if (idToken.includes("Bearer")) {
      const regex = /Bearer (.+)/i;
      idToken = req?.headers.authorization?.match(regex)?.[1]!;
    } else {
      return res.status(400).json({
        error: {
          message: "Authorization token invalid",
        },
      });
    }

    const decodedToken = await auth.verifyIdToken(idToken);

    const user: User = {
      email,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      lastLogin: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    await db.collection("users").doc(decodedToken.uid).set(user);

    return res.json({ user });
  } catch (err: any) {
    return res.status(400).json({
      error: {
        message: getErrorMessageForCode(err.code),
      },
    });
  }
}
