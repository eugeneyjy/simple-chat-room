import { Container, Grid } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatConversationsLayout from "../components/ChatConversationsLayout";
import ChatMessagesLayout from "../components/ChatMessagesLayout";
import useFetchChat from "../hooks/useFetchChat";
import useFetchChats from "../hooks/useFetchChats";
import socket from "../utils/socket";

function Chat() {
    const userId = Cookies.get('userId');
    const navigate = useNavigate();
    const [ chats, setChats ] = useState([]);
    const [ currentChat, setCurrentChat ] = useState(0);
    const [ user ] = useFetchChats(userId, setChats);
    const [ chat, setChat ] = useState(null);
    useFetchChat(chats.length > 0 ? chats[currentChat]._id : '', setChat);

    useEffect(() => {
        if(!userId) {
            navigate('/login');
        }
        socket.auth = { userId };
        socket.connect();
        socket.emit("addUser", userId);
    }, [userId]);

    function handleChatClick(idx) {
        setCurrentChat(idx);
    }

    return(
        <Container component='main' maxWidth='lg' sx={{ mt: 5, display: 'flex'}}>
            <Grid container>
                <Grid item xs={4}>
                    <ChatConversationsLayout 
                        chats={chats} 
                        currentChat={currentChat}
                        setChats={setChats} 
                        setCurrentChat={setCurrentChat} 
                        onChatClick={handleChatClick} 
                        user={user} 
                        userId={userId}/>
                </Grid>
                <Grid item xs={8}>
                    <ChatMessagesLayout
                        userId={userId}
                        chat={chat}
                        setChats={setChats}/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Chat;