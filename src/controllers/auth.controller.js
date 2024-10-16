import User from '../models/user.model.js';
import { generateHash, comparePswdAndHash } from '../utils/credentials.util.js'

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
      
        const { token } = req.params;
        const { password, password2 } = req.body;
  
        const userPassword = await User.findOne({
          where: {
            token: token
          }
        });
  
        if (!userPassword) {
          return res.json({
            success: false,
            msg: 'Error: Debe enviar solicitud por correo'
          });
        }
  
        if(userPassword.getDataValue('isUsed') === true) {
          return res.json({
            success: false,
            msg: 'Error: el token ya se usó o expiró'
          });
        }
  
        if (password !== password2) {
          return res.json({
            success: false,
            msg: 'Las contraseñas no coinciden'
          });
        }
  
        userPassword.setDataValue('isUsed', true);
        await userPassword.save();
  
        const user = await User.findByPk(userPassword.getDataValue('userId'));
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
      
            const user = await User.findOne({
              where: {
                email: email
              }
            });
      
            if(!user) {
              return res.json({
                success: false,
                msg: 'El email es incorrecto'
              });
            }
      
            let userPassword = await UserPassword.findOne({
              where: {
                userId: user.getDataValue('id'),
                isUsed: false
              }
            });
      
            if (userPassword) {
              userPassword.setDataValue('isUsed', true);
              await userPassword.save();
            }
      
            const token = generateRandomString(16);
      
            userPassword = new UserPassword({
              userId: user.getDataValue('id'),
              email: email,
              token: token,
              is_used: false
            });
      
            const data = {
              email: email,
              token: token
            }
      
            const emailHTMLTemplate = getEmailTemplate(data);
      
            await sendEmail(email, 'Recuperar contraseña', emailHTMLTemplate);
            await userPassword.save();
      
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