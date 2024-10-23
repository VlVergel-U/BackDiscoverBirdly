import mongoose from 'mongoose';
const { Schema } = mongoose;

const bird = new Schema({

  _id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  specie: {
    type: String,
    required: true
  },
  url_photo: {
    type: String,
    required: true
  },
  ubication: { 
    type: String,
    required: true
  }
}, {
  timestamps: false,
  versionKey: false
});


const Bird = mongoose.model('Bird', bird);

export default Bird;