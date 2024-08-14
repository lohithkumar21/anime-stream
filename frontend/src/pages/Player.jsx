import React from "react";
import styled from "styled-components";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import YouTube from 'react-youtube';

export default function Player() {
  const navigate = useNavigate();
  const location = useLocation();
  const { videoId } = location.state || {}; // Get videoId from state

  return (
    <Container>
      <div className="player">
        <div className="back" onClick={() => navigate(-1)}>
          <BsArrowLeft />
        </div>
        {videoId ? (
          <YouTube
            videoId={videoId}
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 1,
                controls: 1,
                modestbranding: 1,
                rel: 0,
              },
            }}
          />
        ) : (
          <p>No video available</p>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .player {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .back {
      position: absolute;
      top: 2rem;
      left: 2rem;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      padding: 1rem;
      z-index: 10;
      cursor: pointer;
      transition: background 0.3s ease, transform 0.3s ease;
      
      svg {
        color: #e50914;
        font-size: 2.5rem;
        transition: color 0.3s ease;
      }
      
      &:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: scale(1.1);
        
        svg {
          color: #ffffff;
        }
      }
    }
    
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8));
      z-index: 5;
      pointer-events: none;
    }

    .youtube-container {
      position: relative;
      width: 100%;
      height: 100%;
      
      iframe {
        border: none;
      }
    }
  }
`;
