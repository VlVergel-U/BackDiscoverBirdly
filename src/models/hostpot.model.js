import mongoose from 'mongoose';
const { Schema } = mongoose;

const hostpot = new Schema({
  _id: {
    type: String,
    required: true
  },
  lon: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  location: { 
    type: String,
    required: true
  }
  
}, {
  timestamps: false,
  versionKey: false
});


const Hostpot = mongoose.model('Hostpot', hostpot);

export default Hostpot;