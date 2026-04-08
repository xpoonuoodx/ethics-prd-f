import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./page/Home"; // นำเข้า Home (ปรับ Path ตามโฟลเดอร์ของคุณ)

// จำลอง Component สำหรับหน้าอื่นๆ (สร้างไฟล์แยกได้เลยครับ) v.1
const Services = () => (
  <div>
    <h1>บริการของเรา</h1>
  </div>
);
const Workflow = () => (
  <div>
    <h1>ขั้นตอนการทำงาน</h1>
  </div>
);
const Login = () => (
  <div>
    <h1>เข้าสู่ระบบ</h1>
  </div>
);
const Register = () => (
  <div>
    <h1>สมัครสมาชิก</h1>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
