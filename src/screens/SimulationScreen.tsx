import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../state/gameStore';

export default function SimulationScreen() {
  const { currentTeam, allTeams, currentSeason, currentWeek, simulateWeek, gameResults } = useGameStore();

  if (!currentTeam) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const standings = [...allTeams].sort((a, b) => {
    const aWinPct = a.wins / (a.wins + a.losses);
    const bWinPct = b.wins / (b.wins + b.losses);
    return bWinPct - aWinPct;
  });

  const currentTeamRank = standings.findIndex(team => team.id === currentTeam.id) + 1;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Season {currentSeason}
          </Text>
          <Text className="text-gray-600 text-lg">
            Week {currentWeek} • Your team is #{currentTeamRank}
          </Text>
        </View>

        {/* Season Progress */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Season Progress
            </Text>
            
            <View className="flex-row justify-between mb-4">
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600">
                  {currentTeam.wins}
                </Text>
                <Text className="text-gray-600">Wins</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-2xl font-bold text-red-600">
                  {currentTeam.losses}
                </Text>
                <Text className="text-gray-600">Losses</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-2xl font-bold text-orange-600">
                  {((currentTeam.wins / (currentTeam.wins + currentTeam.losses)) * 100).toFixed(1)}%
                </Text>
                <Text className="text-gray-600">Win Rate</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="bg-gray-200 rounded-full h-3 mb-4">
              <View 
                className="bg-orange-500 h-3 rounded-full"
                style={{ 
                  width: `${(currentWeek / 30) * 100}%` // Assuming 30 week season
                }}
              />
            </View>
            
            <Text className="text-center text-gray-600">
              Week {currentWeek} of 30
            </Text>
          </View>
        </View>

        {/* Simulate Button */}
        <View className="px-6 mb-6">
          <Pressable
            className="bg-orange-500 rounded-2xl p-6 shadow-sm"
            onPress={simulateWeek}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="play-circle" size={32} color="white" />
              <Text className="text-white text-xl font-bold ml-3">
                Simulate Next Week
              </Text>
            </View>
            <Text className="text-white/80 text-center mt-2">
              Advance the season and see how your team performs
            </Text>
          </Pressable>
        </View>

        {/* League Standings */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            League Standings
          </Text>
          
          {standings.map((team, index) => {
            const isCurrentTeam = team.id === currentTeam.id;
            const winPct = (team.wins / (team.wins + team.losses)) * 100;
            
            return (
              <View 
                key={team.id}
                className={`rounded-2xl p-4 mb-3 ${
                  isCurrentTeam ? 'bg-orange-100 border-2 border-orange-500' : 'bg-white'
                } shadow-sm`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View 
                      className="w-8 h-8 rounded-full items-center justify-center mr-4"
                      style={{ 
                        backgroundColor: isCurrentTeam ? '#FF6B35' : '#6B7280'
                      }}
                    >
                      <Text className="text-white font-bold text-sm">
                        {index + 1}
                      </Text>
                    </View>
                    
                    <View className="flex-1">
                      <Text className={`text-lg font-bold ${
                        isCurrentTeam ? 'text-orange-800' : 'text-gray-800'
                      }`}>
                        {team.city} {team.name}
                      </Text>
                      <Text className={`${
                        isCurrentTeam ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {team.wins}-{team.losses} ({winPct.toFixed(1)}%)
                      </Text>
                    </View>
                  </View>
                  
                  {isCurrentTeam && (
                    <View className="bg-orange-500 rounded-lg px-3 py-1">
                      <Text className="text-white font-bold text-sm">
                        YOUR TEAM
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Recent Games */}
        {gameResults.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Recent Games</Text>
            
            {gameResults.slice(-5).reverse().map((game, index) => {
              const homeTeam = allTeams.find(t => t.id === game.homeTeam);
              const awayTeam = allTeams.find(t => t.id === game.awayTeam);
              
              if (!homeTeam || !awayTeam) return null;
              
              return (
                <Pressable
                  key={`${game.homeTeam}-${game.awayTeam}-${index}`}
                  className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="text-gray-800 font-semibold">
                        {awayTeam.city} @ {homeTeam.city}
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        {game.date}
                      </Text>
                    </View>
                    
                    <View className="items-end">
                      <Text className="text-lg font-bold text-gray-800">
                        {game.awayScore} - {game.homeScore}
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        {game.homeScore > game.awayScore ? homeTeam.abbreviation : awayTeam.abbreviation} wins
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Season Info */}
        <View className="px-6 mb-8">
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Season Information
            </Text>
            
            <View className="flex-row items-center mb-3">
              <Ionicons name="calendar" size={20} color="#6B7280" />
              <Text className="text-gray-800 ml-3">
                Regular Season: 30 weeks
              </Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Ionicons name="trophy" size={20} color="#F59E0B" />
              <Text className="text-gray-800 ml-3">
                Playoffs: Top 8 teams qualify
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="swap-horizontal" size={20} color="#EF4444" />
              <Text className="text-gray-800 ml-3">
                Trade Deadline: Week 20
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}