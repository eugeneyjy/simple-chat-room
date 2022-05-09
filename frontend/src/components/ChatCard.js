import React from "react";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

function ChatCard({ info }) {
    return(
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="http://placekitten.com/200/300" />
            </ListItemAvatar>
            <ListItemText
                primary={info.otherParticipants[0].username}
                secondary={info.lastMessage ? info.lastMessage.text : ''}
            />
        </ListItem>
    );
}

export default ChatCard;