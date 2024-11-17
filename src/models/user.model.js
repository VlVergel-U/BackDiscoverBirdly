import mongoose from 'mongoose';
const { Schema } = mongoose;

const user = new Schema({

    firstName: { 
      type: String, 
      required: true 
    },
    secondName: {
       type: String, 
       default: "" 
      }, 
    firstlastName: { 
      type: String, 
      required: true 
    },
    secondlastName: { 
      type: String, 
      default: "" 
    },  
    birth: { 
      type: Date, 
      required: true,
    },
    gender: { 
      type: String, 
      enum: ['Male', 'Female'], 
      required: true 
    },
    department: {
      type: Number,
      ref: 'Department',
      required: true
    },
    municipality: {
      type: Number,
      required: true
    },
    occupation: { 
      type: String, 
      enum: ['Teacher', 'Student'], 
      required: true 
    },
    username: { 
      type: String, 
      required: true, 
      unique: true,
      minlength: 8,
      validate: {
        validator: function(username) {
          return /^[a-zA-Z0-9]+$/.test(username);
        },
        message: 'Invalid username. Only letters and numbers are allowed.'
      }
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      validate: {
        validator: function(email) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        },
        message: 'Invalid email address'
      } 
    },  
    password: { 
      type: String, 
      required: true,
      validate: {
        validator: function(password) {
          return /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);
        },
        message: 'Invalid password. Password should be at least 8 characters long and contain only letters and numbers.'
      }
    }, 
    favorites: [{
        type: String,
        required: false,
        ref: 'Bird'
    }],
    createdAt: { 
      type: Date, 
      default: Date.now 
    },  
    updatedAt: { 
      type: Date, 
      default: Date.now 
    },  
    isActive: { 
      type: Boolean, 
      default: true 
    }  
    
  }, {
    timestamps: true,
    versionKey: false
  });

const User = mongoose.model('User', user);

export default User;