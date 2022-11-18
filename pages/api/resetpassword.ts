import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
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

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: { message: "Email is invalid." },
      });
    }

    sendPasswordResetEmail(getAuth(app), email);

    return res.json({
      message:
        "Just sent reset link to your email. Please check your mail inbox.",
    });
  } catch (err: any) {
    return res.status(400).json({
      error: {
        message: getErrorMessageForCode(err.code),
      },
    });
  }
}
