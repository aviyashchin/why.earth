import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

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

    sendPasswordResetEmail(getAuth(), email);

    return res.json({
      message:
        "Just sent reset link to your email. Please check your mail inbox.",
    });
  } catch (error: any) {
    const { code } = error;
    if (code) {
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
