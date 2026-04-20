/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
    if (userData) {
      navigate("/");
    } else {
      usernameRef.current?.focus();
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Username validation
    if (!values.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (values.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Email validation
    if (!values.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!values.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (values.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    // Confirm password validation
    if (!values.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors above", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (!data.status) {
        toast.error(data.msg || "Registration failed", toastOptions);
        return;
      }

      localStorage.setItem(
        process.env.REACT_APP_LOCALHOST_KEY,
        JSON.stringify(data.user)
      );
      toast.success("Account created successfully! Welcome aboard.", toastOptions);
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.msg || "Network error. Please try again.", 
        toastOptions
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container>
        <FormCard>
          <Brand>
            <LogoIcon src={Logo} alt="ChatApp Logo" />
            <BrandTitle>
              <GradientText>Join the</GradientText> Matrix
            </BrandTitle>
          </Brand>
          
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <InputLabel>Username</InputLabel>
              <InputField
                ref={usernameRef}
                type="text"
                name="username"
                placeholder="Enter your username"
                value={values.username}
                onChange={handleChange}
                $hasError={!!errors.username}
                disabled={isLoading}
                minLength="3"
              />
              {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <InputLabel>Email</InputLabel>
              <InputField
                ref={emailRef}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                $hasError={!!errors.email}
                disabled={isLoading}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <InputLabel>Password</InputLabel>
              <InputField
                ref={passwordRef}
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={values.password}
                onChange={handleChange}
                $hasError={!!errors.password}
                disabled={isLoading}
                minLength="8"
              />
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <InputLabel>Confirm Password</InputLabel>
              <InputField
                ref={confirmPasswordRef}
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={values.confirmPassword}
                onChange={handleChange}
                $hasError={!!errors.confirmPassword}
                disabled={isLoading}
              />
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
            </InputGroup>

            <ButtonContainer>
              <SubmitButton type="submit" disabled={isLoading}>
                <ButtonContent>
                  {isLoading ? (
                    <>
                      <Spinner />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserIcon />
                      Create Account
                    </>
                  )}
                </ButtonContent>
              </SubmitButton>
            </ButtonContainer>
          </form>

          <AuthLink>
            Already in the Matrix? <StyledLink to="/login">Enter Now</StyledLink>
          </AuthLink>
        </FormCard>
      </Container>
      <ToastContainer />
    </>
  );
}

// Keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const glowPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(78, 14, 255, 0.5), 
                0 0 40px rgba(168, 85, 247, 0.3);
  }
  50% { 
    box-shadow: 0 0 40px rgba(78, 14, 255, 0.8), 
                0 0 80px rgba(168, 85, 247, 0.5);
  }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shine = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: 
    radial-gradient(ellipse 80% 60% at 20% 20%, rgba(120, 119, 198, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse 50% 40% at 80% 80%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
    radial-gradient(ellipse 60% 50% at 50% 50%, rgba(78, 14, 255, 0.15) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a1a 0%, #0f0f23 50%, #000000 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #4e0eff, #a855f7, transparent);
    animation: ${scanline} 4s linear infinite;
  }
`;

const FormCard = styled.div`
  background: rgba(10, 10, 26, 0.9);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(78, 14, 255, 0.3);
  border-radius: 32px;
  padding: 4rem 3.5rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 
    0 32px 64px -16px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(78, 14, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  animation: ${float} 6s ease-in-out infinite;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(78, 14, 255, 0.08), 
      transparent
    );
    transition: left 0.6s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2.5rem;
`;

const LogoIcon = styled.img`
  height: 5.5rem;
  filter: drop-shadow(0 0 25px rgba(78, 14, 255, 0.7));
  transition: all 0.3s ease;
`;

const BrandTitle = styled.h1`
  font-size: clamp(2.2rem, 5vw, 3rem);
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #ffffff 0%, #c0b7e8 50%, #4e0eff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #4e0eff 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

const InputLabel = styled.label`
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const InputField = styled.input`
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
  border: 2px solid ${props => props.$hasError ? '#ef4444' : 'rgba(78, 14, 255, 0.5)'};
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: #4e0eff;
    box-shadow: 0 0 0 4px rgba(78, 14, 255, 0.15);
    transform: translateY(-1px);
  }

  ${props => props.$hasError && `
    animation: ${shake} 0.5s ease-in-out;
    border-color: #ef4444;
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: -0.25rem;
`;

const ButtonContainer = styled.div`
  margin: 2rem 0 1.5rem 0;
  position: relative;
`;

const SubmitButton = styled.button`
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #4e0eff 0%, #a855f7 100%);
  border: none;
  border-radius: 24px;
  padding: 1.3rem 2.5rem;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  text-transform: uppercase;
  letter-spacing: 1px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Controlled shadows */
  box-shadow: 
    0 8px 25px rgba(78, 14, 255, 0.35),
    0 4px 12px rgba(168, 85, 247, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 35px rgba(78, 14, 255, 0.45),
      0 6px 18px rgba(168, 85, 247, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
    background: linear-gradient(135deg, #3c0edc 0%, #9333ea 100%);
  }

  &:active:not(:disabled) {
    transform: translateY(0px);
    box-shadow: 
      0 6px 20px rgba(78, 14, 255, 0.3),
      0 2px 8px rgba(168, 85, 247, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: 
      0 4px 12px rgba(78, 14, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  position: relative;
  z-index: 2;
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const UserIcon = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 5px;
    width: 12px;
    height: 12px;
    background: linear-gradient(135deg, #4ade80, #10b981);
    border-radius: 50%;
  }
  
  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
  }
`;

const AuthLink = styled.span`
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.95rem;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-top: 1.75rem;
  display: block;
`;

const StyledLink = styled(Link)`
  color: #4e0eff;
  text-decoration: none;
  font-weight: 700;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
  }
`;
