import React from "react";
import styled from "styled-components";
import logo from "../assets/logo.png";

export default function Header(props) {
  return (
    <StyledHeader>
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  position: fixed; /* Fix the header to the viewport */
  top: 0; /* Align it to the top */
  left: 0; /* Align it to the left */
  padding: 1rem 2rem; /* Adjust padding for spacing */
  z-index: 1000; /* Ensure it is above other content */
  width: 100%; /* Make sure it stretches across the viewport width */
  
  .logo {
    img {
      height: 3rem; /* Adjust logo size if needed */
    }
  }
  
  button {
    padding: 0.5rem 1rem;
    background-color: #e50914;
    border: none;
    cursor: pointer;
    color: white;
    border-radius: 0.2rem;
    font-weight: bolder;
    font-size: 1.05rem;
  }
`;
