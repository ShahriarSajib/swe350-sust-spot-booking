import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import AnimatedSpotShowcase from "../../components/authentication/AnimatedSpotShowcase";
import API_BASE from "../../config";

const ExternalRegister = () => {
  const userType = "external";
  const [idPreview, setIdPreview] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    email: "",
    contactNumber: "",
    password: "",
    idFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      console.log("File detected:", files[0]);
      setFormData((prev) => ({
        ...prev,
        idFile: files[0],
      }));
      setIdPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Selected File:", formData.idFile);

    if (!formData.idFile) {
      alert("Please upload your Identity Verification (ID Photo)");
      return;
    }

    try {
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("department", formData.department);
      data.append("email", formData.email);
      data.append("contactNumber", formData.contactNumber);
      data.append("password", formData.password);
      data.append("userType", userType);
      data.append("idFile", formData.idFile);

      await axios.post(`${API_BASE}/api/users/external`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Registered successfully");
    } catch (err) {
      console.error("Submission error:", err.response?.data);
      alert(
        "Registration failed: " + (err.response?.data?.message || err.message),
      );
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white relative">
      <AnimatedSpotShowcase />
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 lg:px-16 bg-slate-50">
        <div className="w-full max-w-md py-10">
          <div className="mb-8">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              Create Your <span className="text-blue-600">Account</span>
            </h2>
            <p className="text-slate-500 font-medium tracking-tight">
              Register with your personal details.
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
                placeholder="Your Name"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">
                Organization
              </label>
              <input
                name="department"
                className="auth-input-styled"
                onChange={handleChange}
                placeholder="Institute/Organization"
                required
              />
            </div>

            {/* Identification (ID Proof) - Compact Design */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">
                Identity Verification (ID Card/NID)
              </label>

              <div className="relative group">
                {/* Hidden file input */}
                <input
                  type="file"
                  name="idFile"
                  id="idFile"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />

                {/* Compact Custom Label */}
                <label
                  htmlFor="idFile"
                  className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 
        ${
          idPreview
            ? "py-3 border-blue-200 bg-blue-50/20"
            : "py-5 border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-400"
        }`}
                >
                  {!idPreview ? (
                    <div className="flex items-center gap-3">
                      {/* Upload Icon - Smaller */}
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:text-blue-600 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] font-black text-slate-500 uppercase tracking-tight">
                          Upload ID Photo
                        </span>
                        <p className="text-[8px] text-slate-400 leading-none">
                          PNG, JPG (Max 5MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={idPreview}
                            alt="Preview"
                            className="h-12 w-16 object-cover rounded-lg border border-blue-100 shadow-sm"
                          />
                          <div className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white p-0.5 rounded-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="8"
                              height="8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <span className="block text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            File Selected
                          </span>
                          <p className="text-[8px] text-slate-400">
                            Ready to upload
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIdPreview(null);
                          setFormData({ ...formData, idFile: null });
                        }}
                        className="text-[9px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">
                Personal Email
              </label>
              <input
                type="email"
                name="email"
                className="auth-input-styled"
                onChange={handleChange}
                placeholder="name@email.com"
                required
              />
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

            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all">
              Create Account
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-8 text-center font-medium">
            Already registered?{" "}
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

export default ExternalRegister;
