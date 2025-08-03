import React from "react";
import Routes from "./Routes";
import { AuthProvider } from "./providers/AuthProvider";
import { SkeletonTheme } from "react-loading-skeleton";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";

function App() {
  return (
    <AuthProvider>
      <SkeletonTheme baseColor="#eeeeee" highlightColor="#e5e5e5">
        <Routes />
        <ToastContainer position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover />
      </SkeletonTheme>
    </AuthProvider>
  );
}

export default App;
