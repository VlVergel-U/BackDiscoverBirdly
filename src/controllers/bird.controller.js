import axios from 'axios';
import dotenv from 'dotenv'
import { GoogleGenerativeAI } from "@google/generative-ai";
import Bird from '../models/bird.model.js';
import * as cheerio from 'cheerio';
import Department from '../models/department.model.js';

dotenv.config()
const ebirdKey = process.env.token_ebird;
const geminiKey = process.env.gemini_key;
const googlemapsKey = process.env.api_google_maps;
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

  async function obtainDescriptionBird(name){
    try {
      const response = await axios.get(`https://api.catalogo.biodiversidad.co/record_search/advanced_search?scientificName=${encodeURIComponent(name)}`);
      const data = response.data.find(item => item.fullDescriptionApprovedInUse?.fullDescription.fullDescriptionUnstructured);

      if (data) {
        const description = data.fullDescriptionApprovedInUse?.fullDescription.fullDescriptionUnstructured;
        return description;
      }
    
    } catch (error) {
      console.warn(`Error fetching description data for ${name}:`, error.message);
    }
   }


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

  async function getCity(lat, lon) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googlemapsKey}`;
  
    try {
      const response = await axios.get(url);
      const results = response.data.results;
  
      if (results.length > 0) {
        const addressComponents = results[0].address_components;
        const cityComponent = addressComponents.find(component => 
          component.types.includes('locality') || component.types.includes('administrative_area_level_2')
        );
  
        return cityComponent ? cityComponent.long_name : null;
      }
  
      return null;
    } catch (error) {
      console.error('Error getting city from coordinates:', error);
      return null;
    }
  }
  
  export async function obtainBirds() {

    try {
      await Bird.deleteMany({});
  
      const response = await axios.get(`https://api.ebird.org/v2/data/obs/CO-NSA/recent?key=${encodeURIComponent(ebirdKey)}`);

      const birds = await Promise.all(response.data.map(async (bird) => {

        const data = await obtainPhotoBirdBio(bird.sciName)
        
        if (data) {

          const city = await getCity(bird.lat, bird.lng); 
          const description = await obtainDescriptionBird(bird.sciName);

          const departmentModel = await Department.findOne({ 'name': "Norte de Santander" });
          if (!departmentModel) {
            throw new Error(`Department not found: Norte de Santander`);
          } 
      
          const municipalityFind = departmentModel.municipalities.find(mun => mun.name.toLowerCase().trim() === city.toLowerCase().trim());
          if (!municipalityFind) {
            throw new Error(`Municipality not found: ${city} in department: "Norte de Santander"`);
          }

          const newBird = new Bird({
            _id: data.id,
            code: bird.speciesCode,
            name: data.name,
            specie: bird.sciName,
            url_photo: data.url,
            department: departmentModel._id,
            municipality: municipalityFind._id,
            description: description || "No hay descripción",
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
  

  export async function getBirds(req, res) {
    try {
      const birds = await Bird.find()
        .populate('department')
        .populate({ path: 'department', populate: { path: 'municipalities' } });
  
      if (birds.length === 0) {
        return res.status(404).json({ message: 'No hay aves creadas' });
      }
  
      const birdsWithMunicipality = birds.map(bird => {
        const municipality = bird.department.municipalities.find(m => m._id === bird.municipality);
        return {
          ...bird._doc,
          department: {
            _id: bird.department._id,
            name: bird.department.name,
            lon: bird.department.lon,
            lat: bird.department.lat
          },
          municipality
        };
      });
  
      res.status(200).json({
        success: true,
        msg: "Aves obtenidas exitosamente",
        data: birdsWithMunicipality
      });
    } catch (error) {
      console.error(error); // Opcional: Log para depuración
      return res.status(500).json({ message: 'Error obteniendo aves' });
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
