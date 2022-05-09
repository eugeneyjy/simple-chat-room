import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupForm() {
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const navigate = useNavigate();

    async function createUser(user) {
        try {
            const res = await fetch(
                "http://localhost:8000/users",
                {
                    method: 'POST',
                    body: JSON.stringify(user),
                    headers: { 'Content-type': 'application/json' }
                }
            );
            if(res.status === 201) {
                console.log("redirect");
                navigate('/login');
            } else if(res.status === 403) {
                const responseBody = await res.json();
                alert(responseBody.error);
            }
        } catch(err) {
            alert(err);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const user = {
            username: username,
            email: email,
            password: password
        }
        createUser(user);
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
                Create an Account
            </Typography>
            <Box 
                component='form'
                onSubmit={handleSubmit}
                sx={{mt: 3}}
            >
                <Grid container spacing={2} sx={{mb: 2}}>
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
                            id="email" 
                            label="Email"
                            name="email"
                            type="email"
                            required
                            fullWidth
                            onChange={(e) => setEmail(e.target.value)} />
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
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="/login">
                            Login
                        </Link>
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign up
                </Button>
            </Box>
        </Box>
    );
}

export default SignupForm;