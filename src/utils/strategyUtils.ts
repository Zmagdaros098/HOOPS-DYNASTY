import { OffensiveStrategy, DefensiveStrategy, StrategyEffects, TeamStrategy, Team } from '../types/basketball';

// Strategy descriptions for UI display
export const OFFENSIVE_STRATEGY_INFO = {
  [OffensiveStrategy.PACE_AND_SPACE]: {
    description: "Fast tempo, lots of 3s, spread floor",
    icon: "flash" as const,
    strengths: ["High pace", "3-point shooting", "Spacing"],
    weaknesses: ["Interior scoring", "Rebounding"]
  },
  [OffensiveStrategy.RUN_AND_GUN]: {
    description: "Extremely fast pace, focus on quick scoring",
    icon: "rocket" as const,
    strengths: ["Very high pace", "Fast breaks", "Conditioning"],
    weaknesses: ["Defense", "Turnovers", "Half-court offense"]
  },
  [OffensiveStrategy.INSIDE_OUT]: {
    description: "Post play through bigs, kick-outs to shooters",
    icon: "basketball" as const,
    strengths: ["Post scoring", "Drawing fouls", "Rebounding"],
    weaknesses: ["Pace", "3-point shooting"]
  },
  [OffensiveStrategy.ISOLATION]: {
    description: "Focus on one or two stars creating shots",
    icon: "star" as const,
    strengths: ["Star player usage", "Clutch scoring", "Simplicity"],
    weaknesses: ["Ball movement", "Team chemistry", "Predictability"]
  },
  [OffensiveStrategy.BALANCED]: {
    description: "Equal mix of drives, jumpers, and ball movement",
    icon: "scale" as const,
    strengths: ["Versatility", "Adaptability", "No major weaknesses"],
    weaknesses: ["No major strengths"]
  },
  [OffensiveStrategy.MOTION]: {
    description: "Pass-heavy offense, high assists",
    icon: "swap-horizontal" as const,
    strengths: ["Ball movement", "Team chemistry", "Open shots"],
    weaknesses: ["Star player usage", "Pace"]
  }
};

export const DEFENSIVE_STRATEGY_INFO = {
  [DefensiveStrategy.GRIT_AND_GRIND]: {
    description: "Slow pace, physical, grind opponents down",
    icon: "shield" as const,
    strengths: ["Slow pace", "Physical play", "Opponent turnovers"],
    weaknesses: ["Offensive pace", "Foul trouble"]
  },
  [DefensiveStrategy.SWITCH_EVERYTHING]: {
    description: "Switch all screens, versatile defenders",
    icon: "shuffle" as const,
    strengths: ["Screen defense", "Versatility", "Mismatches"],
    weaknesses: ["Size mismatches", "Communication"]
  },
  [DefensiveStrategy.PAINT_PROTECTION]: {
    description: "Collapse defense inside, weaker vs 3-point shooting",
    icon: "home" as const,
    strengths: ["Interior defense", "Rebounding", "Shot blocking"],
    weaknesses: ["3-point defense", "Perimeter coverage"]
  },
  [DefensiveStrategy.PERIMETER_LOCKDOWN]: {
    description: "Pressure guards/wings, risk giving up inside scoring",
    icon: "lock-closed" as const,
    strengths: ["3-point defense", "Steals", "Guard pressure"],
    weaknesses: ["Interior defense", "Post scoring"]
  },
  [DefensiveStrategy.ZONE_DEFENSE]: {
    description: "Force outside shots, good vs isolation, bad vs ball movement",
    icon: "grid" as const,
    strengths: ["vs Isolation", "Help defense", "Rebounding"],
    weaknesses: ["vs Ball movement", "3-point shooting", "Mismatches"]
  },
  [DefensiveStrategy.BALANCED]: {
    description: "General defense, adaptable",
    icon: "scale" as const,
    strengths: ["Versatility", "Adaptability", "No major weaknesses"],
    weaknesses: ["No major strengths"]
  }
};

// Calculate strategy effects for offensive strategies
export function getOffensiveStrategyEffects(strategy: OffensiveStrategy): Partial<StrategyEffects> {
  switch (strategy) {
    case OffensiveStrategy.PACE_AND_SPACE:
      return {
        paceModifier: 1.15,
        twoPointAttemptRate: 0.45,
        threePointAttemptRate: 0.45,
        postUpRate: 0.10,
        assistRate: 1.1,
        turnoverRate: 1.05
      };
    
    case OffensiveStrategy.RUN_AND_GUN:
      return {
        paceModifier: 1.25,
        twoPointAttemptRate: 0.55,
        threePointAttemptRate: 0.35,
        postUpRate: 0.10,
        assistRate: 0.95,
        turnoverRate: 1.15
      };
    
    case OffensiveStrategy.INSIDE_OUT:
      return {
        paceModifier: 0.90,
        twoPointAttemptRate: 0.65,
        threePointAttemptRate: 0.25,
        postUpRate: 0.35,
        assistRate: 1.05,
        turnoverRate: 0.95,
        reboundingModifier: 1.1
      };
    
    case OffensiveStrategy.ISOLATION:
      return {
        paceModifier: 0.95,
        twoPointAttemptRate: 0.60,
        threePointAttemptRate: 0.30,
        postUpRate: 0.20,
        assistRate: 0.85,
        turnoverRate: 0.90
      };
    
    case OffensiveStrategy.MOTION:
      return {
        paceModifier: 0.95,
        twoPointAttemptRate: 0.50,
        threePointAttemptRate: 0.35,
        postUpRate: 0.15,
        assistRate: 1.25,
        turnoverRate: 0.90
      };
    
    case OffensiveStrategy.BALANCED:
    default:
      return {
        paceModifier: 1.0,
        twoPointAttemptRate: 0.55,
        threePointAttemptRate: 0.35,
        postUpRate: 0.20,
        assistRate: 1.0,
        turnoverRate: 1.0
      };
  }
}

// Calculate strategy effects for defensive strategies
export function getDefensiveStrategyEffects(strategy: DefensiveStrategy): Partial<StrategyEffects> {
  switch (strategy) {
    case DefensiveStrategy.GRIT_AND_GRIND:
      return {
        paceModifier: 0.85,
        opponentFGModifier: 0.95,
        turnoverRate: 0.85, // Force more opponent turnovers
        foulRate: 1.15,
        reboundingModifier: 1.05
      };
    
    case DefensiveStrategy.SWITCH_EVERYTHING:
      return {
        paceModifier: 1.0,
        opponentFGModifier: 0.97,
        turnoverRate: 0.95,
        foulRate: 1.05,
        reboundingModifier: 1.0
      };
    
    case DefensiveStrategy.PAINT_PROTECTION:
      return {
        paceModifier: 0.95,
        opponentFGModifier: 0.92, // Strong interior defense
        turnoverRate: 1.0,
        foulRate: 1.1,
        reboundingModifier: 1.15
      };
    
    case DefensiveStrategy.PERIMETER_LOCKDOWN:
      return {
        paceModifier: 1.05,
        opponentFGModifier: 0.94, // Good perimeter defense
        turnoverRate: 0.90, // Force steals
        foulRate: 1.08,
        reboundingModifier: 0.95
      };
    
    case DefensiveStrategy.ZONE_DEFENSE:
      return {
        paceModifier: 0.92,
        opponentFGModifier: 0.96,
        turnoverRate: 0.95,
        foulRate: 0.95,
        reboundingModifier: 1.08
      };
    
    case DefensiveStrategy.BALANCED:
    default:
      return {
        paceModifier: 1.0,
        opponentFGModifier: 1.0,
        turnoverRate: 1.0,
        foulRate: 1.0,
        reboundingModifier: 1.0
      };
  }
}

// Combine offensive and defensive strategy effects
export function getCombinedStrategyEffects(teamStrategy: TeamStrategy): StrategyEffects {
  const offensiveEffects = getOffensiveStrategyEffects(teamStrategy.offensive);
  const defensiveEffects = getDefensiveStrategyEffects(teamStrategy.defensive);
  
  return {
    paceModifier: (offensiveEffects.paceModifier || 1.0) * (defensiveEffects.paceModifier || 1.0),
    twoPointAttemptRate: offensiveEffects.twoPointAttemptRate || 0.55,
    threePointAttemptRate: offensiveEffects.threePointAttemptRate || 0.35,
    postUpRate: offensiveEffects.postUpRate || 0.20,
    assistRate: offensiveEffects.assistRate || 1.0,
    turnoverRate: Math.min(
      (offensiveEffects.turnoverRate || 1.0),
      (defensiveEffects.turnoverRate || 1.0)
    ),
    reboundingModifier: Math.max(
      (offensiveEffects.reboundingModifier || 1.0),
      (defensiveEffects.reboundingModifier || 1.0)
    ),
    opponentFGModifier: defensiveEffects.opponentFGModifier || 1.0,
    foulRate: defensiveEffects.foulRate || 1.0
  };
}

// Generate random strategy for AI teams
export function generateRandomStrategy(): TeamStrategy {
  const offensiveStrategies = Object.values(OffensiveStrategy);
  const defensiveStrategies = Object.values(DefensiveStrategy);
  
  return {
    offensive: offensiveStrategies[Math.floor(Math.random() * offensiveStrategies.length)],
    defensive: defensiveStrategies[Math.floor(Math.random() * defensiveStrategies.length)]
  };
}

// Calculate strategy compatibility with team roster
export function calculateStrategyFit(team: Team, strategy: TeamStrategy): number {
  let fit = 0.5; // Base fit score
  
  // Analyze roster composition
  const guards = team.roster.filter(p => p.position === 'PG' || p.position === 'SG');
  const centers = team.roster.filter(p => p.position === 'C');
  
  // Calculate average attributes for strategy matching
  const avgThreePoint = team.roster.reduce((sum, p) => sum + (p.attributes?.shooting?.threePointShooting || 70), 0) / team.roster.length;
  const avgPostScoring = team.roster.reduce((sum, p) => sum + (p.attributes?.finishing?.postScoring || 70), 0) / team.roster.length;
  const avgSpeed = team.roster.reduce((sum, p) => sum + (p.attributes?.athleticism?.speed || 70), 0) / team.roster.length;
  const avgPassing = team.roster.reduce((sum, p) => sum + (p.attributes?.playmaking?.passing || 70), 0) / team.roster.length;
  
  // Offensive strategy fit
  switch (strategy.offensive) {
    case OffensiveStrategy.PACE_AND_SPACE:
      fit += (avgThreePoint - 70) * 0.003;
      fit += (avgSpeed - 70) * 0.002;
      break;
    case OffensiveStrategy.RUN_AND_GUN:
      fit += (avgSpeed - 70) * 0.004;
      fit += (guards.length - 2) * 0.05;
      break;
    case OffensiveStrategy.INSIDE_OUT:
      fit += (avgPostScoring - 70) * 0.003;
      fit += (centers.length - 1) * 0.1;
      break;
    case OffensiveStrategy.ISOLATION:
      const starPlayers = team.roster.filter(p => p.overall >= 85);
      fit += starPlayers.length * 0.1;
      break;
    case OffensiveStrategy.MOTION:
      fit += (avgPassing - 70) * 0.003;
      break;
  }
  
  return Math.max(0, Math.min(1, fit));
}

// Suggest optimal strategy based on team composition
export function suggestOptimalStrategy(team: Team): TeamStrategy {
  const strategies = [
    OffensiveStrategy.PACE_AND_SPACE,
    OffensiveStrategy.RUN_AND_GUN,
    OffensiveStrategy.INSIDE_OUT,
    OffensiveStrategy.ISOLATION,
    OffensiveStrategy.MOTION,
    OffensiveStrategy.BALANCED
  ];
  
  const defensiveStrategies = [
    DefensiveStrategy.GRIT_AND_GRIND,
    DefensiveStrategy.SWITCH_EVERYTHING,
    DefensiveStrategy.PAINT_PROTECTION,
    DefensiveStrategy.PERIMETER_LOCKDOWN,
    DefensiveStrategy.ZONE_DEFENSE,
    DefensiveStrategy.BALANCED
  ];
  
  let bestOffensive = OffensiveStrategy.BALANCED;
  let bestDefensive = DefensiveStrategy.BALANCED;
  let bestFit = 0;
  
  // Test all combinations
  for (const offensive of strategies) {
    for (const defensive of defensiveStrategies) {
      const testStrategy = { offensive, defensive };
      const fit = calculateStrategyFit(team, testStrategy);
      
      if (fit > bestFit) {
        bestFit = fit;
        bestOffensive = offensive;
        bestDefensive = defensive;
      }
    }
  }
  
  return { offensive: bestOffensive, defensive: bestDefensive };
}

// Calculate matchup advantage between two strategies
export function calculateMatchupAdvantage(teamStrategy: TeamStrategy, opponentStrategy: TeamStrategy): number {
  let advantage = 0;
  
  // Offensive vs Defensive matchups
  if (teamStrategy.offensive === OffensiveStrategy.PACE_AND_SPACE && 
      opponentStrategy.defensive === DefensiveStrategy.PAINT_PROTECTION) {
    advantage += 0.1; // 3-point offense vs interior defense
  }
  
  if (teamStrategy.offensive === OffensiveStrategy.INSIDE_OUT && 
      opponentStrategy.defensive === DefensiveStrategy.PERIMETER_LOCKDOWN) {
    advantage += 0.1; // Post offense vs perimeter defense
  }
  
  if (teamStrategy.offensive === OffensiveStrategy.MOTION && 
      opponentStrategy.defensive === DefensiveStrategy.ZONE_DEFENSE) {
    advantage += 0.15; // Ball movement vs zone
  }
  
  if (teamStrategy.offensive === OffensiveStrategy.ISOLATION && 
      opponentStrategy.defensive === DefensiveStrategy.ZONE_DEFENSE) {
    advantage -= 0.1; // Isolation vs zone (bad matchup)
  }
  
  // Pace matchups
  const teamPace = getCombinedStrategyEffects(teamStrategy).paceModifier;
  const opponentPace = getCombinedStrategyEffects(opponentStrategy).paceModifier;
  
  if (Math.abs(teamPace - opponentPace) > 0.15) {
    // Significant pace difference can be advantageous
    advantage += Math.abs(teamPace - opponentPace) * 0.2;
  }
  
  return Math.max(-0.2, Math.min(0.2, advantage));
}