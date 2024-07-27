import React from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
//import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db, doc, provider, setDoc } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getDoc } from "firebase/firestore";

function SignupSigninComponent() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loginForm, setloginForm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Password: ", password);
    console.log("Confirm Password: ", confirmPassword);
    //Authenticate User or create new account using email or password
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            console.log("User>>>", user);
            toast.success("User Signed Up Successfully");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");
            // create a doc with user id as the following id
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
            // ..
          });
      } else {
        toast.error("Password and Confirm Password dont match");
      }
    } else {
      toast.error("All fields are required");
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    setLoading(true);
    console.log("Email: ", email);
    console.log("Password: ", password);
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User>>>", user);
          toast.success("Successful Login");
            setLoading(false);
          navigate("/dashboard");
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
            setLoading(false);
        });
    } else {
      toast.error("All fields are required");
        setLoading(false);
    }
  }

  async function createDoc(user) {
    //make sure doc
    // create a doc with user id as the following id
    setLoading(true)
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        const createdAt = new Date();
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt,
        });
        //toast.success("User Doc created");
        setLoading(false)
      } catch (e) {
        toast.error(e.message);
        setLoading(false)
      }
    }else{
        //toast.error("UserDOc already exists")
    }
  }

  function googleAuth(){
    setLoading(true)
    try{
      signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log("user>>>", user)
    createDoc(user);
    setLoading(false)
    navigate("/dashboard");
    toast.success("User Signed Up Successfully");
    
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    setLoading(false)
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage)
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
    }catch (e){
      setLoading(false)
      toast.error(e.message)
    }
    
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on{" "}
            <span style={{ color: "var(--theme)" }}>Budget-Buddy.</span>
          </h2>
          <form>
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"Hisham@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Hisham@123"}
            />

            <Button
              disabled={loading}
              onClick={loginUsingEmail}
              text={loading ? "Loading..." : "Login using Email and Password"}
            />
            <p className="p-login">or</p>
            <Button
              disabled={loading}
              onClick={googleAuth}
              text={loading ? "Loading..." : "Login using Google"}
              orange={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setloginForm(!loginForm)}
            >
              Don't have an account?
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on{" "}
            <span style={{ color: "var(--theme)" }}>Budget-Buddy.</span>
          </h2>
          <form>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"Hisham Ismail"}
            />
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"Hisham@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Hisham@123"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Hisham@123"}
            />
            <Button
              disabled={loading}
              onClick={signupWithEmail}
              text={loading ? "Loading..." : "Sign Up using Email and Password"}
            />
            <p className="p-login">or</p>
            <Button
            disabled={loading}
              onClick={googleAuth}
              text={loading ? "Loading..." : "Sign Up using Google"}
              orange={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setloginForm(!loginForm)}
            >
              Already have an account?
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSigninComponent;
