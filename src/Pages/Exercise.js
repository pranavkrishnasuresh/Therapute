import React, { useState, useEffect } from 'react'
import Navbar from '../Components/Navbar'
import '../style.css'
import ActivityCard from "../Components/ActivityCard"
import knee from "../images/kneeExtension.png"
import dumbell from "../images/dumbellThrust.jpeg"
import lying from "../images/lyingDown.png"
import intext from "../images/internalExternal.png"
import plank from "../images/plank.jpg"
import deadlift from "../images/deadlift.png"
function Exercise() {

    const iframe = document.getElementById('iframe');

    const sendDataToIframe = (data) => {
        if (iframe) {
          iframe.contentWindow.postMessage(data);
        } else {
          console.error('Iframe not found.');
        }
      };
  
      // Example data
      const dataToSend = {
        message: 'Hello from React parent component!',
      };

  
  return (
    <div>
      <Navbar/>
      {/* <div className='frame'> */}

{/* <iframe
    src="https://pn23-hacklyticsgradio.hf.space"
    frameborder="0"
    width="1240"
    height="720"
    allow="camera"
    class="gradio-asr"
></iframe> */}
<div class="container-exercise">
  <div className="analysis-inner-div">
    <ActivityCard 
    showName = "Knee Extension"
    name="knee_extension"
    imgSrc={knee}/>
    <ActivityCard 
    showName = "Dumbell Thrust"
    name="dumbell_thrust"
    imgSrc={dumbell}/>
    <ActivityCard 
    showName = "Lying Down External Rotation"
    name="external_rotation"
    imgSrc={lying}/>
    <ActivityCard 
    showName = "Internal & External Rotation"
    name="rotator_cuff"
    imgSrc={intext}/>
    <ActivityCard 
    showName = "Deadlift"
    name="deadlift"
    imgSrc={deadlift}/>
    <ActivityCard 
    showName = "Planks"
    name="planks"
    imgSrc={plank}/>
  </div>
</div>

      {/* </div>


    <button onClick={() => sendDataToIframe(dataToSend)}>Click to send data to iframe</button> */}

    </div>
  )
}

export default Exercise