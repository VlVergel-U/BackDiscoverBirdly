import axios from 'axios';
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from "@google/generative-ai";
import Bird from '../models/bird.model.js';

dotenv.config()
const geminiKey = process.env.gemini_key;
const genAI = new GoogleGenerativeAI(geminiKey);

async function getDescription(birdName){

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hola necesito que te vuelvas experto en aves." }],
      },
      {
        role: "model",
        parts: [{ text: "Qué quieres saber?" }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  const msg = `Dame una descripción clara y concisa de la especie ${birdName}, incluyendo si es endémica, su alimentación, en qué ecosistema vive, y una descripción general. No preguntes nada más, solo responde esos datos en un parrafo`;

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  return text;

  };

  async function obtainPhotoBird(name){
    try {
      const response = await axios.get(`https://api.catalogo.biodiversidad.co/record_search/search?q=${encodeURIComponent(name)}`);
      const data = response.data.find(item => item.imageInfo?.mainImage);

      if (data?.imageInfo?.mainImage) {
        return data.imageInfo.mainImage;
      }
    } catch (biodiversityError) {
      console.warn(`Error fetching biodiversity data for ${name}:`, biodiversityError.message);
    }
  }

  export async function obtainBirds() {

    try {
      await Bird.deleteMany({});
  
      const response = await axios.get('https://www.inaturalist.org/observations.json?place_id=12738&taxon_id=3');

      const birds = await Promise.all(response.data.map(async (bird) => {

        const url = await obtainPhotoBird(bird.taxon?.name) || (bird.photos.length > 0 ? bird.photos[0].medium_url : 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png');
        
        const newBird = new Bird({
          _id: bird.id, 
          name: bird.taxon?.name, 
          specie: bird.species_guess || bird.taxon?.name, 
          url_photo: url,
          ubication: bird.place_guess
        });

        return newBird.save();
      }));
  
      const savedBirds = await Promise.all(birds); 
  
      console.log('Birds successfully updated');
  
    } catch (error) {
      console.error('Error getting birds:', error);
    }
  };
  

  export async function getBirds(req, res){

    try{

      const birds = await Bird.find()

      if (birds.length === 0) {
        return res.status(404).json({ message: 'No hay aves creadas' });
      }
  
      res.status(200).json({
        success: true,
        msg: "Aves obtenidas exitosamente",
        data: birds
      });
  

    }catch{
      throw res.status(500).json({ message: 'Error getting birds' }); 
    }



  };