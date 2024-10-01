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
      required: true 
    },
    gender: { 
      type: String, 
      enum: ['Male', 'Female'], 
      required: true 
    },
    department: {
      type: Number,
      ref: 'Ubication.departments',
      required: true
    },
    municipality: {
      type: Number,
      ref: 'Ubication.departments.municipalities',
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
      unique: true 
    }, 
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },  
    password: { 
      type: String, 
      required: true 
    }, 
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