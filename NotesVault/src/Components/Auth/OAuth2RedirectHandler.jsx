import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/api";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken } = useMyContext();
  const { setCurrentUser, currentUser } = useMyContext();
  const { setIsAdmin, isAdmin } = useMyContext();

  useEffect(() => {
    const fetchOAuthUser = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      console.log("OAuth2RedirectHandler: Params:", params.toString());
      console.log("OAuth2RedirectHandler: Token:", token);

      if (token) {
        try {
          /*const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        localStorage.setItem("JWT_TOKEN", token);

        const user = {
          username: decodedToken.sub,
          //roles: decodedToken.roles.split(","), -- change this
        };
        console.log("User Object:", user);
        localStorage.setItem("USER", JSON.stringify(user));

        // Update context state
        setToken(token);
        //setIsAdmin(user.roles.includes("ROLE_ADMIN")); -- change this

        // Delay navigation to ensure local storage operations complete
        setTimeout(() => {
          console.log("Navigating to /notes");
          navigate("/notes");
        }, 100); // 100ms delay*/
          localStorage.setItem("JWT_TOKEN", token);
          setToken(token);

          const res = await api.get("/auth/user"); // very important that this call comes after token is in the local storage
          console.log(res.data);

          const data = res.data;

          const rolesArr = res.data.Roles.map((role) => {
            return "ROLE_" + role.role;
          });

          const user = {
            id: res.data.Id,
            username: res.data.Username,
            email: data.email,
            roles: rolesArr,
            enabled: data.enabled,
            createdDate: data.createdDate,
            updatedDate: data.updatedDate,
            accountNonExpired: data.accountNonExpired,
            accountNonLocked: data.accountNonLocked,
            credentialsNonExpired: data.credentialsNonExpired,
            twoFactorEnabled: data.twoFactorEnabled,
            profilePicture: data.profilePicture,
          };

          if (rolesArr.includes("ROLE_ADMIN")) {
            localStorage.setItem("IS_ADMIN", JSON.stringify(true));
            setIsAdmin(true);
          } else {
            localStorage.removeItem("IS_ADMIN");
            setIsAdmin(false);
          }
          setCurrentUser(user);

          console.log(user);
          localStorage.setItem("USER", JSON.stringify(user));

          //store the token on the context state  so that it can be shared any where in our application by context provider
          console.log(currentUser + " Inside Login");
          console.log(isAdmin + " Inside Login");
          navigate("/");
        } catch (error) {
          console.error("User Fetching failed:", error);
          navigate("/login");
        }
      } else {
        console.log("Token not found in URL, redirecting to login");
        navigate("/login");
      }
    };
    fetchOAuthUser();
  }, [location, navigate, setToken, setIsAdmin]);

  return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;
