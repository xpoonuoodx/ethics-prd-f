import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            fontFamily: "sans-serif",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h2>เกิดข้อผิดพลาดบางอย่างในหน้านี้</h2>
          <p style={{ color: "#64748b" }}>
            กรุณาลองกลับไปหน้าแรกใหม่อีกครั้ง
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: "10px 24px",
              borderRadius: "8px",
              border: "none",
              background: "#0f172a",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            กลับสู่หน้าแรก
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
