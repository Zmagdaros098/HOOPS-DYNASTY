import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameStore } from '../state/gameStore';
import { initializeGameData } from '../data/mockData';
import { RootStackParamList } from '../navigation/AppNavigator';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const { currentTeam, allTeams, setCurrentTeam, setAllTeams } = useGameStore();
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  useEffect(() => {
    if (allTeams.length === 0) {
      const { teams, currentTeam: defaultTeam } = initializeGameData();
      setAllTeams(teams);
      setCurrentTeam(defaultTeam);
    }
  }, [allTeams.length, setAllTeams, setCurrentTeam]);

  if (!currentTeam) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatSalary = (salary: number) => {
    return `$${(salary / 1000000).toFixed(1)}M`;
  };

  const topPlayers = currentTeam.roster
    .sort((a, b) => b.overall - a.overall)
    .slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Team Header */}
        <View 
          className="px-6 py-8 rounded-b-3xl mb-6"
          style={{ backgroundColor: currentTeam.colors.primary }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-white text-3xl font-bold">
                {currentTeam.city} {currentTeam.name}
              </Text>
              <Text className="text-white/80 text-lg">
                {currentTeam.wins}-{currentTeam.losses}
              </Text>
            </View>
            <View className="bg-white/20 rounded-full p-3">
              <Ionicons name="basketball" size={32} color="white" />
            </View>
          </View>
          
          <View className="flex-row justify-between">
            <View className="bg-white/20 rounded-xl p-4 flex-1 mr-2">
              <Text className="text-white/80 text-sm">Win %</Text>
              <Text className="text-white text-xl font-bold">
                {((currentTeam.wins / (currentTeam.wins + currentTeam.losses)) * 100).toFixed(1)}%
              </Text>
            </View>
            <View className="bg-white/20 rounded-xl p-4 flex-1 ml-2">
              <Text className="text-white/80 text-sm">Payroll</Text>
              <Text className="text-white text-xl font-bold">
                {formatSalary(currentTeam.salary)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Team Overview</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-800">Roster Size</Text>
              <Text className="text-lg font-bold text-orange-600">
                {currentTeam.roster.length}/15
              </Text>
            </View>
            
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-800">Avg Overall</Text>
              <Text className="text-lg font-bold text-orange-600">
                {Math.round(currentTeam.roster.reduce((sum, p) => sum + p.overall, 0) / currentTeam.roster.length)}
              </Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Cap Space</Text>
              <Text className="text-lg font-bold text-green-600">
                {formatSalary(140000000 - currentTeam.salary)}
              </Text>
            </View>
          </View>
        </View>

        {/* Top Players */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Top Players</Text>
          
          {topPlayers.map((player, index) => (
            <Pressable
              key={player.id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
              onPress={() => navigation.navigate('PlayerDetail', { playerId: player.id })}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <View 
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: currentTeam.colors.primary }}
                    >
                      <Text className="text-white font-bold text-sm">
                        {index + 1}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-lg font-bold text-gray-800">
                        {player.name}
                      </Text>
                      <Text className="text-gray-600">
                        {player.position} • {player.age} yrs
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View className="items-end">
                  <View className="bg-orange-100 rounded-lg px-3 py-1 mb-1">
                    <Text className="text-orange-800 font-bold">
                      {player.overall} OVR
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-sm">
                    {formatSalary(player.contract.salary)}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Recent Activity */}
        <View className="px-6 mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center mb-3">
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text className="text-gray-800 ml-3 flex-1">
                Season simulation ready
              </Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <Ionicons name="people" size={24} color="#3B82F6" />
              <Text className="text-gray-800 ml-3 flex-1">
                {currentTeam.roster.length} players on roster
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="swap-horizontal" size={24} color="#F59E0B" />
              <Text className="text-gray-800 ml-3 flex-1">
                Trade deadline approaching
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}