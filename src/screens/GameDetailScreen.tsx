import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameStore } from '../state/gameStore';
import { RootStackParamList } from '../navigation/AppNavigator';

type GameDetailRouteProp = RouteProp<RootStackParamList, 'GameDetail'>;
type GameDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameDetail'>;

export default function GameDetailScreen() {
  const route = useRoute<GameDetailRouteProp>();
  const navigation = useNavigation<GameDetailNavigationProp>();
  const { gameId } = route.params;
  const { boxScores, allTeams } = useGameStore();

  const boxScore = boxScores.find(bs => bs.gameId === gameId);
  
  if (!boxScore) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Game not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const homeTeam = allTeams.find(t => t.id === boxScore.homeTeam);
  const awayTeam = allTeams.find(t => t.id === boxScore.awayTeam);

  if (!homeTeam || !awayTeam) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Teams not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isGameOver = boxScore.quarter >= 4 && boxScore.timeRemaining === "0:00";
  const winningTeam = boxScore.homeScore > boxScore.awayScore ? homeTeam : awayTeam;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6 bg-white">
          <View className="flex-row items-center mb-6">
            <Pressable
              onPress={() => navigation.goBack()}
              className="mr-4 p-2 bg-gray-100 rounded-full"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </Pressable>
            <Text className="text-gray-800 text-2xl font-bold flex-1">
              Game Details
            </Text>
          </View>

          {/* Score Display */}
          <View className="bg-gray-50 rounded-2xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <View className="items-center flex-1">
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  {awayTeam.city}
                </Text>
                <Text className="text-gray-600 mb-2">{awayTeam.name}</Text>
                <Text className="text-4xl font-bold text-gray-800">
                  {boxScore.awayScore}
                </Text>
              </View>
              
              <View className="items-center px-4">
                <Text className="text-gray-500 text-sm mb-1">
                  {isGameOver ? 'FINAL' : `Q${boxScore.quarter}`}
                </Text>
                {!isGameOver && (
                  <Text className="text-gray-500 text-sm">
                    {boxScore.timeRemaining}
                  </Text>
                )}
              </View>
              
              <View className="items-center flex-1">
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  {homeTeam.city}
                </Text>
                <Text className="text-gray-600 mb-2">{homeTeam.name}</Text>
                <Text className="text-4xl font-bold text-gray-800">
                  {boxScore.homeScore}
                </Text>
              </View>
            </View>
            
            {isGameOver && (
              <View className="items-center">
                <View 
                  className="rounded-lg px-4 py-2"
                  style={{ backgroundColor: winningTeam.colors.primary }}
                >
                  <Text className="text-white font-bold">
                    {winningTeam.city} {winningTeam.name} Wins!
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Team Stats Comparison */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Team Stats</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-800 flex-1 text-center">
                {awayTeam.abbreviation}
              </Text>
              <Text className="text-lg font-semibold text-gray-800 px-4">
                Stat
              </Text>
              <Text className="text-lg font-semibold text-gray-800 flex-1 text-center">
                {homeTeam.abbreviation}
              </Text>
            </View>
            
            {/* Field Goal Percentage */}
            <View className="flex-row justify-between items-center mb-3 py-2 border-b border-gray-100">
              <Text className="text-gray-800 font-semibold flex-1 text-center">
                {(Math.random() * 0.3 + 0.35).toFixed(1)}%
              </Text>
              <Text className="text-gray-600 px-4 text-center">FG%</Text>
              <Text className="text-gray-800 font-semibold flex-1 text-center">
                {(Math.random() * 0.3 + 0.35).toFixed(1)}%
              </Text>
            </View>
            
            {/* Rebounds */}
            <View className="flex-row justify-between items-center mb-3 py-2 border-b border-gray-100">
              <Text className="text-gray-800 font-semibold flex-1 text-center">
                {Math.floor(Math.random() * 20 + 35)}
              </Text>
              <Text className="text-gray-600 px-4 text-center">REB</Text>
              <Text className="text-gray-800 font-semibold flex-1 text-center">
                {Math.floor(Math.random() * 20 + 35)}
              </Text>
            </View>
            
            {/* Assists */}
            <View className="flex-row justify-between items-center mb-3 py-2 border-b border-gray-100">
              <Text className="text-gray-800 font-semibold flex-1 text-center">
                {Math.floor(Math.random() * 15 + 15)}
              </Text>
              <Text className="text-gray-600 px-4 text-center">AST</Text>
              <Text className="text-gray-800 font-semibold flex-1 text-center">
                {Math.floor(Math.random() * 15 + 15)}
              </Text>
            </View>
            
            {/* Turnovers */}
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-800 font-semibold flex-1 text-center">
                {Math.floor(Math.random() * 10 + 8)}
              </Text>
              <Text className="text-gray-600 px-4 text-center">TO</Text>
              <Text className="text-gray-800 font-semibold flex-1 text-center">
                {Math.floor(Math.random() * 10 + 8)}
              </Text>
            </View>
          </View>
        </View>

        {/* Top Performers */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Top Performers</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Away Team Top Performer */}
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <View 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: awayTeam.colors.primary }}
                />
                <Text className="text-lg font-bold text-gray-800">
                  {awayTeam.city} {awayTeam.name}
                </Text>
              </View>
              
              {awayTeam.roster.slice(0, 3).map((player) => (
                <View key={player.id} className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-800 font-semibold flex-1">
                    {player.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {Math.floor(Math.random() * 25 + 10)} PTS, {Math.floor(Math.random() * 8 + 3)} REB, {Math.floor(Math.random() * 6 + 2)} AST
                  </Text>
                </View>
              ))}
            </View>
            
            {/* Home Team Top Performer */}
            <View>
              <View className="flex-row items-center mb-3">
                <View 
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: homeTeam.colors.primary }}
                />
                <Text className="text-lg font-bold text-gray-800">
                  {homeTeam.city} {homeTeam.name}
                </Text>
              </View>
              
              {homeTeam.roster.slice(0, 3).map((player) => (
                <View key={player.id} className="flex-row justify-between items-center mb-2">
                  <Text className="text-gray-800 font-semibold flex-1">
                    {player.name}
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    {Math.floor(Math.random() * 25 + 10)} PTS, {Math.floor(Math.random() * 8 + 3)} REB, {Math.floor(Math.random() * 6 + 2)} AST
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Game Summary */}
        <View className="px-6 mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Game Summary</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Ionicons name="basketball" size={20} color="#FF6B35" />
              <Text className="text-gray-800 ml-3">
                {isGameOver ? 'Game completed' : `Currently in Q${boxScore.quarter}`}
              </Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Ionicons name="people" size={20} color="#3B82F6" />
              <Text className="text-gray-800 ml-3">
                Attendance: {Math.floor(Math.random() * 5000 + 15000).toLocaleString()}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="time" size={20} color="#10B981" />
              <Text className="text-gray-800 ml-3">
                Game duration: {Math.floor(Math.random() * 30 + 120)} minutes
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}