import axios from "axios";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { MessageContext } from "../States/MessageContext";
import { useAuthProvider } from "../States/AuthProvider";
import MessageAreaHeader from "./MessageArea/MessageAreaHeader";
import SendMessage from "./MessageArea/SendMessage";
import MessageDisplay from "./MessageArea/MessageDisplay";
import env from "react-dotenv";

const MessageArea = ({ toggleSubMenu, toggleChannelDetails }) => {
  const [{ user }] = useAuthProvider();
  const { messageMode } = useContext(MessageContext);
  const [messages, setMessages] = useState([]);

  const myfunc = useCallback(async () => {
    if (user != undefined) {
      const responseBody = await axios({
        baseURL: `http://206.189.91.54/api/v1`,
        url: "/messages",
        method: "get",
        params: {
          receiver_id: messageMode.receiver_id,
          receiver_class: messageMode.receiver_class,
        },
        headers: {
          expiry: user.expiry,
          uid: user.uid,
          "access-token": user["access-token"],
          client: user.client,
        },
      }).then(
        (response) => {
          setMessages(response.data.data);
          return response;
        },
        (error) => {
          console.log(error);
        }
      );
      var messageWindow = document.querySelector("#messageWindow");
      messageWindow.scrollTop = messageWindow.scrollHeight;
      return responseBody;
    }
  }, [messageMode.receiver_id, user]);

  const updateMessage = () => setInterval(myfunc, 5000);

  // GET MESSAGES
  useEffect(() => {
    myfunc();
    // clearInterval(updateMessage)
    // updateMessage();
  }, [myfunc]);

  // useEffect(()=>{
  //     updateMessage();
  // }, [])

  return (
    <div className="flex flex-col h-screen grow-16">
      <MessageAreaHeader
        toggleSubMenu={toggleSubMenu}
        toggleChannelDetails={toggleChannelDetails}
      />
      {/* DISPLAY MESSAGES */}
      <div className="grow-16 overflow-y-scroll bg-gray-100" id="messageWindow">
        <div className="flex flex-col bg-gray-100 p-2 h-fit">
          {messages !== undefined || messages.length != 0 ? (
            messages.map((message, index) => {
              return (
                <MessageDisplay
                  key={Math.random()}
                  message={message}
                ></MessageDisplay>
              );
            })
          ) : (
            <div>MessageDisplay</div>
          )}
        </div>
      </div>
      <SendMessage myfunc={myfunc} />
    </div>
  );
};

export default MessageArea;
