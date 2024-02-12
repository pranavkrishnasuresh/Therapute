import React from 'react';
import './LandingPage.css'; // Import your CSS file for styling

const LandingPage = () => {


  return (
    <div className="landing-page">
      <header className='landing-page-header'>
        <h1>Therapute</h1>
        <p>We use AI to help you perfect your exercise form.</p>
      </header>
      <main>
        <section className="hero">
          <h2>Perfect Your Form with AI</h2>
          <p>Our cutting-edge AI technology analyzes your exercise pose and provides real-time feedback to ensure you're performing exercises correctly.</p>
          <form action="http://localhost:3000/dashboard">
            <input className="cta-btn" type="submit" value="Get Started" />
        </form>        </section>
        <section className="features">
          <div className="feature">
            <h3>Real-time Feedback</h3>
            <p>Receive instant feedback on your exercise form, helping you prevent injuries and maximize results.</p>
          </div>
          <div className="feature">
            <h3>Instant Communication</h3>
            <p>Our software allows you to increase communication with your physical therapist, and allow them to dynamically monitor your progress.</p>
          </div>
          <div className="feature">
            <h3>Track Your Progress</h3>
            <p>Monitor your progress over time with detailed analytics and insights.</p>
          </div>
        </section>
      </main>
      <footer className='footer-landing'>
        <p>Already have an account? <a href="/login">Log in</a></p>
        <p>Don't have an account yet? <a href="/signup">Sign up</a></p>
      </footer>
    </div>
  );
}

export default LandingPage;
