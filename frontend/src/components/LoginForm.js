import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const navigate = useNavigate();

    async function loginUser(credentials) {
        try {
            const res = await fetch(
                "http://localhost:8000/users/login",
                {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { 'Content-type': 'application/json' },
                    credentials: "include"
                }
            );
            if(res.status === 200) {
                navigate('/');
            }
        } catch(err) {
            alert(err.message);
        }

    }

    function handleSubmit(e) {
        e.preventDefault();
        const credentials = {
            username: username,
            password: password
        }
        loginUser(credentials);
    }

    return(
        <Box
            sx={{
                mt: 10,
                p: 5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'grey'
            }}
        >
            <Typography component="h1" variant="h5">
                Welcome!
            </Typography>
            <Box 
                component='form'
                onSubmit={handleSubmit}
                sx={{mt: 3}}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            id="username" 
                            label="Username" 
                            name="username"
                            required
                            fullWidth
                            onChange={(e) => setUsername(e.target.value)} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="password" 
                            label="Password"
                            name="password"
                            type="password"
                            required
                            fullWidth
                            onChange={(e) => setPassword(e.target.value)} />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                >
                    Login
                </Button>
            </Box>
        </Box>
    );
}

export default LoginForm;