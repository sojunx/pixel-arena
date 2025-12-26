import { AuthContext } from "@/hooks";
import { useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUsername, setCurrentUsername] = useState<string | null>(() =>
    sessionStorage.getItem("username")
  );

  const handleSubmit = (data: string) => {
    sessionStorage.setItem("username", data);
    setCurrentUsername(data);
  };

  return (
    <AuthContext.Provider value={{ currentUsername, handleSubmit }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
