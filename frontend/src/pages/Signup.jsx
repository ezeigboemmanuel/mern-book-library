import { Link } from "react-router";

const SignUp = () => {
  return (
    <div className="min-h-screen text-[#252422] bg-[#f5f5f5] px-4 md:px-12">
      <h2 className="text-center font-semibold pt-8 md:text-2xl w-full max-w-xl mx-auto">
        Sign Up
      </h2>

      <form className="w-full max-w-xl mx-auto flex flex-col justify-center items-center space-y-4 mt-10">
        {/* Username Field */}
        <div className="flex flex-col w-full">
          <label className="md:text-lg">Username:</label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col w-full">
          <label className="md:text-lg">Email:</label>
          <input
            type="email"
            placeholder="johndoe@gmail.com"
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col w-full">
          <label className="md:text-lg">Password:</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col w-full">
          <label className="md:text-lg">Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border border-gray-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#403D39] text-[#FFFCF2] py-2 font-medium rounded-lg"
        >
          Sign up
        </button>

        {/* Login Link */}
        <p>
          Already have an account?{" "}
          <Link to={"/login"} className="text-[#944424]">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
