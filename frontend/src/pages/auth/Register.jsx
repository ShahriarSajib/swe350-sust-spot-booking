import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedSpotShowcase from "../../components/authentication/AnimatedSpotShowcase";
import API_BASE from "../../config";

const Register = () => {
  const userType = "internal";
  const [emailError, setEmailError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "email") {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.endsWith(".sust.edu")) {
      setEmailError("Please use a valid institutional email (@sust.edu)");
      return; // Stop the execution
    }
    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("department", formData.department);
      data.append("email", formData.email);
      data.append("contactNumber", formData.contactNumber);
      data.append("password", formData.password);
      data.append("userType", userType);
      const res = await axios.post(
        `${API_BASE}/api/users/internal`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      alert(res.data.message || "Account created successfully! You can now log in.");
      window.location.href = "/login";
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.message || err.message));
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white relative">
      <AnimatedSpotShowcase />
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-16 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              Create Your <span className="text-blue-600">Account</span>
            </h2>
            <p className="text-slate-500 font-medium tracking-tight">
              Register with your institutional details.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">
                Full Name
              </label>
              <input
                name="fullName"
                className="auth-input-styled"
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">
                Department
              </label>
              <input
                name="department"
                className="auth-input-styled"
                onChange={handleChange}
                placeholder="e.g. CSE, PME"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">
                Institutional Email
              </label>
              <input
                type="email"
                name="email"
                // Dynamically add border-red-500 and text-red-500 if there is an error
                className={`auth-input-styled transition-all ${emailError ? "border-red-500 bg-red-50 focus:border-red-600 text-red-600" : ""
                  }`}
                onChange={handleChange}
                placeholder="example@sust.edu"
                value={formData.email}
                required
              />

              {/* Error Message Display */}
              {emailError && (
                <p className="text-[11px] text-red-600 font-bold mt-1 ml-2 flex items-center gap-1 animate-shake">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {emailError}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">
                Contact Number
              </label>
              <input
                name="contactNumber"
                className="auth-input-styled"
                onChange={handleChange}
                placeholder="+880 1XXX XXXXXX"
                required
              />
            </div>

            <div className="space-y-1 pb-2">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="auth-input-styled"
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all">
              Create Account
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-8 text-center font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-bold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
