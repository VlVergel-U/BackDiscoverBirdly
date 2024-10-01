const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bird = new Schema({

  _id: {
    type: Number,
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
  description: {
    type: String,
    required: true
  },
  ecosystem: {
    type: String,
    required: true
  },
  department: { 
    type: Schema.Types.ObjectId, 
    ref: 'Ubication', 
    required: true 
  }, 
  municipality: { 
    type: Schema.Types.ObjectId, 
    ref: 'Ubication', 
    required: true 
  }
});


const Bird = mongoose.model('Bird', bird);

export default Bird;