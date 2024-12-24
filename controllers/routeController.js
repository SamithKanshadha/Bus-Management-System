const Route = require("../models/Route");
const Bus = require("../models/Bus");

exports.addRoute = async (req, res) => {
  try {
    const { routeNo ,busNumber,  startPoint, endPoint, buses ,distance  } = req.body;

    const route = new Route({ routeNo ,busNumber,  startPoint, endPoint, buses ,distance });
    await route.save();

    res.status(201).json({ message: "Route added successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { routeNo ,busNumber,  startPoint, endPoint, buses ,distance } = req.body;
    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    if (routeNo) route.routeNo = routeNo;
    if (startPoint) route.startPoint = startPoint;
    if (endPoint) route.endPoint = endPoint;
    if (buses) route.buses = buses;
    if (distance) route.distance = distance;

    await route.save();

    res.status(200).json({ message: "Route updated successfully.", route });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    for (const busId of route.buses) {
      await exports.deleteAssignedBus(busId);
    }

    await Route.findByIdAndDelete(id);

    res.status(200).json({ message: "Route deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAssignedBus = async (req, res) => {
  try {
    const { routeId, busId } = req.body;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found." });
    }

    if (route.buses.includes(busId)) {
      route.buses = route.buses.filter(
        (assignedBusId) => assignedBusId.toString() !== busId
      );
      await route.save();

      bus.route = null;
      await bus.save();

      return res.status(200).json({ message: "Bus removed from route successfully." });
    } else {
      return res.status(400).json({ message: "Bus is not assigned to this route." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Assign a bus to a route
exports.assignBusToRoute = async (req, res) => {
  try {
    const { routeId, busId } = req.body;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found." });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found." });
    }

      bus.route = routeId;
      await bus.save();
  
      route.buses.push(busId);
      await route.save();
  
      res
        .status(200)
        .json({ message: "Bus assigned to route successfully.", route, bus });
    

   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
