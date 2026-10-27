
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      details: ""
    };
  }

  static getDerivedStateFromError(error) {
    return { error: error?.message || "Unknown rendering error" };
  }

  componentDidCatch(error, info) {
    console.error("Elite Adventures rendering error:", error);
    this.setState({
      details: info?.componentStack || ""
    });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          background: "#111",
          color: "#fff",
          minHeight: "100vh",
          padding: "24px",
          fontFamily: "sans-serif",
          overflowWrap: "anywhere"
        }}>
          <h2>Elite Adventures error</h2>
          <p>{this.state.error}</p>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {this.state.details}
          </pre>
          <button onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
          
