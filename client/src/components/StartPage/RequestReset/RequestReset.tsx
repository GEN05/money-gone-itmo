import "./RequestReset.css";
import React, { FC, useContext, useState } from "react";
import { Context } from "../../../index";
import { Link } from "react-router-dom";

export const RequestReset: FC = () => {
  const { store } = useContext(Context);
  const [email, setEmail] = useState<string>("");
  const [request, setRequest] = useState<string>("not sent");

  if (request === "sending") {
    return (
      <div className="loader-box">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="request-reset-wrapper">
      <Link to="/login">Go back</Link>
      {request === "not sent" ? (
        <div className="request-reset">
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email"
          />
          <button
            onClick={() => {
              setRequest("sending");
              store
                .requestPasswordReset(email)
                .then(() => setRequest("sent"))
                .catch((err) => {
                  setRequest("not sent");
                  alert(err.response?.data?.message);
                });
            }}
          >
            Send reset link
          </button>
        </div>
      ) : (
        <h1>Email with verification link was send</h1>
      )}
    </div>
  );
};
