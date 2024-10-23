
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react"
import { io } from "socket.io-client";


const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
    const socket = useRef()
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: userInfo.id },
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server")
            });


            // const handleReceiveMessage = (message) => {
            //     const { selectedChatType, selectedChatData, addMessage } = useAppStore.getState();
            
            //     console.log("Received message:", message); 
            
            //     if (selectedChatType !== undefined) {
            //         const isSender = selectedChatData._id === message.sender._id;
            //         const isRecipient = selectedChatData.id === message.recipient._id;
            
            //         // console.log("Selected Chat Data:", selectedChatData);
            //         // console.log("Is Sender:", isSender, "Is Recipient:", isRecipient);
            
            //         if (isSender || isRecipient) {
            //             console.log("Adding message to chat state.");
            //             addMessage(message);
            //         } else {
            //             console.log("Message does not match selected chat.");
            //         }
            //     }
            // };
            
            const handleReceiveMessage = (message) =>{
                const {selectedChatType, selectedChatData, addMessage} = useAppStore.getState();

                if(selectedChatType !== undefined && 
                    (selectedChatData._id === message.sender._id || 
                        selectedChatData._id === message.recipient._id
                    )){
                        console.log("RCV :", message);
                        addMessage(message);
                    }
            };

            // socket.current.on("recieveMessage", handleReciveMessage);
            

            socket.current.on("receiveMessage", handleReceiveMessage); 


            return () => {
                socket.current.disconnect();
            }
        }
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}