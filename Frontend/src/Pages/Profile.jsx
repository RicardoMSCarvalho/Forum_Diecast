import { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { BaseUrl, patch } from "../services/Endpoint";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { setUser } from "../redux/AuthSlice";

export default function Profile() {
  const { userID } = useParams();
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [fullname, setFullname] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      setFullname(user.fullname);
    }
  }, [user]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setProfile(selectedFile);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", fullname);
    formData.append("oldpassword", oldPassword);
    formData.append("newpassword", newPassword);

    if (profile) {
      formData.append("profile", profile);
    }
    try {
      const response = await patch(`auth/profile/${userID}`, formData);
      const data = response.data;
      if (data.success) {
        toast.success(data.message);
        dispatch(setUser(data.user));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Update Profile</h1>
      <form className="profile-form" onSubmit={handleUpdateProfile}>
        <div className="profile-image-section">
          <label htmlFor="profileImage" className="profile-image-label">
            {profile ? (
              <img
                src={URL.createObjectURL(profile)}
                alt="Avatar"
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">
                <img
                  src={`${BaseUrl}/images/${user.profile}`}
                  alt="Avatar"
                  className="profile-image"
                />
              </div>
            )}
          </label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleImageChange}
            className="profile-image-input"
            style={{ display: "none" }}
          />
        </div>

        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Update Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="profile-input"
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="profile-input"
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="profile-input"
          />
        </div>

        <button type="submit" className="profile-button">
          Update Profile
        </button>
      </form>
    </div>
  );
}
