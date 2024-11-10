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

  async function birdsJardinBotanico() {
    const data = {
      birds: [
        "Rupornis magnirostris",
        "Elanus leucurus",
        "Coragyps atratus",
        "Amazilia tzacatl",
        "Anthracothorax nigricollis",
        "Chordeiles acutipennis",
        "Vanellus chilensis",
        "Columbina talpacoti",
        "Zenaida auriculata",
        "Chloroceryle americana",
        "Crotophaga ani",
        "Piaya cayana",
        "Falco sparverius",
        "Milvago chimachima",
        "Piranga rubra",
        "Cyanocorax yncas",
        "Euphonia laniirostris",
        "Spinus xantogastrus",
        "Pygochelidon cyanoleuca",
        "Quiscalus lugubris",
        "Icterus nigrogularis",
        "Sturnella magna",
        "Mimus gilvus",
        "Setophaga petechia",
        "Mniotilta varia",
        "Parkesia noveboracensis",
        "Ramphocelus dimidiatus",
        "Saltator striatipectus",
        "Sicalis flaveola",
        "Sporophila nigricollis",
        "Stilpnia cayana",
        "Stilpnia cyanicollis",
        "Stilpnia cyanoptera",
        "Thraupis episcopus",
        "Sporophila crassirostris",
        "Schistochlamys melanopis",
        "Thraupis palmarum",
        "Cyanerpes cyaneus",
        "Saltator coerulescens",
        "Campylorhynchus griseus",
        "Turdus nudigenis",
        "Turdus flavipes",
        "Myiozetetes cayanensis",
        "Pyrocephalus rubinus",
        "Tyrannus melancholicus",
        "Myiodynastes maculatus",
        "Machetornis rixosa",
        "Elaenia flavogaster",
        "Pitangus sulphuratus",
        "Butorides striata",
        "Nycticorax nycticorax",
        "Melanerpes rubricapillus",
        "Picumnus olivaceus"
      ],
      coordenadas: {
        lat: 8.238487747456373,
        lon: -73.31935972679538
      }
    };
  
    return data;
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
  
      const jardinData = await birdsJardinBotanico();
  
      const birds = await Promise.all(response.data.map(async (bird) => {
  
        const data = await obtainPhotoBirdBio(bird.sciName);
  
        if (data) {
          const city = await getCity(bird.lat, bird.lng); 
          const description = await obtainDescriptionBird(bird.sciName);
  
          const departmentModel = await Department.findOne({ 'name': "Norte de Santander" });
          if (!departmentModel) {
            throw new Error(`Department not found: Norte de Santander`);
          }
  
          const municipalityModel = departmentModel.municipalities.find(mun => mun.name.toLowerCase().trim() === city.toLowerCase().trim());
          if (!municipalityModel) {
            throw new Error(`Municipality not found: ${city} in department: "Norte de Santander"`);
          }
  
          const municipalities = [
            {
              name: municipalityModel.name,
              places: [{
                lat: bird.lat,
                lon: bird.lng
              }]
            }
          ];
  
          if (jardinData.birds.includes(bird.sciName)) {
            if (municipalityModel.name.toLowerCase() === "ocaña") {
              municipalities[0].places.push({
                name: "Jardín Botánico UFPSO",
                lat: jardinData.coordenadas.lat,
                lon: jardinData.coordenadas.lon
              });
            } else {
              municipalities.push({
                name: "Ocaña",
                places: [{
                  name: "Jardín Botánico UFPSO",
                  lat: jardinData.coordenadas.lat,
                  lon: jardinData.coordenadas.lon
                }]
              });
            }
          }
  
          const newBird = new Bird({
            _id: data.id,
            code: bird.speciesCode,
            name: data.name,
            specie: bird.sciName,
            url_photo: data.url,
            department: departmentModel._id,
            municipality: municipalities,
            description: description || "No hay descripción disponible",
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
  }
  
  export async function getBirds(req, res) {
    try {
      const birds = await Bird.find()
        .sort({ name: 1 })
        .populate('department')
        .populate({ path: 'department', populate: { path: 'municipalities' } });
      
      if (birds.length === 0) {
        return res.status(404).json({ message: 'No hay aves creadas' });
      }
  
      const birdCountByMunicipality = await Bird.aggregate([
        { $unwind: "$municipality" },
        { 
          $group: {
            _id: "$municipality.name",
            birdCount: { $sum: 1 }
          }
        },
        {
          $project: {
            municipality: "$_id",
            birdCount: 1,
            _id: 0
          }
        }
      ]);
  
      const birdsWithMunicipality = birds.map(bird => {
        const municipality = bird.municipality.map(mun => {
          const departmentMunicipality = bird.department.municipalities.find(m => m.name === mun.name);
          
          if (!departmentMunicipality) return null;
  
          const birdCount = birdCountByMunicipality.find(count => count.municipality === mun.name)?.birdCount || 0;
  
          return {
            name: departmentMunicipality.name,
            birdCount: birdCount,
            places: mun.places.map(place => ({
              name: place.name,
              lat: place.lat,
              lon: place.lon
            }))
          };
        }).filter(mun => mun !== null);
  
        return {
          ...bird._doc,
          department: {
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
      console.error(error);
      return res.status(500).json({ message: 'Error obteniendo aves' });
    }
  };
  
  
  

  export async function getBird(req, res) {
    try {
      const { searchValue } = req.params;
      const response = await axios.get(`https://api.catalogo.biodiversidad.co/record_search/search?q=${encodeURIComponent(searchValue)}`);
      
      const birdsAPI = response.data.map(bird => bird._id);
      
      const birdsDb = await Bird.find({ _id: { $in: birdsAPI } })
        .populate('department')
        .populate({ path: 'department', populate: { path: 'municipalities' } });
  
      if (birdsDb.length === 0) {
        return res.status(404).json({ message: 'No hay aves coincidentes en la base de datos' });
      }
  
      const birdsWithMunicipality = birdsDb.map(bird => {
        const municipality = bird.municipality.map(mun => {
          const departmentMunicipality = bird.department.municipalities.find(m => m.name === mun.name);
  
          if (!departmentMunicipality) return null;
  
          return {
            name: departmentMunicipality.name,
            places: mun.places.map(place => ({
              name: place.name,
              lat: place.lat,
              lon: place.lon
            }))
          };
        }).filter(mun => mun !== null);
  
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
        msg: "Ave obtenida exitosamente",
        data: birdsWithMunicipality
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error obteniendo ave', error: error.message });
    }
  };


  export async function getBirdCountByMunicipality(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5;
        const skip = (page - 1) * pageSize;

        const result = await Bird.aggregate([
            { $unwind: "$municipality" },
            {
                $group: {
                    _id: "$municipality.name",
                    birdCount: { $sum: 1 }
                }
            },
            {
                $sort: { birdCount: -1 }
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            },
            {
                $project: {
                    municipality: "$_id",
                    birdCount: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener el conteo de aves por municipio",
            error: error.message
        });
    }
}



  
  