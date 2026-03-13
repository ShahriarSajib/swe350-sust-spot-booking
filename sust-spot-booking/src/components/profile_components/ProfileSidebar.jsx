import React from 'react';
import { Camera, User, Lock, X } from "lucide-react";

export default function ProfileSidebar({
    // Profile Data
    profile, setProfile,
    signaturePreview, handleSignatureUpload, handleImageChange,
    handleProfileUpdate,

    // UI States
    showEdit, setShowEdit,
    showPassword, setShowPassword,

    // Form States & Handlers
    savingProfile,
    profileMessage,
    passwordLoading, setPasswordLoading,
    passwordMessage, setPasswordMessage,
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    otpSent, setOtpSent,
    otp, setOtp
}) {
    return (
        <div className="col-span-12 lg:col-span-4 relative mt-20">
            {/* --- PROFILE CARD --- */}
            <div className="bg-white rounded-xl shadow p-6 space-y-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">My Profile</h2>

                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20">
                        <img
                            src={profile.image || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full border-2 border-sky-50"
                        />
                        <label className="absolute bottom-0 right-0 bg-sky-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-sky-600 transition-colors shadow-sm">
                            <Camera size={14} />
                            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                        </label>
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-lg">{profile.name}</p>
                        <p className="text-sm text-sky-600 font-medium">{profile.department}</p>
                    </div>
                </div>

                <div className="text-sm space-y-2 bg-gray-50 p-4 rounded-xl">
                    <p className="text-gray-600"><b className="text-gray-800">Department:</b> {profile.department}</p>
                    <p className="text-gray-600"><b className="text-gray-800">Email:</b> {profile.email}</p>
                    <p className="text-gray-600"><b className="text-gray-800">Contact:</b> {profile.contact}</p>

                    <div className="pt-2 border-t border-gray-200">
                        <b className="text-gray-800 block mb-2">Signature:</b>

                        {/* কন্ডিশন: যদি নতুন প্রিভিউ থাকে অথবা প্রোফাইলে সিগনেচার থাকে */}
                        {(signaturePreview || profile.signature) ? (
                            <div className="space-y-2">
                                <div className="relative w-full h-24 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden p-2">
                                    <img
                                        // প্রথম অগ্রাধিকার নতুন সিলেক্ট করা ফাইল (signaturePreview)
                                        // তা না হলে ডাটাবেসের ফাইল (profile.signature)
                                        src={signaturePreview || profile.signature}
                                        alt="Signature"
                                        className="h-full object-contain"
                                    />
                                </div>
                                <label className="block text-center cursor-pointer">
                                    <span className="text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors">
                                        Change Signature
                                    </span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleSignatureUpload}
                                    />
                                </label>
                            </div>
                        ) : (
                            /* যদি দুটোর একটাও না থাকে (পুরো নতুন ইউজার) */
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-100 transition-colors">
                                <p className="text-xs text-gray-500 font-semibold">Upload Signature</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleSignatureUpload}
                                />
                            </label>
                        )}
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => { setShowEdit(!showEdit); setShowPassword(false); }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold bg-sky-500 text-white rounded-sm hover:bg-sky-600 transition-all shadow-sm"
                    >
                        <User size={16} /> Edit Informations
                    </button>
                    <button
                        onClick={() => { setShowPassword(!showPassword); setShowEdit(false); }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-bold border border-gray-200 text-gray-600 rounded-sm hover:bg-gray-50 transition-all"
                    >
                        <Lock size={16} /> Change Password
                    </button>
                </div>
            </div>
            {/* --- FILE UPDATE ACTION BUTTON --- */}
            {/* যদি নতুন ইমেজ অথবা নতুন সিগনেচার সিলেক্ট করা হয়, তবেই এই সেকশনটি দেখাবে */}
            {(signaturePreview || (profile.image && profile.image.startsWith('data:image'))) && (
                <div className="mt-4 p-3 bg-sky-50 border border-sky-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                    <p className="text-[11px] text-sky-700 font-bold mb-2 flex items-center gap-1">
                        <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></span>
                        New files detected! Please save to update.
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleProfileUpdate}
                            disabled={savingProfile}
                            className="flex-1 py-2 bg-sky-600 text-white text-xs font-bold rounded-lg hover:bg-sky-700 transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            {savingProfile ? "Uploading Files..." : "Confirm & Save New Files"}
                        </button>
                        <button
                            onClick={() => {
                                // এটি ক্লিক করলে সিলেকশন বাতিল হবে
                                window.location.reload();
                            }}
                            className="px-3 py-2 bg-white text-gray-400 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* --- EDIT MODAL --- */}
            {showEdit && (
                <div className="absolute top-0 left-full ml-4 w-[360px] bg-white shadow-2xl rounded-2xl p-6 z-50 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Edit Personal Info</h3>
                        <X className="cursor-pointer text-gray-400" onClick={() => setShowEdit(false)} />
                    </div>
                    <div className="space-y-4">
                        <input className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-sky-400 outline-none" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                        <input className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 text-gray-500" value={profile.email} disabled />
                        <input className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-sky-400 outline-none" value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} />
                        <input className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-sky-400 outline-none" value={profile.contact} onChange={(e) => setProfile({ ...profile, contact: e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setShowEdit(false)} className="px-4 py-2 text-sm font-bold text-gray-500">Cancel</button>
                        <button
                            onClick={handleProfileUpdate} // <--- Shudhu eituku hobe, setSavingProfile likhben na
                            disabled={savingProfile}
                            className="..."
                        >
                            {savingProfile ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                    {profileMessage && <p className="mt-3 text-center text-sm font-medium text-sky-600">{profileMessage}</p>}
                </div>
            )}

            {/* --- PASSWORD MODAL --- */}
            {showPassword && (
                <div className="absolute top-0 left-full ml-4 w-[360px] bg-white shadow-2xl rounded-2xl p-6 z-50 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Change Password</h3>
                        <X className="cursor-pointer text-gray-400" onClick={() => setShowPassword(false)} />
                    </div>
                    {!otpSent ? (
                        <div className="space-y-4">
                            <input type="password" className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-sky-400 outline-none" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                            <input type="password" className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-sky-400 outline-none" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <button
                                disabled={passwordLoading}
                                onClick={() => {
                                    setPasswordLoading(true); setPasswordMessage("Sending OTP...");
                                    setTimeout(() => { setPasswordLoading(false); setOtpSent(true); setPasswordMessage("Check your email for the code"); }, 1500)
                                }}
                                className="w-full bg-sky-500 text-white py-3 rounded-xl font-bold shadow-md shadow-sky-100 disabled:bg-gray-300"
                            >
                                {passwordLoading ? "Requesting..." : "Send OTP"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-center py-2">
                                <p className="text-sm text-gray-500 mb-4">Enter 4-digit code</p>
                                <input maxLength={4} className="w-40 border-b-2 border-sky-500 text-3xl text-center tracking-[0.5em] focus:outline-none bg-transparent font-bold text-gray-700" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
                            </div>
                            <button
                                disabled={passwordLoading}
                                onClick={() => {
                                    setPasswordLoading(true); setPasswordMessage("Verifying...");
                                    setTimeout(() => {
                                        setPasswordLoading(false); setPasswordMessage("Password changed! ✔");
                                        setTimeout(() => { setShowPassword(false); setOtpSent(false); setOtp(""); setPasswordMessage(""); }, 1500)
                                    }, 1500)
                                }}
                                className="w-full bg-sky-500 text-white py-3 rounded-xl font-bold"
                            >
                                {passwordLoading ? "Verifying..." : "Update Password"}
                            </button>
                            <button onClick={() => setOtpSent(false)} className="w-full text-sm text-sky-600 font-bold hover:underline">Resend OTP</button>
                        </div>
                    )}
                    {passwordMessage && <p className="mt-4 text-center text-sm font-semibold text-sky-600">{passwordMessage}</p>}
                </div>
            )}
        </div>
    );
}