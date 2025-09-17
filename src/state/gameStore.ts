import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Team, Player, GameResult, Trade, BoxScore, TeamStrategy } from '../types/basketball';
import { nameGenerator } from '../utils/nameGenerator';
import { generateLeague, LeagueConfig } from '../utils/leagueGenerator';
import { generatePersonalityTraits } from '../utils/personalityUtils';
import { generatePlayerAttributes, calculateOverallRating } from '../utils/attributeUtils';
import { generatePlayerBio, generatePlayerHeight, generatePlayerWeight } from '../utils/bioUtils';
import { generateRandomStrategy, getCombinedStrategyEffects, calculateMatchupAdvantage } from '../utils/strategyUtils';

interface GameState {
  currentTeam: Team | null;
  allTeams: Team[];
  gameResults: GameResult[];
  trades: Trade[];
  currentSeason: number;
  currentWeek: number;
  boxScores: BoxScore[];
  leagueConfig: LeagueConfig | null;
  
  // Actions
  setCurrentTeam: (team: Team) => void;
  setAllTeams: (teams: Team[]) => void;
  addGameResult: (result: GameResult) => void;
  addBoxScore: (boxScore: BoxScore) => void;
  proposeTrade: (trade: Trade) => void;
  acceptTrade: (tradeId: string) => void;
  rejectTrade: (tradeId: string) => void;
  simulateWeek: () => void;
  updatePlayerStats: (teamId: string, playerId: string, stats: Partial<Player['stats']>) => void;
  injurePlayer: (teamId: string, playerId: string, injury: { type: string; weeksRemaining: number }) => void;
  healPlayers: () => void;
  generateDraftClass: (count: number) => Player[];
  generateFreeAgents: (count: number) => Player[];
  generateNewLeague: (config: LeagueConfig) => Team[];
  initializeNewLeague: (config: LeagueConfig, selectedTeamId: string) => void;
  resetLeague: () => void;
  resetSeason: () => void;
  updateTeamInfo: (teamId: string, updates: Partial<Pick<Team, 'name' | 'city' | 'abbreviation' | 'colors'>>) => void;
  updatePlayerName: (teamId: string, playerId: string, newName: string) => void;
  validateTeamName: (name: string, excludeTeamId?: string) => boolean;
  validatePlayerName: (name: string, teamId: string, excludePlayerId?: string) => boolean;
  migratePlayersWithPersonality: () => void;
  migratePlayersWithAttributes: () => void;
  migratePlayersWithBio: () => void;
  updateTeamStrategy: (teamId: string, strategy: TeamStrategy) => void;
  migrateTeamsWithStrategy: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentTeam: null,
      allTeams: [],
      gameResults: [],
      trades: [],
      currentSeason: 2024,
      currentWeek: 1,
      boxScores: [],
      leagueConfig: null,

      setCurrentTeam: (team) => set({ currentTeam: team }),
      
      setAllTeams: (teams) => set({ allTeams: teams }),
      
      addGameResult: (result) => set((state) => ({
        gameResults: [...state.gameResults, result]
      })),
      
      addBoxScore: (boxScore) => set((state) => ({
        boxScores: [...state.boxScores, boxScore]
      })),
      
      proposeTrade: (trade) => set((state) => ({
        trades: [...state.trades, trade]
      })),
      
      acceptTrade: (tradeId) => set((state) => {
        const trade = state.trades.find(t => t.id === tradeId);
        if (!trade) return state;
        
        const updatedTrades = state.trades.map(t => 
          t.id === tradeId ? { ...t, status: 'accepted' as const } : t
        );
        
        // Execute the trade by swapping players between teams
        const updatedTeams = state.allTeams.map(team => {
          if (team.id === trade.fromTeam) {
            const newRoster = team.roster.filter(p => 
              !trade.playersOut.some(po => po.id === p.id)
            ).concat(trade.playersIn);
            return { ...team, roster: newRoster };
          }
          if (team.id === trade.toTeam) {
            const newRoster = team.roster.filter(p => 
              !trade.playersIn.some(pi => pi.id === p.id)
            ).concat(trade.playersOut);
            return { ...team, roster: newRoster };
          }
          return team;
        });
        
        return {
          trades: updatedTrades,
          allTeams: updatedTeams,
          currentTeam: updatedTeams.find(t => t.id === state.currentTeam?.id) || state.currentTeam
        };
      }),
      
      rejectTrade: (tradeId) => set((state) => ({
        trades: state.trades.map(t => 
          t.id === tradeId ? { ...t, status: 'rejected' as const } : t
        )
      })),
      
      simulateWeek: () => set((state) => {
        // Enhanced simulation logic with injuries, detailed results, and strategy effects
        const newResults: GameResult[] = [];
        const newBoxScores: BoxScore[] = [];
        
        // Heal players first
        let updatedTeams = state.allTeams.map(team => ({
          ...team,
          roster: team.roster.map(player => {
            if (player.injury && player.injury.weeksRemaining > 0) {
              const newWeeksRemaining = player.injury.weeksRemaining - 1;
              return {
                ...player,
                injury: newWeeksRemaining > 0 ? { ...player.injury, weeksRemaining: newWeeksRemaining } : undefined
              };
            }
            return player;
          })
        }));
        
        // Simulate games with strategy effects
        updatedTeams = updatedTeams.map((team, teamIndex) => {
          let teamWon = Math.random() > 0.5;
          
          // Create game results for this week with strategy-based scoring
          if (teamIndex % 2 === 0 && teamIndex + 1 < updatedTeams.length) {
            const opponent = updatedTeams[teamIndex + 1];
            
            // Get strategy effects for both teams
            const teamEffects = getCombinedStrategyEffects(team.strategy);
            const opponentEffects = getCombinedStrategyEffects(opponent.strategy);
            
            // Calculate matchup advantage
            const matchupAdvantage = calculateMatchupAdvantage(team.strategy, opponent.strategy);
            
            // Calculate scores based on strategy effects
            const teamBaseScore = 90 + Math.random() * 30;
            const opponentBaseScore = 90 + Math.random() * 30;
            
            // Apply strategy modifiers
            const teamScore = Math.floor(teamBaseScore * (1 + matchupAdvantage) * 
              (2 - teamEffects.turnoverRate) * teamEffects.paceModifier);
            const opponentScore = Math.floor(opponentBaseScore * (1 - matchupAdvantage) * 
              (2 - opponentEffects.turnoverRate) * opponentEffects.paceModifier * 
              opponentEffects.opponentFGModifier);
            
            teamWon = teamScore > opponentScore;
            
            const gameResult: GameResult = {
              homeTeam: team.id,
              awayTeam: opponent.id,
              homeScore: teamScore,
              awayScore: opponentScore,
              date: `Week ${state.currentWeek + 1}`
            };
            
            newResults.push(gameResult);
            
            // Update opponent's record too
            const opponentWon = !teamWon;
            updatedTeams[teamIndex + 1] = {
              ...updatedTeams[teamIndex + 1],
              wins: opponentWon ? updatedTeams[teamIndex + 1].wins + 1 : updatedTeams[teamIndex + 1].wins,
              losses: opponentWon ? updatedTeams[teamIndex + 1].losses : updatedTeams[teamIndex + 1].losses + 1
            };
          }
          
          const wins = teamWon ? team.wins + 1 : team.wins;
          const losses = teamWon ? team.losses : team.losses + 1;
          
          // Random injury chance (5% per week per team, modified by strategy)
          const injuryRate = team.strategy.defensive === 'Grit & Grind' ? 0.07 : 0.05;
          const roster = team.roster.map(player => {
            if (!player.injury && Math.random() < injuryRate) {
              const injuries = ['Ankle Sprain', 'Knee Strain', 'Back Soreness', 'Hamstring Pull', 'Shoulder Strain'];
              const injury = {
                type: injuries[Math.floor(Math.random() * injuries.length)],
                weeksRemaining: Math.floor(Math.random() * 4) + 1
              };
              return { ...player, injury };
            }
            return player;
          });
          
          return { ...team, wins, losses, roster };
        });
        
        return {
          currentWeek: state.currentWeek + 1,
          allTeams: updatedTeams,
          gameResults: [...state.gameResults, ...newResults],
          boxScores: [...state.boxScores, ...newBoxScores],
          currentTeam: updatedTeams.find(t => t.id === state.currentTeam?.id) || state.currentTeam
        };
      }),
      
      updatePlayerStats: (teamId, playerId, stats) => set((state) => ({
        allTeams: state.allTeams.map(team => 
          team.id === teamId 
            ? {
                ...team,
                roster: team.roster.map(player =>
                  player.id === playerId
                    ? { ...player, stats: { ...player.stats, ...stats } }
                    : player
                )
              }
            : team
        )
      })),
      
      injurePlayer: (teamId, playerId, injury) => set((state) => ({
        allTeams: state.allTeams.map(team => 
          team.id === teamId 
            ? {
                ...team,
                roster: team.roster.map(player =>
                  player.id === playerId
                    ? { ...player, injury }
                    : player
                )
              }
            : team
        )
      })),
      
      healPlayers: () => set((state) => ({
        allTeams: state.allTeams.map(team => ({
          ...team,
          roster: team.roster.map(player => {
            if (player.injury && player.injury.weeksRemaining > 0) {
              const newWeeksRemaining = player.injury.weeksRemaining - 1;
              return {
                ...player,
                injury: newWeeksRemaining > 0 ? { ...player.injury, weeksRemaining: newWeeksRemaining } : undefined
              };
            }
            return player;
          })
        }))
      })),
      
      generateDraftClass: (count) => {
        const { currentSeason } = get();
        const draftees: Player[] = [];
        const names = nameGenerator.generateDraftClass(count);
        
        for (let i = 0; i < names.length; i++) {
          const positions: Player['position'][] = ['PG', 'SG', 'SF', 'PF', 'C'];
          const position = positions[Math.floor(Math.random() * positions.length)];
          const age = Math.floor(Math.random() * 3) + 19; // 19-21 years old
          const targetOverall = Math.floor(Math.random() * 30) + 60; // 60-89 overall
          
          // Generate attributes first, then calculate overall from them
          const attributes = generatePlayerAttributes(position, age, targetOverall);
          const overall = calculateOverallRating(attributes, position);
          
          // Generate biographical information
          const bio = generatePlayerBio(age, position, overall, currentSeason);
          
          draftees.push({
            id: Math.random().toString(36).substring(2, 11),
            name: names[i],
            position,
            age,
            overall,
            contract: {
              salary: Math.floor(Math.random() * 5000000) + 1000000, // 1M to 6M (rookie contracts)
              years: 4 // Standard rookie contract
            },
            stats: {
              points: 0,
              rebounds: 0,
              assists: 0,
              steals: 0,
              blocks: 0
            },
            personality: generatePersonalityTraits(position, age, overall),
            attributes,
            bio
          });
        }
        
        return draftees;
      },
      
      generateFreeAgents: (count) => {
        const { currentSeason } = get();
        const freeAgents: Player[] = [];
        const names = nameGenerator.generateFreeAgents(count);
        
        for (let i = 0; i < names.length; i++) {
          const positions: Player['position'][] = ['PG', 'SG', 'SF', 'PF', 'C'];
          const position = positions[Math.floor(Math.random() * positions.length)];
          const age = Math.floor(Math.random() * 15) + 22; // 22-36 years old
          const targetOverall = Math.floor(Math.random() * 40) + 50; // 50-89 overall
          
          // Generate attributes first, then calculate overall from them
          const attributes = generatePlayerAttributes(position, age, targetOverall);
          const overall = calculateOverallRating(attributes, position);
          
          // Generate biographical information
          const bio = generatePlayerBio(age, position, overall, currentSeason);
          
          freeAgents.push({
            id: Math.random().toString(36).substring(2, 11),
            name: names[i],
            position,
            age,
            overall,
            contract: {
              salary: Math.floor(Math.random() * 30000000) + 2000000, // 2M to 32M
              years: Math.floor(Math.random() * 3) + 1 // 1 to 3 years
            },
            stats: {
              points: 0,
              rebounds: 0,
              assists: 0,
              steals: 0,
              blocks: 0
            },
            personality: generatePersonalityTraits(position, age, overall),
            attributes,
            bio
          });
        }
        
        return freeAgents;
      },
      
      generateNewLeague: (config) => {
        const { currentSeason } = get();
        const teams = generateLeague(config, true, currentSeason);
        return teams;
      },
      
      initializeNewLeague: (config, selectedTeamId) => set((state) => {
        const currentSeason = new Date().getFullYear();
        const teams = generateLeague(config, true, currentSeason);
        
        // Reset all team records and player stats to 0 for fresh start
        const freshTeams = teams.map(team => ({
          ...team,
          wins: 0,
          losses: 0,
          roster: team.roster.map(player => ({
            ...player,
            stats: {
              points: 0,
              rebounds: 0,
              assists: 0,
              steals: 0,
              blocks: 0
            },
            injury: undefined // Clear any injuries
          }))
        }));
        
        const selectedTeam = freshTeams.find(t => t.id === selectedTeamId);
        
        return {
          ...state,
          currentTeam: selectedTeam || freshTeams[0],
          allTeams: freshTeams,
          gameResults: [],
          trades: [],
          boxScores: [],
          currentSeason,
          currentWeek: 1,
          leagueConfig: config
        };
      }),
      
      resetLeague: () => set((state) => ({
        ...state,
        currentTeam: null,
        allTeams: [],
        gameResults: [],
        trades: [],
        boxScores: [],
        currentSeason: new Date().getFullYear(),
        currentWeek: 1,
        leagueConfig: null
      })),
      
      resetSeason: () => set((state) => ({
        ...state,
        gameResults: [],
        trades: [],
        boxScores: [],
        currentWeek: 1,
        allTeams: state.allTeams.map(team => ({
          ...team,
          wins: 0,
          losses: 0,
          roster: team.roster.map(player => ({
            ...player,
            stats: {
              points: 0,
              rebounds: 0,
              assists: 0,
              steals: 0,
              blocks: 0
            },
            injury: undefined // Clear all injuries
          }))
        })),
        currentTeam: state.currentTeam ? {
          ...state.currentTeam,
          wins: 0,
          losses: 0,
          roster: state.currentTeam.roster.map(player => ({
            ...player,
            stats: {
              points: 0,
              rebounds: 0,
              assists: 0,
              steals: 0,
              blocks: 0
            },
            injury: undefined
          }))
        } : state.currentTeam
      })),
      
      updateTeamInfo: (teamId, updates) => set((state) => ({
        allTeams: state.allTeams.map(team => 
          team.id === teamId 
            ? { ...team, ...updates }
            : team
        ),
        currentTeam: state.currentTeam?.id === teamId 
          ? { ...state.currentTeam, ...updates }
          : state.currentTeam
      })),
      
      updatePlayerName: (teamId, playerId, newName) => set((state) => ({
        allTeams: state.allTeams.map(team => 
          team.id === teamId 
            ? {
                ...team,
                roster: team.roster.map(player =>
                  player.id === playerId
                    ? { ...player, name: newName }
                    : player
                )
              }
            : team
        ),
        currentTeam: state.currentTeam?.id === teamId 
          ? {
              ...state.currentTeam,
              roster: state.currentTeam.roster.map(player =>
                player.id === playerId
                  ? { ...player, name: newName }
                  : player
              )
            }
          : state.currentTeam
      })),
      
      validateTeamName: (name, excludeTeamId) => {
        const { allTeams } = get();
        return !allTeams.some(team => 
          team.name.toLowerCase() === name.toLowerCase() && team.id !== excludeTeamId
        );
      },
      
      validatePlayerName: (name, teamId, excludePlayerId) => {
        const { allTeams } = get();
        const team = allTeams.find(t => t.id === teamId);
        if (!team) return true;
        
        return !team.roster.some(player => 
          player.name.toLowerCase() === name.toLowerCase() && player.id !== excludePlayerId
        );
      },

      migratePlayersWithPersonality: () => set((state) => {
        // Check if any players are missing personality data
        const needsMigration = state.allTeams.some(team => 
          team.roster.some(player => !player.personality)
        );

        if (!needsMigration) return state;

        // Add personality traits to players that don't have them
        const migratedTeams = state.allTeams.map(team => ({
          ...team,
          roster: team.roster.map(player => {
            if (!player.personality) {
              return {
                ...player,
                personality: generatePersonalityTraits(player.position, player.age, player.overall)
              };
            }
            return player;
          })
        }));

        return {
          ...state,
          allTeams: migratedTeams,
          currentTeam: state.currentTeam ? 
            migratedTeams.find(t => t.id === state.currentTeam?.id) || state.currentTeam :
            state.currentTeam
        };
      }),

      migratePlayersWithAttributes: () => set((state) => {
        // Check if any players are missing attribute data
        const needsMigration = state.allTeams.some(team => 
          team.roster.some(player => !player.attributes)
        );

        if (!needsMigration) return state;

        // Add attributes to players that don't have them
        const migratedTeams = state.allTeams.map(team => ({
          ...team,
          roster: team.roster.map(player => {
            if (!player.attributes) {
              const attributes = generatePlayerAttributes(player.position, player.age, player.overall);
              const recalculatedOverall = calculateOverallRating(attributes, player.position);
              return {
                ...player,
                attributes,
                overall: recalculatedOverall // Update overall to match attributes
              };
            }
            return player;
          })
        }));

        return {
          ...state,
          allTeams: migratedTeams,
          currentTeam: state.currentTeam ? 
            migratedTeams.find(t => t.id === state.currentTeam?.id) || state.currentTeam :
            state.currentTeam
        };
      }),

      migratePlayersWithBio: () => set((state) => {
        // Check if any players are missing bio data or missing height/weight
        const needsMigration = state.allTeams.some(team => 
          team.roster.some(player => !player.bio || !player.bio.height || !player.bio.weight)
        );

        if (!needsMigration) return state;

        // Add bio information to players that don't have it, or add missing height/weight
        const migratedTeams = state.allTeams.map(team => ({
          ...team,
          roster: team.roster.map(player => {
            if (!player.bio) {
              // Player has no bio at all - generate complete bio
              return {
                ...player,
                bio: generatePlayerBio(player.age, player.position, player.overall, state.currentSeason)
              };
            } else if (!player.bio.height || !player.bio.weight) {
              // Player has bio but missing height/weight - add them
              const height = generatePlayerHeight(player.position);
              const weight = generatePlayerWeight(height, player.position);
              return {
                ...player,
                bio: {
                  ...player.bio,
                  height,
                  weight
                }
              };
            }
            return player;
          })
        }));

        return {
          ...state,
          allTeams: migratedTeams,
          currentTeam: state.currentTeam ? 
            migratedTeams.find(t => t.id === state.currentTeam?.id) || state.currentTeam :
            state.currentTeam
        };
      }),

      updateTeamStrategy: (teamId, strategy) => set((state) => ({
        allTeams: state.allTeams.map(team => 
          team.id === teamId 
            ? { ...team, strategy }
            : team
        ),
        currentTeam: state.currentTeam?.id === teamId 
          ? { ...state.currentTeam, strategy }
          : state.currentTeam
      })),

      migrateTeamsWithStrategy: () => set((state) => {
        // Check if any teams are missing strategy data
        const needsMigration = state.allTeams.some(team => !team.strategy);

        if (!needsMigration) return state;

        // Add random strategies to teams that don't have them
        const migratedTeams = state.allTeams.map(team => {
          if (!team.strategy) {
            return {
              ...team,
              strategy: generateRandomStrategy()
            };
          }
          return team;
        });

        return {
          ...state,
          allTeams: migratedTeams,
          currentTeam: state.currentTeam ? 
            migratedTeams.find(t => t.id === state.currentTeam?.id) || state.currentTeam :
            state.currentTeam
        };
      })
    }),
    {
      name: 'basketball-gm-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentTeam: state.currentTeam,
        allTeams: state.allTeams,
        currentSeason: state.currentSeason,
        currentWeek: state.currentWeek,
        gameResults: state.gameResults,
        boxScores: state.boxScores,
        leagueConfig: state.leagueConfig
      }),
      onRehydrateStorage: () => (state) => {
        // Run migrations after loading data
        if (state) {
          state.migratePlayersWithPersonality();
          state.migratePlayersWithAttributes();
          state.migratePlayersWithBio();
          state.migrateTeamsWithStrategy();
        }
      }
    }
  )
);