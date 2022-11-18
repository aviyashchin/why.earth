import moment from "moment";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/libs/firebase-admin";
import { initializeFirebase } from "@/libs/firebase-client";
import { getErrorMessageForCode } from "@/libs/utils";

const app = initializeFirebase();

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

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: "Email or password is invalid." },
      });
    }

    const credential = await signInWithEmailAndPassword(
      getAuth(app),
      email,
      password
    );
    const accessToken = await credential.user.getIdToken();
    const refreshToken = credential.user.refreshToken;

    db.collection("users")
      .doc(credential.user.uid)
      .update({ lastLogin: moment().format("YYYY-MM-DD HH:mm:ss") });
    const userSnapshot = await db
      .collection("users")
      .doc(credential.user.uid)
      .get();
    const user = { ...userSnapshot.data() };

    res.status(200).json({
      accessToken,
      refreshToken,
      user,
    });
  } catch (err: any) {
    return res.status(400).json({
      error: {
        message: getErrorMessageForCode(err.code),
      },
    });
  }
}
