import { Route, Routes } from "react-router";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LogIn from "./pages/Login";
import SignUp from "./pages/Signup";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />
      
      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
