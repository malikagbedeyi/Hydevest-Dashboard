import React, { useState } from "react";
import api from "../../services/api";

const ResetPasswordModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // STEP 1
  const requestResetToken = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = new URLSearchParams();
      payload.append("email", email);

      await api.post("/auth/requestpasswordresttoken", payload, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send token");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2
  const resetPassword = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = new URLSearchParams();
      payload.append("email", email);
      payload.append("token", token);
      payload.append("password", password);

      await api.post("/auth/resetpassword", payload, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3
  const changePassword = async () => {
    try {
      setLoading(true);
      setError("");

      const payload = new URLSearchParams();
      payload.append("old_password", oldPassword);
      payload.append("new_password", newPassword);

      await api.post("/auth/changepassword", payload, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      alert("Password changed successfully");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>×</button>

        {step === 1 && (
          <>
            <h3>Reset Password</h3>
            <input placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={requestResetToken} disabled={loading}>
              Send Reset Token
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>Enter Reset Token</h3>
            <input placeholder="Email" value={email} disabled />
            <input
              placeholder="Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <input
              placeholder="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={resetPassword} disabled={loading}>
              Reset Password
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h3>Change Password</h3>
            <input
              placeholder="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={changePassword} disabled={loading}>
              Change Password
            </button>
          </>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordModal;
