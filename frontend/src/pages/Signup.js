import { Container } from "@mui/material";
import SignupForm from "../components/SignupForm";

function Signup() {
    return(
        <Container component='main' maxWidth='xs'>
            <SignupForm/>
        </Container>
    );
}

export default Signup;