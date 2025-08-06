import { useState } from "react";
import { Avatar, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useMyContext } from "../../store/ContextApi";
import api from "../../services/api";

function ProfilePicture() {
  const { currentUser } = useMyContext();
  const [previewUrl, setPreviewUrl] = useState(
    currentUser?.profilePicture
      ? `http://localhost:8080${currentUser.profilePicture}`
      : "/static/images/avatar/1.jpg"
  );

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("profile picture");
      const response = await api.post("/auth/upload/profile-pic", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update the avatar preview
      const uploadedPath = response.data.profilePicture; // assuming backend returns like "/uploads/profile/uuid_filename.jpg"
      setPreviewUrl(`${import.meta.env.VITE_APP_API_URL}${uploadedPath}`);
      alert("Profile picture updated!");
      console.log(
        "New preview URL:",
        `${import.meta.env.VITE_APP_API_URL}${uploadedPath}`
      );
    } catch (error) {
      console.error(error);
      alert("Failed to upload profile picture.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 relative">
      <Avatar
        alt={currentUser?.username}
        src={previewUrl}
        sx={{ width: 100, height: 100 }}
      />

      <label htmlFor="profile-upload" className="absolute top-0 right-0">
        <input
          type="file"
          id="profile-upload"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
        <IconButton component="span" size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      </label>

      <h3 className="font-semibold text-2xl">{currentUser?.username}</h3>
    </div>
  );
}

export default ProfilePicture;
