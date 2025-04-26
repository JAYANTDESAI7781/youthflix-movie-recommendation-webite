// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// // ✅ Replace with your Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyANrxJfwrQTweWd1TKb5Fd02I8n6xs8pBA",
//     authDomain: "movie-recommendation-sys-41a70.firebaseapp.com",
//     projectId: "movie-recommendation-sys-41a70",
//     storageBucket: "movie-recommendation-sys-41a70.firebasestorage.app",
//     messagingSenderId: "1063413525462",
//     appId: "1:1063413525462:web:91ac8783e998bcdf0c1277",
//     measurementId: "G-6P1QEHCPGG"
//   };
  

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// // Signup Function
// window.signup = function() {
//     const email = document.getElementById("signup-email").value;
//     const password = document.getElementById("signup-password").value;
    
//     createUserWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//             alert("Signup Successful!");
//             showLogout();
//         })
//         .catch((error) => {
//             alert(error.message);
//         });
// };

// // Login Function
// window.login = function() {
//     const email = document.getElementById("login-email").value;
//     const password = document.getElementById("login-password").value;
    
//     signInWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//             alert("Login Successful!");
//             showLogout();
//         })
//         .catch((error) => {
//             alert(error.message);
//         });
// };

// // Logout Function
// window.logout = function() {
//     signOut(auth).then(() => {
//         alert("Logged out!");
//         window.location.href = "index.html"; // ✅ Redirect to the main page
//     }).catch((error) => {
//         alert(error.message);
//     });
// };

// // Show Signup/Login Toggle
// window.showSignup = function() {
//     document.getElementById("signup-form").style.display = "block";
//     document.getElementById("login-form").style.display = "none";
// };

// window.showLogin = function() {
//     document.getElementById("signup-form").style.display = "none";
//     document.getElementById("login-form").style.display = "block";
// };

// function showLogout() {
//     document.getElementById("signup-form").style.display = "none";
//     document.getElementById("login-form").style.display = "none";
//     document.getElementById("logout-btn").style.display = "block";
// }


// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// ✅ Replace this with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyANrxJfwrQTweWd1TKb5Fd02I8n6xs8pBA",
    authDomain: "movie-recommendation-sys-41a70.firebaseapp.com",
    projectId: "movie-recommendation-sys-41a70",
    storageBucket: "movie-recommendation-sys-41a70.firebasestorage.app",
    messagingSenderId: "1063413525462",
    appId: "1:1063413525462:web:91ac8783e998bcdf0c1277",
    measurementId: "G-6P1QEHCPGG"
  };

  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔐 SIGN UP FUNCTION
window.signup = function () {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Signup successful! You can now log in.");
      showLogin();
    })
    .catch((error) => {
      alert("Signup failed: " + error.message);
    });
};

// 🔓 LOGIN FUNCTION
window.login = function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Redirect to movie.html on successful login
      window.location.href = "movie.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
};

// 🚪 LOGOUT FUNCTION
// window.logout = function () {
//   signOut(auth)
//     .then(() => {
//       alert("Logged out successfully.");
//       location.reload();
//     })
//     .catch((error) => {
//       alert("Logout failed: " + error.message);
//     });
// };
window.logout = function () {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // 🔁 Redirect back to login page (index.html)
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert("Logout failed: " + error.message);
      });
  };

// 👀 HANDLE AUTH STATE (Optional: show/hide logout button)
onAuthStateChanged(auth, (user) => {
  const logoutBtn = document.getElementById("logout-btn");
  if (user) {
    logoutBtn.style.display = "block";
  } else {
    logoutBtn.style.display = "none";
  }
});

// 🔁 UI TOGGLE HELPERS
window.showLogin = function () {
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("login-form").style.display = "block";
};

window.showSignup = function () {
  document.getElementById("signup-form").style.display = "block";
  document.getElementById("login-form").style.display = "none";
};
