import { useState } from "react";
import axios from "axios";

export const useProfileUpdate = (profile, setProfile, setSignaturePreview, setShowEdit) => {
    // Ei duto state-ei original binary file thake, ja FormData-te jabe
    const [imageFile, setImageFile] = useState(null);
    const [signatureFile, setSignatureFile] = useState(null);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file); // Binary file save korlam
        const reader = new FileReader();
        reader.onloadend = () => setProfile({ ...profile, image: reader.result }); // Preview dekhano
        reader.readAsDataURL(file);
    };

    const handleSignatureUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSignatureFile(file); // Binary file save korlam
            setSignaturePreview(URL.createObjectURL(file)); // Preview dekhano
        }
    };

   // useProfileUpdate.js এর ভেতর এই অংশটি একদম হুবহু কপি-পেস্ট করুন
const handleProfileUpdate = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    setSavingProfile(true);
    setProfileMessage("Saving changes...");

    try {
        const formData = new FormData();
        
        // ১. টেক্সট ডাটা (এগুলো পোস্টম্যানের Key অনুযায়ী চেক করুন)
        formData.append("full_name", profile.name);
        formData.append("department", profile.department);
        formData.append("contact_number", profile.contact); 

        // ২. ফাইল ডাটা (সবচেয়ে গুরুত্বপূর্ণ অংশ)
        // পোস্টম্যানে যে Key (profile_picture/signature) ব্যবহার করেছেন, এখানেও তাই দিবেন
        if (imageFile) {
            formData.append("profile_picture", imageFile); 
            console.log("Adding Profile Picture to FormData...");
        }
        if (signatureFile) {
            formData.append("signature", signatureFile);
            console.log("Adding Signature to FormData...");
        }

        const res = await axios.put(
            `http://localhost:5000/api/users/profile/${userId}`,
            formData,
            {
                headers: { 
                    "Content-Type": "multipart/form-data" // এই হেডারটি মাস্ট
                },
            }
        );

        if (res.status === 200) {
            setProfileMessage("Profile updated successfully ✔");
            setSignaturePreview(null);
            
            // ব্যাকএন্ড থেকে আসা নতুন ফাইলের নাম দিয়ে স্টেট আপডেট করুন
            const updatedUser = res.data;
            const baseUrl = "http://localhost:5000/uploads/";

            setProfile({
                ...profile,
                image: updatedUser.profile_picture ? `${baseUrl}${updatedUser.profile_picture}` : profile.image,
                signature: updatedUser.signature ? `${baseUrl}${updatedUser.signature}` : profile.signature
            });

            setTimeout(() => {
                setProfileMessage("");
                setShowEdit(false);
                setImageFile(null); // ফাইল ক্লিয়ার করুন
                setSignatureFile(null);
            }, 1500);
        }
    } catch (err) {
        console.error("Frontend Update Error:", err);
        setProfileMessage("Update failed. Try again.");
    } finally {
        setSavingProfile(false);
    }
};

    return { 
        savingProfile, 
        profileMessage, 
        setProfileMessage, 
        handleImageChange, 
        handleSignatureUpload, 
        handleProfileUpdate 
    };
}; 