import React, {useContext, useEffect, useState} from "react";
import { MessageContext } from "../../States/MessageContext";
import { useAuthProvider } from "../../States/AuthProvider";
import axios from "axios";
import env from "react-dotenv";

const DirectMessages = () => {
    const [{ user }] = useAuthProvider();
    const {dispatch} = useContext(MessageContext);
    const [messengers, setMessengers] = useState([])
    const {messageMode} = useContext(MessageContext);
    const [allUsers, setAllUsers] = useState('')
    const [done, setDone] = useState(false)
    const [messengerList, setMessengerList] = useState([]);


    useEffect(() => {
        if(user !== undefined){

            const getUsers = axios({
                url: "/users",
                baseURL: `http://206.189.91.54/api/v1`,
                method: 'get',
                headers: {
                    "expiry": user.expiry,
                    "uid": user.uid,
                    "access-token": user["access-token"],
                    "client": user.client
                }
            }).then(response => {
                const theUsers = response.data.data.map((item)=>{
                    return {id: item.id, email: item.uid}
                })
                // console.log("TheUsers: ", theUsers);
                setAllUsers(theUsers);
                console.log("getUsers run..")
                setDone(true);
                return theUsers;
            })

        }


    }, [user])

    useEffect(() => {
        if(allUsers !== '' && done == true){
            allUsers.map((theUser)=>{
                const responseBody = axios({
                    url: "/messages",
                    baseURL: `http://206.189.91.54/api/v1`,
                    method: 'get',
                    params: {
                        receiver_id: theUser.id,
                        receiver_class: 'User'
                    },
                    headers: {
                        "expiry": user.expiry,
                        "uid": user.uid,
                        "access-token": user["access-token"],
                        "client": user.client
                    }
                })
                .then(response => {
                    if(response.data.data.length !== 0 ){
                        setMessengers([...messengers, {id: theUser.id, email: theUser.email}])
                    }
                    return response
                })
                
                return theUser
            })

        }


    }, [allUsers, done])

    useEffect(()=>{
        if(messengers.length !== 0){
            setMessengerList([...messengerList, ...messengers])
        }
    }, [messengers])

    const handleClick = (e) => {
        dispatch({type: 'SET_MESSAGE_TYPE', user: {"receiver_id": e.target.id, "receiver_class": 'User', "name": e.target.innerText}})
    }

    return messengerList.length !== 0 ? (
        messengerList.map((messenger)=>{
            return (
                <li className={`w-fit px-4 cursor-pointer rounded-md ${messenger.email == messageMode.name ? "font-bold bg-gray-400 text-zinc-700": ""}`} key={messenger.id} id={messenger.id} onClick={handleClick}>{messenger.email}</li>
            )
        })
    ) : (
        <li className="w-fit"></li>
    )
}
 
export default DirectMessages;