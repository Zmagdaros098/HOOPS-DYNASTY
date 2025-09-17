import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameStore } from '../state/gameStore';
import { RootStackParamList } from '../navigation/AppNavigator';
import EditableText from '../components/EditableText';

type EditPlayerRouteProp = RouteProp<RootStackParamList, 'EditPlayer'>;
type EditPlayerNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditPlayer'>;

export default function EditPlayerScreen() {
  const route = useRoute<EditPlayerRouteProp>();
  const navigation = useNavigation<EditPlayerNavigationProp>();
  const { playerId } = route.params;
  const { allTeams, updatePlayerName, validatePlayerName } = useGameStore();

  // Find the player across all teams
  let player = null;
  let playerTeam = null;
  
  for (const team of allTeams) {
    const foundPlayer = team.roster.find(p => p.id === playerId);
    if (foundPlayer) {
      player = foundPlayer;
      playerTeam = team;
      break;
    }
  }

  if (!player || !playerTeam) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Player not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleNameUpdate = (newName: string) => {
    updatePlayerName(playerTeam.id, player.id, newName);
    Alert.alert('Success', 'Player name updated successfully');
  };

  const validateName = (name: string) => {
    return validatePlayerName(name, playerTeam.id, player.id);
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

  const formatSalary = (salary: number) => {
    return `$${(salary / 1000000).toFixed(1)}M`;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <View className="flex-row items-center mb-6">
            <Pressable
              onPress={() => navigation.goBack()}
              className="mr-4 p-2 bg-gray-100 rounded-full"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </Pressable>
            <Text className="text-gray-800 text-2xl font-bold flex-1">
              Edit Player
            </Text>
          </View>
        </View>

        {/* Player Info */}
        <View className="px-6 mb-6">
          <View 
            className="px-6 py-8 rounded-2xl mb-6"
            style={{ backgroundColor: playerTeam.colors.primary }}
          >
            <View className="flex-row items-center">
              <View 
                className="w-16 h-16 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: getPositionColor(player.position) }}
              >
                <Text className="text-white font-bold text-xl">
                  {player.position}
                </Text>
              </View>
              
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold mb-1">
                  {player.name}
                </Text>
                <Text className="text-white/80 text-lg">
                  {playerTeam.city} {playerTeam.name}
                </Text>
              </View>
            </View>
          </View>

          {/* Edit Name Section */}
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Player Name
            </Text>
            
            <Text className="text-gray-600 mb-4">
              Tap the name below to edit it. The name must be unique within the team.
            </Text>
            
            <EditableText
              value={player.name}
              onSave={handleNameUpdate}
              placeholder="Enter player name"
              maxLength={30}
              validate={validateName}
              validationMessage="Player name already exists on this team"
              style="title"
            />
          </View>

          {/* Player Details */}
          <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Player Details
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Position:</Text>
                <Text className="font-semibold text-gray-800">{player.position}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Age:</Text>
                <Text className="font-semibold text-gray-800">{player.age} years</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Overall Rating:</Text>
                <Text className="font-semibold text-gray-800">{player.overall}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Salary:</Text>
                <Text className="font-semibold text-gray-800">{formatSalary(player.contract.salary)}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Contract Years:</Text>
                <Text className="font-semibold text-gray-800">{player.contract.years}</Text>
              </View>
            </View>
          </View>

          {/* Player Stats */}
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Season Stats
            </Text>
            
            <View className="flex-row justify-between mb-4">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-orange-600">
                  {player.stats.points.toFixed(1)}
                </Text>
                <Text className="text-gray-600 font-semibold">PPG</Text>
              </View>
              
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-blue-600">
                  {player.stats.rebounds.toFixed(1)}
                </Text>
                <Text className="text-gray-600 font-semibold">RPG</Text>
              </View>
              
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-600">
                  {player.stats.assists.toFixed(1)}
                </Text>
                <Text className="text-gray-600 font-semibold">APG</Text>
              </View>
            </View>
            
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-xl font-bold text-purple-600">
                  {player.stats.steals.toFixed(1)}
                </Text>
                <Text className="text-gray-600 font-semibold">SPG</Text>
              </View>
              
              <View className="items-center flex-1">
                <Text className="text-xl font-bold text-red-600">
                  {player.stats.blocks.toFixed(1)}
                </Text>
                <Text className="text-gray-600 font-semibold">BPG</Text>
              </View>
              
              <View className="items-center flex-1">
                <Text className="text-xl font-bold text-gray-600">
                  {((player.stats.points + player.stats.rebounds + player.stats.assists) / 3).toFixed(1)}
                </Text>
                <Text className="text-gray-600 font-semibold">EFF</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-6 mb-8">
          <Pressable
            className="bg-orange-500 rounded-2xl p-4 shadow-sm"
            onPress={() => navigation.goBack()}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text className="text-white text-lg font-bold ml-3">
                Done Editing
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}