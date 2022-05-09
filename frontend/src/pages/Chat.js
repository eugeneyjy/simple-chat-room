import { Container, Grid } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import ChatConversationsLayout from "../components/ChatConversationsLayout";
import ChatMessagesLayout from "../components/ChatMessagesLayout";
import useFetchChat from "../hooks/useFetchChat";
import useFetchChats from "../hooks/useFetchChats";

function Chat() {
    const userId = Cookies.get('userId');
    const [ chats, setChats ] = useState([]);
    const [ currentChat, setCurrentChat ] = useState(0);
    const [ user, loading, error ] = useFetchChats(userId, setChats);
    console.log("currentchat", chats[currentChat]);
    const [ chat ] = useFetchChat(chats.length > 0 ? chats[currentChat]._id : '');

    return(
        <Container component='main' maxWidth='lg' sx={{ mt: 5, display: 'flex'}}>
            <Grid container>
                <Grid item xs={4}>
                    <ChatConversationsLayout chats={chats} setChats={setChats} setCurrentChat={setCurrentChat} user={user} userId={userId}/>
                </Grid>
                <Grid item xs={8}>
                    <ChatMessagesLayout userId={userId} chat={chat}/>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Chat;