import React, { useState } from 'react';
import './Signup.css'; // Import your CSS file for styling
import { addUser } from '../Config/firebaseConfig'; // Import your Firebase functions

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Call Firebase function to add user
    await addUser(email, password, username, true, null);

    // Clear form fields after submission
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="signup-page">
      <header>
        <h1>Create an Account</h1>
        <p>Sign up to get started</p>
      </header>
      <main>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button onClick={handleSubmit} type="submit" className="signup-btn">Sign Up</button>
        </form>
      </main>
      <footer className='footer-signup'>
        <p>Already have an account? <a href="/login">Log in</a></p>
      </footer>
    </div>
  );
}

export default Signup;
