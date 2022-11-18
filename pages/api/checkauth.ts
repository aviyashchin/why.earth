import type { NextApiRequest, NextApiResponse } from "next";
import { db, auth } from "@/libs/firebase-admin";
import { initializeFirebase } from "@/libs/firebase-client";
import { getErrorMessageForCode } from "@/libs/utils";

initializeFirebase();

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
    let user = null;
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      user = null;
    } else {
      user = {
        ...userDoc.data(),
      };
    }

    if (!user) {
      return res.status(404).json({
        error: {
          message: "User not found",
        },
      });
    }

    return res.json({
      message: "Successfully signed in!",
      user,
    });
  } catch (e: any) {
    return res.status(400).json({
      error: {
        message: getErrorMessageForCode(e.code),
      },
    });
  }
}
