const User = require("../models/User");


exports.addOperator = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admin can add operators." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const operator = new User({
      name,
      email,
      password,
      role: "operator",
      isAddedByAdmin: true,
    });

    await operator.save();
    res.status(201).json({ message: "Bus operator added successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOperators = async (req, res) => {
  try {
    const operators = await User.find({ role: "operator" });
    res.status(200).json(operators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOperatorById = async (req, res) => {
  try {
    const operator = await User.findById(req.params.id);
    if (!operator) {
      return res.status(404).json({ message: "Operator not found." });
    }
    res.status(200).json(operator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommutors = async (req, res) => {
  try {
    const commuter = await User.find({ role: "commuter" });
    res.status(200).json(commuter);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCommutersById = async (req, res) => {
  try {
    const commuters = await User.findById(req.params.id);
    res.status(200).json(commuters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateOperator = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const operator = await User.findById(id);
    if (!operator || operator.role !== "operator") {
      return res.status(404).json({ message: "Operator not found." });
    }

    if (name) operator.name = name;
    if (email) operator.email = email;
    if (password) {
      const bcrypt = require("bcrypt");
      operator.password = await bcrypt.hash(password, 10);
    }

    await operator.save();

    res.status(200).json({ message: "Operator updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCommuter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const commuter = await User.findById(id);
    if (!commuter || commuter.role != "commuter") {
      return res.status(404).json({ message: "Commuter not found" });
    }

    if (name) commuter.name = name;
    if (email) commuter.email = email;

    if (password) {
      const bcrypt = require("bcrypt");
      commuter.password = await bcrypt.hash(password, 10);
    }

    await commuter.save();
    res.status(200).json({ message: "Commuter updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOperator = async (req, res) => {
  try {
    const { id } = req.params;
    const operator = await User.findById(id);
    if (!operator || operator.role != "operator") {
      return res.status(404).json({ message: "Operator not found" });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Operator Deleted Successfully " });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCommuter = async (req, res) => {
  try {
    const { id } = req.params;
    const commuter = await User.findById(id);
    if (!commuter || commuter.role != "commuter") {
      return res.status(404).json({ message: "Commuter not found" });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "Commuter Deleted Successfully " });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
