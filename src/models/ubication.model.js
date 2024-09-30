const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const municipality = new Schema({

  _id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  }
});

const department = new Schema({

  _id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  lon: {
    type: Number,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  municipalities: [municipality] 
});

const ubication = new Schema ({

    departments: [department]

});

const Ubication = mongoose.model('Ubication', ubication);

export default Ubication;