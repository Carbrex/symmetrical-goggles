import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import { StyledChart } from "./components/chart";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./components/scroll-to-top";
import "react-toastify/dist/ReactToastify.css";

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <ToastContainer
            autoClose={2500}
            limit={3}
            position="top-center"
            theme="dark"
            style={{ fontSize: "14px", minHeight: "auto", padding: "7px 10px" }}
          />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
