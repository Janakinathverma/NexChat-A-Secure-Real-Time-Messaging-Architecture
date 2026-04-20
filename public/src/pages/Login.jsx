/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem(
      process.env.REACT_APP_LOCALHOST_KEY || "userData"
    );
    if (userData) {
      navigate("/");
    } else {
      usernameRef.current?.focus();
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!values.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (values.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    if (!values.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    
    if (!isValid) {
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
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });

      if (!data.status) {
        toast.error(data.msg || "Login failed", toastOptions);
        return;
      }

      localStorage.setItem(
        process.env.REACT_APP_LOCALHOST_KEY || "userData",
        JSON.stringify(data.user)
      );
      toast.success("Login successful! Welcome back.", toastOptions);
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error. Please try again.", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container>
        <BackgroundGrid />
        <FormCard>
          <Brand>
            <LogoIcon src={Logo} alt="ChatApp Logo" />
            <BrandTitle>
              <GradientText>Chat</GradientText>App
            </BrandTitle>
        
          </Brand>
          
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <InputLabel>Login ID</InputLabel>
              <InputFieldWrapper>
                <InputField
                  ref={usernameRef}
                  type="text"
                  name="username"
                  placeholder="Enter login identifier"
                  value={values.username}
                  onChange={handleChange}
                  $hasError={!!errors.username}
                  disabled={isLoading}
                />
                <InputGlow $hasError={!!errors.username} />
                <ScanLine />
              </InputFieldWrapper>
              {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
            </InputGroup>

            <InputGroup>
              <InputLabel>Password</InputLabel>
              <InputFieldWrapper>
                <InputField
                  ref={passwordRef}
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={values.password}
                  onChange={handleChange}
                  $hasError={!!errors.password}
                  disabled={isLoading}
                />
                <InputGlow $hasError={!!errors.password} />
                <ScanLine />
              </InputFieldWrapper>
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </InputGroup>

            <ButtonContainer>
              <SubmitButton type="submit" disabled={isLoading}>
                <ButtonContent>
                  {isLoading ? (
                    <>
                      <QuantumSpinner />
                      <span>INITIALIZING...</span>
                    </>
                  ) : (
                    <>
                      <PortalIcon />
                      <span>Login</span>
                    </>
                  )}
                </ButtonContent>
                <ButtonShine />
              </SubmitButton>
            </ButtonContainer>
          </form>

          <AuthLink>
            NEW TO NETWORK? <StyledLink to="/register">INITIALIZE NODE</StyledLink>
          </AuthLink>
        </FormCard>
      </Container>
      <ToastContainer />
    </>
  );
}

// Enhanced Keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotateX(0deg); }
  50% { transform: translateY(-15px) rotateX(2deg); }
`;

const quantumPulse = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 20px rgba(0, 255, 255, 0.3),
      0 0 40px rgba(120, 219, 255, 0.2),
      0 0 80px rgba(0, 191, 255, 0.1);
  }
  50% { 
    box-shadow: 
      0 0 40px rgba(0, 255, 255, 0.6),
      0 0 80px rgba(120, 219, 255, 0.4),
      0 0 120px rgba(0, 191, 255, 0.2);
  }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%) scaleX(0.5); opacity: 0.8; }
  50% { opacity: 1; }
  100% { transform: translateY(100%) scaleX(1.2); opacity: 0.3; }
`;

const glitch = keyframes`
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
`;

const quantumSpin = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
`;

const shine = keyframes`
  0% { left: -100%; transform: skewX(-25deg); }
  100% { left: 100%; transform: skewX(-25deg); }
`;

const particleFloat = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.6; }
  33% { transform: translateY(-10px) translateX(5px); opacity: 1; }
  66% { transform: translateY(-5px) translateX(-5px); opacity: 0.8; }
`;

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: 
    radial-gradient(ellipse 80% 50% at 20% 20%, rgba(0, 255, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(120, 219, 255, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse 50% 30% at 40% 70%, rgba(0, 191, 255, 0.08) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a1a 0%, #0f0f23 30%, #000000 100%);
  position: relative;
  overflow: hidden;
`;

const BackgroundGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: particleFloat 20s ease-in-out infinite;
  pointer-events: none;
`;

const FormCard = styled.div`
  background: rgba(10, 10, 26, 0.95);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 24px;
  padding: 3.5rem 3rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 
    0 32px 80px -20px rgba(0, 0, 0, 0.9),
    0 0 0 1px rgba(0, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    ${quantumPulse} 3s ease-in-out infinite;
  animation: ${float} 8s ease-in-out infinite;
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
      rgba(0, 255, 255, 0.06), 
      rgba(120, 219, 255, 0.04),
      transparent
    );
    animation: ${shine} 3s infinite;
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 3rem;
`;

const LogoIcon = styled.img`
  height: 5rem;
  filter: drop-shadow(0 0 25px rgba(0, 255, 255, 0.7));
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  
  ${FormCard}:hover & {
    filter: drop-shadow(0 0 35px rgba(0, 255, 255, 1));
    transform: scale(1.05) rotateZ(5deg);
  }
`;

const BrandTitle = styled.h1`
  font-size: 2.3rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #00ffff 0%, #78dbfb 50%, #00bfff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ffff, transparent);
    transform: translateX(-50%);
    border-radius: 1px;
  }
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #00ffff 0%, #00bfff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #00ff00, #00ff88);
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(0, 255, 136, 0.6);
  animation: quantumPulse 2s ease-in-out infinite;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  color: rgba(120, 219, 255, 0.9);
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: relative;
  
  &::before {
    content: '>>';
    margin-right: 0.5rem;
    color: #00ffff;
    font-family: monospace;
  }
`;

const InputFieldWrapper = styled.div`
  position: relative;
`;

const InputField = styled.input`
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  border: 2px solid rgba(0, 255, 255, 0.4);
  border-radius: 16px;
  padding: 1.375rem 1.75rem 1.375rem 3rem;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  font-family: 'SF Mono', monospace;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  width: 100%;
  letter-spacing: 0.5px;

  &::placeholder {
    color: rgba(120, 219, 255, 0.6);
    font-weight: 400;
    letter-spacing: 0.3px;
  }

  &:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 
      0 0 0 4px rgba(0, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  ${props => props.$hasError && `
    border-color: #ff0080;
    animation: ${glitch} 0.3s ease-in-out;
    box-shadow: 0 0 0 4px rgba(255, 0, 128, 0.3);
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InputGlow = styled.div`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: ${props => props.$hasError 
    ? 'linear-gradient(45deg, #ff0080, #ff4081)' 
    : 'linear-gradient(45deg, #00ffff, #78dbfb)'};
  border-radius: 18px;
  padding: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;

  ${InputField}:focus + &,
  ${InputField}:hover + & {
    opacity: 1;
  }
`;

const ScanLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 255, 255, 0.03) 50%,
    transparent 100%
  );
  animation: ${scanline} 3s linear infinite;
  pointer-events: none;
`;

const ErrorMessage = styled.span`
  color: #ff0080;
  font-size: 0.82rem;
  font-weight: 500;
  font-family: 'SF Mono', monospace;
  letter-spacing: 0.5px;
  animation: ${glitch} 0.4s ease-in-out;
`;

const ButtonContainer = styled.div`
  margin: 2rem 0 1.5rem 0;
  position: relative;
`;

const SubmitButton = styled.button`
  position: relative;
  width: 100%;
  background: linear-gradient(135deg, #00ffff 0%, #78dbfb 50%, #00bfff 100%);
  border: none;
  border-radius: 20px;
  padding: 1.5rem 2.5rem;
  color: #000;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-family: 'SF Mono', monospace;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  
  box-shadow: 
    0 12px 40px rgba(0, 255, 255, 0.4),
    0 4px 16px rgba(120, 219, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 
      0 20px 60px rgba(0, 255, 255, 0.6),
      0 8px 24px rgba(120, 219, 255, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px) scale(1);
    box-shadow: 
      0 8px 30px rgba(0, 255, 255, 0.5),
      0 4px 16px rgba(120, 219, 255, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 
      0 6px 20px rgba(0, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  position: relative;
  z-index: 2;
`;

const QuantumSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top: 2px solid rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  position: relative;
  animation: ${quantumSpin} 1s linear infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background: linear-gradient(45deg, #00ffff, #78dbfb);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ${quantumPulse} 1.5s ease-in-out infinite;
  }
`;

const PortalIcon = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  position: relative;
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(120, 219, 255, 0.1));
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 6px;
    width: 3px;
    height: 12px;
    background: rgba(0, 0, 0, 0.8);
    transform: rotate(45deg);
    transform-origin: bottom left;
    box-shadow: 2px 0 0 rgba(0, 0, 0, 0.8);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    right: 6px;
    width: 3px;
    height: 12px;
    background: rgba(0, 0, 0, 0.8);
    transform: rotate(-45deg);
    transform-origin: bottom right;
  }
`;

const ButtonShine = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transform: skewX(-25deg);
  animation: ${shine} 2s infinite;
  z-index: 1;
`;

const AuthLink = styled.span`
  color: rgba(120, 219, 255, 0.8);
  font-size: 0.95rem;
  text-align: center;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 2rem;
  display: block;
  font-family: 'SF Mono', monospace;
`;

const StyledLink = styled(Link)`
  color: #00ffff;
  text-decoration: none;
  font-weight: 800;
  position: relative;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #00ffff, #78dbfb, #00bfff);
    border-radius: 1px;
    transform: scaleX(0);
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
  
  &:hover {
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
  }
`;