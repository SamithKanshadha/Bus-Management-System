const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeNo: { type: String, required: true },
  startPoint: { type: String, required: true },
  endPoint: { type: String, required: true },
  buses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bus' }], 
  distance: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
