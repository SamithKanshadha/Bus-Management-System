const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ message: "Admin logged in successfully!", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.registerCommuter = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const commuter = new User({ name, email, password, role: "commuter" });
    await commuter.save();

    res.status(201).json({ message: "Commuter registered successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.commuterLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const commuter = await User.findOne({ email, role: "commuter" });
    if (!commuter || !(await bcrypt.compare(password, commuter.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: commuter._id, role: commuter.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ message: "User Logged Successfully", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
