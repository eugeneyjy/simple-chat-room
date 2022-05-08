import { Container } from "@mui/material";
import LoginForm from "../components/LoginForm";

function Login() {
    return(
        <Container component='main' maxWidth='xs'>
            <LoginForm/>
        </Container>
    );
}

export default Login;