import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import Dashboard from "./page/Dashboard";
// นำเข้าหน้าเกี่ยวกับเราทั้ง 4 หน้า
import AboutBackground from "./page/AboutBackground";
import AboutPrinciples from "./page/AboutPrinciples";
import AboutProcess from "./page/AboutProcess";
import AboutParticipation from "./page/AboutParticipation";
import Contact from "./page/Contact";
import Login from "./page/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* กลุ่ม Route สำหรับหน้าเกี่ยวกับเรา */}
        <Route path="/about/background" element={<AboutBackground />} />
        <Route path="/about/principles" element={<AboutPrinciples />} />
        <Route path="/about/process" element={<AboutProcess />} />
        <Route path="/about/participation" element={<AboutParticipation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
