import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import Department from '../models/department.model.js';

export async function login(req, res){
    
    const { email, password } = req.body;

    try {
        const searchUser = await User.findOne({ email });

        if (!searchUser) {
            return res.status(401).json({ error: "Incorrect credentials" });
        }

        const comparePassword = await bcrypt.compare(password, searchUser.password);

        if (comparePassword) {
            res.status(200).json({ message: "User authenticated" });
        } else {
            res.status(401).json({ error: "Incorrect credentials" });
        }
    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(500).send("Internal server error");
    }
}



export async function register (req, res) {
    
    const { firstName, secondName, firstlastName, secondlastName, birth, gender, department, municipality, occupation, username, email, password} = req.body;

    if (!firstName || !firstlastName || !secondlastName || !birth || !gender || !department || !municipality || !occupation || !username || !email || !password) {
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

    try {
        const newUser = new User({
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

        await newUser.save(); 
        res.status(201).json({ message: "User created", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};
