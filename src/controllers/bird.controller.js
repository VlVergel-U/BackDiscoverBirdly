import axios from 'axios';
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from "@google/generative-ai";
import Bird from '../models/bird.model.js';

dotenv.config()
const geminiKey = process.env.gemini_key;
const genAI = new GoogleGenerativeAI(geminiKey);

// export async function getData(req, res){

//   try {

//     const response = await axios.get('https://www.inaturalist.org/observations.json?place_id=12738&taxon_id=3');

//     const birdData = response.data.map(observation => ({
//       latitude: observation.latitude,
//       longitude: observation.longitude,
//       place_guess: observation.place_guess,
//       species_guess: observation.species_guess,
//       taxon: {
//         id: observation.taxon?.id,
//         name: observation.taxon?.name,
//         common_name: {
//           id: observation.taxon?.common_name?.id,
//           name: observation.taxon?.common_name?.name,
//         }
//       },
//       photos: observation.photos.length > 0 ? observation.photos.map(photo => ({
//         large_url: photo.large_url
//       })) : []
//     }));

//     return res.json(birdData);

//   } catch (error) {
//     console.error('Error al obtener o guardar los datos:', error);
//     return res.status(500).json({ message: 'Error al obtener los datos' });
//   }
// };



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

  export async function createBirds(req, res){

    try {
      const response = await axios.get('https://www.inaturalist.org/observations.json?place_id=12738&taxon_id=3');
  
      const birds = response.data.map(async (observation) => {

        const newBird = new Bird({
          _id: observation.id, 
          name: observation.taxon?.name, 
          specie: observation.species_guess, 
          url_photo: observation.photos.length > 0 ? observation.photos[0].large_url : 'foto no disponible', // Cambiado para incluir "foto no disponible"
          ubication: observation.place_guess
        });
  
        return newBird.save(); 
      });
  
      const savedBirds = await Promise.all(birds); 
  
      return res.status(201).json({
       message: "Birds created succesfully",
       data: savedBirds 
      }); 
  
    } catch (error) {
      return res.status(500).json({ message: 'Error creating birds' }); 
    }

  };