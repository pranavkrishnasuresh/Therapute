import React, { useState } from 'react';
import './sidebar.css';
import pran from "../images/pran.jpeg"
import {logActiveUserOut} from "../Config/firebaseConfig";

const ProfileBar = ({imgSrc, username}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const logOut = () => {
    logActiveUserOut().then(() => {
      setTimeout(() => {
        window.location.href = '/';
      }, 400); // 5000 milliseconds = 5 seconds
    });
  };
  

  return (
    <div className="profile-bar">
      <div className="welcome-text">Welcome back, {username}</div>
      <div className="profile-icon" onClick={toggleDropdown}>
      <img src={pran} style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}/>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={logOut} className='btn-profile'>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileBar;
