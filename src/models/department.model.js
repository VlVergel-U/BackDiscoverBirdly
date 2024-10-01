import mongoose from 'mongoose';
const { Schema } = mongoose;

const municipalitySchema = new Schema({
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
  },
}, { _id: false });

const departmentSchema = new Schema({
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
  municipalities: [municipalitySchema],
}, {
  timestamps: false,
  versionKey: false,
});

const Department = mongoose.model('Department', departmentSchema);

export default Department;
