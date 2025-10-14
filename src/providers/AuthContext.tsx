"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export type ContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<null | User>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<null | User>>;
};
export type User = {
  // _id: String;
  // email: string;
  // password: string;
  // username: string;
  // bio: string | null;
  // profilePicture: string | null;
  _id: string;
  images: string;
  caption: string;
  like: string[]; // user ids
  user: {
    _id: string;
    username: string;
    followers: string[]; // user ids
  };
};

export type AuthContext = {
  user: User | null;
  setUser: Dispatch<SetStateAction<null | User>>;
  token: string | null;
  setToken: Dispatch<SetStateAction<null | User>>;
};
export type decoded = {
  data: User;
};

export const AuthContext = createContext<ContextType | null>(null);
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const { push } = useRouter();
  useEffect(() => {
    const localtoken = localStorage.getItem("token");

    if (typeof window !== "undefined") {
      if (localtoken) {
        setToken(localtoken);
        const decodedToken: decoded = jwtDecode(localtoken);
        setUser(decodedToken.data);
      } else {
        push("/login");
      }
    }
  }, []);

  const values = { user, setUser, token, setToken };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
export const useUser = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("FAIL !!!!");
  }
  return authContext;
};
