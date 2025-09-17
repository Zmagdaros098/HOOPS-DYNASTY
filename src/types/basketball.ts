export interface PlayerPersonality {
  agreeableness: number; // 0-100
  temperament: number; // 0-100 (higher = more volatile)
  workEthic: number; // 0-100
  leadership: number; // 0-100
  professionalism: number; // 0-100
  ego: number; // 0-100 (higher = bigger ego)
  loyalty: number; // 0-100
  marketPref: number; // 0-100 (preference for big markets)
  morale: number; // 0-100
}

export interface PlayerShooting {
  twoPointShooting: number; // 0-100
  threePointShooting: number; // 0-100
  freeThrowShooting: number; // 0-100
}

export interface PlayerFinishing {
  layups: number; // 0-100
  dunking: number; // 0-100
  postScoring: number; // 0-100
}

export interface PlayerPlaymaking {
  passing: number; // 0-100
  ballHandling: number; // 0-100
  courtVision: number; // 0-100
}

export interface PlayerDefense {
  perimeterDefense: number; // 0-100
  postDefense: number; // 0-100
  steals: number; // 0-100
  blocks: number; // 0-100
}

export interface PlayerRebounding {
  offensiveRebounding: number; // 0-100
  defensiveRebounding: number; // 0-100
}

export interface PlayerAthleticism {
  speed: number; // 0-100
  strength: number; // 0-100
  vertical: number; // 0-100
  endurance: number; // 0-100
}

export interface PlayerBasketballIQ {
  decisionMaking: number; // 0-100
  awareness: number; // 0-100
  shotSelection: number; // 0-100
}

export interface PlayerAttributes {
  shooting: PlayerShooting;
  finishing: PlayerFinishing;
  playmaking: PlayerPlaymaking;
  defense: PlayerDefense;
  rebounding: PlayerRebounding;
  athleticism: PlayerAthleticism;
  basketballIQ: PlayerBasketballIQ;
}

export interface PlayerBio {
  college: string | null; // College name, "No College", or "International"
  hometown: string; // "City, State" or "City, Country"
  draftYear: number; // Year player was drafted
  draftRound: number | null; // 1 or 2, null for undrafted
  draftPick: number | null; // 1-60, null for undrafted
  height: string; // Height in format like "6'8""
  weight: number; // Weight in pounds
}

export interface Player {
  id: string;
  name: string;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  age: number;
  overall: number;
  contract: {
    salary: number;
    years: number;
  };
  stats: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
  };
  personality: PlayerPersonality;
  attributes: PlayerAttributes;
  bio: PlayerBio;
  injury?: {
    type: string;
    weeksRemaining: number;
  };
}

export enum OffensiveStrategy {
  PACE_AND_SPACE = "Pace & Space",
  RUN_AND_GUN = "Run & Gun", 
  INSIDE_OUT = "Inside-Out",
  ISOLATION = "Isolation/Star Power",
  BALANCED = "Balanced",
  MOTION = "Motion/Ball Movement"
}

export enum DefensiveStrategy {
  GRIT_AND_GRIND = "Grit & Grind",
  SWITCH_EVERYTHING = "Switch Everything",
  PAINT_PROTECTION = "Paint Protection", 
  PERIMETER_LOCKDOWN = "Perimeter Lockdown",
  ZONE_DEFENSE = "Zone Defense",
  BALANCED = "Balanced"
}

export interface TeamStrategy {
  offensive: OffensiveStrategy;
  defensive: DefensiveStrategy;
}

export interface StrategyEffects {
  paceModifier: number; // Multiplier for possessions per game
  twoPointAttemptRate: number; // Percentage of shots that are 2-pointers
  threePointAttemptRate: number; // Percentage of shots that are 3-pointers
  postUpRate: number; // Percentage of shots from post-ups
  assistRate: number; // Assists per field goal made
  turnoverRate: number; // Turnovers per possession
  reboundingModifier: number; // Rebounding effectiveness multiplier
  opponentFGModifier: number; // Opponent field goal percentage modifier
  foulRate: number; // Fouls committed per possession
}

export interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  colors: {
    primary: string;
    secondary: string;
  };
  roster: Player[];
  salary: number;
  wins: number;
  losses: number;
  strategy: TeamStrategy;
}

export interface GameResult {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
}

export interface Trade {
  id: string;
  fromTeam: string;
  toTeam: string;
  playersOut: Player[];
  playersIn: Player[];
  status: 'pending' | 'accepted' | 'rejected';
  salaryDifference: number;
  tradeValue: number;
}

export interface BoxScore {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeRemaining: string;
  playerStats: {
    [playerId: string]: {
      minutes: number;
      points: number;
      rebounds: number;
      assists: number;
      steals: number;
      blocks: number;
      turnovers: number;
      fouls: number;
    };
  };
}