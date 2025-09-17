import { Team, Player } from '../types/basketball';
import { nameGenerator } from '../utils/nameGenerator';
import { generatePersonalityTraits } from '../utils/personalityUtils';
import { generatePlayerAttributes, calculateOverallRating } from '../utils/attributeUtils';
import { generatePlayerBio } from '../utils/bioUtils';
import { generateRandomStrategy } from '../utils/strategyUtils';

const generatePlayer = (position: Player['position'], age: number, targetOverall: number): Player => {
  // Generate attributes first, then calculate overall from them
  const attributes = generatePlayerAttributes(position, age, targetOverall);
  const overall = calculateOverallRating(attributes, position);
  const currentSeason = 2024;
  
  // Generate biographical information
  const bio = generatePlayerBio(age, position, overall, currentSeason);
  
  return {
    id: Math.random().toString(36).substring(2, 11),
    name: nameGenerator.generateUniqueName(),
    position,
    age,
    overall,
    contract: {
      salary: Math.floor(Math.random() * 40000000) + 5000000, // 5M to 45M
      years: Math.floor(Math.random() * 4) + 1 // 1 to 4 years
    },
    stats: {
      points: Math.floor(Math.random() * 25) + 5,
      rebounds: Math.floor(Math.random() * 12) + 2,
      assists: Math.floor(Math.random() * 10) + 1,
      steals: Math.floor(Math.random() * 3) + 0.5,
      blocks: Math.floor(Math.random() * 3) + 0.2
    },
    personality: generatePersonalityTraits(position, age, overall),
    attributes,
    bio
  };
};

const lakersRoster: Player[] = [
  generatePlayer("SF", 39, 96),
  generatePlayer("PF", 31, 94),
  generatePlayer("PG", 35, 85),
  generatePlayer("SG", 25, 78),
  generatePlayer("PF", 26, 76),
  generatePlayer("PG", 28, 82),
  generatePlayer("SF", 25, 74),
  generatePlayer("C", 28, 79),
  generatePlayer("PG", 27, 72),
  generatePlayer("SF", 30, 71),
  generatePlayer("SG", 25, 70),
  generatePlayer("SG", 21, 68)
];

const warriorsRoster: Player[] = [
  generatePlayer("PG", 36, 96),
  generatePlayer("SG", 34, 88),
  generatePlayer("PF", 34, 85),
  generatePlayer("SF", 29, 82),
  generatePlayer("PG", 39, 84),
  generatePlayer("SF", 21, 78),
  generatePlayer("SG", 22, 74),
  generatePlayer("C", 28, 76),
  generatePlayer("SG", 31, 73),
  generatePlayer("PG", 21, 71),
  generatePlayer("C", 24, 69),
  generatePlayer("PG", 33, 68)
];

const celticsRoster: Player[] = [
  generatePlayer("SF", 26, 95),
  generatePlayer("SG", 27, 91),
  generatePlayer("C", 28, 87),
  generatePlayer("PG", 29, 83),
  generatePlayer("PG", 34, 86),
  generatePlayer("C", 38, 81),
  generatePlayer("C", 26, 79),
  generatePlayer("PG", 31, 80),
  generatePlayer("PF", 25, 75),
  generatePlayer("PG", 26, 72),
  generatePlayer("SF", 26, 71),
  generatePlayer("C", 28, 69)
];

export const mockTeams: Team[] = [
  {
    id: "lakers",
    name: "Lakers",
    city: "Los Angeles",
    abbreviation: "LAL",
    colors: {
      primary: "#552583",
      secondary: "#FDB927"
    },
    roster: lakersRoster,
    salary: lakersRoster.reduce((sum, player) => sum + player.contract.salary, 0),
    wins: 35,
    losses: 25,
    strategy: generateRandomStrategy()
  },
  {
    id: "warriors",
    name: "Warriors",
    city: "Golden State",
    abbreviation: "GSW",
    colors: {
      primary: "#1D428A",
      secondary: "#FFC72C"
    },
    roster: warriorsRoster,
    salary: warriorsRoster.reduce((sum, player) => sum + player.contract.salary, 0),
    wins: 38,
    losses: 22,
    strategy: generateRandomStrategy()
  },
  {
    id: "celtics",
    name: "Celtics",
    city: "Boston",
    abbreviation: "BOS",
    colors: {
      primary: "#007A33",
      secondary: "#BA9653"
    },
    roster: celticsRoster,
    salary: celticsRoster.reduce((sum, player) => sum + player.contract.salary, 0),
    wins: 42,
    losses: 18,
    strategy: generateRandomStrategy()
  }
];

export const initializeGameData = () => {
  return {
    teams: mockTeams,
    currentTeam: mockTeams[0] // Default to Lakers
  };
};