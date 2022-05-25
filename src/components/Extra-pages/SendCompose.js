import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthProvider } from "../../States/AuthProvider";
import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";

import axios from "axios";
import env from "react-dotenv";
import { useComposeMessageProvider } from "../../States/Reducers/ComposeMessageProvider";
export default function SendCompose({
  toggleStepOne,
  setToggleStepTwo,
  toggleStepTwo,
  setToggleStepOne,
}) {
  const [onChangeTitle, setOnchangeTitle] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [{ isCreateMode, composeDescription }, dispatch] =
    useComposeMessageProvider();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm();
  const [{ user }] = useAuthProvider();

  const handleToggleCompose = () => {
    dispatch({
      type: "SET_COMPOSE_MODE",
      isCreateMode: false,
    });
  };
  const nexStep = async (data) => {
    dispatch({
      type: "SET_COMPOSE_BODY",
      body: data.message,
    });

    try {
      const req = await axios.post(
        `http://206.189.91.54/api/v1/messages`,
        {
          receiver_id: composeDescription.recieverId,
          receiver_class: "User",
          body: data.message,
        },
        {
          headers: {
            expiry: user.expiry,
            uid: user.uid,
            "access-token": user["access-token"],
            client: user.client,
          },
        }
      );
      setError("message sent");
      resetField("message");
      setTimeout(() => handleToggleCompose(), 1000);
    } catch (err) {
      console.log(err);
      handleToggleCompose();
      resetField("message");
    }
  };
  return (
    <>
      {error !== "" && (
        <Alert status="success">
          <AlertIcon />
          {`${error}`}
        </Alert>
      )}
      <h2 className="my-20 font-bold  text-4xl">What's the message?</h2>
      <form className="flex w-2/5 items-end" onSubmit={handleSubmit(nexStep)}>
        <input
          className="mt-4 h-full bg-gray-100 border outline-none rounded-md p-3 w-4/5"
          type="text"
          name="message"
          {...register("message", {
            required: "true",
            onChange: (e) => setOnchangeTitle(e.target.value),
          })}
        />
        <button
          className={`${
            onChangeTitle !== ""
              ? "bg-gray-800 text-white"
              : "bg-gray-400 text-white"
          } w-1/5 rounded h-full ml-5 transition-all `}
          type="submit"
        >
          Submit
        </button>
      </form>
      <p className="text-xs mt-10 text-gray-400">
        Changed your mind?{" "}
        <span>
          <button
            onClick={handleToggleCompose}
            className="font-bold text-gray-500"
          >
            Close this window
          </button>
        </span>
      </p>
    </>
  );
}
