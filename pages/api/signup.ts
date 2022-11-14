import { db } from "@/libs/firebase";
import moment from "moment";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "@/interfaces/User";

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

    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        error: { message: "Email, username and password are invalid." },
      });
    }

    const userQuery = await db
      .collection("users")
      .where("username", "==", username)
      .get();
    if (!userQuery.empty) {
      return res
        .status(400)
        .json({ error: { message: "Username is already taken." } });
    }

    const auth = getAuth();
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const accessToken = await credential.user.getIdToken();
    const refreshToken = credential.user.refreshToken;

    const user: User = {
      email,
      username,
      createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    await db.collection("users").doc(credential.user.uid).set(user);

    return res.json({ accessToken, refreshToken });
  } catch (err: any) {
    const { code } = err;
    if (code === "auth/email-already-in-use") {
      res.status(400);
    } else {
      res.status(500);
    }
    res.json({
      error: {
        message: code ? code.replace("auth/", "") : "Unknown error occured.",
      },
    });
  }
}
