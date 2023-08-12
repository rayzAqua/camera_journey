import { useState, createContext, useContext, useEffect } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: JSON.parse(localStorage.getItem("token")) || null,
  });

  useEffect(() => {
    if (!auth.user && !auth.token) {
      const data = JSON.parse(localStorage.getItem("user"));
      const token = JSON.parse(localStorage.getItem("token"));
      if (data && token) {
        setAuth({
          user: data,
          token: token,
        });
        console.log("Do set auth");
      } else {
        console.log("No Login");
      }
    }
  }, []);

  console.log("User:", auth.user);
  console.log("Token:", auth.token);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => useContext(AuthContext);

export { useAuthContext, AuthContextProvider };
