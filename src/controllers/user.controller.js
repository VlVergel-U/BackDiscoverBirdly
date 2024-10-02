import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import Department from '../models/department.model.js';

export async function createUser (req, res) {
    
    const { name, lastName, birth, gender, department, municipality, occupation, username, email, password} = req.body;

    if (!name || !lastName || !birth || !gender || !department || !municipality || !occupation || !username || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const passwordEncrypted = await bcrypt.hash(password, 10);

    const departmentModel = await Department.findOne({ 'name': department });
    if (!departmentModel) {
      throw new Error(`Department not found: ${department}`);
    } 

    const municipalityFind = departmentModel.municipalities.find(mun => mun.name === municipality);
    if (!municipalityFind) {
      throw new Error(`Municipality not found: ${municipality} in department: ${department}`);
    }

    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const secondName = nameParts.slice(1).join(' '); 

    const lastNameParts = lastName.split(' ');
    const firstlastName = lastNameParts[0]; 
    const secondlastName = lastNameParts.slice(1).join(' ');


    try {
        const user = new User({
            firstName,
            secondName,
            firstlastName,
            secondlastName,
            birth,
            gender,
            department: departmentModel._id,
            municipality: municipalityFind._id,
            occupation,
            username,
            email,
            password: passwordEncrypted, 
        });

        await User.collection.insertOne(user);
        res.status(201).json(
            { 
            message: "User created",
            data: user 
        }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};


export async function getAllUsers(req, res) {
    const users = await User.find()
      .populate('department')
      .populate({ path: 'department', populate: { path: 'municipalities' } });
  
    if (users.length === 0) {
      return res.status(404).json({ message: 'No hay usuarios creados' });
    }
  
    const usersWithMunicipality = users.map(user => {
      const municipality = user.department.municipalities.find(m => m._id === user.municipality);
      return {
        ...user._doc,
        department: {
          _id: user.department._id,
          name: user.department.name,
          lon: user.department.lon,
          lat: user.department.lat
        },
        municipality
      };
    });
  
    res.status(200).json({
      success: true,
      msg: "Usuarios obtenidos exitosamente",
      data: usersWithMunicipality
    });
  }

  export async function getUser(req, res) {
    
    const {username} = req.params

    const validateCreated = await User.find();

    if(validateCreated.length === 0){
        return res.status(404).json({ message: 'No hay usuarios creados' });
    }

    const user = await User.findOne({ username })
      .populate('department')
      .populate({ path: 'department', populate: { path: 'municipalities' } });
    
    if(!user){
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const municipality = user.department.municipalities.find(m => m._id === user.municipality);

    res.status(200).json({
        success: true,
        msg: "Usuario obtenido exitosamente",
        data: {
          ...user._doc,
          department: {
            _id: user.department._id,
            name: user.department.name,
            lon: user.department.lon,
            lat: user.department.lat
          },
          municipality
        }
    })
}

export async function updateUser(req, res) {
    const { username } = req.params;
    const { email, password, newUsername } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const updatedUser  = {};
    if (newUsername) updatedUser .username = newUsername;
    if (email) updatedUser .email = email;
    if (password) updatedUser .password = await bcrypt.hash(password, 10);

    try {
        await User.updateOne({ _id: user._id }, { $set: updatedUser  });
        res.status(200).json({
            success: true,
            msg: "Usuario actualizado exitosamente",
            data: updatedUser 
        });
    } catch (error) {
        console.error("Error actualizando usuario:", error);
        res.status(500).json({ message: "Error actualizando usuario", error: error.message });
    }
}

export async function deleteUser(req, res){

    const {username} = req.params;

    const validateCreated = await User.find();
 
    if(validateCreated.length === 0){
        return res.status(404).json({ message: 'No hay usuarios creados' });
    }

    const user = await User.findOne({ username });

    if(user.length === 0){
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await User.deleteOne({ username });

    res.status(200).json({
        sucess: true,
        msg: "Usuario eliminado exitosamente",
        data: user
    })

    
}