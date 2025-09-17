import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameStore } from '../state/gameStore';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Team } from '../types/basketball';
import TeamCard from '../components/TeamCard';

type TeamSelectionRouteProp = RouteProp<RootStackParamList, 'TeamSelection'>;
type TeamSelectionNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TeamSelection'>;

export default function TeamSelectionScreen() {
  const route = useRoute<TeamSelectionRouteProp>();
  const navigation = useNavigation<TeamSelectionNavigationProp>();
  const { leagueConfig } = route.params;
  const { generateNewLeague, initializeNewLeague } = useGameStore();
  
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isCreatingLeague, setIsCreatingLeague] = useState(false);

  // Generate teams when component mounts
  useEffect(() => {
    const teams = generateNewLeague(leagueConfig);
    setAvailableTeams(teams);
  }, [leagueConfig, generateNewLeague]);

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  const handleStartLeague = async () => {
    if (!selectedTeamId) {
      Alert.alert('Error', 'Please select a team to manage');
      return;
    }

    Alert.alert(
      'Start League',
      `Are you sure you want to start "${leagueConfig.leagueName}" as the ${availableTeams.find(t => t.id === selectedTeamId)?.city} ${availableTeams.find(t => t.id === selectedTeamId)?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Start League',
          style: 'default',
          onPress: async () => {
            setIsCreatingLeague(true);
            
            try {
              // Initialize the new league with selected team
              await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate league creation
              
              // Initialize the league in the store
              initializeNewLeague(leagueConfig, selectedTeamId);
              
              // Navigate back to main app
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
              
            } catch (error) {
              Alert.alert('Error', 'Failed to create league. Please try again.');
              setIsCreatingLeague(false);
            }
          }
        }
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const selectedTeam = availableTeams.find(team => team.id === selectedTeamId);

  if (isCreatingLeague) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-8 shadow-lg items-center">
            <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-6">
              <Ionicons name="basketball" size={40} color="#FF6B35" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Creating Your League
            </Text>
            <Text className="text-gray-600 text-center text-lg mb-6">
              Generating teams, players, and setting up your season...
            </Text>
            <View className="w-full bg-gray-200 rounded-full h-3">
              <View className="bg-orange-500 h-3 rounded-full animate-pulse" style={{ width: '70%' }} />
            </View>
            <Text className="text-gray-500 text-sm mt-3">This may take a moment</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <View className="flex-row items-center mb-6">
            <Pressable
              onPress={handleBack}
              className="mr-4 p-2 bg-gray-100 rounded-full"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </Pressable>
            <Text className="text-gray-800 text-2xl font-bold flex-1">
              Choose Your Team
            </Text>
          </View>

          <Text className="text-gray-600 text-lg">
            Select the team you want to manage in {leagueConfig.leagueName}
          </Text>
        </View>

        {/* Team Selection */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Available Teams</Text>
          
          {availableTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              isSelected={selectedTeamId === team.id}
              onPress={() => handleTeamSelect(team.id)}
              showStats={true}
            />
          ))}
        </View>

        {/* Selected Team Preview */}
        {selectedTeam && (
          <View className="px-6 mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Your Team</Text>
            
            <View className="bg-white rounded-2xl p-6 shadow-sm">
              <View className="flex-row items-center mb-4">
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: selectedTeam.colors.primary }}
                >
                  <Ionicons name="basketball" size={24} color="white" />
                </View>
                <View>
                  <Text className="text-xl font-bold text-gray-800">
                    {selectedTeam.city} {selectedTeam.name}
                  </Text>
                  <Text className="text-gray-600">Your Selected Team</Text>
                </View>
              </View>
              
              <Text className="text-gray-600 mb-3">Top Players:</Text>
              {selectedTeam.roster
                .sort((a, b) => b.overall - a.overall)
                .slice(0, 3)
                .map((player, index) => (
                  <View key={player.id} className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-800 font-semibold">
                      {index + 1}. {player.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-gray-600 text-sm mr-2">{player.position}</Text>
                      <View className="bg-orange-100 rounded px-2 py-1">
                        <Text className="text-orange-800 font-semibold text-xs">
                          {player.overall} OVR
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}

        {/* Start League Button */}
        <View className="px-6 mb-8">
          <Pressable
            className={`rounded-2xl p-6 shadow-sm ${
              selectedTeamId ? 'bg-orange-500' : 'bg-gray-300'
            }`}
            onPress={handleStartLeague}
            disabled={!selectedTeamId}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons 
                name="play-circle" 
                size={32} 
                color={selectedTeamId ? "white" : "#9CA3AF"} 
              />
              <Text className={`text-xl font-bold ml-3 ${
                selectedTeamId ? 'text-white' : 'text-gray-500'
              }`}>
                Start League
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}