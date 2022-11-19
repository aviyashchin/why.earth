import {
  TAG_ACCESS_TOKEN,
  TAG_EMAIL,
  TAG_REFRESH_TOKEN,
} from "@/libs/constants";
import { useEffect, useState } from "react";
import { User } from "@/interfaces/User";
import { toast } from "react-toastify";
import { initializeFirebase } from "@/libs/firebase-client";

initializeFirebase();

const useAuth = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accessToken, setAcessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    email: "",
    createdAt: "",
    lastLogin: "",
  });

  useEffect(() => {
    if (window) {
      const accessToken = window.localStorage.getItem(TAG_ACCESS_TOKEN);
      const refreshToken = window.localStorage.getItem(TAG_REFRESH_TOKEN);

      setAcessToken(<string>accessToken);
      setRefreshToken(<string>refreshToken);

      if (accessToken) {
        checkAuth(<string>accessToken);
      }
    }
  }, []);

  const checkAuth = async (accessToken: string) => {
    const response = await fetch(`/api/checkauth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
  };

  const createUser = async (
    accessToken: string,
    refreshToken: string,
    email: string
  ) => {
    const response = await fetch(`/api/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();

      setAcessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(data.user);
      setIsSignedIn(true);
    } else {
      setIsSignedIn(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    const response = await fetch(`/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      window.localStorage.setItem(TAG_ACCESS_TOKEN, data.accessToken);
      window.localStorage.setItem(TAG_REFRESH_TOKEN, data.refreshToken);

      setAcessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(data.user);

      setIsSignedIn(true);
      setIsLoading(false);

      toast.success("Successfully signed up!");
    } else {
      if (response.status == 500) {
        toast.error("Error occured on signing up.");
      } else {
        const data = await response.json();
        toast.error(
          data.error.message
            ? data.error.message
            : "Error occured on signing up."
        );
      }
      setIsSignedIn(false);
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const response = await fetch(`/api/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      window.localStorage.setItem(TAG_ACCESS_TOKEN, data.accessToken);
      window.localStorage.setItem(TAG_REFRESH_TOKEN, data.refreshToken);

      setAcessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(data.user);

      setIsSignedIn(true);
      setIsLoading(false);

      toast.success("Successfully signed in!");
    } else {
      if (response.status == 500) {
        toast.error("Error occured on signing in.");
      } else {
        const data = await response.json();
        toast.error(
          data.error.message
            ? data.error.message
            : "Error occured on signing in."
        );
      }
      setIsSignedIn(false);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    fetch(`/api/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    window.localStorage.setItem(TAG_ACCESS_TOKEN, "");
    window.localStorage.setItem(TAG_REFRESH_TOKEN, "");
    window.localStorage.setItem(TAG_EMAIL, "");

    setAcessToken("");
    setRefreshToken("");

    setIsSignedIn(false);
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    const response = await fetch(`/api/resetpassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      setIsLoading(false);

      toast.success(data.message);
      return true;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on resetting password.");
      } else {
        const data = await response.json();
        toast.error(
          data.error.message
            ? data.error.message
            : "Error occured on resetting password."
        );
      }

      setIsLoading(false);
    }
    return false;
  };

  const updateEmail = async (email: string) => {
    setIsLoading(true);
    const response = await fetch(`/api/updateemail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);

      setIsLoading(false);

      toast.success(data.message);
    } else {
      if (response.status == 500) {
        toast.error("Error occured on resetting password.");
      } else {
        const data = await response.json();
        toast.error(
          data.error.message
            ? data.error.message
            : "Error occured on resetting password."
        );
      }

      setIsLoading(false);
    }
  };

  return {
    isLoading,
    isSignedIn,
    user,
    checkAuth,
    createUser,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateEmail,
  };
};

export default useAuth;
