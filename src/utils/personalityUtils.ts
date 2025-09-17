/**
 * Personality Utilities for Basketball GM App
 * Handles personality trait calculations, generation, and labeling
 */

import { PlayerPersonality, Player } from '../types/basketball';

export type PersonalityLabel = 'Diva' | 'Mercurial' | 'Neutral' | 'Pro' | 'Leader';

/**
 * Calculate personality score based on the formula:
 * 0.25×Agreeableness + 0.20×Professionalism + 0.20×Leadership + 0.15×(100-Temperament) + 0.10×Loyalty + 0.10×(100-Ego)
 */
export const calculatePersonalityScore = (personality: PlayerPersonality): number => {
  const score = 
    0.25 * personality.agreeableness +
    0.20 * personality.professionalism +
    0.20 * personality.leadership +
    0.15 * (100 - personality.temperament) +
    0.10 * personality.loyalty +
    0.10 * (100 - personality.ego);
  
  return Math.round(score * 100) / 100; // Round to 2 decimal places
};

/**
 * Get personality label based on score
 * ≤24 'Diva', 25–39 'Mercurial', 40–59 'Neutral', 60–79 'Pro', ≥80 'Leader'
 */
export const getPersonalityLabel = (score: number): PersonalityLabel => {
  if (score <= 24) return 'Diva';
  if (score <= 39) return 'Mercurial';
  if (score <= 59) return 'Neutral';
  if (score <= 79) return 'Pro';
  return 'Leader';
};

/**
 * Get color for personality label
 */
export const getPersonalityLabelColor = (label: PersonalityLabel): string => {
  switch (label) {
    case 'Diva': return '#EF4444'; // Red
    case 'Mercurial': return '#F59E0B'; // Orange
    case 'Neutral': return '#6B7280'; // Gray
    case 'Pro': return '#3B82F6'; // Blue
    case 'Leader': return '#10B981'; // Green
  }
};

/**
 * Get background color for personality label
 */
export const getPersonalityLabelBgColor = (label: PersonalityLabel): string => {
  switch (label) {
    case 'Diva': return '#FEE2E2'; // Red background
    case 'Mercurial': return '#FEF3C7'; // Orange background
    case 'Neutral': return '#F3F4F6'; // Gray background
    case 'Pro': return '#DBEAFE'; // Blue background
    case 'Leader': return '#D1FAE5'; // Green background
  }
};

/**
 * Generate realistic personality traits based on player attributes
 */
export const generatePersonalityTraits = (
  position: Player['position'],
  age: number,
  overall: number
): PlayerPersonality => {
  // Base traits with some randomness
  const baseTraits = {
    agreeableness: Math.floor(Math.random() * 60) + 20, // 20-80
    temperament: Math.floor(Math.random() * 70) + 15, // 15-85
    workEthic: Math.floor(Math.random() * 50) + 30, // 30-80
    leadership: Math.floor(Math.random() * 60) + 20, // 20-80
    professionalism: Math.floor(Math.random() * 50) + 30, // 30-80
    ego: Math.floor(Math.random() * 70) + 15, // 15-85
    loyalty: Math.floor(Math.random() * 60) + 20, // 20-80
    marketPref: Math.floor(Math.random() * 80) + 10, // 10-90
    morale: Math.floor(Math.random() * 40) + 60, // 60-100 (start high)
  };

  // Adjust based on overall rating (better players tend to have better work ethic/professionalism)
  const overallFactor = (overall - 50) / 50; // -1 to 1 scale
  baseTraits.workEthic = Math.min(100, Math.max(0, baseTraits.workEthic + overallFactor * 20));
  baseTraits.professionalism = Math.min(100, Math.max(0, baseTraits.professionalism + overallFactor * 15));
  
  // Higher overall players may have bigger egos
  baseTraits.ego = Math.min(100, Math.max(0, baseTraits.ego + overallFactor * 10));

  // Adjust based on position
  switch (position) {
    case 'PG':
      // Point guards tend to have higher leadership and lower ego
      baseTraits.leadership = Math.min(100, baseTraits.leadership + 15);
      baseTraits.ego = Math.max(0, baseTraits.ego - 10);
      break;
    case 'C':
      // Centers tend to have higher ego and lower agreeableness
      baseTraits.ego = Math.min(100, baseTraits.ego + 10);
      baseTraits.agreeableness = Math.max(0, baseTraits.agreeableness - 5);
      break;
    case 'SG':
      // Shooting guards tend to have higher ego
      baseTraits.ego = Math.min(100, baseTraits.ego + 5);
      break;
  }

  // Adjust based on age
  if (age < 25) {
    // Younger players: lower professionalism, higher ego, lower loyalty
    baseTraits.professionalism = Math.max(0, baseTraits.professionalism - 10);
    baseTraits.ego = Math.min(100, baseTraits.ego + 10);
    baseTraits.loyalty = Math.max(0, baseTraits.loyalty - 15);
  } else if (age > 32) {
    // Veteran players: higher professionalism, lower ego, higher loyalty
    baseTraits.professionalism = Math.min(100, baseTraits.professionalism + 15);
    baseTraits.ego = Math.max(0, baseTraits.ego - 10);
    baseTraits.loyalty = Math.min(100, baseTraits.loyalty + 10);
    baseTraits.leadership = Math.min(100, baseTraits.leadership + 10);
  }

  return baseTraits;
};

/**
 * Validate personality traits (ensure 0-100 range)
 */
export const validatePersonalityTraits = (personality: PlayerPersonality): PlayerPersonality => {
  const validated: PlayerPersonality = {} as PlayerPersonality;
  
  Object.keys(personality).forEach(key => {
    const value = personality[key as keyof PlayerPersonality];
    validated[key as keyof PlayerPersonality] = Math.min(100, Math.max(0, value));
  });
  
  return validated;
};

/**
 * Get personality insights based on traits
 */
export const getPersonalityInsights = (personality: PlayerPersonality): string[] => {
  const insights: string[] = [];
  const score = calculatePersonalityScore(personality);
  const label = getPersonalityLabel(score);

  // Label-based insights
  switch (label) {
    case 'Leader':
      insights.push("Natural leader who elevates teammates");
      break;
    case 'Pro':
      insights.push("Professional approach to the game");
      break;
    case 'Diva':
      insights.push("May cause locker room issues");
      break;
    case 'Mercurial':
      insights.push("Unpredictable personality");
      break;
  }

  // Trait-specific insights
  if (personality.leadership > 80) {
    insights.push("Excellent captain material");
  }
  
  if (personality.workEthic > 85) {
    insights.push("Exceptional work ethic");
  }
  
  if (personality.ego > 85) {
    insights.push("Very high ego - needs careful management");
  }
  
  if (personality.loyalty < 30) {
    insights.push("Low loyalty - flight risk in free agency");
  }
  
  if (personality.temperament > 80) {
    insights.push("Volatile temperament - prone to outbursts");
  }
  
  if (personality.marketPref > 80) {
    insights.push("Prefers big market teams");
  }
  
  if (personality.morale < 40) {
    insights.push("Low morale - performance may suffer");
  }

  return insights;
};

/**
 * Get trait display name
 */
export const getTraitDisplayName = (trait: keyof PlayerPersonality): string => {
  switch (trait) {
    case 'agreeableness': return 'Agreeableness';
    case 'temperament': return 'Temperament';
    case 'workEthic': return 'Work Ethic';
    case 'leadership': return 'Leadership';
    case 'professionalism': return 'Professionalism';
    case 'ego': return 'Ego';
    case 'loyalty': return 'Loyalty';
    case 'marketPref': return 'Market Preference';
    case 'morale': return 'Morale';
  }
};

/**
 * Get trait description
 */
export const getTraitDescription = (trait: keyof PlayerPersonality): string => {
  switch (trait) {
    case 'agreeableness': return 'How well the player gets along with teammates';
    case 'temperament': return 'Emotional stability (higher = more volatile)';
    case 'workEthic': return 'Dedication to training and improvement';
    case 'leadership': return 'Natural leadership abilities';
    case 'professionalism': return 'Professional conduct and attitude';
    case 'ego': return 'Self-importance (higher = bigger ego)';
    case 'loyalty': return 'Loyalty to team and organization';
    case 'marketPref': return 'Preference for large market teams';
    case 'morale': return 'Current happiness and satisfaction';
  }
};