/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import multiavatar from "@multiavatar/multiavatar/esm";

const toastOptions = {
  position: "bottom-right",
  autoClose: 5000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  // Check authentication
  useEffect(() => {
    try {
      const user = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (!user) {
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/login");
    }
  }, [navigate]);

  const generateRandomName = () => Math.random().toString(36).substring(2, 15);

  // Generate avatars
  useEffect(() => {
    const generateAvatars = async () => {
      try {
        const data = [];
        for (let i = 0; i < 4; i++) {
          const randomName = generateRandomName();
          const svgCode = multiavatar(randomName);
          const encoded = btoa(unescape(encodeURIComponent(svgCode)));
          data.push(encoded);
        }
        setAvatars(data);
      } catch (error) {
        console.error("Avatar generation error:", error);
        toast.error("Failed to generate avatars", toastOptions);
      } finally {
        setIsLoading(false);
      }
    };

    generateAvatars();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }

    try {
      const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
      if (!userData) {
        toast.error("User session expired", toastOptions);
        navigate("/login");
        return;
      }

      const user = JSON.parse(userData);
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        toast.success("Avatar set successfully!", toastOptions);
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    } catch (error) {
      console.error("Set avatar error:", error);
      toast.error("Network error. Please try again.", toastOptions);
    }
  };

  return (
    <>
      <Container>
        {isLoading ? (
          <LoadingScreen>
            <Spinner />
            <LoadingText>Generating Avatars...</LoadingText>
          </LoadingScreen>
        ) : (
          <>
            <Header>
              <Title>
                Select Your <GradientText>Digital Avatar</GradientText>
              </Title>
              <Subtitle>Choose your unique identity</Subtitle>
            </Header>

            <AvatarsGrid>
              {avatars.map((avatar, index) => (
                <AvatarCard
                  key={index}
                  selected={selectedAvatar === index}
                  onClick={() => setSelectedAvatar(index)}
                >
                  <AvatarImage
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt={`Avatar ${index + 1}`}
                  />
                  <SelectionRing selected={selectedAvatar === index} />
                  <HoverGlow />
                </AvatarCard>
              ))}
            </AvatarsGrid>

            <ActionButton onClick={setProfilePicture}>
              <ButtonContent>
                <SetIcon />
                Activate Avatar
              </ButtonContent>
            </ActionButton>
          </>
        )}
        <ToastContainer />
      </Container>
    </>
  );
}

// Keyframes
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(78, 14, 255, 0.7); }
  70% { box-shadow: 0 0 0 20px rgba(78, 14, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(78, 14, 255, 0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(ellipse at center, #0f0f23 0%, #000000 70%);
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
    pointer-events: none;
    animation: ${rotate} 20s linear infinite;
  }
`;

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const Spinner = styled.div`
  width: 80px;
  height: 80px;
  border: 4px solid rgba(78, 14, 255, 0.2);
  border-top: 4px solid #4e0eff;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;

const LoadingText = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 500;
  letter-spacing: 1px;
`;

const Header = styled.div`
  text-align: center;
  z-index: 2;
  animation: ${float} 6s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #c0b7e8 50%, #4e0eff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
  text-shadow: 0 4px 16px rgba(78, 14, 255, 0.3);
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #4e0eff 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  margin: 0.5rem 0 0;
  font-weight: 400;
  letter-spacing: 0.5px;
`;

const AvatarsGrid = styled.div`
  display: flex;
  gap: 2.5rem;
  z-index: 2;
`;

const AvatarCard = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.selected ? 'scale(1.15) translateY(-10px)' : 'scale(1)'};
  
  &:hover {
    transform: scale(1.2) translateY(-15px) !important;
  }
`;

const AvatarImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 20px;
  object-fit: cover;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.4));
  transition: all 0.3s ease;
`;

const SelectionRing = styled.div`
  position: absolute;
  top: -12px;
  left: -12px;
  right: -12px;
  bottom: -12px;
  border: 4px solid transparent;
  border-radius: 28px;
  background: ${props => props.selected 
    ? 'conic-gradient(from 0deg, #4e0eff, #a855f7, #4e0eff, transparent 270deg)'
    : 'transparent'
  };
  opacity: ${props => props.selected ? 1 : 0};
  transition: all 0.4s ease;
  animation: ${props => props.selected ? pulse : 'none'} 2s infinite;
`;

const HoverGlow = styled.div`
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  background: radial-gradient(circle, rgba(78, 14, 255, 0.3) 0%, transparent 70%);
  border-radius: 28px;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${AvatarCard}:hover & {
    opacity: 1;
    animation: ${pulse} 1.5s infinite;
  }
`;

const ActionButton = styled.button`
  z-index: 2;
  position: relative;
  padding: 1.2rem 3rem;
  background: linear-gradient(135deg, #4e0eff 0%, #a855f7 100%);
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  overflow: hidden;
  box-shadow: 
    0 12px 40px rgba(78, 14, 255, 0.4),
    0 6px 20px rgba(168, 85, 247, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 20px 60px rgba(78, 14, 255, 0.5),
      0 12px 32px rgba(168, 85, 247, 0.4);
    background: linear-gradient(135deg, #3c0edc 0%, #9333ea 100%);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const SetIcon = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 3px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 5px;
    width: 3px;
    height: 8px;
    border-right: 2px solid rgba(255, 255, 255, 0.8);
    border-bottom: 2px solid rgba(255, 255, 255, 0.8);
    transform: rotate(45deg);
  }
`;