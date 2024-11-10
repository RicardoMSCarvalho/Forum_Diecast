import path from "path";
import fs from "fs";

export const deleteImage = async (imgName) => {
  try {
    if (!imgName) {
      console.log("No image name provided.");
      return false;
    }
    const profilePath = path.join("public/images", imgName);

    await fs.promises.unlink(profilePath);

    return true;
  } catch (error) {
    console.error(`Error deleting image "${imgName}":`, error);
  }
};
