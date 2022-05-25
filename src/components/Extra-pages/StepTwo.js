import React, { useState } from "react";
import { useCreateChannelProvider } from "../../States/Reducers/CreateChannelProvider";
import { useForm } from "react-hook-form";
import { useAuthProvider } from "../../States/AuthProvider";
import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";

import axios from "axios";
import env from "react-dotenv";
export default function StepTwo({
  toggleStepOne,
  setToggleStepTwo,
  toggleStepTwo,
  setToggleStepOne,
}) {
  const [onChangeTitle, setOnchangeTitle] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm();
  const [{ user }] = useAuthProvider();
  const [{ channelDescription, users, error }, dispatch] =
    useCreateChannelProvider();
  const handleToggleCreateChanel = () => {
    dispatch({
      type: "SET_CREATE_MODE",
      toggleCreateMode: false,
    });
    dispatch({
      type: "RESET_CHANNEL_DATA",
    });
  };
  const nexStep = async (data) => {
    // get id using email

    const isUserExist = users.some(({ email }) => email === data.email);
    if (isUserExist) {
      const id = users.filter(({ email, id }) => {
        if (email === data.email) {
          return id;
        }
      })[0].id;
      const members = [id, user.id];
      // create the channel details
      dispatch({
        type: "SET_STEP_TWO",
        channelMembers: [id, user.id],
      });
      // post the channel
      setIsloading(true);
      try {
        const req = await axios.post(
          `http://206.189.91.54/api/v1/channels`,
          {
            name: channelDescription.channelName,
            user_ids: members,
          },
          {
            headers: {
              "access-token": user["access-token"],
              client: user.client,
              expiry: user.expiry,
              uid: user.uid,
            },
          }
        );
        req.data.errors &&
          dispatch({
            type: "SET_ERROR",
            error: req.data.errors[0],
          });
        setTimeout(() => {
          dispatch({
            type: "SET_ERROR",
            error: "",
          });
        }, 3000);
        // set spinner to false when the it's fullfilled
        setIsloading(false);
        // close the channel creation
        setToggleStepTwo(false);

        dispatch({
          type: "SET_CREATE_MODE",
          isCreateMode: false,
        });
        dispatch({
          type: "RESET_CHANNEL_DATA",
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      dispatch({
        type: "SET_ERROR",
        error: "User doesn't exist in slack",
      });
      setTimeout(() => {
        dispatch({
          type: "SET_ERROR",
          error: "",
        });
      }, 3000);
    }
  };
  return (
    <>
      {isLoading && (
        <div className="absolute w-full bg-white opacity-70 h-screen flex items-center justify-center">
          <Spinner size="md" />
        </div>
      )}
      {error !== "" && (
        <Alert status="error">
          <AlertIcon />
          {`${error}`}
        </Alert>
      )}
      <h2 className="my-20 font-bold  text-4xl">
        Who do you email most about
        <span className="text-blue-500 border-b-4 font-bold ">{`${channelDescription.channelName}?`}</span>
      </h2>
      <form className="flex w-1/4 items-end" onSubmit={handleSubmit(nexStep)}>
        <input
          className="mt-4 h-full bg-gray-100 border outline-none rounded-md p-3 w-4/5"
          type="email"
          name="email"
          {...register("email", {
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
            onClick={handleToggleCreateChanel}
            className="font-bold text-gray-500"
          >
            Close this window
          </button>
        </span>
      </p>
    </>
  );
}
