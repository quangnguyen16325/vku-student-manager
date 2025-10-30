import axios from "axios";

export const uploadImage = async (imageUri, email) => {
  const username = email.split("@")[0];
  const data = new FormData();

  data.append("file", {
    uri: imageUri,
    type: "image/jpeg",
    name: `${username}.jpg`, 
  });

  data.append("upload_preset", "unsigned_vku_upload");
  data.append("folder", "VKU Student Manager");

  const safeEmail = username.replace(/[@.]/g, "_");
  const uniqueId = Date.now();
  data.append("public_id", `${safeEmail}_${uniqueId}`);

  const CLOUD_NAME = "dkno35cfs"; 

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      data
    );
    return res.data.secure_url; 
  } catch (error) {
    console.log("Upload error:", error.response?.data || error.message);
    throw error;
  }
};
