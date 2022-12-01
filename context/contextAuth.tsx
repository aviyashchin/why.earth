import useAuth from "@/hooks/useAuth";
import PropTypes from "prop-types";
import { createContext, useContext } from "react";

export const AuthContext = createContext({
  isLoading: false,
  isSignedIn: false,
  user: {
    email: "",
  },
  checkAuth: async (token: string) => {},
  createUser: async (token: string, refreshToken: string, email: string) => {},
  signIn: async (email: string, password: string) => {},
  signOut: async () => {},
  signUp: async (email: string, password: string) => {},
  updateEmail: async (email: string) => {},
  resetPassword: async (email: string) => {
    return false;
  },
});

export const AuthProvider = ({ children }: { children: any }) => {
  const {
    isLoading,
    isSignedIn,
    user,
    checkAuth,
    createUser,
    signIn,
    signOut,
    signUp,
    updateEmail,
    resetPassword,
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isSignedIn,
        user,
        checkAuth,
        createUser,
        signIn,
        signOut,
        signUp,
        updateEmail,
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
