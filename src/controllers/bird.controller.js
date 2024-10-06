import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config()
const apiKey = process.env.chatgptkey;

export async function getData(req, res){

  try {

    const response = await axios.get('https://www.inaturalist.org/observations.json?place_id=12738&taxon_id=3');

    const birdData = response.data.map(observation => ({
      latitude: observation.latitude,
      longitude: observation.longitude,
      place_guess: observation.place_guess,
      species_guess: observation.species_guess,
      taxon: {
        id: observation.taxon?.id,
        name: observation.taxon?.name,
        rank: observation.taxon?.rank,
        ancestry: observation.taxon?.ancestry,
        common_name: {
          id: observation.taxon?.common_name?.id,
          name: observation.taxon?.common_name?.name,
          is_valid: observation.taxon?.common_name?.is_valid,
          lexicon: observation.taxon?.common_name?.lexicon
        }
      },
      photos: observation.photos.length > 0 ? observation.photos.map(photo => ({
        large_url: photo.large_url
      })) : []
    }));

    res.status(200).json({
        success: true,
        msg: "Aves obtenidas exitosamente",
        data: birdData
    })

    // for (const bird of birdData) {
    //     const description = await getDescription(bird.taxon.name);
    //     console.log(`Descripción de ${bird.taxon.name}:`, description);
    //   }

    // console.log(getDescription("loro"));

  } catch (error) {
    console.error('Error al obtener o guardar los datos:', error);
  }
};


async function getDescription(birdName){
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5", 
          messages: [
            { role: "system", content: "Eres un experto en aves" },
            { role: "user", content: `Dame una descripción de esta ave ${birdName}, dandome en una lista, si es endemica, si esta en peligro de extincion, que come, de que ecosistema es y una descripcion en general.` }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      return response.data.choices[0].message.content;
  
    } catch (error) {
      console.error('Error al consultar ChatGPT:', error);
      return 'Descripción no disponible';
    }
  };

  export async function createBirds(birdData){



  };