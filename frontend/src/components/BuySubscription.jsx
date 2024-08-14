import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";

function BuySubscription() {
  const navigate = useNavigate();

  const handlePaymentClick = () => {
    navigate("/paymentdetails");
  };

  const handleLogoutClick = async () => {
    try {
      await signOut(firebaseAuth);
      console.log("User logged out");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Container>
      <Content>
        <h2>Subscription Required</h2>
        <p>To continue enjoying our content, please choose one of our subscription plans:</p>
        <Button onClick={handlePaymentClick}>Go to Payment</Button>
        <LogoutLink onClick={handleLogoutClick}>Login with Another Account</LogoutLink>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: rgba(0, 0, 0, 0.8);
  color: white;
`;

const Content = styled.div`
  background: #333;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 500px;
  width: 100%;

  h2 {
    margin-bottom: 1rem;
    font-size: 2rem;
  }

  p {
    margin-bottom: 2rem;
    font-size: 1.2rem;
  }
`;

const Button = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    background: #f40612;
  }
`;

const LogoutLink = styled.a`
  color: #007bff; /* Different color for logout link */
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  margin-bottom: 0;

  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
`;

export default BuySubscription;
