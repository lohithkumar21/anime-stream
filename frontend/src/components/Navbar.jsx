import { signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.png";
import { firebaseAuth } from "../utils/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Navbar({ isScrolled }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const movies = useSelector((state) => state.aniflix.movies);

  const links = [
    { name: "Home", link: "/" },
    { name: "TV Shows", link: "/tv" },
    { name: "Movies", link: "/movies" },
    { name: "My List", link: "/mylist" },
  ];

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setCurrentUser(user.email);
      }
    });
  }, []);

  useEffect(() => {
    if (searchInput) {
      const results = movies.filter(movie =>
        movie.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredMovies(results);
    } else {
      setFilteredMovies([]);
    }
  }, [searchInput, movies]);

  const handleLogout = () => {
    signOut(firebaseAuth)
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <Container isScrolled={isScrolled}>
      <nav className="flex">
        <div className="left flex a-center">
          <div className="brand flex a-center j-center">
            <img src={logo} alt="Logo" />
          </div>
          <ul className="links flex">
            {links.map(({ name, link }) => (
              <li key={name}>
                <Link to={link}>{name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="center flex a-center">
          <div className="search flex a-center">
            <input
              type="search"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <FaSearch className="search-icon" />
            {searchInput && filteredMovies.length > 0 && (
              <div className="search-results">
                {filteredMovies.map(movie => (
                  <Link
                    key={movie.id}
                    to={`/chosen/${movie.videoType}/${movie.id}`}
                  >
                    {movie.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="right flex a-center">
          {currentUser && (
            <div className="user-info" onClick={() => setDropdownVisible(!dropdownVisible)}>
              <span>{currentUser}</span>
              <FaChevronDown className={`dropdown-icon ${dropdownVisible ? "open" : ""}`} />
              {dropdownVisible && (
                <div className="dropdown">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </Container>
  );
}

const Container = styled.div`
  nav {
    position: fixed;
    top: 0;
    height: 4rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: ${({ isScrolled }) => (isScrolled ? "black" : "black")};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 10;
    transition: background-color 0.3s ease-in-out;

    .left {
      display: flex;
      align-items: center;
      gap: 2rem;

      .brand {
        img {
          height: 2rem;
        }
      }

      .links {
        list-style: none;
        display: flex;
        gap: 1rem;

        li a {
          color: ${({ isScrolled }) => (isScrolled ? "white" : "white")};
          text-decoration: none;
          font-weight: bold;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
        }
      }
    }

    .center {
      flex: 1;
      display: flex;
      justify-content: flex-end;

      .search {
        position: relative;
        display: flex;
        align-items: center;
        background-color: transparent;
        border: 1px solid ${({ isScrolled }) => (isScrolled ? "white" : "white")};
        border-radius: 0.5rem;
        width: 100%;
        max-width: 300px; 
        padding: 0.25rem 0.5rem;
        margin-right: 1rem; 

        input {
          border: none;
          background: transparent;
          padding: 0.5rem;
          width: 100%;
          border-radius: 0.5rem;
          font-size: 1rem;
          color: ${({ isScrolled }) => (isScrolled ? "white" : "white")};
          outline: none;
        }

        input:focus {
          border: none; 
          box-shadow: none;
        }

        .search-icon {
          margin-left: 0.5rem;
          color: ${({ isScrolled }) => (isScrolled ? "white" : "white")}; 
        }

        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: #1a1a1a;
          border: 1px solid #555;
          border-radius: 0.5rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          max-height: 300px;
          overflow-y: auto;
          z-index: 20;
          margin-top: 0.5rem;
          padding: 0.5rem;

          a {
            display: block;
            color: white;
            text-decoration: none;
            padding: 0.5rem;
            border-radius: 0.25rem;
            transition: background-color 0.3s ease;

            &:hover {
              background-color: rgba(255, 255, 255, 0.1);
            }
          }
        }
      }
    }

    .right {
      display: flex;
      align-items: center;
      gap: 1rem;

      .user-info {
        display: flex;
        align-items: center;
        position: relative;
        color: white;
        cursor: pointer;

        span {
          font-size: 1rem;
          margin-right: 0.5rem;
        }

        .dropdown-icon {
          font-size: 1rem;
          transition: transform 0.3s ease;
        }

        .dropdown-icon.open {
          transform: rotate(180deg);
        }

        .dropdown {
          position: absolute;
          top: 2.5rem;
          right: 0;
          background-color: #1a1a1a;
          padding: 0.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 150px;
          border: 1px solid #555;
          animation: dropdownFadeIn 0.3s ease-in-out;

          @keyframes dropdownFadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          a, button {
            color: white;
            background: none;
            border: none;
            cursor: pointer;
            text-align: left;
            padding: 0.5rem;
            border-radius: 0.25rem;
            font-size: 1rem;
            transition: background-color 0.3s ease;

            &:hover {
              background-color: rgba(255, 255, 255, 0.1);
            }
          }
        }
      }
    }
  }
`;
