import React, { useState } from "react";
import styled from "styled-components";
import axios from "../axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({ theme }) => theme.text};
  padding: 0 20px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 3px solid ${({ theme }) => theme.soft};
  padding: 20px 50px;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  border-radius: 10px;

  @media (max-width: 600px) {
    padding: 15px 30px;
    width: 90%;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const Input = styled.input`
  border: 3px solid ${({ theme }) => theme.soft};
  border-radius: 5px;
  padding: 10px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
  font-size: 16px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Button = styled.button`
  border-radius: 5px;
  border: none;
  padding: 12px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  @media (max-width: 600px) {
    padding: 10px 15px;
  }
`;

const SignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/signin";
    const payload = isSignUp ? { name, email, password } : { email, password };

    try {
      const res = await axios.post(endpoint, payload);
      dispatch(loginSuccess(res.data.user));
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      dispatch(loginFailure());
      alert(isSignUp ? "Failed to sign up" : "Failed to sign in");
    }
  };

  const handleGoogleSignIn = async () => {
    dispatch(loginStart());
    try {
      const result = await signInWithPopup(auth, provider);
      const res = await axios.post("/auth/google", {
        email: result.user.email,
        name: result.user.displayName,
        img: result.user.photoURL,
        googleId: result.user.uid,
      });
      dispatch(loginSuccess(res.data.user));
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      dispatch(loginFailure());
      alert("Failed to sign in with Google");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>{isSignUp ? "Sign Up" : "Sign In"}</Title>
        <form onSubmit={handleAuth} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          {isSignUp && (
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          )}
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</Button>
        </form>
        <Button onClick={handleGoogleSignIn}>
          <GoogleIcon /> Sign in with Google
        </Button>
        <Button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Sign In" : "Create an account"}
        </Button>
      </Wrapper>
    </Container>
  );
};

export default SignIn;







