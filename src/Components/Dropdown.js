import React, { useState } from 'react';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        Click me
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <a href="#">Logout</a>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
