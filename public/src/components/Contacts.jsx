/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import Logo from "../assets/logo.svg";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState("User");
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    try {
      const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUserName(user.username || "User");
        setCurrentUserImage(user.avatarImage);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  const changeCurrentChat = useCallback((index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  }, [changeChat]);

  if (!currentUserImage) {
    return <LoadingContainer />;
  }

  return (
    <Container>
      <Header>
        <Brand>
          <LogoIcon src={Logo} alt="logo" />
          <BrandTitle>
            <GradientText>snap</GradientText>py
          </BrandTitle>
        </Brand>
      </Header>

      <ContactsList>
        {contacts.map((contact, index) => (
          <ContactItem
            key={contact._id}
            selected={index === currentSelected}
            onClick={() => changeCurrentChat(index, contact)}
          >
            <AvatarContainer>
              <ContactAvatar
                src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                alt={contact.username}
              />
              <AvatarGlow selected={index === currentSelected} />
            </AvatarContainer>
            
            <ContactInfo>
              <ContactName>{contact.username}</ContactName>
              <StatusIndicator selected={index === currentSelected} />
            </ContactInfo>
            
            <SelectionBorder selected={index === currentSelected} />
          </ContactItem>
        ))}
      </ContactsList>

      <CurrentUser>
        <UserAvatarContainer>
          <UserAvatar
            src={`data:image/svg+xml;base64,${currentUserImage}`}
            alt={currentUserName}
          />
          <UserGlow />
        </UserAvatarContainer>
        <UserInfo>
          <UserName>{currentUserName}</UserName>
          <UserStatus>Online</UserStatus>
        </UserInfo>
      </CurrentUser>
    </Container>
  );
}

// Keyframes
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(154, 134, 243, 0.7);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(154, 134, 243, 0);
  }
`;

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 10px rgba(78, 14, 255, 0.5), 
                0 0 20px rgba(168, 85, 247, 0.3);
  }
  50% { 
    box-shadow: 0 0 20px rgba(78, 14, 255, 0.8), 
                0 0 40px rgba(168, 85, 247, 0.5);
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

const LoadingContainer = styled.div`
  height: 100vh;
  background: linear-gradient(135deg, #0a0a1a 0%, #0f0f23 50%, #000000 100%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  height: 100vh;
  overflow: hidden;
  background: 
    linear-gradient(180deg, #080420 0%, #0a0a1a 50%, #0f0f23 100%),
    radial-gradient(ellipse at top, rgba(78, 14, 255, 0.1) 0%, transparent 70%);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #4e0eff, #9a86f3, transparent);
    animation: ${glow} 3s ease-in-out infinite;
  }
`;

const Header = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(78, 14, 255, 0.2);
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const LogoIcon = styled.img`
  height: 2.2rem;
  filter: drop-shadow(0 0 15px rgba(78, 14, 255, 0.6));
  transition: all 0.3s ease;
`;

const BrandTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #ffffff 0%, #c0b7e8 50%, #9a86f3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #4e0eff 0%, #9a86f3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ContactsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  gap: 1rem;
  padding: 1.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #4e0eff, #9a86f3);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(78, 14, 255, 0.5);
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #3c0edc, #7c5af0);
  }
`;

const ContactItem = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  min-height: 5.5rem;
  cursor: pointer;
  width: 95%;
  max-width: 400px;
  border-radius: 20px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateX(8px);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  ${props => props.selected && `
    background: linear-gradient(135deg, rgba(154, 134, 243, 0.3) 0%, rgba(78, 14, 255, 0.2) 100%);
    border-color: #9a86f3;
    transform: translateX(12px) scale(1.02);
    box-shadow: 
      0 12px 40px rgba(154, 134, 243, 0.4),
      0 0 0 1px rgba(154, 134, 243, 0.5);
    animation: ${pulse} 2s infinite;
  `}
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const ContactAvatar = styled.img`
  height: 3.5rem;
  width: 3.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
`;

const AvatarGlow = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, 
    ${props => props.selected ? 'rgba(154, 134, 243, 0.6)' : 'transparent'} 0%, 
    transparent 70%
  );
  opacity: ${props => props.selected ? 1 : 0};
  transition: all 0.3s ease;
`;

const ContactInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ContactName = styled.h3`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.2rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusIndicator = styled.div`
  height: 3px;
  width: ${props => props.selected ? '24px' : '12px'};
  background: linear-gradient(90deg, 
    ${props => props.selected ? '#9a86f3' : '#4ade80'}, 
    ${props => props.selected ? '#4e0eff' : '#22c55e'}
  );
  border-radius: 2px;
  transition: all 0.3s ease;
`;

const SelectionBorder = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: 20px;
  background: conic-gradient(
    transparent 0deg,
    ${props => props.selected ? '#9a86f3' : 'transparent'} 10deg,
    transparent 20deg
  );
  opacity: ${props => props.selected ? 1 : 0};
  transition: all 0.3s ease;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: xor;
  -webkit-mask-composite: xor;
`;

const CurrentUser = styled.div`
  background: linear-gradient(135deg, #1e1e3f 0%, #0d0d30 100%);
  border-top: 1px solid rgba(154, 134, 243, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  animation: ${float} 6s ease-in-out infinite;
`;

const UserAvatarContainer = styled.div`
  position: relative;
`;

const UserAvatar = styled.img`
  height: 4.5rem;
  width: 4.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(154, 134, 243, 0.6);
  box-shadow: 0 0 25px rgba(154, 134, 243, 0.5);
`;

const UserGlow = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(154, 134, 243, 0.4) 0%, transparent 70%);
  animation: ${glow} 3s ease-in-out infinite;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
`;

const UserName = styled.h2`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.2rem 0;
  letter-spacing: -0.02em;
  text-shadow: 0 0 10px rgba(154, 134, 243, 0.5);
`;

const UserStatus = styled.span`
  color: #4ade80;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;