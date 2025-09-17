import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameStore } from '../state/gameStore';
import { RootStackParamList } from '../navigation/AppNavigator';
import PersonalityCard from '../components/PersonalityCard';
import AttributeCard from '../components/AttributeCard';
import { 
  formatCollegeDisplay, 
  formatDraftDisplay, 
  getCollegeTier, 
  getCollegeTierColor, 
  getCollegeTierBgColor,
  getDraftRoundColor,
  getDraftRoundBgColor
} from '../utils/bioUtils';

type PlayerDetailRouteProp = RouteProp<RootStackParamList, 'PlayerDetail'>;
type PlayerDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PlayerDetail'>;

export default function PlayerDetailScreen() {
  const route = useRoute<PlayerDetailRouteProp>();
  const navigation = useNavigation<PlayerDetailNavigationProp>();
  const { playerId } = route.params;
  const { allTeams } = useGameStore();

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

  const getOverallGrade = (overall: number) => {
    if (overall >= 90) return { grade: 'A+', color: '#10B981' };
    if (overall >= 85) return { grade: 'A', color: '#10B981' };
    if (overall >= 80) return { grade: 'B+', color: '#3B82F6' };
    if (overall >= 75) return { grade: 'B', color: '#3B82F6' };
    if (overall >= 70) return { grade: 'C+', color: '#F59E0B' };
    if (overall >= 65) return { grade: 'C', color: '#F59E0B' };
    if (overall >= 60) return { grade: 'D+', color: '#EF4444' };
    return { grade: 'D', color: '#EF4444' };
  };

  const overallGrade = getOverallGrade(player.overall);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View 
          className="px-6 py-8 rounded-b-3xl mb-6"
          style={{ backgroundColor: playerTeam.colors.primary }}
        >
          <View className="flex-row items-center mb-6">
            <Pressable
              onPress={() => navigation.goBack()}
              className="mr-4 p-2 bg-white/20 rounded-full"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <Text className="text-white text-2xl font-bold flex-1">
              Player Details
            </Text>
            <Pressable
              onPress={() => navigation.navigate('EditPlayer', { playerId: player.id })}
              className="p-2 bg-white/20 rounded-full"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="pencil" size={24} color="white" />
            </Pressable>
          </View>

          <View className="flex-row items-center">
            <View 
              className="w-20 h-20 rounded-full items-center justify-center mr-6"
              style={{ backgroundColor: getPositionColor(player.position) }}
            >
              <Text className="text-white font-bold text-2xl">
                {player.position}
              </Text>
            </View>
            
            <View className="flex-1">
              <Text className="text-white text-3xl font-bold mb-1">
                {player.name}
              </Text>
              <Text className="text-white/80 text-lg mb-2">
                {playerTeam.city} {playerTeam.name}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-white/80 text-lg mr-4">
                  Age: {player.age}
                </Text>
                <View 
                  className="rounded-lg px-3 py-1"
                  style={{ backgroundColor: overallGrade.color }}
                >
                  <Text className="text-white font-bold">
                    {player.overall} OVR ({overallGrade.grade})
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Contract Information */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Contract</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-800">Annual Salary</Text>
              <Text className="text-2xl font-bold text-green-600">
                {formatSalary(player.contract.salary)}
              </Text>
            </View>
            
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-800">Contract Length</Text>
              <Text className="text-lg font-bold text-gray-800">
                {player.contract.years} {player.contract.years === 1 ? 'year' : 'years'}
              </Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Total Value</Text>
              <Text className="text-lg font-bold text-orange-600">
                {formatSalary(player.contract.salary * player.contract.years)}
              </Text>
            </View>
          </View>
        </View>

        {/* Season Statistics */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Season Stats</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row justify-between mb-6">
              <View className="items-center flex-1">
                <Text className="text-3xl font-bold text-orange-600">
                  {player.stats.points.toFixed(1)}
                </Text>
                <Text className="text-gray-600 font-semibold">PPG</Text>
                <Text className="text-xs text-gray-500">Points Per Game</Text>
              </View>
              
              <View className="items-center flex-1">
                <Text className="text-3xl font-bold text-blue-600">
                  {player.stats.rebounds.toFixed(1)}
                </Text>
                <Text className="text-gray-600 font-semibold">RPG</Text>
                <Text className="text-xs text-gray-500">Rebounds Per Game</Text>
              </View>
              
              <View className="items-center flex-1">
                <Text className="text-3xl font-bold text-green-600">
                  {player.stats.assists.toFixed(1)}
                </Text>
                <Text className="text-gray-600 font-semibold">APG</Text>
                <Text className="text-xs text-gray-500">Assists Per Game</Text>
              </View>
            </View>
            
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-purple-600">
                  {player.stats.steals.toFixed(1)}
                </Text>
                <Text className="text-gray-600 font-semibold">SPG</Text>
                <Text className="text-xs text-gray-500">Steals Per Game</Text>
              </View>
              
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-red-600">
                  {player.stats.blocks.toFixed(1)}
                </Text>
                <Text className="text-gray-600 font-semibold">BPG</Text>
                <Text className="text-xs text-gray-500">Blocks Per Game</Text>
              </View>
              
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-gray-600">
                  {((player.stats.points + player.stats.rebounds + player.stats.assists) / 3).toFixed(1)}
                </Text>
                <Text className="text-gray-600 font-semibold">EFF</Text>
                <Text className="text-xs text-gray-500">Efficiency</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Attributes */}
        <View className="px-6 mb-6">
          <AttributeCard 
            attributes={player.attributes} 
            position={player.position}
            showDetails={true} 
          />
        </View>

        {/* Personality */}
        <View className="px-6 mb-6">
          <PersonalityCard personality={player.personality} showDetails={true} />
        </View>

        {/* Player Bio */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Player Bio</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Height and Weight */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-2">Physical</Text>
              <View className="flex-row items-center">
                <View className="flex-row items-center mr-6">
                  <Ionicons name="resize" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-2 text-lg font-medium">
                    {player.bio.height}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="fitness" size={20} color="#6B7280" />
                  <Text className="text-gray-700 ml-2 text-lg font-medium">
                    {player.bio.weight} lbs
                  </Text>
                </View>
              </View>
            </View>

            {/* College */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-2">College</Text>
              <View className="flex-row items-center">
                <View 
                  className="rounded-lg px-3 py-1 mr-3"
                  style={{ 
                    backgroundColor: getCollegeTierBgColor(getCollegeTier(player.bio.college))
                  }}
                >
                  <Text 
                    className="font-semibold"
                    style={{ 
                      color: getCollegeTierColor(getCollegeTier(player.bio.college))
                    }}
                  >
                    {formatCollegeDisplay(player.bio.college)}
                  </Text>
                </View>
                {getCollegeTier(player.bio.college) === 'elite' && (
                  <View className="bg-yellow-100 rounded-lg px-2 py-1">
                    <Text className="text-yellow-800 text-xs font-bold">ELITE</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Hometown */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-2">Hometown</Text>
              <View className="flex-row items-center">
                <Ionicons name="location" size={20} color="#6B7280" />
                <Text className="text-gray-700 ml-2 text-lg">
                  {player.bio.hometown}
                </Text>
              </View>
            </View>

            {/* Draft Information */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-2">Draft History</Text>
              <View className="flex-row items-center">
                <View 
                  className="rounded-lg px-3 py-1 mr-3"
                  style={{ 
                    backgroundColor: getDraftRoundBgColor(player.bio.draftRound)
                  }}
                >
                  <Text 
                    className="font-semibold"
                    style={{ 
                      color: getDraftRoundColor(player.bio.draftRound)
                    }}
                  >
                    {formatDraftDisplay(player.bio)}
                  </Text>
                </View>
                {player.bio.draftRound === 1 && player.bio.draftPick && player.bio.draftPick <= 10 && (
                  <View className="bg-purple-100 rounded-lg px-2 py-1">
                    <Text className="text-purple-800 text-xs font-bold">TOP 10</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Player Analysis */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Player Analysis</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-2">Strengths</Text>
              <View className="flex-row flex-wrap">
                {player.stats.points > 15 && (
                  <View className="bg-green-100 rounded-lg px-3 py-1 mr-2 mb-2">
                    <Text className="text-green-800 font-semibold">Scorer</Text>
                  </View>
                )}
                {player.stats.rebounds > 8 && (
                  <View className="bg-blue-100 rounded-lg px-3 py-1 mr-2 mb-2">
                    <Text className="text-blue-800 font-semibold">Rebounder</Text>
                  </View>
                )}
                {player.stats.assists > 6 && (
                  <View className="bg-purple-100 rounded-lg px-3 py-1 mr-2 mb-2">
                    <Text className="text-purple-800 font-semibold">Playmaker</Text>
                  </View>
                )}
                {player.stats.steals > 1.5 && (
                  <View className="bg-orange-100 rounded-lg px-3 py-1 mr-2 mb-2">
                    <Text className="text-orange-800 font-semibold">Defender</Text>
                  </View>
                )}
                {player.overall > 80 && (
                  <View className="bg-yellow-100 rounded-lg px-3 py-1 mr-2 mb-2">
                    <Text className="text-yellow-800 font-semibold">Elite</Text>
                  </View>
                )}
              </View>
            </View>
            
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-2">Development Potential</Text>
              <View className="bg-gray-200 rounded-full h-3 mb-2">
                <View 
                  className="bg-orange-500 h-3 rounded-full"
                  style={{ 
                    width: `${Math.max(0, Math.min(100, (30 - player.age) * 10))}%`
                  }}
                />
              </View>
              <Text className="text-gray-600 text-sm">
                {player.age < 25 ? 'High potential for growth' : 
                 player.age < 30 ? 'Moderate potential for growth' : 
                 'Limited potential for growth'}
              </Text>
            </View>
            
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-2">Trade Value</Text>
              <View className="flex-row items-center">
                <View className="flex-1">
                  <View className="bg-gray-200 rounded-full h-3 mb-2">
                    <View 
                      className="bg-green-500 h-3 rounded-full"
                      style={{ 
                        width: `${Math.min(100, (player.overall / 100) * 100)}%`
                      }}
                    />
                  </View>
                  <Text className="text-gray-600 text-sm">
                    {player.overall > 85 ? 'Very High' : 
                     player.overall > 75 ? 'High' : 
                     player.overall > 65 ? 'Medium' : 'Low'}
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-green-600 ml-4">
                  {Math.round(player.overall * 1.2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-6 mb-8">
          <Pressable
            className="bg-green-500 rounded-2xl p-4 mb-3 shadow-sm"
            onPress={() => navigation.navigate('EditPlayer', { playerId: player.id })}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="pencil" size={24} color="white" />
              <Text className="text-white text-lg font-bold ml-3">
                Edit Player Name
              </Text>
            </View>
          </Pressable>

          <Pressable
            className="bg-orange-500 rounded-2xl p-4 mb-3 shadow-sm"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="swap-horizontal" size={24} color="white" />
              <Text className="text-white text-lg font-bold ml-3">
                Propose Trade
              </Text>
            </View>
          </Pressable>
          
          <Pressable
            className="bg-blue-500 rounded-2xl p-4 shadow-sm"
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="stats-chart" size={24} color="white" />
              <Text className="text-white text-lg font-bold ml-3">
                View Full Stats
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}