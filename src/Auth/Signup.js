import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { svg } from "../Svg";
import { useAuthProvider } from "../States/AuthProvider";
import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import PasswordChecklist from "react-password-checklist";
import env from "react-dotenv";
import axios from "axios";

export default function Signup({ setToggleSignup, setToggleLogin }) {
  const [onChangePassword, setOnchangePassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [{ user, accounts }, dispatch] = useAuthProvider();
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const getUserInfo = async (data) => {
    const { email, password, userName } = data;
    if (isPasswordValid) {
      // try if the input is valid
      try {
        // show the spinner
        setLoading(true);
        let res = await axios
          .post(`http://206.189.91.54/api/v1/auth`, {
            email,
            password,
            nickname: userName,
          })
          // hide the spinner when data is sent
          .then(() => setLoading(false));
        // toggle the components
        setToggleLogin(true);
        setToggleSignup(false);
      } catch (err) {
        // hide the spinner when error
        setLoading(false);
        setMessage("User already exist");
      }
    } else {
      // set error when password is invalid format
      setMessage("Invalid password format");
    }
  };
  const handleToggleLogin = (_) => {
    setToggleLogin(true);
    setToggleSignup(false);
  };
  return (
    <>
      {message !== "" && onChangePassword !== "" ? (
        <Alert status="error">
          <AlertIcon />
          {message}
        </Alert>
      ) : (
        ""
      )}
      {isLoading && (
        <div className="absolute w-full bg-white opacity-70 h-screen flex items-center justify-center">
          <Spinner size="md" />
        </div>
      )}
      <div className="w-3/4 h-1/6 flex items-center">
        <h1 className="text-4xl ">Signup</h1>
      </div>
      <form
        className=" flex flex-col justify-start w-3/4 h-5/6"
        onSubmit={handleSubmit(getUserInfo)}
      >
        <div className="flex justify-between mt-10">
          <div className="w-3/6 flex flex-col justify-between items-start ">
            <label htmlFor="email" className="text-xs text-gray-400">
              Email
            </label>
            <input
              className="mt-4 bg-gray-100 border outline-none rounded-md p-3 w-full"
              type="email"
              name="email"
              {...register("email", { required: "true" })}
            />
          </div>
          <div className=" w-3/6 ml-8 flex flex-col justify-between items-start">
            <label htmlFor="userName" className="text-xs text-gray-400">
              User name
            </label>
            <input
              className="mt-4 bg-gray-100 border rounded-md outline-none p-3 w-full"
              type="text"
              name="userName"
              {...register("userName", { required: "true" })}
            />
          </div>
        </div>
        <div className="flex justify-between mt-10">
          <div className="w-3/6 flex flex-col justify-between items-start ">
            <label htmlFor="email" className="text-xs text-gray-400">
              Password
            </label>
            <input
              className="mt-4 bg-gray-100 border outline-none rounded-md p-3 w-full"
              type="password"
              name="password"
              autoComplete="true"
              {...register("password", {
                required: "true",
                onChange: (e) => setOnchangePassword(e.target.value),
              })}
            />
          </div>
          <div className=" w-3/6 ml-8 flex justify-center items-center">
            <button type="submit">{svg.leftArrow}</button>
          </div>
        </div>
        <p className="my-14 text-xs text-gray-400">
          {" "}
          Already have an account?{" "}
          <span
            onClick={handleToggleLogin}
            className="cursor-pointer font-bold  text-xs text-gray-500"
          >
            Login
          </span>
        </p>
        {onChangePassword && (
          <PasswordChecklist
            rules={["minLength", "number", "capital"]}
            minLength={8}
            value={onChangePassword}
            onChange={(isValid) =>
              isValid ? setIsPasswordValid(true) : setIsPasswordValid(false)
            }
          />
        )}
      </form>
    </>
  );
}
