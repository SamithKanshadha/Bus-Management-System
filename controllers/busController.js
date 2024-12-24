const Bus = require("../models/Bus");

exports.addBus = async (req, res) => {
  try {
    const { name, busNumber, capacity, features, operator, route, type  } =
      req.body;

    const bus = new Bus({
      name,
      busNumber,
      capacity,
      features,
      operator,
      route,
      type,
      
    });
    await bus.save();

    res.status(201).json({ message: "Bus added successfully.", bus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found." });
    }
    res.status(200).json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, busnumber, capacity, features, operator, route, type} =
      req.body;
    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found." });
    }

    if (name) bus.name = name;
    if (busnumber) bus.busnumber = busnumber;
    if (capacity) bus.capacity = capacity;
    if (features) bus.features = features;
    if (operator) bus.operator = operator;
    if (route) bus.route = route;
    if (type) bus.type = type;
    
    await bus.save();

    res.status(200).json({ message: "Bus details updated successfully." });
  } catch (err) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found." });
    }

    await Bus.findByIdAndDelete(id);
    res.status(200).json({ message: "Bus deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
