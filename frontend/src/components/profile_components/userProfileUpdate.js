import { useState } from "react";
import axios from "axios";
import API_BASE from "../../config";

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
    const token = localStorage.getItem("token");

    if (!userId) return;

    setSavingProfile(true);
    setProfileMessage("Saving changes...");

    try {
        const formData = new FormData();
        
        formData.append("full_name", profile.name);
        formData.append("department", profile.department);
        formData.append("contact_number", profile.contact); 

        if (imageFile) {
            formData.append("profile_picture", imageFile); 
            console.log("Adding Profile Picture to FormData...");
        }
        if (signatureFile) {
            formData.append("signature", signatureFile);
            console.log("Adding Signature to FormData...");
        }

        const res = await axios.put(
            `${API_BASE}/api/users/profile/${userId}`,
            formData,
            {
                headers: { 
                    "Content-Type": "multipart/form-data" ,
                    "Authorization": `Bearer ${token}`
                },
            }
        );

        if (res.status === 200) {
            setProfileMessage("Profile updated successfully ✔");
            setSignaturePreview(null);
            

            const updatedUser = res.data;
            const { getImageUrl } = require("../../utils/imageHelper");

            setProfile({
                ...profile,
                image: updatedUser.profile_picture ? getImageUrl(updatedUser.profile_picture) : profile.image,
                signature: updatedUser.signature ? getImageUrl(updatedUser.signature) : profile.signature
            });

            setTimeout(() => {
                setProfileMessage("");
                setShowEdit(false);
                setImageFile(null); 
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