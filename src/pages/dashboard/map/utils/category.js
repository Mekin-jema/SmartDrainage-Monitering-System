import { 
  FaUtensils, FaHotel, FaShoppingCart, FaGasPump, FaTree, FaHospital, 
  FaUniversity, FaShoppingBag, FaBus, FaDumbbell, FaLandmark, FaBuilding, 
  FaBicycle, FaMosque, FaChurch, FaTheaterMasks, FaBook, FaCocktail, FaCar, 
  FaHome, FaBeer, FaClinicMedical, FaTrain, FaSubway, FaPlane, FaBriefcase 
} from "react-icons/fa";

const COLORS = {
  FOOD: 'rgba(192, 57, 43, 0.5)',         // Faded dark red
  LODGING: 'rgba(173, 20, 87, 0.5)',      // Faded dark pink
  SHOPPING: 'rgba(56, 142, 60, 0.5)',     // Faded dark green
  NATURE: 'rgba(0, 137, 123, 0.5)',       // Faded dark teal
  TRANSPORT: 'rgba(63, 81, 181, 0.5)',    // Faded indigo
  HEALTH: 'rgba(123, 31, 162, 0.5)',      // Faded dark purple
  EDUCATION: 'rgba(2, 136, 209, 0.5)',    // Faded dark blue
  FITNESS: 'rgba(230, 74, 25, 0.5)',      // Faded deep orange
  CULTURE: 'rgba(255, 160, 0, 0.5)',      // Faded amber
  RELIGION: 'rgba(103, 58, 183, 0.5)',    // Faded deep purple
  ENTERTAINMENT: 'rgba(216, 27, 96, 0.5)',// Faded pink
  BUSINESS: 'rgba(96, 125, 139, 0.5)',    // Faded blue grey
  RESIDENTIAL: 'rgba(124, 179, 66, 0.5)', // Faded light green
};


const categories = [
  {
    name: "Restaurants",
    tag: "amenity=restaurant",
    icon: "restaurant",
    IconComponent: FaUtensils,
    iconColor: COLORS.FOOD,
    textColor: COLORS.FOOD,
  },
  {
    name: "Hotels",
    tag: "tourism=hotel",
    icon: "hotel",
    IconComponent: FaHotel,
    iconColor: COLORS.LODGING,
    textColor: COLORS.LODGING,
  },
  {
    name: "Supermarkets",
    tag: "shop=supermarket",
    icon: "shopping-cart",
    IconComponent: FaShoppingCart,
    iconColor: COLORS.SHOPPING,
    textColor: COLORS.SHOPPING,
  },
  {
    name: "Parks",
    tag: "leisure=park",
    icon: "park",
    IconComponent: FaTree,
    iconColor: COLORS.NATURE,
    textColor: COLORS.NATURE,
  },
  {
    name: "Fuel Stations",
    tag: "amenity=fuel",
    icon: "local_gas_station",
    IconComponent: FaGasPump,
    iconColor: COLORS.TRANSPORT,
    textColor: COLORS.TRANSPORT,
  },
  {
    name: "Hospitals",
    tag: "amenity=hospital",
    icon: "local_hospital",
    IconComponent: FaHospital,
    iconColor: COLORS.HEALTH,
    textColor: COLORS.HEALTH,
  },
  {
    name: "Clinics",
    tag: "amenity=clinic",
    icon: "local_pharmacy",
    IconComponent: FaClinicMedical,
    iconColor: COLORS.HEALTH,
    textColor: COLORS.HEALTH,
  },
  {
    name: "Universities",
    tag: "amenity=university",
    icon: "school",
    IconComponent: FaUniversity,
    iconColor: COLORS.EDUCATION,
    textColor: COLORS.EDUCATION,
  },
  {
    name: "Bus Stations",
    tag: "public_transport=bus_station",
    icon: "bus",
    IconComponent: FaBus,
    iconColor: COLORS.TRANSPORT,
    textColor: COLORS.TRANSPORT,
  },
  {
    name: "Train Stations",
    tag: "railway=station",
    icon: "train",
    IconComponent: FaTrain,
    iconColor: COLORS.TRANSPORT,
    textColor: COLORS.TRANSPORT,
  },
  {
    name: "Subways",
    tag: "railway=subway",
    icon: "subway",
    IconComponent: FaSubway,
    iconColor: COLORS.TRANSPORT,
    textColor: COLORS.TRANSPORT,
  },
  {
    name: "Airports",
    tag: "aeroway=aerodrome",
    icon: "flight",
    IconComponent: FaPlane,
    iconColor: COLORS.TRANSPORT,
    textColor: COLORS.TRANSPORT,
  },
  {
    name: "Gyms & Fitness Centers",
    tag: "leisure=fitness_centre",
    icon: "fitness_center",
    IconComponent: FaDumbbell,
    iconColor: COLORS.FITNESS,
    textColor: COLORS.FITNESS,
  },
  {
    name: "Tourist Attractions",
    tag: "tourism=attraction",
    icon: "travel_explore",
    IconComponent: FaLandmark,
    iconColor: COLORS.CULTURE,
    textColor: COLORS.CULTURE,
  },
  {
    name: "Mosques",
    tag: "amenity=place_of_worship&religion=muslim",
    icon: "mosque",
    IconComponent: FaMosque,
    iconColor: COLORS.RELIGION,
    textColor: COLORS.RELIGION,
  },
  {
    name: "Churches",
    tag: "amenity=place_of_worship&religion=christian",
    icon: "church",
    IconComponent: FaChurch,
    iconColor: COLORS.RELIGION,
    textColor: COLORS.RELIGION,
  },
  {
    name: "Libraries",
    tag: "amenity=library",
    icon: "local_library",
    IconComponent: FaBook,
    iconColor: COLORS.EDUCATION,
    textColor: COLORS.EDUCATION,
  },
  {
    name: "Cinemas & Theaters",
    tag: "amenity=cinema",
    icon: "movie",
    IconComponent: FaTheaterMasks,
    iconColor: COLORS.ENTERTAINMENT,
    textColor: COLORS.ENTERTAINMENT,
  },
  {
    name: "Car Rentals",
    tag: "amenity=car_rental",
    icon: "car_rental",
    IconComponent: FaCar,
    iconColor: COLORS.TRANSPORT,
    textColor: COLORS.TRANSPORT,
  },
  {
    name: "Residential Areas",
    tag: "landuse=residential",
    icon: "home",
    IconComponent: FaHome,
    iconColor: COLORS.RESIDENTIAL,
    textColor: COLORS.RESIDENTIAL,
  },
  {
    name: "Business Centers",
    tag: "office=company",
    icon: "business_center",
    IconComponent: FaBriefcase,
    iconColor: COLORS.BUSINESS,
    textColor: COLORS.BUSINESS,
  },
];

export default categories;