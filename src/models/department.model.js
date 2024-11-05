import mongoose from 'mongoose';
const { Schema } = mongoose;

const municipality = new Schema({
  _id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  }

}, { _id: false });

const department = new Schema({
  _id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  municipalities: [municipality],
}, {
  timestamps: false,
  versionKey: false,
});

const Department = mongoose.model('Department', department);

export default Department;
