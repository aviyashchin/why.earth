import useAuth from "@/hooks/userAuth";
import PropTypes from "prop-types";
import { createContext, useContext } from "react";

export const AuthContext = createContext({
  isLoading: false,
  isSignedIn: false,
  user: {
    email: "",
    username: "",
  },
  signIn: async (email: string, password: string) => {},
  signOut: async () => {},
  signUp: async (email: string, username: string, password: string) => {},
  updateEmail: async (email: string) => {},
  updateUsername: async (username: string) => {},
  resetPassword: async (email: string) => {
    return false;
  },
});

export const AuthProvider = ({ children }: { children: any }) => {
  const {
    isLoading,
    isSignedIn,
    user,
    signIn,
    signOut,
    signUp,
    updateEmail,
    updateUsername,
    resetPassword,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isSignedIn,
        user,
        signIn,
        signOut,
        signUp,
        updateEmail,
        updateUsername,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthValues = () => useContext(AuthContext);

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
