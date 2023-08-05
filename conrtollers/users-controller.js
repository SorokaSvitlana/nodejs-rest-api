import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import User from "../models/user.js";

const avatarsDir = path.resolve("public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);

  try {
    const avatar = await Jimp.read(tempUpload);
    avatar.resize(250, 250).write(resultUpload);
  } catch (err) {
    throw err;
  }

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default updateAvatar;
