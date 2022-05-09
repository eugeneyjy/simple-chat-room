import { Avatar, InputBase, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";

function ChatMessagesLayout({ userId, chat }) {
    console.log("filter", chat ? chat.participants.filter(p => p._id !== userId)[0] : '');
    return(
        <Box
            sx={{ 
                bgcolor: 'grey',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Paper
                square
                elevation={0}
                variant="outlined"
                sx={{ p: '12px 10px', display: 'flex', alignItems: 'center' }}
            >
                <Avatar alt="Remy Sharp" src="http://placekitten.com/200/300" sx={{ mr: 2 }}/>
                <Typography variant="h6" color="inherit" component="div">
                    {chat ? chat.participants.filter(p => p._id !== userId)[0].username : ''}
                </Typography>
            </Paper>
            <Box
                sx={{height: '100%'}}
            >
                {chat ? chat.messages.map((message) => (<div key={message._id}>{message.text}</div>)) : ''}
            </Box>
            <Paper
                square
                elevation={0}
                variant="outlined"
                sx={{ p: '10px 10px' }}
            >
                <Paper
                    square={false}
                    variant="outlined"
                    sx={{ borderRadius: 5, display: 'flex' }}
                >
                    <InputBase
                        sx={{ ml: 1, pr: 2, pl: 2, width: '100%' }}
                        placeholder="Start new conversation"
                        inputProps={{ 'aria-label': 'Start new conversation' }}
                        multiline
                        maxRows={5}
                    />
                </Paper>
            </Paper>
        </Box>
    );
}

export default ChatMessagesLayout;