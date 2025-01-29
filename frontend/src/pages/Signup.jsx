import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, isLoading, error } = useAuthStore(); // Access signup function and states from the store
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      // Check if passwords match
      if (password !== confirmPassword) {
        toast.error("Passwords must match."); // Show an error toast if passwords don't match
        return; // Stop execution
      }

      // Call the signup function from the store
      await signup(username, email, password);

      // Navigate to the homepage on success
      navigate("/");
    } catch (error) {
      console.log(error); // Log any errors for debugging
    }
  };

  return (
    <div className="min-h-screen text-[#252422] bg-[#f5f5f5] px-4 md:px-12">
      <h2 className="text-center font-semibold pt-8 md:text-2xl w-full max-w-xl mx-auto">
        Sign Up
      </h2>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl mx-auto flex flex-col justify-center items-center space-y-4 mt-10"
      >
        {/* Username Field */}
        <div className="flex flex-col w-full">
          <label className="md:text-lg">Username:</label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col w-full">
          <label className="md:text-lg">Email:</label>
          <input
            type="email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col w-full">
          <label className="md:text-lg">Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col w-full">
          <label className="md:text-lg">Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading} // Disable the button when loading
          className="w-full bg-[#403D39] text-[#FFFCF2] py-2 font-medium rounded-lg"
        >
          {isLoading ? "Please wait..." : "Sign up"}{" "}
          {/* Change the text based on loading state */}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
