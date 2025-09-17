/**
 * Biographical Utilities for Basketball Players
 * Handles player bio generation, draft history, and display formatting
 */

import { PlayerBio, Player } from '../types/basketball';
import { getRandomCollege } from '../data/colleges';
import { getRandomHometown, isInternationalHometown } from '../data/hometowns';

/**
 * Calculate realistic draft year based on player age and current season
 */
export const calculateDraftYear = (age: number, currentSeason: number): number => {
  // Most players are drafted at ages 19-22 (college) or 18-25 (international)
  // Calculate when they would have been drafted based on current age
  const typicalDraftAge = Math.random() < 0.8 ? 
    Math.floor(Math.random() * 4) + 19 : // 19-22 for college players (80%)
    Math.floor(Math.random() * 8) + 18;  // 18-25 for international players (20%)
  
  const draftYear = currentSeason - (age - typicalDraftAge);
  
  // Ensure draft year is reasonable (not in the future, not too far in the past)
  return Math.max(1990, Math.min(currentSeason, draftYear));
};

/**
 * Generate draft round and pick based on player overall rating and age
 */
export const generateDraftInfo = (overall: number, age: number): { round: number | null, pick: number | null } => {
  // Higher overall players more likely to be drafted earlier
  // Younger players at draft time more likely to be drafted higher
  
  // 15% chance of being undrafted (especially for lower overall players)
  const undraftedChance = overall < 60 ? 0.25 : overall < 70 ? 0.15 : overall < 80 ? 0.08 : 0.03;
  
  if (Math.random() < undraftedChance) {
    return { round: null, pick: null };
  }
  
  // Calculate draft position based on overall rating
  let draftPosition: number;
  
  if (overall >= 85) {
    // Elite players: picks 1-15
    draftPosition = Math.floor(Math.random() * 15) + 1;
  } else if (overall >= 80) {
    // Very good players: picks 5-25
    draftPosition = Math.floor(Math.random() * 21) + 5;
  } else if (overall >= 75) {
    // Good players: picks 15-40
    draftPosition = Math.floor(Math.random() * 26) + 15;
  } else if (overall >= 70) {
    // Decent players: picks 25-55
    draftPosition = Math.floor(Math.random() * 31) + 25;
  } else {
    // Lower players: picks 35-60
    draftPosition = Math.floor(Math.random() * 26) + 35;
  }
  
  // Determine round based on pick
  const round = draftPosition <= 30 ? 1 : 2;
  
  return { round, pick: draftPosition };
};

/**
 * Generate realistic height based on player position
 */
export const generatePlayerHeight = (position: Player['position']): string => {
  // Height ranges in inches for each position (realistic NBA distributions)
  const heightRanges = {
    'PG': { min: 70, max: 78, common: [72, 73, 74, 75] }, // 5'10" - 6'6", common 6'0" - 6'3"
    'SG': { min: 72, max: 80, common: [74, 75, 76, 77, 78] }, // 6'0" - 6'8", common 6'2" - 6'6"
    'SF': { min: 76, max: 82, common: [78, 79, 80] }, // 6'4" - 6'10", common 6'6" - 6'8"
    'PF': { min: 79, max: 84, common: [80, 81, 82, 83] }, // 6'7" - 7'0", common 6'8" - 6'11"
    'C': { min: 81, max: 90, common: [82, 83, 84, 85, 86] } // 6'9" - 7'6", common 6'10" - 7'2"
  };

  const range = heightRanges[position];
  let heightInInches: number;

  // 70% chance to get a common height, 30% chance for full range
  if (Math.random() < 0.7 && range.common.length > 0) {
    heightInInches = range.common[Math.floor(Math.random() * range.common.length)];
  } else {
    heightInInches = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  }

  // Convert inches to feet and inches format
  const feet = Math.floor(heightInInches / 12);
  const inches = heightInInches % 12;
  return `${feet}'${inches}"`;
};

/**
 * Generate realistic weight based on height and position
 */
export const generatePlayerWeight = (height: string, position: Player['position']): number => {
  // Convert height string back to inches for calculation
  const heightMatch = height.match(/(\d+)'(\d+)"/);
  if (!heightMatch) return 200; // fallback
  
  const heightInInches = parseInt(heightMatch[1]) * 12 + parseInt(heightMatch[2]);
  
  // Base weight calculation using realistic athlete BMI (22-28)
  // Weight = BMI * (height in inches / 39.37)^2 * 2.205 (convert to pounds)
  const heightInMeters = heightInInches * 0.0254;
  const baseBMI = 24; // Athletic average
  const baseWeight = baseBMI * (heightInMeters * heightInMeters) * 2.205;

  // Position-based weight adjustments
  const positionMultipliers = {
    'PG': 0.85, // Guards tend to be leaner
    'SG': 0.90,
    'SF': 0.95,
    'PF': 1.05, // Forwards and centers tend to be heavier/more muscular
    'C': 1.10
  };

  const adjustedWeight = baseWeight * positionMultipliers[position];
  
  // Add some random variation (±15 pounds)
  const variation = (Math.random() - 0.5) * 30;
  const finalWeight = Math.round(adjustedWeight + variation);

  // Ensure reasonable bounds (160-350 lbs)
  return Math.max(160, Math.min(350, finalWeight));
};

/**
 * Generate complete player biographical information
 */
export const generatePlayerBio = (
  age: number, 
  position: Player['position'], 
  overall: number,
  currentSeason: number
): PlayerBio => {
  const hometown = getRandomHometown();
  const isInternational = isInternationalHometown(hometown);
  
  // Determine college based on hometown and other factors
  let college: string | null;
  
  if (isInternational) {
    // International players: 70% no college, 20% international, 10% US college
    const rand = Math.random();
    if (rand < 0.7) {
      college = "No College";
    } else if (rand < 0.9) {
      college = "International";
    } else {
      college = getRandomCollege();
      // If we got "No College" or "International" from the weighted selection, keep it
      if (college === "No College" || college === "International") {
        college = "International";
      }
    }
  } else {
    // US players: mostly go to college
    college = getRandomCollege();
    
    // Adjust based on overall rating - higher rated players more likely to have gone to top colleges
    if (overall >= 85 && (college === "No College" || college === "International")) {
      // Elite players rarely skip college entirely, re-roll
      college = getRandomCollege();
      while (college === "No College" || college === "International") {
        college = getRandomCollege();
      }
    }
  }
  
  const draftYear = calculateDraftYear(age, currentSeason);
  const { round, pick } = generateDraftInfo(overall, age);
  
  // Generate height and weight
  const height = generatePlayerHeight(position);
  const weight = generatePlayerWeight(height, position);
  
  return {
    college,
    hometown,
    draftYear,
    draftRound: round,
    draftPick: pick,
    height,
    weight
  };
};

/**
 * Format college display text
 */
export const formatCollegeDisplay = (college: string | null): string => {
  if (!college || college === "No College") {
    return "No College";
  }
  if (college === "International") {
    return "International";
  }
  return college;
};

/**
 * Format draft display text
 */
export const formatDraftDisplay = (bio: PlayerBio): string => {
  if (!bio.draftRound || !bio.draftPick) {
    return "Undrafted";
  }
  
  const roundText = bio.draftRound === 1 ? "1st" : "2nd";
  return `${bio.draftYear}, ${roundText} Round, Pick ${bio.draftPick}`;
};

/**
 * Get draft round color for UI display
 */
export const getDraftRoundColor = (round: number | null): string => {
  if (!round) return '#6B7280'; // Gray for undrafted
  if (round === 1) return '#F59E0B'; // Gold for 1st round
  return '#9CA3AF'; // Silver for 2nd round
};

/**
 * Get draft round background color for UI display
 */
export const getDraftRoundBgColor = (round: number | null): string => {
  if (!round) return '#F3F4F6'; // Light gray for undrafted
  if (round === 1) return '#FEF3C7'; // Light gold for 1st round
  return '#F9FAFB'; // Light silver for 2nd round
};

/**
 * Get college tier for display styling
 */
export const getCollegeTier = (college: string | null): 'elite' | 'high' | 'mid' | 'low' | 'none' => {
  if (!college || college === "No College") return 'none';
  if (college === "International") return 'mid';
  
  // Elite programs
  const elitePrograms = [
    "Duke University", "University of Kentucky", "University of Connecticut", 
    "University of Kansas", "University of North Carolina", "Villanova University",
    "Gonzaga University", "University of California, Los Angeles"
  ];
  
  if (elitePrograms.includes(college)) return 'elite';
  
  // High-tier programs (check if it contains "University" and is likely a major program)
  if (college.includes("University") || college.includes("State")) {
    return Math.random() > 0.5 ? 'high' : 'mid';
  }
  
  return 'mid';
};

/**
 * Get college tier color
 */
export const getCollegeTierColor = (tier: 'elite' | 'high' | 'mid' | 'low' | 'none'): string => {
  switch (tier) {
    case 'elite': return '#10B981'; // Green
    case 'high': return '#3B82F6';  // Blue
    case 'mid': return '#F59E0B';   // Orange
    case 'low': return '#EF4444';   // Red
    case 'none': return '#6B7280';  // Gray
  }
};

/**
 * Get college tier background color
 */
export const getCollegeTierBgColor = (tier: 'elite' | 'high' | 'mid' | 'low' | 'none'): string => {
  switch (tier) {
    case 'elite': return '#D1FAE5'; // Light green
    case 'high': return '#DBEAFE';  // Light blue
    case 'mid': return '#FEF3C7';   // Light orange
    case 'low': return '#FEE2E2';   // Light red
    case 'none': return '#F3F4F6';  // Light gray
  }
};

/**
 * Check if player is international based on bio
 */
export const isInternationalPlayer = (bio: PlayerBio): boolean => {
  return isInternationalHometown(bio.hometown) || bio.college === "International";
};

/**
 * Format height for display (already in correct format)
 */
export const formatHeightDisplay = (height: string): string => {
  return height; // Height is already in "6'8"" format
};

/**
 * Format weight for display
 */
export const formatWeightDisplay = (weight: number): string => {
  return `${weight} lbs`;
};

/**
 * Get BMI category for display styling (optional utility)
 */
export const getBMICategory = (height: string, weight: number): 'underweight' | 'normal' | 'overweight' | 'athletic' => {
  const heightMatch = height.match(/(\d+)'(\d+)"/);
  if (!heightMatch) return 'normal';
  
  const heightInInches = parseInt(heightMatch[1]) * 12 + parseInt(heightMatch[2]);
  const heightInMeters = heightInInches * 0.0254;
  const bmi = weight / 2.205 / (heightInMeters * heightInMeters);
  
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'athletic'; // For athletes, higher BMI is often muscle
  return 'overweight';
};

/**
 * Get hometown state/country abbreviation for compact display
 */
export const getHometownAbbreviation = (hometown: string): string => {
  const [, location] = hometown.split(', ');
  
  // US state abbreviations are already short
  if (location && location.length <= 3) {
    return location;
  }
  
  // Common country abbreviations
  const countryAbbreviations: Record<string, string> = {
    'Canada': 'CAN',
    'Spain': 'ESP',
    'France': 'FRA',
    'Australia': 'AUS',
    'Germany': 'GER',
    'Italy': 'ITA',
    'Greece': 'GRE',
    'Serbia': 'SRB',
    'Croatia': 'CRO',
    'Slovenia': 'SLO',
    'Lithuania': 'LTU',
    'Latvia': 'LAT',
    'Israel': 'ISR',
    'Turkey': 'TUR',
    'Russia': 'RUS',
    'Ukraine': 'UKR',
    'Poland': 'POL',
    'Czech Republic': 'CZE',
    'Hungary': 'HUN',
    'Romania': 'ROU',
    'Nigeria': 'NGR',
    'Senegal': 'SEN',
    'Angola': 'ANG',
    'Brazil': 'BRA',
    'Argentina': 'ARG',
    'Mexico': 'MEX',
    'Dominican Republic': 'DOM',
    'Puerto Rico': 'PUR',
    'Cuba': 'CUB',
    'Jamaica': 'JAM',
    'Haiti': 'HAI'
  };
  
  return countryAbbreviations[location] || location?.substring(0, 3).toUpperCase() || '';
};

/**
 * Generate bio for existing player (migration)
 */
export const generateBioForExistingPlayer = (
  player: Player,
  currentSeason: number
): PlayerBio => {
  return generatePlayerBio(player.age, player.position, player.overall, currentSeason);
};