"use client";

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

type ContextType = {
  login: (email: string, password: string) => Promise<void>;
  user: User | null;
  setUser: Dispatch<SetStateAction<null | User>>;
};
type User = {
  email: string;
  password: string;
  username: string;
  bio: string | null;
  profilePicture: string | null;
};

export const AuthContext = createContext<ContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const { push } = useRouter();

  useEffect(() => {
    const userItem = localStorage.getItem("user");
    if (userItem) {
      setUser(JSON.parse(userItem));
    }
  }, []);

  const login = async () => {
    const response = await fetch("http://localhost:10000/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: "lord@gmail.com",
        password: "1234567890",
      }),
    });
    const user = await response.json();
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };
  console.log(user);
  const values = { login: login, user: user, setUser: setUser };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
export const useUser = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("FAIL !!!!");
  }
  return authContext;
};
