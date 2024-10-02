import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

export async function login(req, res){
    
    const { username, password } = req.body;

    try {
        const searchUser = await User.findOne({ username });

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

