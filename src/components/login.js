import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";
import register from "./register";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    console.log("Inside");
    e.preventDefault();
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log("Inside----------------------------------");
        if (user) {
          const collection =
            register.utype === "Client" ? "Client" : "Freelancer";
          const userDoc = await getDoc(doc(db, collection, user.uid));
          console.log("----------------------------------------Inside");
          if (userDoc.exists()) {
            console.log("--------inside--------");
            
            const {id, usertype } = userDoc.data();
            toast.success("User logged in Successfully", {
              position: "top-center",
            });
            console.log(id);
            
            localStorage.setItem("userUID", id);

            // Navigate based on user type
            navigate(
              usertype === "Client"
                ? "/client-dashboard"
                : "/freelancer-dashboard"
            );
          }
        }
      } catch (error) {
        toast.error(error.message, { position: "bottom-center" });
      }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <form 
        onSubmit={handleSubmit} 
        className="border rounded p-4 shadow"
        style={{ width: '300px' }}
      >
        <h3 className="text-center">Login</h3>
  
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
  
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
  
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
        <p className="forgot-password text-right">
          New user <a href="/register">Register Here</a>
        </p>
      
      </form>
    </div>
  )

}
export default Login;