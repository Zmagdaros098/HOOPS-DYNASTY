import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../state/gameStore';

export default function PlayoffsScreen() {
  const { allTeams, currentWeek, currentSeason } = useGameStore();

  // Check if playoffs should start (after week 30)
  const isPlayoffTime = currentWeek > 30;
  
  // Get playoff teams (top 8 by win percentage)
  const playoffTeams = [...allTeams]
    .sort((a, b) => {
      const aWinPct = a.wins / (a.wins + a.losses);
      const bWinPct = b.wins / (b.wins + b.losses);
      return bWinPct - aWinPct;
    })
    .slice(0, 8);

  // Create playoff bracket structure
  const firstRound = [
    { team1: playoffTeams[0], team2: playoffTeams[7], winner: null },
    { team1: playoffTeams[1], team2: playoffTeams[6], winner: null },
    { team1: playoffTeams[2], team2: playoffTeams[5], winner: null },
    { team1: playoffTeams[3], team2: playoffTeams[4], winner: null },
  ];

  const semifinals = [
    { team1: null, team2: null, winner: null },
    { team1: null, team2: null, winner: null },
  ];



  if (!isPlayoffTime) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="trophy-outline" size={80} color="#9CA3AF" />
          <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Playoffs Not Started
          </Text>
          <Text className="text-gray-600 text-center text-lg mb-6">
            Complete the regular season (30 weeks) to unlock the playoffs
          </Text>
          <Text className="text-gray-500 text-center">
            Current week: {currentWeek} / 30
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            {currentSeason} Playoffs
          </Text>
          <Text className="text-gray-600 text-lg">
            Championship Tournament
          </Text>
        </View>

        {/* Playoff Bracket */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Playoff Bracket</Text>
          
          {/* First Round */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-800 mb-4">First Round</Text>
            
            {firstRound.map((matchup, index) => (
              <View key={index} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-lg font-bold text-gray-800 mr-2">
                        #{index * 2 + 1}
                      </Text>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800">
                          {matchup.team1?.city} {matchup.team1?.name}
                        </Text>
                        <Text className="text-gray-600">
                          {matchup.team1?.wins}-{matchup.team1?.losses} ({((matchup.team1?.wins || 0) / ((matchup.team1?.wins || 0) + (matchup.team1?.losses || 0)) * 100).toFixed(1)}%)
                        </Text>
                      </View>
                    </View>
                    
                    <View className="flex-row items-center">
                      <Text className="text-lg font-bold text-gray-800 mr-2">
                        #{8 - index}
                      </Text>
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800">
                          {matchup.team2?.city} {matchup.team2?.name}
                        </Text>
                        <Text className="text-gray-600">
                          {matchup.team2?.wins}-{matchup.team2?.losses} ({((matchup.team2?.wins || 0) / ((matchup.team2?.wins || 0) + (matchup.team2?.losses || 0)) * 100).toFixed(1)}%)
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View className="items-center ml-4">
                    <Text className="text-gray-500 text-sm mb-1">Best of 7</Text>
                    <View className="bg-orange-100 rounded-lg px-3 py-1">
                      <Text className="text-orange-800 font-semibold text-sm">
                        Pending
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Semifinals */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-800 mb-4">Semifinals</Text>
            
            {semifinals.map((_, index) => (
              <View key={index} className="bg-white rounded-2xl p-4 mb-3 shadow-sm opacity-50">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-gray-500 text-center text-lg">
                      Winner of Matchup {index * 2 + 1} vs Winner of Matchup {index * 2 + 2}
                    </Text>
                  </View>
                  
                  <View className="items-center ml-4">
                    <Text className="text-gray-400 text-sm mb-1">Best of 7</Text>
                    <View className="bg-gray-100 rounded-lg px-3 py-1">
                      <Text className="text-gray-500 font-semibold text-sm">
                        TBD
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Finals */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-800 mb-4">Championship Final</Text>
            
            <View className="bg-white rounded-2xl p-6 shadow-sm opacity-50">
              <View className="items-center">
                <Ionicons name="trophy" size={48} color="#F59E0B" />
                <Text className="text-2xl font-bold text-gray-800 mt-4 mb-2">
                  Championship Game
                </Text>
                <Text className="text-gray-500 text-center text-lg mb-4">
                  Winner of Semifinal 1 vs Winner of Semifinal 2
                </Text>
                <View className="bg-gray-100 rounded-lg px-4 py-2">
                  <Text className="text-gray-500 font-semibold">
                    To Be Determined
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Playoff Information */}
        <View className="px-6 mb-8">
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Playoff Format
            </Text>
            
            <View className="flex-row items-center mb-3">
              <Ionicons name="people" size={20} color="#3B82F6" />
              <Text className="text-gray-800 ml-3">
                8 teams qualify based on regular season record
              </Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Ionicons name="trophy" size={20} color="#F59E0B" />
              <Text className="text-gray-800 ml-3">
                All series are best-of-7 format
              </Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Ionicons name="calendar" size={20} color="#10B981" />
              <Text className="text-gray-800 ml-3">
                Higher seed gets home court advantage
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="star" size={20} color="#EF4444" />
              <Text className="text-gray-800 ml-3">
                Winner becomes league champion
              </Text>
            </View>
          </View>
        </View>

        {/* Simulate Playoffs Button */}
        <View className="px-6 mb-8">
          <Pressable
            className="bg-orange-500 rounded-2xl p-6 shadow-sm"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="play-circle" size={32} color="white" />
              <Text className="text-white text-xl font-bold ml-3">
                Simulate Playoffs
              </Text>
            </View>
            <Text className="text-white/80 text-center mt-2">
              Run the entire playoff tournament
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}