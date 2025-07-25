import React, { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
  //find the token in the localstorage
  const getToken = localStorage.getItem("JWT_TOKEN")
    ? // carefull here with stringyfy
      JSON.parse(localStorage.getItem("JWT_TOKEN"))
    : null;

  //find the user status from the localstorage
  const isADmin = localStorage.getItem("IS_ADMIN")
    ? JSON.parse(localStorage.getItem("IS_ADMIN")) // chnaged stringify to parse
    : false;

  /*const getToken = localStorage.getItem("JWT_TOKEN") || null;

  const isADmin = localStorage.getItem("IS_ADMIN") === "true";*/

  // store token in state
  const [token, setToken] = useState(getToken);

  // store the current logged in user
  const [currentUser, setCurrentUser] = useState(null);

  //handle sidebar opening and closing in the admin panel
  const [openSidebar, setOpenSidebar] = useState(true);

  //check the loggedin user is admin or not
  const [isAdmin, setIsAdmin] = useState(isADmin);

  const fetchUser = async () => {
    const user = JSON.parse(localStorage.getItem("USER"));

    const username = user ? user.username : null;

    if (username) {
      try {
        const response = await api.get("/auth/user");
        const data = response.data;
        const roles = data.roles;

        if (roles.includes("ADMIN")) {
          localStorage.setItem("IS_ADMIN", JSON.stringify(true));
          setIsAdmin(true);
        } else {
          localStorage.removeItem("IS_ADMIN");
          setIsAdmin(false);
        }
        setCurrentUser(data);
      } catch (error) {
        console.error("Error fetching current user", error);
        toast.error("Error fetching current user");
      }
    }
  };

  //if jwt token exist fetch the current user
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  //through context provider you are sending all the datas so that we access at anywhere in your application
  return (
    <ContextApi.Provider
      value={{
        token,
        setToken,
        currentUser,
        setCurrentUser,
        openSidebar,
        setOpenSidebar,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(ContextApi);

  return context;
};
