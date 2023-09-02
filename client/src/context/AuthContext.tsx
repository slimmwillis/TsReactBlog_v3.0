import { createContext, useCallback, useEffect, useState } from "react";
export interface AuthContextType {
  admin: AdminType | null;
  setAdmin: React.Dispatch<React.SetStateAction<AdminType | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface Props {
  children: React.ReactNode;
}

interface AdminType {
  email: string;
  password: string;
}

export const AuthContextProvider = ({ children }: Props) => {
  const [admin, setAdmin] = useState<AdminType | null>(null);

  useEffect(() => {
    const adminJson = localStorage.getItem("admin");
    if (adminJson) {
      setAdmin(JSON.parse(adminJson));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        setAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
