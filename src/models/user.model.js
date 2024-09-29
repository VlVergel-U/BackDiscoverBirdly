import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({

    firstName: { type: String, required: true },
    secondName: { type: String, default: "" }, 
    firstlastName: { type: String, required: true },
    secondlastName: { type: String, default: "" },  
    birth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    department: { type: String, required: true },
    municipality: { type: String, required: true },
    occupation: { type: String, enum: ['Teacher', 'Student'], required: true },
    email: { type: String, required: true, unique: true },  
    password: { type: String, required: true }, 
    createdAt: { type: Date, default: Date.now },  
    updatedAt: { type: Date, default: Date.now },  
    isActive: { type: Boolean, default: true }  
    
  }, {
    timestamps: true 
  });

const User = mongoose.model('User', userSchema);

export default User;