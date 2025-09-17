/**
 * League Generation Utilities for Basketball GM App
 * Creates new leagues with fresh teams, players, and configurations
 */

import { Team, Player } from '../types/basketball';
import { nameGenerator } from './nameGenerator';
import { generatePersonalityTraits } from './personalityUtils';
import { generatePlayerAttributes, calculateOverallRating } from './attributeUtils';
import { generatePlayerBio } from './bioUtils';
import { generateRandomStrategy } from './strategyUtils';

export interface LeagueConfig {
  leagueName: string;
  seasonLength: number;
  difficulty: 'easy' | 'normal' | 'hard';
  numberOfTeams: number;
}

// Predefined team templates with cities, names, colors, and abbreviations
const TEAM_TEMPLATES = [
  // Western Conference
  {
    city: "Los Angeles",
    name: "Storm",
    abbreviation: "LAS",
    colors: { primary: "#552583", secondary: "#FDB927" }
  },
  {
    city: "Golden State",
    name: "Thunder",
    abbreviation: "GST",
    colors: { primary: "#1D428A", secondary: "#FFC72C" }
  },
  {
    city: "Phoenix",
    name: "Blaze",
    abbreviation: "PHB",
    colors: { primary: "#E56020", secondary: "#1D1160" }
  },
  {
    city: "Denver",
    name: "Peaks",
    abbreviation: "DEN",
    colors: { primary: "#0E2240", secondary: "#FEC524" }
  },
  {
    city: "Portland",
    name: "Cascades",
    abbreviation: "POR",
    colors: { primary: "#E03A3E", secondary: "#000000" }
  },
  {
    city: "Seattle",
    name: "Emeralds",
    abbreviation: "SEA",
    colors: { primary: "#006747", secondary: "#FFC200" }
  },
  {
    city: "Sacramento",
    name: "Royals",
    abbreviation: "SAC",
    colors: { primary: "#5A2D81", secondary: "#63727A" }
  },
  {
    city: "San Antonio",
    name: "Stallions",
    abbreviation: "SAS",
    colors: { primary: "#C4CED4", secondary: "#000000" }
  },
  {
    city: "Houston",
    name: "Rockets",
    abbreviation: "HOU",
    colors: { primary: "#CE1141", secondary: "#000000" }
  },
  {
    city: "Dallas",
    name: "Mavericks",
    abbreviation: "DAL",
    colors: { primary: "#00538C", secondary: "#002F5F" }
  },
  {
    city: "Memphis",
    name: "Blues",
    abbreviation: "MEM",
    colors: { primary: "#5D76A9", secondary: "#12173F" }
  },
  {
    city: "New Orleans",
    name: "Jazz",
    abbreviation: "NOP",
    colors: { primary: "#0C2340", secondary: "#C8102E" }
  },
  {
    city: "Oklahoma City",
    name: "Storm",
    abbreviation: "OKC",
    colors: { primary: "#007AC1", secondary: "#EF3B24" }
  },
  {
    city: "Utah",
    name: "Mountains",
    abbreviation: "UTA",
    colors: { primary: "#002B5C", secondary: "#00471B" }
  },
  {
    city: "Minnesota",
    name: "Wolves",
    abbreviation: "MIN",
    colors: { primary: "#0C2340", secondary: "#236192" }
  },
  // Eastern Conference
  {
    city: "Boston",
    name: "Eagles",
    abbreviation: "BOS",
    colors: { primary: "#007A33", secondary: "#BA9653" }
  },
  {
    city: "Miami",
    name: "Heat",
    abbreviation: "MIA",
    colors: { primary: "#98002E", secondary: "#F9A01B" }
  },
  {
    city: "New York",
    name: "Titans",
    abbreviation: "NYK",
    colors: { primary: "#006BB6", secondary: "#F58426" }
  },
  {
    city: "Brooklyn",
    name: "Nets",
    abbreviation: "BKN",
    colors: { primary: "#000000", secondary: "#FFFFFF" }
  },
  {
    city: "Philadelphia",
    name: "Liberty",
    abbreviation: "PHI",
    colors: { primary: "#006BB6", secondary: "#ED174C" }
  },
  {
    city: "Toronto",
    name: "Raptors",
    abbreviation: "TOR",
    colors: { primary: "#CE1141", secondary: "#000000" }
  },
  {
    city: "Chicago",
    name: "Lightning",
    abbreviation: "CHI",
    colors: { primary: "#CE1141", secondary: "#000000" }
  },
  {
    city: "Milwaukee",
    name: "Bucks",
    abbreviation: "MIL",
    colors: { primary: "#00471B", secondary: "#EEE1C6" }
  },
  {
    city: "Indiana",
    name: "Pacers",
    abbreviation: "IND",
    colors: { primary: "#002D62", secondary: "#FDBB30" }
  },
  {
    city: "Detroit",
    name: "Motors",
    abbreviation: "DET",
    colors: { primary: "#C8102E", secondary: "#1D42BA" }
  },
  {
    city: "Cleveland",
    name: "Cavaliers",
    abbreviation: "CLE",
    colors: { primary: "#860038", secondary: "#FDBB30" }
  },
  {
    city: "Atlanta",
    name: "Hawks",
    abbreviation: "ATL",
    colors: { primary: "#E03A3E", secondary: "#C1D32F" }
  },
  {
    city: "Charlotte",
    name: "Hornets",
    abbreviation: "CHA",
    colors: { primary: "#1D1160", secondary: "#00788C" }
  },
  {
    city: "Washington",
    name: "Wizards",
    abbreviation: "WAS",
    colors: { primary: "#002B5C", secondary: "#E31837" }
  },
  {
    city: "Orlando",
    name: "Magic",
    abbreviation: "ORL",
    colors: { primary: "#0077C0", secondary: "#C4CED4" }
  }
];

/**
 * Generates a single player with realistic attributes
 */
const generatePlayer = (
  position: Player['position'], 
  ageRange: [number, number], 
  overallRange: [number, number],
  freshStart: boolean = false,
  currentSeason: number = 2024
): Player => {
  const age = Math.floor(Math.random() * (ageRange[1] - ageRange[0] + 1)) + ageRange[0];
  const overall = Math.floor(Math.random() * (overallRange[1] - overallRange[0] + 1)) + overallRange[0];
  
  // Salary based on overall rating and age
  const baseSalary = Math.floor(Math.random() * 35000000) + 5000000; // 5M to 40M
  const ageFactor = age < 25 ? 0.7 : age > 32 ? 0.8 : 1.0;
  const overallFactor = overall / 100;
  const salary = Math.floor(baseSalary * ageFactor * overallFactor);
  
  // Generate attributes first, then calculate overall from them
  const attributes = generatePlayerAttributes(position, age, overall);
  const calculatedOverall = calculateOverallRating(attributes, position);

  // Generate biographical information
  const bio = generatePlayerBio(age, position, calculatedOverall, currentSeason);

  return {
    id: Math.random().toString(36).substring(2, 11),
    name: nameGenerator.generateUniqueName(),
    position,
    age,
    overall: calculatedOverall,
    contract: {
      salary,
      years: Math.floor(Math.random() * 4) + 1 // 1 to 4 years
    },
    stats: freshStart ? {
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0
    } : {
      points: Math.floor(Math.random() * 20) + 5 + (calculatedOverall - 70) * 0.3,
      rebounds: Math.floor(Math.random() * 10) + 2 + (position === 'C' || position === 'PF' ? 3 : 0),
      assists: Math.floor(Math.random() * 8) + 1 + (position === 'PG' ? 4 : 0),
      steals: Math.random() * 2.5 + 0.5,
      blocks: Math.random() * 2.5 + 0.2 + (position === 'C' ? 1 : 0)
    },
    personality: generatePersonalityTraits(position, age, calculatedOverall),
    attributes,
    bio
  };
};

/**
 * Generates a balanced roster for a team
 */
const generateTeamRoster = (difficulty: LeagueConfig['difficulty'], freshStart: boolean = false, currentSeason: number = 2024): Player[] => {
  const roster: Player[] = [];
  
  // Define position requirements and skill ranges based on difficulty
  const positionRequirements = [
    { position: 'PG' as const, count: 2 },
    { position: 'SG' as const, count: 3 },
    { position: 'SF' as const, count: 3 },
    { position: 'PF' as const, count: 2 },
    { position: 'C' as const, count: 2 }
  ];
  
  // Adjust overall ranges based on difficulty
  let overallRange: [number, number];
  switch (difficulty) {
    case 'easy':
      overallRange = [65, 90]; // Higher overall players
      break;
    case 'hard':
      overallRange = [55, 85]; // Lower overall players
      break;
    default:
      overallRange = [60, 88]; // Balanced
  }
  
  // Generate players for each position
  positionRequirements.forEach(({ position, count }) => {
    for (let i = 0; i < count; i++) {
      const ageRange: [number, number] = [19, 36];
      const player = generatePlayer(position, ageRange, overallRange, freshStart, currentSeason);
      roster.push(player);
    }
  });
  
  return roster;
};

/**
 * Generates a complete team with roster and stats
 */
const generateTeam = (template: typeof TEAM_TEMPLATES[0], difficulty: LeagueConfig['difficulty'], freshStart: boolean = false, currentSeason: number = 2024): Team => {
  const roster = generateTeamRoster(difficulty, freshStart, currentSeason);
  const salary = roster.reduce((sum, player) => sum + player.contract.salary, 0);
  
  // Generate win/loss records - fresh start gets 0-0, otherwise realistic records
  let wins = 0;
  let losses = 0;
  
  if (!freshStart) {
    const totalGames = 60; // Assume 60 games played so far
    const teamStrength = roster.reduce((sum, p) => sum + p.overall, 0) / roster.length;
    const winProbability = (teamStrength - 50) / 50; // Convert to probability
    wins = Math.floor(Math.random() * 20) + Math.floor(totalGames * Math.max(0.2, Math.min(0.8, winProbability)));
    losses = totalGames - wins;
  }
  
  return {
    id: template.abbreviation.toLowerCase(),
    name: template.name,
    city: template.city,
    abbreviation: template.abbreviation,
    colors: template.colors,
    roster,
    salary,
    wins,
    losses,
    strategy: generateRandomStrategy()
  };
};

/**
 * Generates a complete league with specified number of teams
 */
export const generateLeague = (config: LeagueConfig, freshStart: boolean = true, currentSeason: number = 2024): Team[] => {
  // Reset name generator for fresh names
  nameGenerator.resetUsedNames();
  
  const teams: Team[] = [];
  const selectedTemplates = TEAM_TEMPLATES.slice(0, config.numberOfTeams);
  
  selectedTemplates.forEach(template => {
    const team = generateTeam(template, config.difficulty, freshStart, currentSeason);
    teams.push(team);
  });
  
  return teams;
};

/**
 * Validates league configuration
 */
export const validateLeagueConfig = (config: LeagueConfig): string[] => {
  const errors: string[] = [];
  
  if (!config.leagueName || config.leagueName.trim().length === 0) {
    errors.push('League name is required');
  }
  
  if (config.leagueName.length > 30) {
    errors.push('League name must be 30 characters or less');
  }
  
  if (config.seasonLength < 10 || config.seasonLength > 50) {
    errors.push('Season length must be between 10 and 50 weeks');
  }
  
  if (!['easy', 'normal', 'hard'].includes(config.difficulty)) {
    errors.push('Invalid difficulty level');
  }
  
  if (config.numberOfTeams < 2 || config.numberOfTeams > TEAM_TEMPLATES.length) {
    errors.push(`Number of teams must be between 2 and ${TEAM_TEMPLATES.length}`);
  }
  
  return errors;
};



/**
 * Calculates league statistics
 */
export const calculateLeagueStats = (teams: Team[]) => {
  const totalPlayers = teams.reduce((sum, team) => sum + team.roster.length, 0);
  const averageOverall = teams.reduce((sum, team) => {
    const teamAvg = team.roster.reduce((tSum, player) => tSum + player.overall, 0) / team.roster.length;
    return sum + teamAvg;
  }, 0) / teams.length;
  
  const totalSalary = teams.reduce((sum, team) => sum + team.salary, 0);
  const averageSalary = totalSalary / teams.length;
  
  return {
    totalTeams: teams.length,
    totalPlayers,
    averageOverall: Math.round(averageOverall),
    totalSalary,
    averageSalary,
    averageRosterSize: Math.round(totalPlayers / teams.length)
  };
};

/**
 * Gets available team templates for league creation
 */
export const getAvailableTeamTemplates = () => TEAM_TEMPLATES;

export default {
  generateLeague,
  validateLeagueConfig,
  getAvailableTeamTemplates,
  calculateLeagueStats
};