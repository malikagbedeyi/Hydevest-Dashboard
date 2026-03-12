import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, Briefcase, Shield, Circle, UserCheck } from 'lucide-react'; 
import '../assets/Styles/dashboard/profilePopup.scss';
import profileDefault from '../assets/Images/profileImg.png';

const ProfilePopup = ({ onClose, logout }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUserInfo(parsedUser);
      }
    } catch (error) {
      console.error("❌ Failed to parse user from localstorage", error);
    }
  }, []);

  if (!userInfo) return null;

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h3>User Profile</h3>
          <X className="close-icon" onClick={onClose} size={20} />
        </div>

        <div className="profile-body">
          <div className="profile-avatar-section">
            <img src={profileDefault} alt="Profile" />
            
            {/* 1. Corrected Name logic: your JSON uses first_name */}
            <h4>{(userInfo.first_name || "") + " " + (userInfo.lastname || "")}</h4>
            
            {/* 2. Badge Section */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
              <span className="badge">{userInfo.account_type || "Not set"}</span>
              
              {/* 3. Added Status logic */}
              <span className={`status-badge ${userInfo.status === 1 ? 'active' : 'inactive'}`}>
                <Circle size={8} fill="currentColor" />
                {userInfo.status === 1 ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <Mail size={16} />
              <div>
                <p className="label">Email Address</p>
                <p className="value">{userInfo.email || userInfo.system_email}</p>
              </div>
            </div>

            <div className="info-item">
              <UserCheck size={16} />
              <div>
                <p className="label">Role</p>
                <p className="value" style={{ textTransform: 'uppercase' }}>
                    {userInfo.role || 'Not set'}
                </p>
              </div>
            </div>

            <div className="info-item">
              <Briefcase size={16} />
              <div>
                <p className="label">Job Title</p>
                <p className="value" style={{ textTransform: 'capitalize' }}>
                  {userInfo.job_title || "Not Set"}
                </p>
              </div>
            </div>

            <div className="info-item">
              <Phone size={16} />
              <div>
                <p className="label">Phone Number</p>
                <p className="value">{userInfo.phone_no || "Not Set"}</p>
              </div>
            </div>

            <div className="info-item">
              <Shield size={16} />
              <div>
                <p className="label">Access Level</p>
                <p className="value">
                  {userInfo.is_superuser === 1 ? "Administrative Access" : "Standard Access"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-footer">
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;