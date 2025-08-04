import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import InputField from "../InputField/InputField";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Divider from "@mui/material/Divider";
import Buttons from "../../utils/Buttons";
import toast from "react-hot-toast";
import { useMyContext } from "../../store/ContextApi";
import { useEffect } from "react";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Login = () => {
  // Step 1: Login method and Step 2: Verify 2FA
  const [step, setStep] = useState(1);
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(false);
  // Access the token and setToken function using the useMyContext hook from the ContextProvider
  const { setToken, token } = useMyContext();
  const { setCurrentUser, currentUser } = useMyContext();
  const { setIsAdmin, isAdmin } = useMyContext();
  const navigate = useNavigate();

  //react hook form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
      code: "",
    },
    mode: "onTouched",
  });

  const handleSuccessfulLogin = async (token) => {
    // , decodedToken - removed from here

    /*const user = {
      username: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };*/
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
      email: data.Username,
      roles: rolesArr,
      createdDate: data.createdDate,
      updatedDate: data.updatedDate,
      accountNonExpired: data.accountNonExpired,
      accountNonLocked: data.accountNonLocked,
      credentialsNonExpired: data.credentialsNonExpired,
      twoFactorEnabled: data.twoFactorEnabled,
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

    //

    // fetching from the local stoarge
    // Now read back immediately from localStorage
    const storedUser = JSON.parse(localStorage.getItem("USER"));
    const storedIsAdmin = JSON.parse(localStorage.getItem("IS_ADMIN"));

    console.log(storedUser, "from localStorage");
    console.log(storedIsAdmin, "from localStorage");
    navigate("/notes");
  };

  //function for handle login with credentials
  const onLoginHandler = async (data) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/public/signin", data); // changed it to signin to login, data has all the data of the form

      console.log(response);
      //showing success message with react hot toast
      toast.success("Login Successful");

      //reset the input field by using reset() function provided by react hook form after submission
      reset();

      if (response.status === 200 && response.data.jwtToken) {
        console.log("Login successfull");
        console.log("jwt: " + response.data.jwtToken);
        setJwtToken(response.data.jwtToken);

        // i dont want to decode the token instaed i want to fect the user and the pass the data in the handleSuccessfullLogin function
        // const decodedToken = jwtDecode(response.data.jwtToken);
        /*if (decodedToken.is2faEnabled) {
          setStep(2); // Move to 2FA verification step
        } else {
          handleSuccessfulLogin(response.data.jwtToken, decodedToken);
        }*/
        //const res = await api.get("/auth/user");

        handleSuccessfulLogin(response.data.jwtToken);
      } else {
        toast.error(
          "Login failed. Please check your credentials and try again."
        );
      }
    } catch (error) {
      if (error) {
        toast.error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  //function for verify 2fa authentication
  /*const onVerify2FaHandler = async (data) => {
    const code = data.code;
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append("jwtToken", jwtToken);

      await api.post("/auth/public/verify-2fa-login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const decodedToken = jwtDecode(jwtToken);
      handleSuccessfulLogin(jwtToken, decodedToken);
    } catch (error) {
      console.error("2FA verification error", error);
      toast.error("Invalid 2FA code. Please try again.");
    } finally {
      setLoading(false);
    }
  };*/

  //if there is token  exist navigate  the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/notes");
  }, [navigate, token]);

  //step1 will render the login form and step-2 will render the 2fa verification form
  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center">
      {step === 1 ? (
        <React.Fragment>
          <form
            onSubmit={handleSubmit(onLoginHandler)}
            className="sm:w-[450px] w-[360px]  shadow-custom py-8 sm:px-8 px-4"
          >
            <div>
              <h1 className="font-montserrat text-center font-bold text-2xl">
                Login Here
              </h1>
              <p className="text-slate-600 text-center">
                Please Enter your username and password{" "}
              </p>
              <div className="flex items-center justify-between gap-1 py-5 ">
                <Link
                  to={`${apiUrl}/oauth2/authorization/google`}
                  className="flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm shadow-slate-200 rounded-md hover:bg-slate-300 transition-all duration-300"
                >
                  <span>
                    <FcGoogle className="text-2xl" />
                  </span>
                  <span className="font-semibold sm:text-customText text-xs">
                    Login with Google
                  </span>
                </Link>
                <Link
                  to={`${apiUrl}/oauth2/authorization/github`}
                  className="flex gap-1 items-center justify-center flex-1 border p-2 shadow-sm shadow-slate-200 rounded-md hover:bg-slate-300 transition-all duration-300"
                >
                  <span>
                    <FaGithub className="text-2xl" />
                  </span>
                  <span className="font-semibold sm:text-customText text-xs">
                    Login with Github
                  </span>
                </Link>
              </div>

              <Divider className="font-semibold">OR</Divider>
            </div>

            <div className="flex flex-col gap-2">
              <InputField
                label="UserName"
                required
                id="username"
                type="text"
                message="*UserName is required"
                placeholder="type your username"
                register={register}
                errors={errors}
              />{" "}
              <InputField
                label="Password"
                required
                id="password"
                type="password"
                message="*Password is required"
                placeholder="type your password"
                register={register}
                errors={errors}
              />
            </div>
            <Buttons
              disabled={loading}
              onClickhandler={() => {}}
              className="bg-customRed font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
              type="text"
            >
              {loading ? <span>Loading...</span> : "LogIn"}
            </Buttons>
            <p className=" text-sm text-slate-700 ">
              <Link
                className=" underline hover:text-black"
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
            </p>

            <p className="text-center text-sm text-slate-700 mt-6">
              Don't have an account?{" "}
              <Link
                className="font-semibold underline hover:text-black"
                to="/signup"
              >
                SignUp
              </Link>
            </p>
          </form>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <form
            onSubmit={handleSubmit(onVerify2FaHandler)}
            className="sm:w-[450px] w-[360px]  shadow-custom py-8 sm:px-8 px-4"
          >
            <div>
              <h1 className="font-montserrat text-center font-bold text-2xl">
                Verify 2FA
              </h1>
              <p className="text-slate-600 text-center">
                Enter the correct code to complete 2FA Authentication
              </p>

              <Divider className="font-semibold pb-4"></Divider>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <InputField
                label="Enter Code"
                required
                id="code"
                type="text"
                message="*Code is required"
                placeholder="Enter your 2FA code"
                register={register}
                errors={errors}
              />
            </div>
            <Buttons
              disabled={loading}
              onClickhandler={() => {}}
              className="bg-customRed font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
              type="text"
            >
              {loading ? <span>Loading...</span> : "Verify 2FA"}
            </Buttons>
          </form>
        </React.Fragment>
      )}
    </div>
  );
};

export default Login;
