from flask import Flask, render_template, Response
# import traceback
import cv2
import mediapipe as mp
import numpy as np
from flask import request
from flask_cors import CORS
import os
from openai import Client
import flask



app = Flask(__name__)
CORS(app)


mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

def calc_angle(p1, p2, p3):
    a = np.array([p1.x, p1.y,p1.z])
    b = np.array([p2.x, p2.y, p2.z])
    c = np.array([p3.x, p3.y,p3.z])

    ba = a - b
    bc = c - b

    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.rad2deg(np.arccos(cosine_angle))

    return angle

def calc_dist(p1, p2):
    a = np.array([p1.x, p1.y,p1.z])
    b = np.array([p2.x, p2.y, p2.z])

    squared_dist = np.sum((a-b)**2, axis=0)
    return np.sqrt(squared_dist)


curr_pos = 'down'
reps = 0

def knee_extension(landmarks):
    global curr_pos, reps
    next_pos = ""
    standing = False
    alreadyRight = False

    left_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
    right_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]

    left_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
    right_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]

    left_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
    right_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]

    left_knee_angle = calc_angle(left_ankle, left_knee, left_hip)
    right_knee_angle = calc_angle(right_ankle, right_knee, right_hip)
    
    errors = []
    leg_down = "left"

    if right_knee_angle >= 135 and left_knee_angle >= 135:
        return None

    if left_ankle.y < right_ankle.y:
        leg_down = "right"
    
    if leg_down == "right":
        reps += 1
        alreadyRight = True
        if right_knee_angle < 140:
            errors.append("Don't bend right leg")
        if abs(left_hip.y - left_knee.y) > 0.05:
            errors.append("Keep left knee parallel to hip")
        if left_knee_angle >= 160:
            standing = True
        if left_knee_angle >= 130 and not standing:
            next_pos = "up"
        if left_knee_angle < 70 and not standing:
            curr_pos = "down"


    if leg_down == "left":
        reps+=1
        if left_knee_angle < 140:
            errors.append("Don't bend left leg")
        if abs (right_hip.y - right_knee.y) > 0.05:
            errors.append("Keep right knee parallel to hip")
        if right_knee_angle >= 160:
            standing = True
        if right_knee_angle >= 130 and not standing and not alreadyRight:
            next_pos = "up"
        if right_knee_angle < 70 and not standing and not alreadyRight:
            curr_pos = "down"
    
    
    if next_pos == "up" and curr_pos == "down":
         reps += 1
         curr_pos = "up"
    if curr_pos == "up" and next_pos == "down":
         curr_pos = "down"
    
    return errors

curr_pos = 'down'
reps = 0
def dumbell_thrust(landmarks):
    global curr_pos, reps
    next_pos = ""
    errors = []

    left_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
    right_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]

    left_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
    right_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]

    left_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
    right_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]

    left_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
    right_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]

    left_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    right_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]

    left_knee_angle = calc_angle(left_ankle, left_knee, left_hip)
    right_knee_angle = calc_angle(right_ankle, right_knee, right_hip)

    if (left_knee_angle < 80) and (right_knee_angle < 80) :
         next_pos = "down"
    if (left_knee_angle > 130) and (right_knee_angle > 130) :
         next_pos = "up"

    if left_knee_angle < 90 or right_knee_angle < 90:
        errors.append("Don't bend down too much")
    
    if abs(calc_dist(left_ankle, right_ankle) - calc_dist(left_hip, right_hip)) > 0.1:
        errors.append("Keep legs hip width apart")
    
    if abs(calc_dist(left_elbow, right_elbow) - calc_dist(left_shoulder, right_shoulder)) > 0.1:
        errors.append("Keep elbows parallel to shoulders")

    if calc_dist(left_elbow, left_hip) < 0.4 or calc_dist(right_elbow, right_hip) < 0.4:
        errors.append("Don't bend elbows down too much")
    if next_pos == "up" and curr_pos == "down":
         reps += 1
         curr_pos = "up"
    if curr_pos == "up" and next_pos == "down":
         curr_pos = "down"

    return errors

def external_rotation(landmarks):

    errors = []
    active_arm = "right"

    left_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
    right_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]

    left_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]
    right_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]

    left_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    right_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]

    left_arm_angle = calc_angle(left_elbow, left_wrist, left_shoulder)
    right_arm_angle = calc_angle(right_elbow, right_wrist, right_shoulder)

    
    if left_elbow.z > right_elbow.z:
        active_arm = "left"
    
    if active_arm == "right":
        if right_arm_angle < 90:
            errors.append("Angle in right arm is less than 90 degrees")
        if right_arm_angle > 120:
            errors.append("Angle in right arm is more than 90 degrees")
        if right_wrist.z > right_elbow.z:
            errors.append("Keep right wrist perpendicular to elbow")
        

    if active_arm == "left":
        if left_arm_angle < 90:
            errors.append("Angle in left arm is less than 90 degrees")
        if calc_angle(left_elbow, left_wrist, left_shoulder) > 120:
            errors.append("Angle in left arm is more than 90 degrees")
        if left_wrist.z > left_elbow.z:
            errors.append("Keep left wrist perpendicular to elbow")
    
    return errors

def rotator_cuff(landmarks):
    errors = []
    active_arm = "right"

    left_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
    right_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value]

    left_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]
    right_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]

    left_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    right_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]

    left_arm_angle = calc_angle(left_elbow, left_wrist, left_shoulder)
    right_arm_angle = calc_angle(right_elbow, right_wrist, right_shoulder)

    if left_elbow.z > right_elbow.z:
        active_arm = "left"
    
    if active_arm == "right":
        if right_arm_angle < 70:
            errors.append("Angle in right arm is less than 90 degrees")
        if right_arm_angle > 110:
            errors.append("Angle in right arm is greater than 90 degrees")
        if abs(right_elbow.z - right_shoulder.z) > .1:
            errors.append("Keep right elbow perpendicular to shoulder")
        

    if active_arm == "left":
        if left_arm_angle < 70:
            errors.append("Angle in left arm is less than 90 degrees")
        if left_arm_angle > 110:
            errors.append("Angle in left arm is greater than 90 degrees")
        if abs(left_elbow.z - left_shoulder.z) > .1:
            errors.append("Keep left elbow perpendicular to shoulder")
            
    return errors

def deadlift(landmarks):
    errors = []
    left_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
    right_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]

    left_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
    right_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]

    left_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
    right_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]

    left_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    right_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]

    left_knee_angle = calc_angle(left_ankle, left_knee, left_hip)
    right_knee_angle = calc_angle(right_ankle, right_knee, right_hip)

    if left_knee_angle < 80 or right_knee_angle < 80:
        errors.append("Don't bend knees too much")
    
    if abs(calc_dist(left_ankle, right_ankle) - calc_dist(left_hip, right_hip)) > 0.1:
        errors.append("Keep legs hip width apart")
    
    if abs(calc_dist(left_shoulder, right_shoulder) - calc_dist(left_hip, right_hip)) > 0.1:
        errors.append("Keep shoulders parallel to hips")
    
    return errors

def planks(landmarks):
    errors = []
    left_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
    right_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]

    left_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
    right_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]

    left_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
    right_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]

    if abs(left_shoulder.y - right_shoulder.y) > 0.1:
        errors.append("Keep your shoulders parallel to ground")

    if abs(left_hip.y - right_hip.y) > 0.1:
        errors.append("Keep your hips parallel to ground")

    if abs(left_ankle.y - right_ankle.y) > 0.1:
        errors.append("Keep your ankles parallel to ground")
        
    return errors

modes = ["knee_extension", "external_rotation", "dumbell_thrust", "rotator_cuff", "deadlift", "planks"]

curr_mode = "knee_extension"

def generate_frames():
    
    # Initialize VideoCapture
    cap = cv2.VideoCapture(0)

    # Setup mediapipe instance
    mp_pose = mp.solutions.pose
    mp_drawing = mp.solutions.drawing_utils
    mp_holistic = mp.solutions.holistic
    # Main loop
    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic, mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()

            if not ret:
                break

            # Recolor image to RGB
            frame = cv2.flip(frame, 1)
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False

            # Make detection
            results = pose.process(image)

            # Recolor back to BGR
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            # Extract landmarks
            try:
                landmarks = results.pose_landmarks.landmark
                if curr_mode == "knee_extension":
                    errors = knee_extension(landmarks)
                elif curr_mode == "external_rotation":
                    errors = external_rotation(landmarks)
                elif curr_mode == "dumbell_thrust":
                    errors = dumbell_thrust(landmarks)
                elif curr_mode == "rotator_cuff":
                    errors = rotator_cuff(landmarks)
                elif curr_mode == "deadlift":
                    errors = deadlift(landmarks)
                else:
                    errors = planks(landmarks)

                if len(errors) == 0:
                    cv2.rectangle(image, (0, 0), (1920, 70), (79,201,128), -1)
                    cv2.putText(image, f'Great Form!', (50,50), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 255, 0), 2)
                for i in range(len(errors)):
                    cv2.rectangle(image, (0, 0), (1920, 70), (79,201,128), -1)
                    cv2.putText(image, f'Error: {errors[i]}', (50,50 + 80*i), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 0), 2)
                

                # cv2.putText(image, f'Info: {", ".join(errors)}', (50,50), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 0), 2)
            except:
                # print(traceback.format_exc())
                pass

            # Make detection
            results = pose.process(image)
            results_face = holistic.process(image)

            #mp_drawing.draw_landmarks(image, results_face.face_landmarks, mp_holistic.FACEMESH_TESSELATION)
            
            # Render detections
            mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                                    mp_drawing.DrawingSpec(color=(245,117,66), thickness=2, circle_radius=2), 
                                    mp_drawing.DrawingSpec(color=(245,66,230), thickness=2, circle_radius=2)
                                    )               
            
            
            ret, buffer = cv2.imencode('.jpg', image)  # Encode the frame in JPEG format
            image = buffer.tobytes()  # Convert the frame to bytes
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + image + b'\r\n')  # Yield the frame in HTTP multipart response format


            if cv2.waitKey(10) & 0xFF == ord('q'):
                break

    # Release VideoCapture and close all windows
    cap.release()
    cv2.destroyAllWindows()
        
        
        
        
    
    
    
    
    # camera = cv2.VideoCapture(0)  # Use the default camera (usually webcam)
    # while True:
    #     success, frame = camera.read()  # Read the frame from the camera
    #     if not success:
    #         break
    #     else:
    #         ret, buffer = cv2.imencode('.jpg', frame)  # Encode the frame in JPEG format
    #         frame = buffer.tobytes()  # Convert the frame to bytes
    #         yield (b'--frame\r\n'
    #                b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')  # Yield the frame in HTTP multipart response format

@app.route('/')
def index():
    return render_template('index.html')  # Render the HTML template

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')  # Return the streaming response

@app.route('/set_mode', methods=['POST'])
def set_mode():
    global curr_mode
    global reps
    reps = 0
    curr_mode = request.form["exercise"]
    return "OK"

# client = Client(api_key=os.environ.get("key"))

@app.route('/conversation', methods=['POST'])
def start_conversation():
    # Get user input and conversation count from request
    user_input = request.json.get('user_input')
    conversation_count = request.json.get('conversation_count')

    if conversation_count == "3":
        return flask.jsonify({'chatbot_response': 'Thank you for chatting! Have a great day.'}), 200

    # Generate prompt for ChatGPT
    prompt = f"Hey, engineer me a question to ask the user based on this input: '{user_input}' to extract insights from how their workout went."

    # Send information to ChatGPT
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": user_input,
            },
            {
                "role": "assistant",
                "content": prompt
            }
        ],
        model="gpt-3.5-turbo",
    )

    # Extract the response from ChatGPT
    chatbot_response = chat_completion.choices[0].message.content

    # Return the response to the client
    return flask.jsonify({'chatbot_response': chatbot_response}), 200





@app.route('/test', methods=['POST'])
def receive_data():
    data = request.form.get('acceleration')
    print("Received data:", data)
    return "Data received successfully"


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3001, debug=True)

