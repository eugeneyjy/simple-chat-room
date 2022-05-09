import { useState, useEffect } from 'react';

function useFetchChats(userId, setChats) {
    const [ user, setUser ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    useEffect(() => {
        async function fetchChats() {
            let responseBody = {};
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:8000/users/${userId}/conversations`,
                    {
                        credentials: 'include'
                    }
                )
                if(response.status !== 200) {
                    setError(true);
                    throw response.status;
                }
                responseBody = await response.json();
            } catch(e) {
                console.log(e);
                setError(true);
                throw e;
            }
            setLoading(false);
            setError(false);
            setUser(responseBody.user);
            setChats(responseBody.conversations);
        }

        if(userId) {
            fetchChats();
        }
    }, [ userId, setChats ]);

    return [ user, loading, error ];
}

export default useFetchChats;