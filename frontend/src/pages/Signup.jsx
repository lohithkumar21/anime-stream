import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => email.endsWith("@gmail.com");

  const handleSignIn = async () => {
    try {
      const { email, password } = formValues;
      if (!isValidEmail(email)) {
        setEmailError("Email must end with @gmail.com");
        return;
      }
      setEmailError("");
      await createUserWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login"); // Adjust this route according to your application
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) navigate("/");
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <Container>
      <BackgroundImage />
      <div className="content">
      <Header/>
        <div className="form-container">
          <h1>REGISTER</h1>
          {emailError && <div className="error">{emailError}</div>}
          <div className="form">
            <input
              type="email"
              placeholder="Email address"
              onChange={(e) => {
                setFormValues({
                  ...formValues,
                  email: e.target.value,
                });
                // Validate email on change
                if (!isValidEmail(e.target.value)) {
                  setEmailError("Email must end with @gmail.com");
                } else {
                  setEmailError("");
                }
              }}
              value={formValues.email}
              className={isValidEmail(formValues.email) ? "valid" : "invalid"}
            />
            {showPassword && (
              <input
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    password: e.target.value,
                  })
                }
                value={formValues.password}
              />
            )}
            {!showPassword ? (
              <button className="toggle-password" onClick={() => setShowPassword(true)}>
                Next
              </button>
            ) : (
              <button className="submit" onClick={handleSignIn}>
                Sign Up
              </button>
            )}
            <div className="login-info">
              <span>Already have an account?</span><pre> </pre>
              <a className="login-link" onClick={handleLoginRedirect}>
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  background: linear-gradient(to right, #1a1a1a, #333333);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .form-container {
      background: rgba(0, 0, 0, 0.8); /* Black with minimal opacity */
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 400px;
      text-align: center;
      position: relative;
      h1 {
        color: #e50914;
        font-size: 2rem;
        margin-bottom: 1.5rem;
      }
      .error {
        color: red;
        margin-bottom: 1rem;
      }
      .form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        input {
          padding: 1rem;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          outline: none;
          transition: border-color 0.3s;
          &:focus {
            border-color: #e50914;
          }
        }
        .valid {
          border-color: #4caf50; /* Green border for valid email */
        }
        .invalid {
          border-color: red; /* Red border for invalid email */
        }
        button {
          padding: 1rem;
          border: none;
          color: white;
          font-size: 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .toggle-password {
          background-color: #e50914;
          &:hover {
            background-color: #f40612;
          }
        }
        .submit {
          background-color: #4caf50;
          &:hover {
            background-color: #45a049;
          }
        }
        .login-info {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 1rem;
          span {
            color: #ddd; 
            
          }
          .login-link {
            color: #e50914;
            cursor: pointer;
            text-decoration: none;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
`;

export default Signup;
