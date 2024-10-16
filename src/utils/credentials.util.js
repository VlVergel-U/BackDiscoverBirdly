import bcrypt from 'bcrypt';

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

export const generateHash = (text) => {
  return bcrypt.hashSync(text, salt);
}

export const comparePswdAndHash = (text, hash) => {
  return bcrypt.compareSync(text, hash);
}

