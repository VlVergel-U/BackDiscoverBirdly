import User from '../models/user.model.js';
import { generateHash, comparePswdAndHash } from '../utils/credentials.util.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { getEmailTemplate } from '../templates/email.templates.js';
import { sendEmail } from '../utils/email.util.js';

dotenv.config()

export async function login(req, res){
    
    const { username, password } = req.body;

    try {
        const searchUser = await User.findOne({ username });

        if (!searchUser) {
            return res.status(401).json({ error: "Incorrect credentials" });
        }

        if (comparePswdAndHash(password, searchUser.password)) {
            res.status(200).json({ message: "User authenticated" });
        } else {
            res.status(401).json({ error: "Incorrect credentials" });
        }
    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(500).send("Internal server error");
    }
}

export async function resetPassword(req, res){
    try {
        const { username } = req.params;
        const { password, password2 } = req.body;
  
        if (password !== password2) {
          return res.json({
            success: false,
            msg: 'Las contraseñas no coinciden'
          });
        }
  
        const user = await User.findOne({ username });
        const passwordHash = generateHash(password);
        user.setDataValue('password', passwordHash);
  
        await user.save();
        res.json({
          success: true,
          email: user.getDataValue('email'),
          msg: 'Las contraseñas se cambiaron correctamente'
        });
  
      } catch (error) {
        console.log('Error', error.message);
        res.json({
          success: false,
          msg: 'Error al enviar email'
        });
      }
    }

    export async function sendResetPasswordEmail(req, res){
        try {

            const { email } = req.params;
      
            const user = await User.findOne({email});
      
            if(!user) {
              return res.json({
                success: false,
                msg: 'El email es incorrecto'
              });
            }
      
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: {
                    username: user.username,
                },
            }, process.env.jwt_hash);
      
            const data = {
              nameUser: user.username,
              token: token
            }
      
            const emailHTMLTemplate = getEmailTemplate(data);
      
            await sendEmail(email, 'Recuperar contraseña', emailHTMLTemplate);
      
            res.json({
              success: true,
              email: email,
              token: token,
              msg: 'Email enviado correctamente!'
            });
            
          } catch (error) {
            console.log('Error', error.message);
            res.json({
              success: false,
              msg: 'Error al enviar email'
            });
          }

    }