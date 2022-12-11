import "./PasswordReset.css";
import React, { FC, useContext, useState } from "react";
import { Context } from "../../../index";
import { Link, useParams } from "react-router-dom";

export const PasswordReset: FC = () => {
  const { store } = useContext(Context);
  const { resetToken, id } = useParams();

  const [password, setPassword] = useState<string>("");
  const [passwordControl, setPasswordControl] = useState<string>("");
  const [request, setRequest] = useState<string>("not sent");

  if (request === "sending") {
    return (
      <div className="loader-box">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="password-reset-wrapper">
      <Link to="/login">Go back</Link>
      {request === "not sent" ? (
        <div className="password-reset">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            name="password"
            autoComplete="off"
            placeholder="New password"
          />
          <input
            onChange={(e) => setPasswordControl(e.target.value)}
            value={passwordControl}
            type="password"
            name="password"
            autoComplete="off"
            placeholder="New password again"
          />
          <button
            onClick={() => {
              if (id === undefined || resetToken === undefined) {
                alert("Incorrect reset link");
              } else if (password !== passwordControl) {
                alert("Passwords are different");
              } else if (password.length < 3) {
                alert("Too short password");
              } else {
                setRequest("sending");
                store
                  .resetPassword(id, resetToken, password)
                  .then(() => setRequest("sent"))
                  .catch((err) => {
                    setRequest("not sent");
                    alert(err.response?.data?.message);
                  });
              }
            }}
          >
            reset
          </button>
        </div>
      ) : (
        <h1>Password successfully changed</h1>
      )}
    </div>
  );
};
