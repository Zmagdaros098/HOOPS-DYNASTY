/**
 * Basketball Attribute Utilities for Hoops Dynasty
 * Handles player attribute generation, calculation, and display
 */

import { 
  PlayerAttributes, 
  Player 
} from '../types/basketball';

export type AttributeCategory = 'shooting' | 'finishing' | 'playmaking' | 'defense' | 'rebounding' | 'athleticism' | 'basketballIQ';
export type AttributeGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';

/**
 * Position-specific attribute weights for overall rating calculation
 */
export const getPositionWeights = (position: Player['position']) => {
  switch (position) {
    case 'PG':
      return {
        shooting: 0.20,
        finishing: 0.10,
        playmaking: 0.25,
        defense: 0.15,
        rebounding: 0.05,
        athleticism: 0.15,
        basketballIQ: 0.10
      };
    case 'SG':
      return {
        shooting: 0.30,
        finishing: 0.15,
        playmaking: 0.10,
        defense: 0.15,
        rebounding: 0.05,
        athleticism: 0.20,
        basketballIQ: 0.05
      };
    case 'SF':
      return {
        shooting: 0.20,
        finishing: 0.15,
        playmaking: 0.15,
        defense: 0.20,
        rebounding: 0.10,
        athleticism: 0.20,
        basketballIQ: 0.00
      };
    case 'PF':
      return {
        shooting: 0.10,
        finishing: 0.25,
        playmaking: 0.05,
        defense: 0.20,
        rebounding: 0.20,
        athleticism: 0.15,
        basketballIQ: 0.05
      };
    case 'C':
      return {
        shooting: 0.05,
        finishing: 0.30,
        playmaking: 0.05,
        defense: 0.20,
        rebounding: 0.25,
        athleticism: 0.15,
        basketballIQ: 0.00
      };
  }
};

/**
 * Calculate category average from individual attributes
 */
const calculateCategoryAverage = (category: any): number => {
  const values = Object.values(category) as number[];
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

/**
 * Calculate overall rating from attributes based on position weights
 */
export const calculateOverallRating = (attributes: PlayerAttributes, position: Player['position']): number => {
  const weights = getPositionWeights(position);
  
  const categoryAverages = {
    shooting: calculateCategoryAverage(attributes.shooting),
    finishing: calculateCategoryAverage(attributes.finishing),
    playmaking: calculateCategoryAverage(attributes.playmaking),
    defense: calculateCategoryAverage(attributes.defense),
    rebounding: calculateCategoryAverage(attributes.rebounding),
    athleticism: calculateCategoryAverage(attributes.athleticism),
    basketballIQ: calculateCategoryAverage(attributes.basketballIQ)
  };
  
  const overall = Object.entries(weights).reduce((sum, [category, weight]) => {
    return sum + (categoryAverages[category as keyof typeof categoryAverages] * weight);
  }, 0);
  
  return Math.round(overall);
};

/**
 * Generate realistic player attributes based on position, age, and target overall
 */
export const generatePlayerAttributes = (
  position: Player['position'],
  age: number,
  targetOverall: number
): PlayerAttributes => {
  // Base attribute ranges
  const baseRange = [30, 70]; // Most attributes fall in this range
  const variation = 25; // How much attributes can vary from base
  
  // Age factors (young players: higher athleticism, lower IQ; veterans: opposite)
  const athleticismBonus = age < 25 ? 15 : age > 32 ? -10 : 0;
  const iqBonus = age < 25 ? -10 : age > 32 ? 15 : 0;
  
  // Position-specific attribute tendencies
  const getAttributeBase = (category: string, attribute: string): number => {
    let base = baseRange[0] + Math.random() * (baseRange[1] - baseRange[0]);
    
    // Position-specific boosts
    switch (position) {
      case 'PG':
        if (category === 'playmaking') base += 20;
        if (category === 'shooting' && attribute !== 'postScoring') base += 10;
        if (category === 'athleticism' && attribute === 'speed') base += 15;
        if (category === 'basketballIQ') base += 15;
        if (category === 'finishing' && attribute === 'dunking') base -= 15;
        if (category === 'rebounding') base -= 10;
        break;
        
      case 'SG':
        if (category === 'shooting') base += 20;
        if (category === 'athleticism' && (attribute === 'speed' || attribute === 'vertical')) base += 15;
        if (category === 'finishing' && attribute !== 'postScoring') base += 10;
        if (category === 'playmaking' && attribute === 'passing') base -= 5;
        if (category === 'rebounding') base -= 5;
        break;
        
      case 'SF':
        if (category === 'shooting' && attribute !== 'freeThrowShooting') base += 10;
        if (category === 'athleticism') base += 15;
        if (category === 'defense') base += 10;
        if (category === 'finishing') base += 10;
        break;
        
      case 'PF':
        if (category === 'finishing') base += 20;
        if (category === 'rebounding') base += 20;
        if (category === 'defense' && attribute === 'postDefense') base += 15;
        if (category === 'athleticism' && attribute === 'strength') base += 15;
        if (category === 'shooting' && attribute === 'threePointShooting') base -= 10;
        break;
        
      case 'C':
        if (category === 'finishing') base += 25;
        if (category === 'rebounding') base += 25;
        if (category === 'defense' && (attribute === 'postDefense' || attribute === 'blocks')) base += 20;
        if (category === 'athleticism' && attribute === 'strength') base += 20;
        if (category === 'shooting') base -= 15;
        if (category === 'playmaking') base -= 10;
        if (category === 'athleticism' && attribute === 'speed') base -= 10;
        break;
    }
    
    // Age adjustments
    if (category === 'athleticism') base += athleticismBonus;
    if (category === 'basketballIQ') base += iqBonus;
    
    // Add some randomness
    base += (Math.random() - 0.5) * variation;
    
    return Math.max(10, Math.min(95, base));
  };
  
  const attributes: PlayerAttributes = {
    shooting: {
      twoPointShooting: getAttributeBase('shooting', 'twoPointShooting'),
      threePointShooting: getAttributeBase('shooting', 'threePointShooting'),
      freeThrowShooting: getAttributeBase('shooting', 'freeThrowShooting')
    },
    finishing: {
      layups: getAttributeBase('finishing', 'layups'),
      dunking: getAttributeBase('finishing', 'dunking'),
      postScoring: getAttributeBase('finishing', 'postScoring')
    },
    playmaking: {
      passing: getAttributeBase('playmaking', 'passing'),
      ballHandling: getAttributeBase('playmaking', 'ballHandling'),
      courtVision: getAttributeBase('playmaking', 'courtVision')
    },
    defense: {
      perimeterDefense: getAttributeBase('defense', 'perimeterDefense'),
      postDefense: getAttributeBase('defense', 'postDefense'),
      steals: getAttributeBase('defense', 'steals'),
      blocks: getAttributeBase('defense', 'blocks')
    },
    rebounding: {
      offensiveRebounding: getAttributeBase('rebounding', 'offensiveRebounding'),
      defensiveRebounding: getAttributeBase('rebounding', 'defensiveRebounding')
    },
    athleticism: {
      speed: getAttributeBase('athleticism', 'speed'),
      strength: getAttributeBase('athleticism', 'strength'),
      vertical: getAttributeBase('athleticism', 'vertical'),
      endurance: getAttributeBase('athleticism', 'endurance')
    },
    basketballIQ: {
      decisionMaking: getAttributeBase('basketballIQ', 'decisionMaking'),
      awareness: getAttributeBase('basketballIQ', 'awareness'),
      shotSelection: getAttributeBase('basketballIQ', 'shotSelection')
    }
  };
  
  // Adjust attributes to match target overall rating
  const currentOverall = calculateOverallRating(attributes, position);
  const adjustment = (targetOverall - currentOverall) * 0.8; // 80% adjustment to avoid over-correction
  
  // Apply adjustment proportionally to all attributes
  const adjustAttribute = (value: number): number => {
    const adjusted = value + adjustment;
    return Math.max(10, Math.min(95, Math.round(adjusted)));
  };
  
  return {
    shooting: {
      twoPointShooting: adjustAttribute(attributes.shooting.twoPointShooting),
      threePointShooting: adjustAttribute(attributes.shooting.threePointShooting),
      freeThrowShooting: adjustAttribute(attributes.shooting.freeThrowShooting)
    },
    finishing: {
      layups: adjustAttribute(attributes.finishing.layups),
      dunking: adjustAttribute(attributes.finishing.dunking),
      postScoring: adjustAttribute(attributes.finishing.postScoring)
    },
    playmaking: {
      passing: adjustAttribute(attributes.playmaking.passing),
      ballHandling: adjustAttribute(attributes.playmaking.ballHandling),
      courtVision: adjustAttribute(attributes.playmaking.courtVision)
    },
    defense: {
      perimeterDefense: adjustAttribute(attributes.defense.perimeterDefense),
      postDefense: adjustAttribute(attributes.defense.postDefense),
      steals: adjustAttribute(attributes.defense.steals),
      blocks: adjustAttribute(attributes.defense.blocks)
    },
    rebounding: {
      offensiveRebounding: adjustAttribute(attributes.rebounding.offensiveRebounding),
      defensiveRebounding: adjustAttribute(attributes.rebounding.defensiveRebounding)
    },
    athleticism: {
      speed: adjustAttribute(attributes.athleticism.speed),
      strength: adjustAttribute(attributes.athleticism.strength),
      vertical: adjustAttribute(attributes.athleticism.vertical),
      endurance: adjustAttribute(attributes.athleticism.endurance)
    },
    basketballIQ: {
      decisionMaking: adjustAttribute(attributes.basketballIQ.decisionMaking),
      awareness: adjustAttribute(attributes.basketballIQ.awareness),
      shotSelection: adjustAttribute(attributes.basketballIQ.shotSelection)
    }
  };
};

/**
 * Get attribute grade (A+, A, B+, etc.)
 */
export const getAttributeGrade = (value: number): AttributeGrade => {
  if (value >= 95) return 'A+';
  if (value >= 90) return 'A';
  if (value >= 85) return 'A-';
  if (value >= 80) return 'B+';
  if (value >= 75) return 'B';
  if (value >= 70) return 'B-';
  if (value >= 65) return 'C+';
  if (value >= 60) return 'C';
  if (value >= 55) return 'C-';
  if (value >= 50) return 'D+';
  if (value >= 40) return 'D';
  return 'F';
};

/**
 * Get color for attribute value
 */
export const getAttributeColor = (value: number): string => {
  if (value >= 85) return '#10B981'; // Green
  if (value >= 70) return '#3B82F6'; // Blue
  if (value >= 55) return '#F59E0B'; // Orange
  if (value >= 40) return '#EF4444'; // Red
  return '#6B7280'; // Gray
};

/**
 * Get background color for attribute value
 */
export const getAttributeBgColor = (value: number): string => {
  if (value >= 85) return '#D1FAE5'; // Green background
  if (value >= 70) return '#DBEAFE'; // Blue background
  if (value >= 55) return '#FEF3C7'; // Orange background
  if (value >= 40) return '#FEE2E2'; // Red background
  return '#F3F4F6'; // Gray background
};

/**
 * Get display name for attribute categories
 */
export const getCategoryDisplayName = (category: AttributeCategory): string => {
  switch (category) {
    case 'shooting': return 'Shooting';
    case 'finishing': return 'Finishing';
    case 'playmaking': return 'Playmaking';
    case 'defense': return 'Defense';
    case 'rebounding': return 'Rebounding';
    case 'athleticism': return 'Athleticism';
    case 'basketballIQ': return 'Basketball IQ';
  }
};

/**
 * Get display name for individual attributes
 */
export const getAttributeDisplayName = (attribute: string): string => {
  const attributeNames: Record<string, string> = {
    // Shooting
    twoPointShooting: '2-Point Shooting',
    threePointShooting: '3-Point Shooting',
    freeThrowShooting: 'Free Throw Shooting',
    
    // Finishing
    layups: 'Layups',
    dunking: 'Dunking',
    postScoring: 'Post Scoring',
    
    // Playmaking
    passing: 'Passing',
    ballHandling: 'Ball Handling',
    courtVision: 'Court Vision',
    
    // Defense
    perimeterDefense: 'Perimeter Defense',
    postDefense: 'Post Defense',
    steals: 'Steals',
    blocks: 'Blocks',
    
    // Rebounding
    offensiveRebounding: 'Offensive Rebounding',
    defensiveRebounding: 'Defensive Rebounding',
    
    // Athleticism
    speed: 'Speed',
    strength: 'Strength',
    vertical: 'Vertical',
    endurance: 'Endurance',
    
    // Basketball IQ
    decisionMaking: 'Decision Making',
    awareness: 'Awareness',
    shotSelection: 'Shot Selection'
  };
  
  return attributeNames[attribute] || attribute;
};

/**
 * Get description for individual attributes
 */
export const getAttributeDescription = (attribute: string): string => {
  const descriptions: Record<string, string> = {
    // Shooting
    twoPointShooting: 'Ability to make shots inside the 3-point line',
    threePointShooting: 'Ability to make shots from beyond the 3-point line',
    freeThrowShooting: 'Ability to make free throw shots',
    
    // Finishing
    layups: 'Ability to score close to the basket',
    dunking: 'Ability to dunk and finish above the rim',
    postScoring: 'Ability to score with back to basket',
    
    // Playmaking
    passing: 'Ability to deliver accurate passes to teammates',
    ballHandling: 'Ability to dribble and control the ball',
    courtVision: 'Ability to see and create scoring opportunities',
    
    // Defense
    perimeterDefense: 'Ability to defend players on the perimeter',
    postDefense: 'Ability to defend players in the post',
    steals: 'Ability to steal the ball from opponents',
    blocks: 'Ability to block opponent shots',
    
    // Rebounding
    offensiveRebounding: 'Ability to grab rebounds on offense',
    defensiveRebounding: 'Ability to grab rebounds on defense',
    
    // Athleticism
    speed: 'How fast the player can move',
    strength: 'Physical strength and power',
    vertical: 'Jumping ability and leaping',
    endurance: 'Stamina and ability to play extended minutes',
    
    // Basketball IQ
    decisionMaking: 'Ability to make smart decisions with the ball',
    awareness: 'Understanding of game situations and positioning',
    shotSelection: 'Ability to take good shots and avoid bad ones'
  };
  
  return descriptions[attribute] || 'Basketball skill attribute';
};

/**
 * Get top attributes for a player
 */
export const getTopAttributes = (attributes: PlayerAttributes, count: number = 3): Array<{category: AttributeCategory, attribute: string, value: number}> => {
  const allAttributes: Array<{category: AttributeCategory, attribute: string, value: number}> = [];
  
  Object.entries(attributes).forEach(([categoryKey, categoryValue]) => {
    const category = categoryKey as AttributeCategory;
    Object.entries(categoryValue).forEach(([attributeKey, attributeValue]) => {
      allAttributes.push({
        category,
        attribute: attributeKey,
        value: attributeValue as number
      });
    });
  });
  
  return allAttributes
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
};

/**
 * Get player archetype based on attributes
 */
export const getPlayerArchetype = (attributes: PlayerAttributes, position: Player['position']): string => {
  const categoryAverages = {
    shooting: calculateCategoryAverage(attributes.shooting),
    finishing: calculateCategoryAverage(attributes.finishing),
    playmaking: calculateCategoryAverage(attributes.playmaking),
    defense: calculateCategoryAverage(attributes.defense),
    rebounding: calculateCategoryAverage(attributes.rebounding),
    athleticism: calculateCategoryAverage(attributes.athleticism),
    basketballIQ: calculateCategoryAverage(attributes.basketballIQ)
  };
  
  // Find dominant categories
  const sortedCategories = Object.entries(categoryAverages)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 2);
  
  const [primaryCategory] = sortedCategories[0];
  
  // Position-specific archetypes
  switch (position) {
    case 'PG':
      if (primaryCategory === 'shooting') return 'Scoring Point Guard';
      if (primaryCategory === 'playmaking') return 'Floor General';
      if (primaryCategory === 'defense') return 'Defensive Point Guard';
      if (primaryCategory === 'athleticism') return 'Athletic Point Guard';
      return 'Traditional Point Guard';
      
    case 'SG':
      if (primaryCategory === 'shooting') return 'Sharpshooter';
      if (primaryCategory === 'athleticism') return 'Athletic Wing';
      if (primaryCategory === 'defense') return 'Two-Way Guard';
      if (primaryCategory === 'finishing') return 'Slashing Guard';
      return 'Shooting Guard';
      
    case 'SF':
      if (primaryCategory === 'shooting') return 'Stretch Forward';
      if (primaryCategory === 'athleticism') return 'Athletic Wing';
      if (primaryCategory === 'defense') return 'Defensive Wing';
      if (primaryCategory === 'playmaking') return 'Point Forward';
      return 'Small Forward';
      
    case 'PF':
      if (primaryCategory === 'shooting') return 'Stretch Four';
      if (primaryCategory === 'finishing') return 'Power Forward';
      if (primaryCategory === 'defense') return 'Defensive Forward';
      if (primaryCategory === 'rebounding') return 'Rebounding Forward';
      return 'Power Forward';
      
    case 'C':
      if (primaryCategory === 'finishing') return 'Scoring Center';
      if (primaryCategory === 'defense') return 'Defensive Anchor';
      if (primaryCategory === 'rebounding') return 'Glass Cleaner';
      if (primaryCategory === 'shooting') return 'Stretch Center';
      return 'Traditional Center';
      
    default:
      return 'Basketball Player';
  }
};