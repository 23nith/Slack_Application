import React, { useState, useEffect, useCallback } from "react";
import { useTransition, animated } from "react-spring";
import StepOne from "../Extra-pages/StepOne";
import axios from "axios";
import StepTwo from "../Extra-pages/StepTwo";
import env from "react-dotenv";
import { useCreateChannelProvider } from "../../States/Reducers/CreateChannelProvider";
import { useAuthProvider } from "../../States/AuthProvider";
import SendCompose from "../Extra-pages/SendCompose";
import WhereToSend from "../Extra-pages/WhereToSend";
import { useComposeMessageProvider } from "../../States/Reducers/ComposeMessageProvider";
export default function ComposeMessage() {
  const [toggleStepOne, setToggleStepOne] = useState(true);
  const [_, dispatch] = useComposeMessageProvider();
  const [toggleStepTwo, setToggleStepTwo] = useState(false);
  const [{ user }] = useAuthProvider();
  useEffect(() => {
    async function getUsers() {
      try {
        // get all users
        const data = await axios
          .get(`http://206.189.91.54/api/v1/users`, {
            headers: {
              "access-token": user["access-token"],
              client: user.client,
              expiry: user.expiry,
              uid: user.uid,
            },
          })
          .then(({ data }) => data.data);
        // set state
        dispatch({
          type: "SET_USERS",
          users: data,
        });
      } catch (err) {
        console.log(err);
      }
    }
    getUsers();
  }, []);
  const transtionStepOne = useTransition(toggleStepOne, {
    from: { x: -100, y: 0, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    leave: { x: -100, y: 0, opacity: 0 },
    config: {
      mass: 1,
      tension: 500,
      friction: 30,
      clamp: true,
    },
  });
  // Create transition for signup
  const transtionStepTwo = useTransition(toggleStepTwo, {
    from: { x: -100, y: 0, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    leave: { x: -100, y: 0, opacity: 0 },
    config: {
      mass: 1,
      tension: 500,
      friction: 30,
      clamp: true,
    },
  });
  return (
    <div className="flex z-10 w-screen bg-white h-full absolute">
      {transtionStepOne(
        (style, item) =>
          item && (
            <animated.div
              className="w-full transition-all text-black flex-col bg-white flex items-center h-screen"
              style={style}
            >
              <WhereToSend
                setToggleStepOne={setToggleStepOne}
                toggleStepOne={toggleStepOne}
                setToggleStepTwo={setToggleStepTwo}
                toggleStepTwo={toggleStepTwo}
              />
            </animated.div>
          )
      )}
      {transtionStepTwo(
        (style, item) =>
          item && (
            <animated.div
              className="w-full text-black flex-col bg-white flex items-center h-screen"
              style={style}
            >
              <SendCompose
                setToggleStepOne={setToggleStepOne}
                toggleStepOne={toggleStepOne}
                setToggleStepTwo={setToggleStepTwo}
                toggleStepTwo={toggleStepTwo}
              />
            </animated.div>
          )
      )}
    </div>
  );
}
