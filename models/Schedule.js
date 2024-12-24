const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true,
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  departureTime: {
    type: Date,
    required: true,
  },
  arrivalTime: {
    type: Date,
    required: true,
  },
  price:{
    type : Number,
    required:true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Cancelled', 'Completed'],
    default: 'Scheduled',
  },
});

module.exports = mongoose.model('Schedule', scheduleSchema);
