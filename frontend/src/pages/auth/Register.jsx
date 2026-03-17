import React, { useState } from 'react';
import AnimatedSpotShowcase from "../../components/authentication/AnimatedSpotShowcase";
import { Link } from "react-router-dom";
import axios from 'axios';

const Register = () => {
  // Fixed userType for this page
  const userType = 'internal';

  const [formData, setFormData] = useState({
    fullName: '',
    department: '',
    email: '',
    contactNumber: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('department', formData.department);
      data.append('email', formData.email);
      data.append('contactNumber', formData.contactNumber);
      data.append('password', formData.password);
      data.append('userType', userType); // Sending internal type

      const res = await axios.post('http://localhost:5000/api/users', data, {
        headers: {
          'Content-Type': 'multipart/form-data' // এটি যোগ করুন
        }
      });
       console.log(res.data);
      alert('Internal account created successfully!');
      console.log(res.data);
    } catch (err) {
      
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
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
            <p className="text-slate-500 font-medium tracking-tight">Register with your institutional details.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">Full Name</label>
              <input name="fullName" className="auth-input-styled" onChange={handleChange} placeholder="Full Name" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">Department</label>
              <input name="department" className="auth-input-styled" onChange={handleChange} placeholder="e.g. CSE, PME" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">Institutional Email</label>
              <input type="email" name="email" className="auth-input-styled" onChange={handleChange} placeholder="example@sust.edu" required />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">Contact Number</label>
              <input name="contactNumber" className="auth-input-styled" onChange={handleChange} placeholder="+880 1XXX XXXXXX" required />
            </div>

            <div className="space-y-1 pb-2">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2 tracking-widest">Password</label>
              <input type="password" name="password" className="auth-input-styled" onChange={handleChange} placeholder="••••••••" required />
            </div>

            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all">
              Create  Account
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-8 text-center font-medium">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;