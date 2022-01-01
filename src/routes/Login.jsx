// Import FirebaseAuth and firebase.
import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useNavigate } from "react-router";

const auth = getAuth();

function SignInScreen() {

  const navigate = useNavigate();

  // Configure FirebaseUI.
  const uiConfigMap = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // We will display Google and Facebook as auth providers.
    callbacks: {
      signInSuccess: () => {navigate("/")}
    },
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  };

  return (
    <div className="bg-gray-800 h-screen text-gray-300 text-center">
      <h1 className="text-5xl bg-sky-700 p-2 rounded-b-md">Tasket</h1>
      <p className="m-2">
        Welcome to Tasket, the online tool to help you manage weekly group tasks
      </p>
      <p className="m-2">Please sign-in to use the app</p>
      <StyledFirebaseAuth uiConfig={uiConfigMap} firebaseAuth={auth} />
    </div>
  );
}

export default SignInScreen;
