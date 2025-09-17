/**
 * College Basketball Programs Database
 * Weighted selection system for realistic player college backgrounds
 */

export interface College {
  name: string;
  weight: number; // Higher weight = more likely to be selected
  conference?: string;
}

// Top-tier programs (highest weight)
const TOP_TIER_COLLEGES: College[] = [
  { name: "Duke University", weight: 10, conference: "ACC" },
  { name: "University of Kentucky", weight: 10, conference: "SEC" },
  { name: "University of Connecticut", weight: 9, conference: "Big East" },
  { name: "University of Kansas", weight: 9, conference: "Big 12" },
  { name: "University of North Carolina", weight: 9, conference: "ACC" },
  { name: "Villanova University", weight: 8, conference: "Big East" },
  { name: "Gonzaga University", weight: 8, conference: "WCC" },
  { name: "University of California, Los Angeles", weight: 8, conference: "Pac-12" },
  { name: "Michigan State University", weight: 7, conference: "Big Ten" },
  { name: "University of Arizona", weight: 7, conference: "Pac-12" },
  { name: "University of Louisville", weight: 7, conference: "ACC" },
  { name: "Syracuse University", weight: 7, conference: "ACC" },
  { name: "University of Florida", weight: 7, conference: "SEC" },
  { name: "Indiana University", weight: 7, conference: "Big Ten" },
  { name: "University of Michigan", weight: 6, conference: "Big Ten" }
];

// High-tier programs (medium-high weight)
const HIGH_TIER_COLLEGES: College[] = [
  { name: "Baylor University", weight: 6, conference: "Big 12" },
  { name: "University of Virginia", weight: 6, conference: "ACC" },
  { name: "Texas Tech University", weight: 6, conference: "Big 12" },
  { name: "University of Houston", weight: 6, conference: "Big 12" },
  { name: "Purdue University", weight: 6, conference: "Big Ten" },
  { name: "University of Wisconsin", weight: 5, conference: "Big Ten" },
  { name: "University of Illinois", weight: 5, conference: "Big Ten" },
  { name: "Ohio State University", weight: 5, conference: "Big Ten" },
  { name: "University of Iowa", weight: 5, conference: "Big Ten" },
  { name: "University of Maryland", weight: 5, conference: "Big Ten" },
  { name: "University of Tennessee", weight: 5, conference: "SEC" },
  { name: "Auburn University", weight: 5, conference: "SEC" },
  { name: "University of Alabama", weight: 5, conference: "SEC" },
  { name: "Louisiana State University", weight: 5, conference: "SEC" },
  { name: "University of Arkansas", weight: 5, conference: "SEC" },
  { name: "Texas A&M University", weight: 5, conference: "SEC" },
  { name: "University of Georgia", weight: 4, conference: "SEC" },
  { name: "University of South Carolina", weight: 4, conference: "SEC" },
  { name: "Vanderbilt University", weight: 4, conference: "SEC" },
  { name: "University of Mississippi", weight: 4, conference: "SEC" },
  { name: "Wake Forest University", weight: 4, conference: "ACC" },
  { name: "Georgia Institute of Technology", weight: 4, conference: "ACC" },
  { name: "Florida State University", weight: 4, conference: "ACC" },
  { name: "Clemson University", weight: 4, conference: "ACC" },
  { name: "Virginia Tech", weight: 4, conference: "ACC" },
  { name: "University of Miami", weight: 4, conference: "ACC" },
  { name: "Boston College", weight: 4, conference: "ACC" },
  { name: "University of Pittsburgh", weight: 4, conference: "ACC" },
  { name: "Notre Dame University", weight: 4, conference: "ACC" },
  { name: "University of Texas", weight: 5, conference: "Big 12" },
  { name: "Texas Christian University", weight: 4, conference: "Big 12" },
  { name: "Oklahoma State University", weight: 4, conference: "Big 12" },
  { name: "University of Oklahoma", weight: 4, conference: "Big 12" },
  { name: "Iowa State University", weight: 4, conference: "Big 12" },
  { name: "Kansas State University", weight: 4, conference: "Big 12" },
  { name: "West Virginia University", weight: 4, conference: "Big 12" },
  { name: "University of Cincinnati", weight: 4, conference: "Big 12" },
  { name: "University of Central Florida", weight: 4, conference: "Big 12" },
  { name: "Brigham Young University", weight: 4, conference: "Big 12" }
];

// Mid-tier programs (medium weight)
const MID_TIER_COLLEGES: College[] = [
  { name: "Stanford University", weight: 4, conference: "Pac-12" },
  { name: "University of Oregon", weight: 4, conference: "Pac-12" },
  { name: "University of Southern California", weight: 4, conference: "Pac-12" },
  { name: "University of Colorado", weight: 3, conference: "Pac-12" },
  { name: "Arizona State University", weight: 3, conference: "Pac-12" },
  { name: "University of Utah", weight: 3, conference: "Pac-12" },
  { name: "University of Washington", weight: 3, conference: "Pac-12" },
  { name: "Washington State University", weight: 3, conference: "Pac-12" },
  { name: "Oregon State University", weight: 3, conference: "Pac-12" },
  { name: "University of California, Berkeley", weight: 3, conference: "Pac-12" },
  { name: "Creighton University", weight: 4, conference: "Big East" },
  { name: "Marquette University", weight: 4, conference: "Big East" },
  { name: "Providence College", weight: 3, conference: "Big East" },
  { name: "Seton Hall University", weight: 3, conference: "Big East" },
  { name: "St. John's University", weight: 3, conference: "Big East" },
  { name: "Xavier University", weight: 3, conference: "Big East" },
  { name: "Butler University", weight: 3, conference: "Big East" },
  { name: "Georgetown University", weight: 3, conference: "Big East" },
  { name: "DePaul University", weight: 2, conference: "Big East" },
  { name: "University of Memphis", weight: 4, conference: "AAC" },
  { name: "Temple University", weight: 3, conference: "AAC" },
  { name: "Southern Methodist University", weight: 3, conference: "AAC" },
  { name: "University of Tulsa", weight: 2, conference: "AAC" },
  { name: "East Carolina University", weight: 2, conference: "AAC" },
  { name: "Tulane University", weight: 2, conference: "AAC" },
  { name: "University of South Florida", weight: 2, conference: "AAC" },
  { name: "Wichita State University", weight: 3, conference: "AAC" },
  { name: "San Diego State University", weight: 4, conference: "Mountain West" },
  { name: "University of Nevada, Las Vegas", weight: 3, conference: "Mountain West" },
  { name: "Colorado State University", weight: 3, conference: "Mountain West" },
  { name: "Boise State University", weight: 3, conference: "Mountain West" },
  { name: "University of New Mexico", weight: 3, conference: "Mountain West" },
  { name: "Fresno State University", weight: 2, conference: "Mountain West" },
  { name: "University of Wyoming", weight: 2, conference: "Mountain West" },
  { name: "Utah State University", weight: 2, conference: "Mountain West" },
  { name: "Air Force Academy", weight: 2, conference: "Mountain West" },
  { name: "University of Nevada, Reno", weight: 2, conference: "Mountain West" },
  { name: "San Jose State University", weight: 2, conference: "Mountain West" }
];

// Lower-tier and mid-major programs (lower weight)
const LOWER_TIER_COLLEGES: College[] = [
  { name: "Saint Mary's College", weight: 3, conference: "WCC" },
  { name: "Loyola Marymount University", weight: 2, conference: "WCC" },
  { name: "University of San Francisco", weight: 2, conference: "WCC" },
  { name: "Santa Clara University", weight: 2, conference: "WCC" },
  { name: "Pepperdine University", weight: 2, conference: "WCC" },
  { name: "University of the Pacific", weight: 1, conference: "WCC" },
  { name: "Portland University", weight: 1, conference: "WCC" },
  { name: "Loyola Chicago", weight: 3, conference: "A-10" },
  { name: "Virginia Commonwealth University", weight: 3, conference: "A-10" },
  { name: "University of Dayton", weight: 3, conference: "A-10" },
  { name: "Saint Louis University", weight: 2, conference: "A-10" },
  { name: "University of Richmond", weight: 2, conference: "A-10" },
  { name: "George Mason University", weight: 2, conference: "A-10" },
  { name: "George Washington University", weight: 2, conference: "A-10" },
  { name: "Davidson College", weight: 2, conference: "A-10" },
  { name: "Fordham University", weight: 2, conference: "A-10" },
  { name: "La Salle University", weight: 1, conference: "A-10" },
  { name: "University of Massachusetts", weight: 2, conference: "A-10" },
  { name: "Rhode Island University", weight: 2, conference: "A-10" },
  { name: "St. Bonaventure University", weight: 2, conference: "A-10" },
  { name: "Duquesne University", weight: 1, conference: "A-10" },
  { name: "Murray State University", weight: 2, conference: "MVC" },
  { name: "Northern Iowa University", weight: 2, conference: "MVC" },
  { name: "Bradley University", weight: 1, conference: "MVC" },
  { name: "Drake University", weight: 1, conference: "MVC" },
  { name: "Illinois State University", weight: 1, conference: "MVC" },
  { name: "Indiana State University", weight: 1, conference: "MVC" },
  { name: "Loyola University Chicago", weight: 2, conference: "MVC" },
  { name: "Missouri State University", weight: 1, conference: "MVC" },
  { name: "Southern Illinois University", weight: 1, conference: "MVC" },
  { name: "University of Evansville", weight: 1, conference: "MVC" },
  { name: "Valparaiso University", weight: 1, conference: "MVC" },
  { name: "Belmont University", weight: 2, conference: "OVC" },
  { name: "Jacksonville State University", weight: 1, conference: "OVC" },
  { name: "Morehead State University", weight: 1, conference: "OVC" },
  { name: "Eastern Kentucky University", weight: 1, conference: "OVC" },
  { name: "Austin Peay State University", weight: 1, conference: "OVC" },
  { name: "Tennessee State University", weight: 1, conference: "OVC" },
  { name: "Tennessee Tech University", weight: 1, conference: "OVC" },
  { name: "University of Tennessee at Martin", weight: 1, conference: "OVC" },
  { name: "Southeast Missouri State University", weight: 1, conference: "OVC" },
  { name: "Southern Illinois University Edwardsville", weight: 1, conference: "OVC" },
  { name: "Eastern Illinois University", weight: 1, conference: "OVC" },
  { name: "Florida Atlantic University", weight: 2, conference: "C-USA" },
  { name: "Florida International University", weight: 2, conference: "C-USA" },
  { name: "Louisiana Tech University", weight: 2, conference: "C-USA" },
  { name: "Marshall University", weight: 2, conference: "C-USA" },
  { name: "Middle Tennessee State University", weight: 2, conference: "C-USA" },
  { name: "Old Dominion University", weight: 2, conference: "C-USA" },
  { name: "Rice University", weight: 1, conference: "C-USA" },
  { name: "University of Alabama at Birmingham", weight: 2, conference: "C-USA" },
  { name: "University of North Texas", weight: 2, conference: "C-USA" },
  { name: "University of Texas at El Paso", weight: 1, conference: "C-USA" },
  { name: "University of Texas at San Antonio", weight: 2, conference: "C-USA" },
  { name: "Western Kentucky University", weight: 2, conference: "C-USA" },
  { name: "Charlotte University", weight: 2, conference: "C-USA" },
  { name: "North Carolina State University", weight: 4, conference: "ACC" }
];

// Special categories for reference
export const SPECIAL_CATEGORIES = [
  "No College",
  "International"
];

// Combine all colleges
export const ALL_COLLEGES = [
  ...TOP_TIER_COLLEGES,
  ...HIGH_TIER_COLLEGES,
  ...MID_TIER_COLLEGES,
  ...LOWER_TIER_COLLEGES
];

// Create weighted selection array
export const createCollegeWeightedArray = (): string[] => {
  const weightedArray: string[] = [];
  
  // Add colleges based on their weights
  ALL_COLLEGES.forEach(college => {
    for (let i = 0; i < college.weight; i++) {
      weightedArray.push(college.name);
    }
  });
  
  // Add special categories
  // No College: 8% chance
  for (let i = 0; i < 15; i++) {
    weightedArray.push("No College");
  }
  
  // International: 12% chance
  for (let i = 0; i < 25; i++) {
    weightedArray.push("International");
  }
  
  return weightedArray;
};

// Get college by name for additional info
export const getCollegeInfo = (collegeName: string): College | null => {
  return ALL_COLLEGES.find(college => college.name === collegeName) || null;
};

// Get random college with weighting
export const getRandomCollege = (): string => {
  const weightedArray = createCollegeWeightedArray();
  const randomIndex = Math.floor(Math.random() * weightedArray.length);
  return weightedArray[randomIndex];
};