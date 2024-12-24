const Schedule = require("../models/Schedule");
const Bus = require("../models/Bus");
const Route = require("../models/Route");


exports.createSchedule = async (req, res) => {
  try {
    const { routeId, busId, departureTime, arrivalTime, status , price } = req.body;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found." });
    }

    if (!route.buses.includes(busId.toString())) {
      return res
        .status(400)
        .json({ message: "Bus is not assigned to the provided route." });
    }

    const schedule = new Schedule({
      routeId,
      busId,
      departureTime,
      arrivalTime,
      status,
      price
    });
    await schedule.save();

    res
      .status(201)
      .json({ message: "Schedule created successfully.", schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("routeId")
      .populate("busId");
    res.status(200).json({ schedules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getSpecificSchedule = async (req, res) => {
  try {
    const { routeId } = req.params;
    const routeSchedules = await Schedule.find({ routeId })
      .populate("routeId")
      .populate("busId");
    res.status(200).json({ routeSchedules });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { busId, departureTime, arrivalTime, status ,price } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { busId, departureTime, arrivalTime, status },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found." });
    }

    res
      .status(200)
      .json({ message: "Schedule updated successfully.", schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await Schedule.findByIdAndDelete(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found." });
    }

    res.status(200).json({ message: "Schedule deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
