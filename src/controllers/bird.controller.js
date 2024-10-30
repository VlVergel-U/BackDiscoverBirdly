import axios from 'axios';
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from "@google/generative-ai";
import Bird from '../models/bird.model.js';
import * as cheerio from 'cheerio';

dotenv.config()
const ebirdKey = process.env.token_ebird;
const geminiKey = process.env.gemini_key;
const genAI = new GoogleGenerativeAI(geminiKey);

// async function getDescription(birdName){

//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
//   const chat = model.startChat({
//     history: [
//       {
//         role: "user",
//         parts: [{ text: "Hola necesito que te vuelvas experto en aves." }],
//       },
//       {
//         role: "model",
//         parts: [{ text: "Qué quieres saber?" }],
//       },
//     ],
//     generationConfig: {
//       maxOutputTokens: 100,
//     },
//   });

//   const msg = `Dame una descripción clara y concisa de la especie ${birdName}, incluyendo si es endémica, su alimentación, en qué ecosistema vive, y una descripción general. No preguntes nada más, solo responde esos datos en un parrafo`;

//   const result = await chat.sendMessage(msg);
//   const response = await result.response;
//   const text = response.text();
//   return text;

//   };

  // async function obtainDescriptionBird(){
  //   try {
  //     const response = await axios.get("https://ebird.org/species/lobsta1", {
  //       maxRedirects: 0
  //     });
  //     const html = response.data;
  //     const $ = cheerio.load(html);
  
  //     const info = $('.Species-identification-text p').text().trim();
  
  //     console.log(info);
  //   } catch (error) {
  //     console.error('Error fetching the page:', error);
  //   }
  // }


  async function obtainPhotoBirdBio(name){
    try {
      const response = await axios.get(`https://api.catalogo.biodiversidad.co/record_search/search?q=${encodeURIComponent(name)}`);
      const data = response.data.find(item => item.imageInfo?.mainImage);

      if (data) {
        const url = data.imageInfo.mainImage;
        const name = data.commonNames && data.commonNames.length > 0 ? data.commonNames[0].name : null;
        const id = data._id;
        return { url, name, id };
      }
    
    } catch (error) {
      console.warn(`Error fetching biodiversity data for ${name}:`, error.message);
        await obtainPhotoBirdInaturalist(name);

    }
  }

  async function obtainPhotoBirdInaturalist(name){
    try {
      const response = await axios.get(`https://api.inaturalist.org/v1/observations?taxon_name=${encodeURIComponent(name)}`);
      const results = response.data.results;
      const data = results.find(item => item.taxon.default_photo.url);
      if (data?.taxon.default_photo.url) {
        return data.taxon.default_photo.url;
      }
    } catch (error) {
      console.warn(`Error fetching inaturalist data for ${name}:`, error.message);
    }
  }

  export async function obtainBirds() {

    try {
      await Bird.deleteMany({});
  
      const response = await axios.get(`https://api.ebird.org/v2/data/obs/CO-NSA/recent?key=${encodeURIComponent(ebirdKey)}`);
      // const descripción = await obtainDescriptionBird()
      // console.log(descripción)
      const birds = await Promise.all(response.data.map(async (bird) => {

        const data = await obtainPhotoBirdBio(bird.sciName)
        
        if (data) {
          const newBird = new Bird({
            _id: data.id,
            code: bird.speciesCode,
            name: data.name,
            specie: bird.sciName,
            url_photo: data.url,
            ubication: bird.locName,
            description: "hola",
          });
  
          return newBird.save();
        }
        return null;
      }));
  
      const savedBirds = birds.filter(bird => bird !== null);
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


  export async function getBird(req, res){

    try{
      const { searchValue } = req.params;
      const response = await axios.get(`https://api.catalogo.biodiversidad.co/record_search/search?q=${encodeURIComponent(searchValue)}`);

      const birdsAPI = response.data.map(bird => bird._id);
          
      const birdsDb = await Bird.aggregate([
        {
          $match: {
            _id: { $in: birdsAPI },
          }
        }
      ]);

      if (birdsDb.length === 0) {
        return res.status(404).json({ message: 'No hay aves coincidentes en la base de datos' });
      }

      res.status(200).json({
        success: true,
        msg: "Aves obtenidas exitosamente",
        data: birdsDb
      });

    } catch (error) {
      return res.status(500).json({ message: 'Error getting birds', error: error.message }); 
    }

  };