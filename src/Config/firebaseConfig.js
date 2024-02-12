// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDoc, setDoc, doc, query, where, getDocs, updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBw8PHjga33D3rRrgGakxxeJDSp9cCJwjw",
  authDomain: "therapute-28a65.firebaseapp.com",
  projectId: "therapute-28a65",
  storageBucket: "therapute-28a65.appspot.com",
  messagingSenderId: "51911317619",
  appId: "1:51911317619:web:65109d32a8db4ae95e3206",
  measurementId: "G-NRC0B10GVC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to add a new user
export async function addUser(email, password, username, isActive, therapist) {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        email: email,
        password: password,
        username: username,
        isActive: isActive,
        history: [],
        therapist: therapist
      });
      console.log("User added with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding user: ", e);
    }
  }
  
  // Function to get user by username
  export async function getUserByEmail(email) {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      } else {
        return { error: 'User not found' }; // Return an object indicating user not found
      }
    } catch (error) {
      console.error('Error getting user:', error);
      // You can throw the error here if you want to handle it in the calling code
      return { error: 'An error occurred' }; // Return an object indicating an error occurred
    }
  }
  
  // Function to update user's history
  export async function updateUserHistory(username, exerciseId, grade) {
    try {
      const userRef = doc(db, "users", username);
      await setDoc(userRef, { history: { [exerciseId]: { grade: grade } } }, { merge: true });
      console.log("User's history updated!");
    } catch (e) {
      console.error("Error updating user's history: ", e);
    }
  }

  export async function signInUserWithEmailAndPassword(email, password) {
      const user = await getUserByEmail(email); // Get user data from Firestore
      console.log(user !== null);
      if (user !== null && user.password === password) { // Check if user exists and password matches
        console.log("User signed in successfully!");
        return true; // Sign in user if password matches
      } else {
          return false;
      }
    } 

    
    export async function logActiveUserOut() {
        const activeUserQuery = query(collection(db, 'users'), where('isActive', '==', true));
        const querySnapshot = await getDocs(activeUserQuery);

    
        querySnapshot.forEach(async (doc) => {
            const userRef = doc.ref;
            await updateDoc(userRef, { isActive: false });
        });
    }
    