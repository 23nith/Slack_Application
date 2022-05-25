import { useState, useContext } from "react";
import { MessageContext } from "../../States/MessageContext";
import { useAuthProvider } from "../../States/AuthProvider";
import { useForm } from "react-hook-form";
import axios from "axios";
import env from "react-dotenv";

const SendMessage = ({myfunc}) => {
    const [{ user }] = useAuthProvider();
    const {messageMode} = useContext(MessageContext)
    const [messageToSend, setMessageToSend] = useState();

    const {register, handleSubmit} = useForm();
    
    const sendMessage = (data) =>{
        let bodyContents = {
            receiver_id: parseInt(messageMode["receiver_id"]),
            receiver_class: messageMode["receiver_class"],
            body: data.messageToSend
        }
    
        let requestHeaders = {
            headers: {
            "expiry": user.expiry,
            "uid": user.uid,
            "access-token": user["access-token"],
            "client": user.client
            }
        }

        axios.post(`http://206.189.91.54/api/v1/messages`, bodyContents, requestHeaders)
        .then((response) => {
            console.log("Success axios", response)
            setMessageToSend("")
            myfunc()
        }, (error)=> {
            console.log("Rejected", error)
        })
    }

    
    return ( 
        <div className="h-17 w-full bg-gray-700 p-4">
            <form onSubmit={handleSubmit(sendMessage)}>
                <div className="flex flex-row">
                    <div className="w-full">
                        <textarea className="mt-4 bg-gray-100 border outline-none rounded-md p-3 text-black w-99 "
                        placeholder={"Send message"} 
                        {...register("messageToSend", {
                            required: "true",
                            onChange: (e)=> setMessageToSend(e.target.value) 
                            })}
                        value={messageToSend}/>
                    </div>
                    <div>
                        <button className="mt-4 rounded-md text-xs bg-gray-400 text-white w-fit px-5 py-3" type="Submit">Send</button>
                    </div>
                </div>

            </form>
        </div> 
    );
}
 
export default SendMessage;