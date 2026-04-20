import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import Robot from "../assets/robot.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("User");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.username || "User");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setUserName("User");
      } finally {
        setIsLoaded(true);
      }
    };

    loadUserData();
  }, []);

  if (!isLoaded) {
    return <LoadingContainer />;
  }

  return (
    <Container>
      <RobotContainer>
        <AnimatedRobot src={Robot} alt="Welcome Robot" />
        <RobotGlow />
      </RobotContainer>
      
      <WelcomeText>
        <Greeting>
          Welcome Back, <NeonName>{userName}!</NeonName>
        </Greeting>
        <Message>
          Ready to dive into the <GradientText>digital realm</GradientText>?
        </Message>
        <SubMessage>Select a chat to begin your cosmic conversation</SubMessage>
      </WelcomeText>
      
      <Particles />
    </Container>
  );
}

// Keyframes
const wave = keyframes`
  0%, 60%, 100% { 
    transform: rotate(0deg); 
  }
  30% { 
    transform: rotate(15deg); 
  }
  70% { 
    transform: rotate(-10deg); 
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(2deg); }
  66% { transform: translateY(-10px) rotate(-1deg); }
`;

const glowPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(78, 14, 255, 0.6), 
                0 0 40px rgba(168, 85, 247, 0.4), 
                inset 0 0 20px rgba(255, 255, 255, 0.1);
  }
  50% { 
    box-shadow: 0 0 40px rgba(78, 14, 255, 0.9), 
                0 0 80px rgba(168, 85, 247, 0.6), 
                inset 0 0 30px rgba(255, 255, 255, 0.2);
  }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(ellipse at center, #0f0f23 0%, #000000 70%);
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  min-height: 100vh;
  width: 100vw;
  background: 
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 50% 30% at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse 50% 30% at 20% 20%, rgba(78, 14, 255, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a1a 0%, #0f0f23 50%, #000000 100%);
  position: relative;
  overflow: hidden;
  padding: 2rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #4e0eff, #a855f7, transparent);
    animation: ${scanline} 3s linear infinite;
  }
`;

const RobotContainer = styled.div`
  position: relative;
  animation: ${float} 8s ease-in-out infinite;
`;

const AnimatedRobot = styled.img`
  height: 22rem;
  max-width: 100%;
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))
          drop-shadow(0 0 30px rgba(78, 14, 255, 0.4));
  animation: ${wave} 3s ease-in-out infinite 1s;
  transform-origin: bottom center;
`;

const RobotGlow = styled.div`
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background: radial-gradient(circle, rgba(78, 14, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: ${glowPulse} 3s ease-in-out infinite;
  pointer-events: none;
`;

const WelcomeText = styled.div`
  text-align: center;
  z-index: 2;
  max-width: 600px;
`;

const Greeting = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #e0d7ff 50%, #4e0eff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
  letter-spacing: -0.03em;
  line-height: 1.1;
  text-shadow: 0 0 30px rgba(78, 14, 255, 0.5);
`;

const NeonName = styled.span`
  background: linear-gradient(135deg, #4e0eff 0%, #a855f7 50%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #4e0eff, #a855f7, transparent);
    border-radius: 2px;
    animation: ${glowPulse} 2s ease-in-out infinite;
  }
`;

const Message = styled.h2`
  font-size: clamp(1.3rem, 3vw, 2rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.02em;
`;

const GradientText = styled.span`
  background: linear-gradient(135deg, #4e0eff 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SubMessage = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.2rem;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.5px;
  max-width: 500px;
`;

const Particles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background: linear-gradient(45deg, #4e0eff, #a855f7);
    border-radius: 50%;
    animation: ${float} 15s linear infinite;
  }
  
  &::before {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
    animation-duration: 20s;
  }
  
  &::after {
    top: 70%;
    right: 15%;
    animation-delay: -5s;
    animation-duration: 25s;
  }
`;