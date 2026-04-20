/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled, { keyframes } from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Fixed: Removed async from useEffect, added proper error handling
  useEffect(() => {
    const userDataKey = process.env.REACT_APP_LOCALHOST_KEY || "userData";
    const userData = localStorage.getItem(userDataKey);
    
    if (!userData) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem(userDataKey);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Socket connection effect
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
      
      // Cleanup on unmount
      return () => {
        socket.current?.disconnect();
      };
    }
  }, [currentUser]);

  // Contacts loading effect
  useEffect(() => {
    const loadContacts = async () => {
      if (currentUser?.isAvatarImageSet) {
        try {
          setIsLoading(true);
          const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data);
        } catch (error) {
          console.error("Failed to load contacts:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        navigate("/setAvatar");
      }
    };

    if (currentUser) {
      loadContacts();
    }
  }, [currentUser, navigate]);

  const handleChatChange = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Container>
      <HolographicBackground />
      <InnerContainer>
        <Contacts 
          contacts={contacts} 
          changeChat={handleChatChange}
          currentUser={currentUser}
        />
        {currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer 
            currentChat={currentChat} 
            socket={socket}
            currentUser={currentUser}
          />
        )}
      </InnerContainer>
      <StatusBar />
    </Container>
  );
}

// Futuristic Styled Components
const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 20px rgba(0, 255, 255, 0.3),
      0 0 40px rgba(120, 219, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  50% { 
    box-shadow: 
      0 0 40px rgba(0, 255, 255, 0.6),
      0 0 80px rgba(120, 219, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const scanMatrix = keyframes`
  0% { 
    background-position: 0% 50%;
  }
  100% { 
    background-position: 100% 50%;
  }
`;

const floatGrid = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px); }
  33% { transform: translateY(-20px) translateX(10px); }
  66% { transform: translateY(-10px) translateX(-10px); }
`;

const glitchShift = keyframes`
  0%, 100% { transform: translateX(0); }
  10% { transform: translateX(-2px); }
  20% { transform: translateX(2px); }
  30% { transform: translateX(-1px); }
  40% { transform: translateX(1px); }
  50% { transform: translateX(-2px); }
  60% { transform: translateX(2px); }
  70% { transform: translateX(-1px); }
  80% { transform: translateX(1px); }
  90% { transform: translateX(0); }
`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background: 
    radial-gradient(ellipse 80% 60% at 20% 20%, rgba(0, 255, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 50% 40% at 80% 80%, rgba(120, 219, 255, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a1a 0%, #0f0f23 50%, #000000 100%);
`;

const HolographicBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.04) 1px, transparent 1px),
    radial-gradient(circle at 25% 25%, rgba(120, 219, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(0, 191, 255, 0.03) 0%, transparent 50%);
  background-size: 50px 50px, 50px 50px, 200px 200px, 300px 300px;
  animation: ${floatGrid} 25s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
`;

const InnerContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  position: relative;
  z-index: 1;

  .container {
    height: 90vh;
    width: 95vw;
    max-width: 1600px;
    background: rgba(10, 10, 26, 0.85);
    backdrop-filter: blur(25px);
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 24px;
    display: grid;
    grid-template-columns: 25% 75%;
    box-shadow: 
      0 32px 80px -20px rgba(0, 0, 0, 0.9),
      0 0 0 1px rgba(0, 255, 255, 0.2),
      ${pulseGlow} 4s ease-in-out infinite;
    overflow: hidden;
    position: relative;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
      height: 85vh;
      width: 90vw;
    }

    @media screen and (max-width: 720px) {
      grid-template-columns: 1fr;
      height: 85vh;
      width: 95vw;
      gap: 1rem;
    }
  }
`;

const StatusBar = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 10, 26, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(0, 255, 255, 0.4);
  border-radius: 20px;
  padding: 0.75rem 2rem;
  color: rgba(120, 219, 255, 0.9);
  font-family: 'SF Mono', monospace;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: ${glitchShift} 3s infinite;
  
  &::before {
    content: ">> NEURAL LINK ACTIVE | QUANTUM SYNC: 100% | LATENCY: 12ms";
  }
`;

const LoadingScreen = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0a0a1a 0%, #0f0f23 50%, #000000 100%);
  color: #00ffff;
  font-family: 'SF Mono', monospace;
  text-align: center;
  gap: 2rem;

  &::before {
    content: '';
    width: 80px;
    height: 80px;
    border: 4px solid rgba(0, 255, 255, 0.3);
    border-top: 4px solid #00ffff;
    border-radius: 50%;
    animation: ${pulseGlow} 1.5s linear infinite;
  }

  &::after {
    content: 'INITIALIZING NEURAL INTERFACE...';
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 2px;
    opacity: 0.8;
  }
`;