/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  // Load messages when currentChat changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentChat?._id) return;
      
      try {
        const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
        if (!userData) return;
        
        const data = JSON.parse(userData);
        const response = await axios.post(recieveMessageRoute, {
          from: data._id,
          to: currentChat._id,
        });
        setMessages(response.data || []);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, [currentChat]);

  // Socket message listener
  useEffect(() => {
    const socketInstance = socket?.current;
    if (!socketInstance) return;

    const handleReceiveMsg = (msg) => {
      setArrivalMessage({ fromSelf: false, message: msg });
    };

    socketInstance.on("msg-recieve", handleReceiveMsg);

    // Cleanup
    return () => {
      socketInstance.off("msg-recieve", handleReceiveMsg);
    };
  }, [socket]);

  // Add arrival message to list
  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMsg = useCallback(async (msg) => {
    if (!currentChat?._id || !socket?.current) return;

    try {
      const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      const data = JSON.parse(userData);
      
      // Emit to socket
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: data._id,
        msg,
      });

      // Save to database
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
      });

      // Optimistically update UI
      setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [currentChat?._id, socket]);

  if (!currentChat) {
    return <EmptyChat />;
  }

  return (
    <Container>
      <ChatHeader>
        <UserDetails>
          <UserAvatar>
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt={currentChat.username}
            />
            <OnlineIndicator />
          </UserAvatar>
          <UserInfo>
            <Username>{currentChat.username}</Username>
            <Status>Online • Active</Status>
          </UserInfo>
        </UserDetails>
        <Logout />
      </ChatHeader>

      <MessagesArea>
        {messages.map((message, index) => (
          <Message key={`${message.message}-${index}`} 
                   fromSelf={message.fromSelf}
                   ref={messages.length - 1 === index ? scrollRef : null}>
            <MessageBubble fromSelf={message.fromSelf}>
              <MessageContent>{message.message}</MessageContent>
            </MessageBubble>
          </Message>
        ))}
      </MessagesArea>

      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

// Keyframes
const typingPulse = keyframes`
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
`;

const messageSlideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px rgba(154, 134, 243, 0.5);
  }
  50% { 
    box-shadow: 0 0 20px rgba(154, 134, 243, 0.8), 0 0 30px rgba(78, 14, 255, 0.4);
  }
`;

const EmptyChat = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, rgba(78, 14, 255, 0.05) 0%, transparent 50%);
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 2rem;
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 12% 78% 10%;
  height: 100vh;
  gap: 0.25rem;
  overflow: hidden;
  background: 
    linear-gradient(180deg, #0a0a1a 0%, #0f0f23 50%, #080420 100%),
    radial-gradient(ellipse at top-left, rgba(78, 14, 255, 0.08) 0%, transparent 70%);

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 65% 20%;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2.5rem;
  background: rgba(10, 10, 26, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(154, 134, 243, 0.2);
  position: relative;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #9a86f3, transparent);
  }
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const UserAvatar = styled.div`
  position: relative;
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border: 2px solid rgba(10, 10, 26, 0.8);
  border-radius: 50%;
  animation: ${typingPulse} 2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.1rem 0;
  letter-spacing: -0.02em;
`;

const Status = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const MessagesArea = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: auto;
  scroll-behavior: smooth;
  
  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #4e0eff, #9a86f3);
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(255, 255, 255, 0.2);
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #3c0edc, #7c5af0);
  }
`;

const Message = styled.div`
  display: flex;
  ${props => props.fromSelf ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
  align-items: flex-end;
  gap: 0.75rem;
  animation: ${messageSlideIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  animation-delay: calc(var(--message-delay, 0) * 0.1s);
`;

const MessageBubble = styled.div`
  position: relative;
  max-width: 65%;
  padding: 1.25rem 1.5rem;
  border-radius: 24px;
  word-wrap: break-word;
  font-size: 1rem;
  line-height: 1.5;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  ${props => props.fromSelf 
    ? `
      background: linear-gradient(135deg, rgba(154, 134, 243, 0.25) 0%, rgba(78, 14, 255, 0.2) 100%);
      border-color: rgba(154, 134, 243, 0.4);
      margin-left: auto;
      border-bottom-right-radius: 8px;
      
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        right: -8px;
        width: 16px;
        height: 16px;
        background: linear-gradient(135deg, rgba(154, 134, 243, 0.25) 0%, rgba(78, 14, 255, 0.2) 100%);
        clip-path: polygon(0 100%, 100% 100%, 100% 0);
        border-bottom-left-radius: 12px;
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: 4px;
        right: -4px;
        width: 8px;
        height: 8px;
        background: #9a86f3;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(154, 134, 243, 0.6);
      }
    `
    : `
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 0, 255, 0.12) 100%);
      border-color: rgba(153, 0, 255, 0.3);
      margin-right: auto;
      border-bottom-left-radius: 8px;
      
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: -8px;
        width: 16px;
        height: 16px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(153, 0, 255, 0.12) 100%);
        clip-path: polygon(0 0, 100% 100%, 0 100%);
        border-bottom-right-radius: 12px;
      }
    `
  }

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    max-width: 85%;
  }
`;

const MessageContent = styled.p`
  color: #f8fafc;
  font-weight: 500;
  margin: 0;
  font-size: 1rem;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;