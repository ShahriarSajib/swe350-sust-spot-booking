import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedSpotShowcase from "../../components/authentication/AnimatedSpotShowcase";
import API_BASE from "../../config";

const Login = ({ onLogin }) => {
  const [loginType, setLoginType] = useState("user");
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // --- New State for Errors ---
  const [error, setError] = useState({ field: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ field: "", message: "" }); // Reset errors on new attempt

    try {
      const url =
        loginType === "admin"
          ? `${API_BASE}/api/admin/login`
          : `${API_BASE}/api/users/login`;

      const res = await axios.post(url, { email, password });

      // On Success
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
      // Network errors (CORS, server offline, Render sleeping) have no err.response
      if (!err.response) {
        setError({ field: "general", message: "Cannot connect to server. Please wait a moment and try again." });
        return;
      }
      const serverMsg = err.response?.data?.message?.toLowerCase() || "";
      
      // Logic to determine which field to highlight
      if (serverMsg.includes("user") || serverMsg.includes("email") || serverMsg.includes("not found")) {
        setError({ field: "email", message: "Email address not registered." });
      } else if (serverMsg.includes("password")) {
        setError({ field: "password", message: "Invalid password. Please try again." });
      } else if (serverMsg.includes("verify") || serverMsg.includes("verified")) {
        setError({ field: "general", message: "Please verify your email before logging in." });
      } else {
        setError({ field: "general", message: serverMsg || "Login failed. Please try again." });
      }
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError({ field: "", message: "" });

    try {
      await axios.post(`${API_BASE}/api/users/forgot-password`, { email });
      alert("Reset link sent to your email!");
      setIsForgotMode(false);
    } catch (err) {
      setError({ field: "email", message: err.response?.data?.message || "Failed to send reset link" });
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-slate-100">
      <AnimatedSpotShowcase />

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-16 bg-slate-100">
        <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200 border border-white">
          
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              {isForgotMode ? <>Reset <span className="text-blue-600">Password</span></> : <>Welcome <span className="text-blue-600">Back</span></>}
            </h2>
            <p className="text-slate-500 font-medium">
              {isForgotMode
                ? "Enter your email to receive a password reset link."
                : `Enter your ${loginType === "admin" ? "admin" : ""} credentials.`}
            </p>
          </div>

          {!isForgotMode ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* --- EMAIL INPUT --- */}
              <div className="space-y-1">
                <label className={`text-[10px] font-black uppercase ml-2 tracking-widest ${error.field === "email" ? "text-red-500" : "text-slate-400"}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if(error.field === "email") setError({field: "", message: ""});
                  }}
                  className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none transition-all font-medium ${
                    error.field === "email" 
                    ? "border-red-500 focus:ring-2 focus:ring-red-100" 
                    : "border-slate-100 focus:ring-2 focus:ring-blue-100"
                  }`}
                  placeholder="name@email.com"
                />
                {error.field === "email" && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase tracking-wide">{error.message}</p>}
              </div>

              {/* --- PASSWORD INPUT --- */}
              <div className="space-y-1">
                <div className="flex justify-between items-center pr-2">
                  <label className={`text-[10px] font-black uppercase ml-2 tracking-widest ${error.field === "password" ? "text-red-500" : "text-slate-400"}`}>
                    Password
                  </label>
                  {loginType === "user" && (
                    <button type="button" onClick={() => setIsForgotMode(true)} className="text-[10px] font-bold text-blue-600 hover:underline">
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if(error.field === "password") setError({field: "", message: ""});
                  }}
                  className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none transition-all font-medium ${
                    error.field === "password" 
                    ? "border-red-500 focus:ring-2 focus:ring-red-100" 
                    : "border-slate-100 focus:ring-2 focus:ring-blue-100"
                  }`}
                  placeholder="••••••••"
                />
                {error.field === "password" && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase tracking-wide">{error.message}</p>}
              </div>

              <div className="pt-2">
                {error.field === "general" && (
                  <p className="mb-3 text-center text-red-500 text-xs font-bold bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error.message}
                  </p>
                )}
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-[0.98]">
                  {loginType === "user" ? "Login" : "Login as Admin"}
                </button>
              </div>
            </form>
          ) : (
            /* --- FORGOT PASSWORD MODE --- */
            <form className="space-y-6" onSubmit={handleResetSubmit}>
              <div className="space-y-1">
                <label className={`text-[10px] font-black uppercase ml-2 tracking-widest ${error.field === "email" ? "text-red-500" : "text-slate-400"}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none transition-all font-medium ${
                    error.field === "email" ? "border-red-500" : "border-slate-100"
                  }`}
                  placeholder="enter your registered email"
                />
                {error.field === "email" && <p className="text-red-500 text-[10px] font-bold ml-2 uppercase">{error.message}</p>}
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98]">
                  Send Reset Link
                </button>
                <button type="button" onClick={() => { setIsForgotMode(false); setError({field:"", message:""}); }} className="w-full mt-4 text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-slate-600 transition-all">
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {!isForgotMode && (
            <div className="mt-10 space-y-4">
              {loginType === "user" && (
                <>
                  <p className="text-sm text-slate-500 text-center font-medium">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline underline-offset-4">
                      Create an account
                    </Link>
                  </p>
                  <p className="text-sm text-slate-500 text-center font-medium">
                    Are you an external?{" "}
                    <Link to="/external-booking" className="text-blue-600 font-bold hover:underline underline-offset-4">
                      Click here
                    </Link>
                  </p>
                </>
              )}
              <div className="pt-4 flex flex-col items-center gap-6">
                <div className="flex items-center justify-center gap-3">
                  <div
                    onClick={() => { setLoginType("user"); setError({field:"", message:""}); }}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer border transition-all ${
                      loginType === "user" ? "border-blue-600 text-blue-600 bg-blue-50" : "border-slate-200 text-slate-400"
                    }`}
                  >
                    login as User
                  </div>
                  <div className="h-1 w-1 bg-slate-200 rounded-full"></div>
                  <div
                    onClick={() => { setLoginType("admin"); setError({field:"", message:""}); }}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer border transition-all ${
                      loginType === "admin" ? "border-blue-600 text-blue-600 bg-blue-50" : "border-slate-200 text-slate-400"
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