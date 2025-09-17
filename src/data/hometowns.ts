/**
 * Hometown Database for Basketball Players
 * Population-weighted selection system for realistic player origins
 */

export interface Hometown {
  city: string;
  state?: string; // For US cities
  country?: string; // For international cities
  population: number; // Used for weighting
  weight: number; // Calculated weight for selection
}

// Major US Cities (highest population, highest weight)
const MAJOR_US_CITIES: Hometown[] = [
  { city: "New York", state: "NY", population: 8400000, weight: 20 },
  { city: "Los Angeles", state: "CA", population: 4000000, weight: 18 },
  { city: "Chicago", state: "IL", population: 2700000, weight: 15 },
  { city: "Houston", state: "TX", population: 2300000, weight: 12 },
  { city: "Phoenix", state: "AZ", population: 1700000, weight: 10 },
  { city: "Philadelphia", state: "PA", population: 1600000, weight: 10 },
  { city: "San Antonio", state: "TX", population: 1500000, weight: 9 },
  { city: "San Diego", state: "CA", population: 1400000, weight: 9 },
  { city: "Dallas", state: "TX", population: 1300000, weight: 8 },
  { city: "San Jose", state: "CA", population: 1000000, weight: 7 },
  { city: "Austin", state: "TX", population: 980000, weight: 7 },
  { city: "Jacksonville", state: "FL", population: 950000, weight: 6 },
  { city: "Fort Worth", state: "TX", population: 920000, weight: 6 },
  { city: "Columbus", state: "OH", population: 900000, weight: 6 },
  { city: "Charlotte", state: "NC", population: 880000, weight: 6 },
  { city: "San Francisco", state: "CA", population: 870000, weight: 6 },
  { city: "Indianapolis", state: "IN", population: 860000, weight: 6 },
  { city: "Seattle", state: "WA", population: 750000, weight: 5 },
  { city: "Denver", state: "CO", population: 720000, weight: 5 },
  { city: "Washington", state: "DC", population: 700000, weight: 5 }
];

// Large US Cities (medium-high weight)
const LARGE_US_CITIES: Hometown[] = [
  { city: "Boston", state: "MA", population: 690000, weight: 5 },
  { city: "El Paso", state: "TX", population: 680000, weight: 4 },
  { city: "Detroit", state: "MI", population: 670000, weight: 5 },
  { city: "Nashville", state: "TN", population: 670000, weight: 4 },
  { city: "Portland", state: "OR", population: 650000, weight: 4 },
  { city: "Memphis", state: "TN", population: 650000, weight: 4 },
  { city: "Oklahoma City", state: "OK", population: 640000, weight: 4 },
  { city: "Las Vegas", state: "NV", population: 640000, weight: 4 },
  { city: "Louisville", state: "KY", population: 620000, weight: 4 },
  { city: "Baltimore", state: "MD", population: 590000, weight: 4 },
  { city: "Milwaukee", state: "WI", population: 590000, weight: 4 },
  { city: "Albuquerque", state: "NM", population: 560000, weight: 3 },
  { city: "Tucson", state: "AZ", population: 550000, weight: 3 },
  { city: "Fresno", state: "CA", population: 540000, weight: 3 },
  { city: "Sacramento", state: "CA", population: 520000, weight: 3 },
  { city: "Kansas City", state: "MO", population: 490000, weight: 3 },
  { city: "Mesa", state: "AZ", population: 500000, weight: 3 },
  { city: "Atlanta", state: "GA", population: 490000, weight: 4 },
  { city: "Colorado Springs", state: "CO", population: 480000, weight: 3 },
  { city: "Raleigh", state: "NC", population: 470000, weight: 3 },
  { city: "Omaha", state: "NE", population: 470000, weight: 3 },
  { city: "Miami", state: "FL", population: 460000, weight: 4 },
  { city: "Oakland", state: "CA", population: 430000, weight: 3 },
  { city: "Minneapolis", state: "MN", population: 430000, weight: 3 },
  { city: "Tulsa", state: "OK", population: 410000, weight: 3 },
  { city: "Cleveland", state: "OH", population: 380000, weight: 3 },
  { city: "Wichita", state: "KS", population: 390000, weight: 3 },
  { city: "Arlington", state: "TX", population: 390000, weight: 3 }
];

// Medium US Cities (medium weight)
const MEDIUM_US_CITIES: Hometown[] = [
  { city: "New Orleans", state: "LA", population: 390000, weight: 3 },
  { city: "Bakersfield", state: "CA", population: 380000, weight: 2 },
  { city: "Tampa", state: "FL", population: 380000, weight: 3 },
  { city: "Honolulu", state: "HI", population: 350000, weight: 2 },
  { city: "Aurora", state: "CO", population: 370000, weight: 2 },
  { city: "Anaheim", state: "CA", population: 350000, weight: 2 },
  { city: "Santa Ana", state: "CA", population: 330000, weight: 2 },
  { city: "St. Louis", state: "MO", population: 300000, weight: 3 },
  { city: "Riverside", state: "CA", population: 330000, weight: 2 },
  { city: "Corpus Christi", state: "TX", population: 320000, weight: 2 },
  { city: "Lexington", state: "KY", population: 320000, weight: 2 },
  { city: "Pittsburgh", state: "PA", population: 300000, weight: 3 },
  { city: "Anchorage", state: "AK", population: 290000, weight: 1 },
  { city: "Stockton", state: "CA", population: 310000, weight: 2 },
  { city: "Cincinnati", state: "OH", population: 300000, weight: 2 },
  { city: "St. Paul", state: "MN", population: 310000, weight: 2 },
  { city: "Toledo", state: "OH", population: 270000, weight: 2 },
  { city: "Newark", state: "NJ", population: 280000, weight: 2 },
  { city: "Greensboro", state: "NC", population: 290000, weight: 2 },
  { city: "Plano", state: "TX", population: 290000, weight: 2 },
  { city: "Henderson", state: "NV", population: 320000, weight: 2 },
  { city: "Lincoln", state: "NE", population: 290000, weight: 2 },
  { city: "Buffalo", state: "NY", population: 250000, weight: 2 },
  { city: "Jersey City", state: "NJ", population: 270000, weight: 2 },
  { city: "Chula Vista", state: "CA", population: 270000, weight: 2 },
  { city: "Fort Wayne", state: "IN", population: 270000, weight: 2 },
  { city: "Orlando", state: "FL", population: 280000, weight: 2 },
  { city: "St. Petersburg", state: "FL", population: 260000, weight: 2 },
  { city: "Chandler", state: "AZ", population: 260000, weight: 2 },
  { city: "Laredo", state: "TX", population: 260000, weight: 2 },
  { city: "Norfolk", state: "VA", population: 240000, weight: 2 },
  { city: "Durham", state: "NC", population: 280000, weight: 2 },
  { city: "Madison", state: "WI", population: 260000, weight: 2 },
  { city: "Lubbock", state: "TX", population: 250000, weight: 2 },
  { city: "Irvine", state: "CA", population: 280000, weight: 2 },
  { city: "Winston-Salem", state: "NC", population: 240000, weight: 2 },
  { city: "Glendale", state: "AZ", population: 250000, weight: 2 },
  { city: "Garland", state: "TX", population: 240000, weight: 2 },
  { city: "Hialeah", state: "FL", population: 230000, weight: 2 },
  { city: "Reno", state: "NV", population: 250000, weight: 2 },
  { city: "Chesapeake", state: "VA", population: 250000, weight: 2 },
  { city: "Gilbert", state: "AZ", population: 250000, weight: 2 },
  { city: "Baton Rouge", state: "LA", population: 220000, weight: 2 },
  { city: "Irving", state: "TX", population: 240000, weight: 2 },
  { city: "Scottsdale", state: "AZ", population: 260000, weight: 2 },
  { city: "North Las Vegas", state: "NV", population: 250000, weight: 2 },
  { city: "Fremont", state: "CA", population: 230000, weight: 2 },
  { city: "Boise", state: "ID", population: 230000, weight: 2 }
];

// Smaller US Cities (lower weight but still represented)
const SMALL_US_CITIES: Hometown[] = [
  { city: "Richmond", state: "VA", population: 230000, weight: 1 },
  { city: "San Bernardino", state: "CA", population: 220000, weight: 1 },
  { city: "Birmingham", state: "AL", population: 200000, weight: 1 },
  { city: "Spokane", state: "WA", population: 220000, weight: 1 },
  { city: "Rochester", state: "NY", population: 200000, weight: 1 },
  { city: "Des Moines", state: "IA", population: 210000, weight: 1 },
  { city: "Modesto", state: "CA", population: 220000, weight: 1 },
  { city: "Fayetteville", state: "NC", population: 210000, weight: 1 },
  { city: "Tacoma", state: "WA", population: 220000, weight: 1 },
  { city: "Oxnard", state: "CA", population: 210000, weight: 1 },
  { city: "Fontana", state: "CA", population: 210000, weight: 1 },
  { city: "Columbus", state: "GA", population: 200000, weight: 1 },
  { city: "Montgomery", state: "AL", population: 200000, weight: 1 },
  { city: "Shreveport", state: "LA", population: 180000, weight: 1 },
  { city: "Aurora", state: "IL", population: 200000, weight: 1 },
  { city: "Yonkers", state: "NY", population: 200000, weight: 1 },
  { city: "Akron", state: "OH", population: 190000, weight: 1 },
  { city: "Huntington Beach", state: "CA", population: 200000, weight: 1 },
  { city: "Little Rock", state: "AR", population: 200000, weight: 1 },
  { city: "Augusta", state: "GA", population: 200000, weight: 1 },
  { city: "Amarillo", state: "TX", population: 200000, weight: 1 },
  { city: "Glendale", state: "CA", population: 200000, weight: 1 },
  { city: "Mobile", state: "AL", population: 190000, weight: 1 },
  { city: "Grand Rapids", state: "MI", population: 200000, weight: 1 },
  { city: "Salt Lake City", state: "UT", population: 200000, weight: 2 },
  { city: "Tallahassee", state: "FL", population: 190000, weight: 1 },
  { city: "Huntsville", state: "AL", population: 200000, weight: 1 },
  { city: "Grand Prairie", state: "TX", population: 190000, weight: 1 },
  { city: "Knoxville", state: "TN", population: 190000, weight: 1 },
  { city: "Worcester", state: "MA", population: 190000, weight: 1 }
];

// International Cities (for international players)
const INTERNATIONAL_CITIES: Hometown[] = [
  { city: "Toronto", country: "Canada", population: 2930000, weight: 8 },
  { city: "Montreal", country: "Canada", population: 1780000, weight: 5 },
  { city: "Vancouver", country: "Canada", population: 675000, weight: 4 },
  { city: "Madrid", country: "Spain", population: 3200000, weight: 6 },
  { city: "Barcelona", country: "Spain", population: 1620000, weight: 5 },
  { city: "Paris", country: "France", population: 2160000, weight: 6 },
  { city: "Lyon", country: "France", population: 520000, weight: 3 },
  { city: "Melbourne", country: "Australia", population: 5080000, weight: 7 },
  { city: "Sydney", country: "Australia", population: 5310000, weight: 7 },
  { city: "Perth", country: "Australia", population: 2040000, weight: 4 },
  { city: "Berlin", country: "Germany", population: 3670000, weight: 5 },
  { city: "Munich", country: "Germany", population: 1480000, weight: 3 },
  { city: "Milan", country: "Italy", population: 1350000, weight: 4 },
  { city: "Rome", country: "Italy", population: 2870000, weight: 4 },
  { city: "Athens", country: "Greece", population: 3150000, weight: 4 },
  { city: "Belgrade", country: "Serbia", population: 1690000, weight: 4 },
  { city: "Zagreb", country: "Croatia", population: 790000, weight: 3 },
  { city: "Ljubljana", country: "Slovenia", population: 280000, weight: 2 },
  { city: "Vilnius", country: "Lithuania", population: 540000, weight: 3 },
  { city: "Riga", country: "Latvia", population: 630000, weight: 2 },
  { city: "Tel Aviv", country: "Israel", population: 460000, weight: 3 },
  { city: "Istanbul", country: "Turkey", population: 15460000, weight: 5 },
  { city: "Ankara", country: "Turkey", population: 5660000, weight: 3 },
  { city: "Moscow", country: "Russia", population: 12540000, weight: 4 },
  { city: "St. Petersburg", country: "Russia", population: 5380000, weight: 3 },
  { city: "Kiev", country: "Ukraine", population: 2960000, weight: 3 },
  { city: "Warsaw", country: "Poland", population: 1790000, weight: 3 },
  { city: "Prague", country: "Czech Republic", population: 1320000, weight: 3 },
  { city: "Budapest", country: "Hungary", population: 1750000, weight: 3 },
  { city: "Bucharest", country: "Romania", population: 1830000, weight: 2 },
  { city: "Lagos", country: "Nigeria", population: 14860000, weight: 4 },
  { city: "Dakar", country: "Senegal", population: 1030000, weight: 3 },
  { city: "Luanda", country: "Angola", population: 2570000, weight: 2 },
  { city: "São Paulo", country: "Brazil", population: 12330000, weight: 4 },
  { city: "Rio de Janeiro", country: "Brazil", population: 6750000, weight: 3 },
  { city: "Buenos Aires", country: "Argentina", population: 3080000, weight: 4 },
  { city: "Mexico City", country: "Mexico", population: 9210000, weight: 5 },
  { city: "Guadalajara", country: "Mexico", population: 1460000, weight: 3 },
  { city: "Monterrey", country: "Mexico", population: 1140000, weight: 2 },
  { city: "Santo Domingo", country: "Dominican Republic", population: 1030000, weight: 4 },
  { city: "San Juan", country: "Puerto Rico", population: 320000, weight: 3 },
  { city: "Havana", country: "Cuba", population: 2130000, weight: 2 },
  { city: "Kingston", country: "Jamaica", population: 590000, weight: 2 },
  { city: "Port-au-Prince", country: "Haiti", population: 1230000, weight: 2 }
];

// Combine all hometowns
export const ALL_HOMETOWNS = [
  ...MAJOR_US_CITIES,
  ...LARGE_US_CITIES,
  ...MEDIUM_US_CITIES,
  ...SMALL_US_CITIES,
  ...INTERNATIONAL_CITIES
];

// Create weighted selection array
export const createHometownWeightedArray = (): Hometown[] => {
  const weightedArray: Hometown[] = [];
  
  ALL_HOMETOWNS.forEach(hometown => {
    for (let i = 0; i < hometown.weight; i++) {
      weightedArray.push(hometown);
    }
  });
  
  return weightedArray;
};

// Get random hometown with population weighting
export const getRandomHometown = (): string => {
  const weightedArray = createHometownWeightedArray();
  const randomIndex = Math.floor(Math.random() * weightedArray.length);
  const selectedHometown = weightedArray[randomIndex];
  
  if (selectedHometown.state) {
    return `${selectedHometown.city}, ${selectedHometown.state}`;
  } else {
    return `${selectedHometown.city}, ${selectedHometown.country}`;
  }
};

// Get hometown info by formatted string
export const getHometownInfo = (hometownString: string): Hometown | null => {
  const [city, location] = hometownString.split(', ');
  return ALL_HOMETOWNS.find(hometown => 
    hometown.city === city && 
    (hometown.state === location || hometown.country === location)
  ) || null;
};

// Check if hometown is international
export const isInternationalHometown = (hometownString: string): boolean => {
  const hometownInfo = getHometownInfo(hometownString);
  return hometownInfo ? !!hometownInfo.country : false;
};