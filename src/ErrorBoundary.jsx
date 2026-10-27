
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || "Unknown error"
    };
  }

  componentDidCatch(error) {
    console.error("Website error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: "#111827",
          color: "white",
          minHeight: "100vh",
          padding: "24px",
          fontFamily: "sans-serif",
          overflowWrap: "anywhere"
        }}>
          <h2>Elite Adventures Error</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {this.state.message}
          </pre>
          <button onClick={() => window.location.reload()}>
            Reload website
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
