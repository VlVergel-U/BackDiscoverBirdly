import Hostpot from "../models/hostpot.model.js";

export async function createHostpots() {
  try {
    const hostpots = [
      { "_id": "L12704898", "lat": 7.4233895, "lon": -72.5426549, "location": "Aguas Calientes (Toledo)" },
      { "_id": "L10274890", "lat": 7.6338306, "lon": -72.7917514, "location": "Arboledas (area general)" },
      { "_id": "L15909231", "lat": 7.5871634, "lon": -72.9304996, "location": "Bagueche" },
      { "_id": "L7518509", "lat": 7.6008636, "lon": -72.605778, "location": "Cabaña La Trinidad" },
      { "_id": "L4351779", "lat": 7.9186249, "lon": -72.4899669, "location": "Canal Bogotá" },
      { "_id": "L4910114", "lat": 7.1387502, "lon": -72.6649368, "location": "Chitaga (pueblo)" },
      { "_id": "L27614953", "lat": 7.5832413, "lon": -72.6365627, "location": "Cordillera Country Club" },
      { "_id": "L33845761", "lat": 8.194106, "lon": -72.4936199, "location": "Corregimiento de la Buena Esperanza" },
      { "_id": "L18458408", "lat": 8.2136, "lon": -73.378993, "location": "Ecofinca Las Cayanas" },
      { "_id": "L4607041", "lat": 7.8636581, "lon": -72.5011933, "location": "Ecoparque San Rafael" },
      { "_id": "L22585325", "lat": 7.6021991, "lon": -72.9423859, "location": "Finca Bagueche" },
      { "_id": "L8137064", "lat": 7.6796532, "lon": -72.6525873, "location": "Finca San Carlos" },
      { "_id": "L12704171", "lat": 7.346427, "lon": -72.651731, "location": "Fontibón (Nepo)" },
      { "_id": "L22449142", "lat": 7.5943543, "lon": -72.6045734, "location": "Hotel Colonial" },
      { "_id": "L28250569", "lat": 8.483668, "lon": -72.620045, "location": "Humedal Las Garzas - Tibú" },
      { "_id": "L37265707", "lat": 8.298427, "lon": -72.469868, "location": "Humedal Los Cámbulos" },
      { "_id": "L11220475", "lat": 8.2526618, "lon": -73.36131, "location": "Humedal los Lagos, Ocaña" },
      { "_id": "L19051722", "lat": 8.234995, "lon": -73.3215215, "location": "Jardin botanico Jorge Enrique Quintero Arenas" },
      { "_id": "L18238929", "lat": 8.254472, "lon": -73.3162136, "location": "La Rinconada" },
      { "_id": "L21359488", "lat": 7.0102962, "lon": -72.6822452, "location": "Laguna Comagueta - finca el rincon de Comagueta" }
    ];

    await Hostpot.insertMany(hostpots);
    console.log('Hotspots creados con éxito');
  } catch (error) {
    console.error('Error al crear los hotspots:', error.message);
  }
}

export async function getHostpots(req, res) {

  const limit = parseInt(req.query.limit) || 0;
  const page = parseInt(req.query.page) || 0;
  const skip = (page - 1) * limit;

  try {
    const totalHostpots = await Hostpot.countDocuments();
    const totalPages = Math.ceil(totalHostpots / limit);

    const hostpots = await Hostpot.find()
      .sort({ location: 1 }) 
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.status(200).json({
      success: true,
      msg: "Hostpots obtenidos exitosamente",
      data: hostpots,
      pagination: {
        total: totalHostpots,
        limit: parseInt(limit),
        page: parseInt(page),
        totalPages
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los hostpots', error });
  }
}

