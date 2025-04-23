// import { render, screen } from "@testing-library/react";

// import App from "../src/layout/Application";

jest.mock("@tauri-apps/api/window", () => ({
  getCurrentWindow: jest.fn(() => ({
    metadata: {},
  })),
}));

jest.mock("@tauri-apps/api/webviewWindow", () => ({
  WebviewWindow: jest.fn(() => ({
    prototype: {}, // Mock prototype
  })),
}));

// test("Renders the main page", () => {
//   const testMessage = "Rsbuild with React";
//   render(<App />);
//   expect(screen.getByText(testMessage)).toBeInTheDocument();
// });
