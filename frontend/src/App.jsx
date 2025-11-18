

import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Login from "./login/Login.jsx";


function App() {
  return (

    <Router> 
      <Routes>
        <Route path="/" element={<Login />} /> 
      </Routes>
    </Router>
  );
}
export default App;