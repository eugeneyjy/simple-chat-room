import { Avatar, Box, IconButton, InputBase, Paper, Typography } from "@mui/material";
import { grey } from '@mui/material/colors';
import ChatConversations from "./ChatConversations";
import SearchIcon from '@mui/icons-material/Search';


function ChatConversationsLayout({chats, currentChat, setChats, setCurrentChat, onChatClick, user, userId}) {
    async function startNewConversation(e) {
        if(e.key === 'Enter') {
            const username = e.currentTarget.value;
            let chatWithUser = {};
            try {
                const res = await fetch(
                    `http://localhost:8000/users/byusername/${username}`,
                    {
                        method: 'GET',
                        headers: { 'Content-type': 'application/json' }
                    }
                );
                if(res.status === 200) {
                    const responseBody = await res.json();
                    chatWithUser = responseBody;
                    try {
                        if(chatWithUser._id === userId) {
                            throw new Error("Can't chat with yourself");
                        } 
                        const conversation = {
                            participantIds: [userId, chatWithUser._id],
                            type: "dm"
                        };
                        const res = await fetch(
                            "http://localhost:8000/conversations",
                            {
                                method: 'POST',
                                body: JSON.stringify(conversation),
                                headers: { 'Content-type': 'application/json' },
                                credentials: 'include'
                            }
                        );
                        const responseBody = await res.json();
                        const newChat = {
                            _id: responseBody.id,
                            otherParticipants: [chatWithUser]
                        };
                        setChats(prev => [newChat, ...prev]);
                        setCurrentChat(0);
                    } catch(err) {
                        alert(err);
                    }
                } else {
                    throw new Error('User not found');
                }
            } catch(err) {
                alert(err);
            }
        }
    }

    return(
        <Box
            sx={{
                backgroundColor: grey[500],
                height: '100%',
                minHeight: 650
            }}
        >
            <Paper
                square
                variant="outlined"
                sx={{ p: '12px 10px', display: 'flex', alignItems: 'center', width: 400 }}
            >
                <Avatar alt="Remy Sharp" src="http://placekitten.com/200/300" sx={{ mr: 2, ml: 0.5 }}/>
                <Typography variant="h6" color="inherit" component="div">
                    {user.username ? user.username : ''}
                </Typography>
            </Paper>
            <Paper
                square
                sx={{ p: '10px 10px' }}
            >
                <Paper
                    square={false}
                    variant="outlined"
                    sx={{ borderRadius: 5, display: 'flex' }}
                >
                    <IconButton>
                        <SearchIcon/>
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, pr: 2, width: '100%' }}
                        placeholder="Start new conversation"
                        inputProps={{ 'aria-label': 'Start new conversation' }}
                        onKeyUp={(e) => startNewConversation(e)}
                    />
                </Paper>
            </Paper>
            <ChatConversations chats={chats} currentChat={currentChat} onChatClick={onChatClick}/>
        </Box>
    );
}

export default ChatConversationsLayout;