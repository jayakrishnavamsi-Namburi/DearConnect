import UserModel from "../models/user.model.js"; // adjust path if needed

export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("name username");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      username: user.username,
    });
  } catch (err) {
    console.error("Error in getProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
