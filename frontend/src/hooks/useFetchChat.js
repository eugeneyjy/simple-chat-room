import { useState, useEffect } from 'react';

function useFetchChat(conversationId) {
    const [ chat, setChat ] = useState()

    useEffect(() => {
        console.log(conversationId);
        async function fetchChats() {
            let responseBody = {};
            try {
                const response = await fetch(
                    `http://localhost:8000/conversations/${conversationId}`,
                    {
                        credentials: 'include'
                    }
                )
                if(response.status !== 200) {
                    throw response.status;
                }
                responseBody = await response.json();
            } catch(e) {
                console.log(e);
                throw e;
            }
            setChat(responseBody);
        }

        if(conversationId) {
            fetchChats();
        }
    }, [ conversationId ]);

    return [ chat ];
}

export default useFetchChat;