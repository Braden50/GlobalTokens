import "./Login.css";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js"

import Alert from "react-bootstrap/Alert"



export default function Login() {
  const navigate = useNavigate();
  const [submitDisabled, setSubmitDisabled] = useState(false);
  
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const [userKey, setUserKey] = useState();
  
  const [showError, setShowError] = useState(false)
  
  function loginSuccess() {
    navigate("/map")
  }

  function loginFailure() {
    setShowError(true)
  }
  
  useEffect(() => {
    var userLoc = localStorage.getItem("user");
    if (userLoc) {
      // userLoc = JSON.parse(userLoc);
      loginSuccess()
    }
  }, []);


  // async function onSubmit(data) {}
  async function onSubmit(event) {
    if (!userKey) { return loginFailure(); }
    try {
      setSubmitDisabled(true);
      if (userKey == "1234") {
        loginSuccess();
      }

      const userWalletInfo = await connection.getAccountInfo(new PublicKey(userKey))
      // console.log(accountInfo)
      if (userWalletInfo) {
        localStorage.setItem('user', userWalletInfo);
        loginSuccess()
      }
      else {
        loginFailure()
      }
    } catch (err) {
      console.log(err)
      loginFailure()
    }
    setSubmitDisabled(false);
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form className="login-form">
          <h1>GlobalTokens</h1>
          <div className="mb-3 login-el">
            <h3 className="login-el">Login</h3>
            <label className="login-el">Solana Account Public Key</label>
            <input
              type="text"
              className="form-control"
              placeholder="Key"
              name="key"
              id="key"
              onChange={event => setUserKey(event.target.value)}
            />
          <div className="login-el d-grid"></div>
            <button type="button" className="btn btn-primary" id="submit" onClick={() => onSubmit()} disabled={submitDisabled}>
              Submit
            </button>
          </div>
          <div>
            <Alert key="danger" variant="danger" onClose={() => setShowError(false)} show={showError} dismissible>
              Invalid public key
            </Alert>
          </div>
          
        </form>
      </div>
    </div>
      
  );
}


