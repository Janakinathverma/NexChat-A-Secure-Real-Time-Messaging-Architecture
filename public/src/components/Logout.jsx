import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";

export default function Logout() {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (!userData) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const { _id } = JSON.parse(userData);
      const response = await axios.get(`${logoutRoute}/${_id}`);
      
      if (response.status === 200) {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear storage and redirect on error
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <LogoutButton onClick={handleClick} title="Logout">
      <BiPowerOff />
      <GlowEffect />
    </LogoutButton>
  );
}

const LogoutButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  cursor: pointer;
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 32px rgba(102, 126, 234, 0.3),
    0 4px 16px rgba(118, 75, 162, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 40px rgba(102, 126, 234, 0.4),
      0 8px 24px rgba(118, 75, 162, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 
      0 4px 16px rgba(102, 126, 234, 0.3),
      0 2px 8px rgba(118, 75, 162, 0.2);
  }

  svg {
    font-size: 1.4rem;
    color: #ffffff;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    z-index: 2;
    transition: all 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1) rotate(10deg);
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.8));
  }
`;

const GlowEffect = styled.div`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent 30%
  );
  border-radius: 50%;
  opacity: 0;
  transition: all 0.6s ease;
  pointer-events: none;
  z-index: 1;

  ${LogoutButton}:hover & {
    opacity: 1;
    animation: rotate 2s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;