import Department from "../models/department.model.js"; 

export async function createDepartment() {
  try {

    const departmentExists = await Department.findOne({ "_id": 54 });

    if (departmentExists) {
      console.log('Data about departments and municipalities already in db');
      return;
    }

    const department = new Department({
      _id: 54,
      name: "Norte de Santander",
      lat: 8,
      lon: -73,
      municipalities: [
        {
          _id: 54051,
          name: "Arboledas",
          lat: 7.6666667,
          lon: -72.75,
        },
        {
          _id: 54099,
          name: "Bochalema",
          lat: 7.6666667,
          lon: -72.5833333,
        },
        {
          _id: 54109,
          name: "Bucarasica",
          lat: 8.0833333,
          lon: -73,
        },
        {
          _id: 54172,
          name: "Chinácota",
          lat: 7.75,
          lon: -72.55,
        },
        {
          _id: 54174,
          name: "Chitagá",
          lat: 7.1666667,
          lon: -72.5833333,
        },
        {
          _id: 54206,
          name: "Convención",
          lat: 8.8333333,
          lon: -73.2,
        },
        {
          _id: 54223,
          name: "Cucutilla",
          lat: 7.5,
          lon: -72.75,
        },
        {
          _id: 54128,
          name: "Cáchira",
          lat: 7.75,
          lon: -73.1666667,
        },
        {
          _id: 54125,
          name: "Cácota",
          lat: 7.25,
          lon: -72.5833333,
        },
        {
          _id: 54001,
          name: "Cúcuta",
          lat: 7.8833333,
          lon: -72.5052778,
        },
        {
          _id: 54239,
          name: "Durania",
          lat: 7.75,
          lon: -72.6333333,
        },
        {
          _id: 54245,
          name: "El Carmen",
          lat: 8.75,
          lon: -73.3333333,
        },
        {
          _id: 54250,
          name: "El Tarra",
          lat: 8.5847222,
          lon: -73.0883333,
        },
        {
          _id: 54261,
          name: "El Zulia",
          lat: 7.9355556,
          lon: -72.605,
        },
        {
          _id: 54313,
          name: "Gramalote",
          lat: 7.9166667,
          lon: -72.75,
        },
        {
          _id: 54344,
          name: "Hacarí",
          lat: 8.5,
          lon: -73.0833333,
        },
        {
          _id: 54347,
          name: "Herrán",
          lat: 7.5,
          lon: -72.4666667,
        },
        {
          _id: 54385,
          name: "La Esperanza",
          lat: 8.1666667,
          lon: -72.4666667,
        },
        {
          _id: 54398,
          name: "La Playa",
          lat: 8.25,
          lon: -73.1666667,
        },
        {
          _id: 54377,
          name: "Labateca",
          lat: 7.3333333,
          lon: -72.5,
        },
        {
          _id: 54405,
          name: "Los Patios",
          lat: 7.8383333,
          lon: -72.5133333,
        },
        {
          _id: 54418,
          name: "Lourdes",
          lat: 7.9666667,
          lon: -72.8333333,
        },
        {
          _id: 54480,
          name: "Mutiscua",
          lat: 7.3333333,
          lon: -72.7166667,
        },
        {
          _id: 54498,
          name: "Ocaña",
          lat: 8.25,
          lon: -73.3,
        },
        {
          _id: 54518,
          name: "Pamplona",
          lat: 7.3780556,
          lon: -72.6525,
        },
        {
          _id: 54520,
          name: "Pamplonita",
          lat: 7.5,
          lon: -72.5833333,
        },
        {
          _id: 54553,
          name: "Puerto Santander",
          lat: 8.3636111,
          lon: -72.4075,
        },
        {
          _id: 54599,
          name: "Ragonvalia",
          lat: 7.5833333,
          lon: -72.5,
        },
        {
          _id: 54660,
          name: "Salazar",
          lat: 7.8,
          lon: -72.8333333,
        },
        {
          _id: 54670,
          name: "San Calixto",
          lat: 8.75,
          lon: -73.0333333,
        },
        {
          _id: 54673,
          name: "San Cayetano",
          lat: 7.8833333,
          lon: -72.5833333,
        },
        {
          _id: 54680,
          name: "Santiago",
          lat: 7.9166667,
          lon: -72.6666667,
        },
        {
          _id: 54720,
          name: "Sardinata",
          lat: 8.25,
          lon: -72.75,
        },
        {
          _id: 54743,
          name: "Silos",
          lat: 7.2,
          lon: -72.75,
        },
        {
          _id: 54800,
          name: "Teorama",
          lat: 8.75,
          lon: -73.1666667,
        },
        {
          _id: 54810,
          name: "Tibú",
          lat: 8.6480556,
          lon: -72.7394444,
        },
        {
          _id: 54820,
          name: "Toledo",
          lat: 7.3,
          lon: -72.25,
        },
        {
          _id: 54871,
          name: "Villa Caro",
          lat: 7.9169444,
          lon: -72.9763889,
        },
        {
          _id: 54003,
          name: "Ábrego",
          lat: 8,
          lon: -73.2,
        },
      ],
    });

    await department.save();
    console.log('Departamento creada con éxito:', department);
  } catch (error) {
    console.error('Error al crear el departamento:', error.message);
  }
}


export async function getDepartments(req, res){

  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los departamentos', error });
  }
};