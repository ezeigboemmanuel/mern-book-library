import { Route, Routes } from "react-router";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LogIn from "./pages/Login";
import SignUp from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import RedirectAuthenticatedUser from "./providers/RedirectAuthenticatedUsers";
import RedirectUnauthenticatedUser from "./providers/RedirectUnauthenticatedUsers";
import AddBook from "./pages/AddBook";
import Bookpage from "./pages/Bookpage";
import UpdateBook from "./pages/UpdateBook";
import Searchpage from "./pages/Searchbook";

function App() {
  const { fetchUser, fetchingUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (fetchingUser) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Toaster />

      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUp />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LogIn />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/add-book"
          element={
            <RedirectUnauthenticatedUser>
              <AddBook />
            </RedirectUnauthenticatedUser>
          }
        />
        <Route path="/book/:id" element={<Bookpage />} />

        <Route
          path="/book/:id/update"
          element={
            <RedirectUnauthenticatedUser>
              <UpdateBook />
            </RedirectUnauthenticatedUser>
          }
        />

        <Route path="/search" element={<Searchpage />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default App;
