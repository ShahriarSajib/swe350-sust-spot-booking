import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedSpotShowcase from "../../components/authentication/AnimatedSpotShowcase";

const Login = ({ onLogin }) => {
  const [loginType, setLoginType] = useState("user");
  // New state to toggle between Login and Forgot Password view
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url =
        loginType === "admin"
          ? "http://localhost:5000/api/admin/login"
          : "http://localhost:5000/api/users/login";

      const res = await axios.post(url, {
        email,
        password,
      });

      alert("Login Successful!");

      if (loginType === "admin") {
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("adminId", res.data.admin.approver_id);
        localStorage.setItem("adminName", res.data.admin.approver_name || "");
      } else {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("userName", res.data.user.full_name || "");
        localStorage.setItem("userContact", res.data.user.contact_number || "");
        localStorage.setItem("userType", res.data.user.user_type || "user");
      }

      onLogin(loginType);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/users/forgot-password", {
        email,
      });

      alert("Reset link sent to your email!");
      setIsForgotMode(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send reset link");
    }
  };
  return (
    <div className="min-h-screen flex font-sans bg-slate-100">
      <AnimatedSpotShowcase />

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-16 bg-slate-100">
        <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200 border border-white">
          {/* Header section changes based on mode */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              {isForgotMode ? (
                <>
                  Reset <span className="text-blue-600">Password</span>
                </>
              ) : (
                <>
                  Welcome <span className="text-blue-600">Back</span>
                </>
              )}
            </h2>
            <p className="text-slate-500 font-medium">
              {isForgotMode
                ? "Enter your email to receive a password reset link."
                : `Enter your ${loginType === "admin" ? "admin" : ""} credentials to access your account.`}
            </p>
          </div>

          {!isForgotMode ? (
            /* --- EXISTING LOGIN FORM --- */
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  placeholder="name@email.com"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center pr-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                    Password
                  </label>
                  {loginType === "user" && (
                    <button
                      type="button"
                      onClick={() => setIsForgotMode(true)}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-600 hover:shadow-blue-200 transition-all active:scale-[0.98]"
                >
                  {loginType === "user" ? "Login" : "Login as Admin"}
                </button>
              </div>
            </form>
          ) : (
            /* --- FORGOT PASSWORD FORM --- */
            <form className="space-y-6" onSubmit={handleResetSubmit}>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                  placeholder="enter your registered email"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98]"
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setIsForgotMode(false)}
                  className="w-full mt-4 text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-all"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Footer Section - Only show when not in Forgot Mode to keep it clean */}
          {!isForgotMode && (
            <div className="mt-10 space-y-4">
              {" "}
              {/* Adjusted spacing */}
              {loginType === "user" && (
                <>
                  {/* Registration Link */}
                  <p className="text-sm text-slate-500 text-center font-medium">
                    Don’t have an account?{" "}
                    <Link
                      to="/register"
                      className="text-blue-600 font-bold hover:underline underline-offset-4"
                    >
                      Create an account
                    </Link>
                  </p>

                  {/* External User Booking Link - New Section */}
                  <p className="text-sm text-slate-500 text-center font-medium">
                    Are you an external?{" "}
                    <Link
                      to="/external-booking" // You can change this path later
                      className="text-blue-600 font-bold hover:underline underline-offset-4"
                    >
                      Click here
                    </Link>
                  </p>
                </>
              )}
              {/* Divider and Login Type Switcher */}
              <div className="pt-4 flex flex-col items-center gap-6">
                <div className="flex items-center justify-center gap-3">
                  <div
                    onClick={() => setLoginType("user")}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer border transition-all ${
                      loginType === "user"
                        ? "border-blue-600 text-blue-600 bg-blue-50"
                        : "border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    login as User
                  </div>
                  <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
                  <div
                    onClick={() => setLoginType("admin")}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer border transition-all ${
                      loginType === "admin"
                        ? "border-blue-600 text-blue-600 bg-blue-50"
                        : "border-slate-200 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    login as Admin
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
