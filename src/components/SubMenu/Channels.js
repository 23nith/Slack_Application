import { useContext } from "react";
import { MessageContext } from "../../States/MessageContext";
import env from "react-dotenv";
import { useChannelDetailsContext } from "../../States/ChannelDetailsProvider";
import axios from "axios";
import { useAuthProvider } from "../../States/AuthProvider";

const Channels = ({ channel }) => {
  const { dispatch, messageMode } = useContext(MessageContext);
  const [{ user }] = useAuthProvider();
  const [_, channelDispatch] = useChannelDetailsContext();
  const handleClick = async (e) => {
    console.log(e.target);
    dispatch({
      type: "SET_MESSAGE_TYPE",
      user: {
        receiver_id: e.target.id,
        receiver_class: "Channel",
        name: e.target.innerText,
      },
    });
    // get channel details
    try {
      const channelDetailsData = await axios
        .get(`http://206.189.91.54/api/v1/channels/${e.target.id}`, {
          headers: {
            expiry: user.expiry,
            uid: user.uid,
            "access-token": user["access-token"],
            client: user.client,
          },
        })
        .then(({ data }) => data.data);
      // set the data to channel details state
      channelDispatch({
        type: "SET_CHANNEL_DETAILS",
        channelDetailsData,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <li
      className={`w-fit px-4 cursor-pointer rounded-md ${
        channel.name == messageMode.name
          ? "font-bold bg-gray-400 text-zinc-700"
          : ""
      }`}
      key={channel.id}
      id={channel.id}
      onClick={handleClick}
    >
      {channel.name}
    </li>
  );
};

export default Channels;
