import React, { useState } from 'react';
import AnimatedSpotShowcase from "../AnimatedSpotShowcase";
import { Link } from "react-router-dom";
import axios from 'axios';

const Register = () => {
  const [userType, setUserType] = useState('internal');
  const [idPreview, setIdPreview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    department: '',
    organization: '',
    designation: '',
    email: '',
    contactNumber: '',
    password: '',
    idFile: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setIdPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      if (userType === 'internal') data.append('department', formData.department);
      if (userType === 'external') {
        data.append('organization', formData.organization);
        data.append('designation', formData.designation);
        if (formData.idFile) data.append('idFile', formData.idFile);
      }
      data.append('email', formData.email);
      data.append('contactNumber', formData.contactNumber);
      data.append('password', formData.password);
      data.append('userType', userType);

      // Send to backend
      const res = await axios.post('http://localhost:5000/api/users', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('User registered successfully!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
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
              Create <span className="text-blue-600">Account</span>
            </h2>
            <p className="text-slate-500 font-medium">Join SUST Spot Booking to manage your events.</p>
          </div>

          <div className="bg-slate-100 p-1.5 rounded-2xl flex mb-6 border border-slate-200">
            <button onClick={() => setUserType('internal')} className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${userType==='internal'? "bg-white text-blue-600 shadow-sm":"text-slate-500 hover:text-slate-700"}`}>Internal</button>
            <button onClick={() => setUserType('external')} className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${userType==='external'? "bg-white text-blue-600 shadow-sm":"text-slate-500 hover:text-slate-700"}`}>External</button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2">Full Name</label>
              <input name="fullName" className="auth-input-styled" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />
            </div>

            {userType==='internal' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-900 ml-2">Department</label>
                <input name="department" className="auth-input-styled" value={formData.department} onChange={handleChange} placeholder="e.g. CSE, PME, MAT" />
              </div>
            )}

            {userType==='external' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-900 ml-2">Organization / Institute Name</label>
                  <input name="organization" className="auth-input-styled" value={formData.organization} onChange={handleChange} placeholder="Where do you work/study?" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-900 ml-2">Designation</label>
                  <input name="designation" className="auth-input-styled" value={formData.designation} onChange={handleChange} placeholder="e.g. Manager, Student, Officer" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-900 ml-2">Personal Identification (ID Proof)</label>
                  <input type="file" name="idFile" accept="image/*" onChange={handleChange} />
                  {idPreview && <img src={idPreview} alt="Preview" className="h-20 mt-2" />}
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2">{userType==='internal'?'Institutional Email':'Personal Email'}</label>
              <input type="email" name="email" className="auth-input-styled" value={formData.email} onChange={handleChange} placeholder={userType==='internal'?"example@sust.edu":"example@gmail.com"} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2">Contact Number</label>
              <input name="contactNumber" className="auth-input-styled" value={formData.contactNumber} onChange={handleChange} placeholder="+880 1XXX XXXXXX" />
            </div>

            <div className="space-y-1 pb-2">
              <label className="text-[10px] font-black uppercase text-slate-900 ml-2">Password</label>
              <input type="password" name="password" className="auth-input-styled" value={formData.password} onChange={handleChange} placeholder="••••••••" />
            </div>

            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-600 hover:shadow-blue-200 transition-all active:scale-[0.98]">
              {userType==='internal'?'Create Account':'Request for Creating Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;