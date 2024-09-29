import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

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
    
    const { firstName, secondName, firstlastName, secondlastName, birth, gender, department, municipality, occupation, email, password} = req.body;

    if (!firstName || !firstlastName || !secondlastName || !birth || !gender || !department || !municipality || !occupation || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const passwordEncrypted = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({
            firstName,
            secondName,
            firstlastName,
            secondlastName,
            birth,
            gender,
            department,
            municipality,
            occupation,
            email,
            password: passwordEncrypted, 
        });

        await newUser.save(); 
        res.status(201).json({ message: "User created successfully.", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user.", error: error.message });
    }
};
