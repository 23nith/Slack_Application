import { useState, useCallback, useEffect } from "react";
import { useTransition } from "react-spring";
import AuthProvider, { useAuthProvider } from "./States/AuthProvider";
import { authInitialState, AuthReducer } from "./States/Reducers/AuthReducer";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./Auth/Auth";
import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import PrivateRoute from "./Auth/PrivateRoute";
import MenuBar from "./components/MenuBar";
import SubMenu from "./components/SubMenu";
import MessageArea from "./components/MessageArea";
import ChannelDetails from "./components/ChannelDetails";
import MessageContextPovider from "./States/MessageContext";
import CreateChannel from "./components/SubMenu/CreateChannel";
import { useCreateChannelProvider } from "./States/Reducers/CreateChannelProvider";
import ChannelDatailsProvider from "./States/ChannelDetailsProvider";
import axios from "axios";
import env from "react-dotenv";
import ComposeMessageProvider from "./States/Reducers/ComposeMessageProvider";

import {
  channelReducer,
  channelDetailsInitialState,
} from "./States/Reducers/channelDetailsReducer";

function App() {
  const [toggleLogin, setToggleLogin] = useState(true);
  const [isSignupOpen, setToggleSignup] = useState(false);

  const [{ user }] = useAuthProvider();
  const [showSubMenu, setShowSubMenu] = useState(true);
  const [showChannelDetails, setShowChannelDetails] = useState(false);
  const [{ isCreateMode, error }, dispatch] = useCreateChannelProvider();
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
          type: "GET_ALL_USERS",
          users: data,
        });
      } catch (err) {
        console.log(err);
      }
    }
    getUsers();
  }, []);
  // Create transition for login
  const transtionLogin = useTransition(toggleLogin, {
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
  const transtionSignup = useTransition(isSignupOpen, {
    from: { x: -100, y: 0, opacity: 0 },
    enter: { x: 0, y: 0, opacity: 1 },
    leave: { x: -100, y: 0, opacity: 0 },
    config: {
      mass: 1,
      tension: 450,
      friction: 35,
      clamp: true,
    },
  });

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  const toggleChannelDetails = () => {
    setShowChannelDetails(!showChannelDetails);
  };

  return (
    // Auth set up
    <Router>
      <div className="w-full h-full bg-gray-600">
        <ChannelDatailsProvider
          reducer={channelReducer}
          initialState={channelDetailsInitialState}
        >
          <AuthProvider reducer={AuthReducer} initialState={authInitialState}>
            <MessageContextPovider>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Auth
                      transtionLogin={transtionLogin}
                      transtionSignup={transtionSignup}
                      isSignupOpen={isSignupOpen}
                      setToggleLogin={setToggleLogin}
                      setToggleSignup={setToggleSignup}
                      toggleLogin={toggleLogin}
                    />
                  }
                />
                <Route
                  path="account"
                  element={
                    <PrivateRoute>
                      {/* logged in account component here */}
                      <div className="flex flex-row h-screen text-white select-none">
                        {error !== "" && (
                          <div className="absolute right-0  left-0 ml-auto mr-auto">
                            <Alert status="error">
                              <AlertIcon />
                              {`channel ${error}`}
                            </Alert>
                          </div>
                        )}
                        <MenuBar />
                        <ComposeMessageProvider>
                          <SubMenu showSubMenu={showSubMenu} />
                        </ComposeMessageProvider>
                        <MessageArea
                          toggleSubMenu={toggleSubMenu}
                          toggleChannelDetails={toggleChannelDetails}
                        />
                        {showChannelDetails && <ChannelDetails />}
                        {isCreateMode && <CreateChannel />}
                      </div>
                    </PrivateRoute>
                  }
                />
              </Routes>
            </MessageContextPovider>
          </AuthProvider>
        </ChannelDatailsProvider>
      </div>
    </Router>
  );
}

export default App;
