import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config()

const user = process.env.db_user;
const password = process.env.db_password;
const clusterName = process.env.db_clustername;
const dbName = process.env.db_bdname;

const uri = `mongodb+srv://${user}:${password}@${clusterName}.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const connectionbd = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (e) {
    console.log('Connection error', e);
  }
};

export default connectionbd;
