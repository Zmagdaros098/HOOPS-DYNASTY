import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameStore } from '../state/gameStore';
import { RootStackParamList } from '../navigation/AppNavigator';
import PersonalityCard from '../components/PersonalityCard';
import AttributeCard from '../components/AttributeCard';

type RosterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RosterScreen() {
  const { currentTeam } = useGameStore();
  const navigation = useNavigation<RosterScreenNavigationProp>();

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

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'PG': return '#3B82F6';
      case 'SG': return '#10B981';
      case 'SF': return '#F59E0B';
      case 'PF': return '#EF4444';
      case 'C': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const sortedRoster = [...currentTeam.roster].sort((a, b) => b.overall - a.overall);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            {currentTeam.name} Roster
          </Text>
          <Text className="text-gray-600 text-lg">
            {currentTeam.roster.length} players • {formatSalary(currentTeam.salary)} total
          </Text>
        </View>

        {/* Roster List */}
        <View className="px-6">
          {sortedRoster.map((player) => (
            <Pressable
              key={player.id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-sm"
              onPress={() => navigation.navigate('PlayerDetail', { playerId: player.id })}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View className="flex-row items-center">
                {/* Position Badge */}
                <View className="relative mr-4">
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: getPositionColor(player.position) }}
                  >
                    <Text className="text-white font-bold text-sm">
                      {player.position}
                    </Text>
                  </View>
                  {player.injury && (
                    <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
                      <Ionicons name="medical" size={10} color="white" />
                    </View>
                  )}
                </View>

                {/* Player Info */}
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800 mb-1">
                    {player.name}
                  </Text>
                  <View className="flex-row items-center mb-2">
                    <Text className="text-gray-600 mr-4">
                      Age: {player.age}
                    </Text>
                    <View className="bg-orange-100 rounded-lg px-2 py-1 mr-2">
                      <Text className="text-orange-800 font-semibold text-sm">
                        {player.overall} OVR
                      </Text>
                    </View>
                    {player.injury && (
                      <View className="bg-red-100 rounded-lg px-2 py-1">
                        <Text className="text-red-800 font-semibold text-xs">
                          {player.injury.type} ({player.injury.weeksRemaining}w)
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Attributes and Personality Row */}
                  <View className="mb-3 space-y-2">
                    <AttributeCard 
                      attributes={player.attributes} 
                      position={player.position}
                      compact={true} 
                    />
                    <PersonalityCard personality={player.personality} compact={true} />
                  </View>
                  
                  <View className="flex-row justify-between">
                    <View className="items-center">
                      <Text className="text-xs text-gray-500">PPG</Text>
                      <Text className="text-sm font-semibold text-gray-800">
                        {player.stats.points.toFixed(1)}
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-xs text-gray-500">RPG</Text>
                      <Text className="text-sm font-semibold text-gray-800">
                        {player.stats.rebounds.toFixed(1)}
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-xs text-gray-500">APG</Text>
                      <Text className="text-sm font-semibold text-gray-800">
                        {player.stats.assists.toFixed(1)}
                      </Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-xs text-gray-500">Contract</Text>
                      <Text className="text-sm font-semibold text-gray-800">
                        {formatSalary(player.contract.salary)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Edit and Arrow */}
                <View className="flex-row items-center">
                  <Pressable
                    className="p-2 mr-2"
                    onPress={(e) => {
                      e.stopPropagation();
                      navigation.navigate('EditPlayer', { playerId: player.id });
                    }}
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <Ionicons name="pencil" size={18} color="#FF6B35" />
                  </Pressable>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Roster Summary */}
        <View className="px-6 py-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Roster Breakdown
            </Text>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Point Guards</Text>
              <Text className="font-semibold text-gray-800">
                {currentTeam.roster.filter(p => p.position === 'PG').length}
              </Text>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Shooting Guards</Text>
              <Text className="font-semibold text-gray-800">
                {currentTeam.roster.filter(p => p.position === 'SG').length}
              </Text>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Small Forwards</Text>
              <Text className="font-semibold text-gray-800">
                {currentTeam.roster.filter(p => p.position === 'SF').length}
              </Text>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Power Forwards</Text>
              <Text className="font-semibold text-gray-800">
                {currentTeam.roster.filter(p => p.position === 'PF').length}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Centers</Text>
              <Text className="font-semibold text-gray-800">
                {currentTeam.roster.filter(p => p.position === 'C').length}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}