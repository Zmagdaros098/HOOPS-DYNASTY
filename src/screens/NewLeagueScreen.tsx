import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NewLeagueScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LeagueConfig {
  leagueName: string;
  seasonLength: number;
  difficulty: 'easy' | 'normal' | 'hard';
  numberOfTeams: number;
}

export default function NewLeagueScreen() {
  const navigation = useNavigation<NewLeagueScreenNavigationProp>();
  const [leagueConfig, setLeagueConfig] = useState<LeagueConfig>({
    leagueName: 'My Basketball League',
    seasonLength: 30,
    difficulty: 'normal',
    numberOfTeams: 30
  });

  const seasonLengthOptions = [
    { value: 20, label: '20 weeks', description: 'Quick season' },
    { value: 30, label: '30 weeks', description: 'Standard season' },
    { value: 40, label: '40 weeks', description: 'Extended season' }
  ];

  const difficultyOptions = [
    { value: 'easy' as const, label: 'Easy', description: 'Relaxed gameplay, favorable trades' },
    { value: 'normal' as const, label: 'Normal', description: 'Balanced gameplay experience' },
    { value: 'hard' as const, label: 'Hard', description: 'Challenging AI, tough decisions' }
  ];

  const teamCountOptions = [
    { value: 8, label: '8 teams', description: 'Small league, quick seasons' },
    { value: 16, label: '16 teams', description: 'Medium league, balanced play' },
    { value: 24, label: '24 teams', description: 'Large league, more competition' },
    { value: 30, label: '30 teams', description: 'Full league, maximum realism' }
  ];

  const handleContinue = () => {
    if (!leagueConfig.leagueName.trim()) {
      Alert.alert('Error', 'Please enter a league name');
      return;
    }

    navigation.navigate('TeamSelection', { leagueConfig });
  };

  const handleBack = () => {
    Alert.alert(
      'Cancel League Creation',
      'Are you sure you want to cancel? Your settings will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => navigation.goBack() }
      ]
    );
  };

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
              Create New League
            </Text>
          </View>

          <Text className="text-gray-600 text-lg">
            Customize your league settings and start fresh
          </Text>
        </View>

        {/* League Name */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">League Name</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              What would you like to call your league?
            </Text>
            <TextInput
              className="bg-gray-50 rounded-xl p-4 text-lg text-gray-800"
              value={leagueConfig.leagueName}
              onChangeText={(text) => setLeagueConfig(prev => ({ ...prev, leagueName: text }))}
              placeholder="Enter league name"
              placeholderTextColor="#9CA3AF"
              maxLength={30}
            />
            <Text className="text-gray-500 text-sm mt-2">
              {leagueConfig.leagueName.length}/30 characters
            </Text>
          </View>
        </View>

        {/* Season Length */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Season Length</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              How long should each season be?
            </Text>
            
            {seasonLengthOptions.map((option) => (
              <Pressable
                key={option.value}
                className={`rounded-xl p-4 mb-3 border-2 ${
                  leagueConfig.seasonLength === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                onPress={() => setLeagueConfig(prev => ({ ...prev, seasonLength: option.value }))}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className={`text-lg font-bold ${
                      leagueConfig.seasonLength === option.value ? 'text-orange-800' : 'text-gray-800'
                    }`}>
                      {option.label}
                    </Text>
                    <Text className={`text-sm ${
                      leagueConfig.seasonLength === option.value ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {option.description}
                    </Text>
                  </View>
                  {leagueConfig.seasonLength === option.value && (
                    <Ionicons name="checkmark-circle" size={24} color="#FF6B35" />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Team Count */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">League Size</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              How many teams in your league?
            </Text>
            
            {teamCountOptions.map((option) => (
              <Pressable
                key={option.value}
                className={`rounded-xl p-4 mb-3 border-2 ${
                  leagueConfig.numberOfTeams === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                onPress={() => setLeagueConfig(prev => ({ ...prev, numberOfTeams: option.value }))}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className={`text-lg font-bold ${
                      leagueConfig.numberOfTeams === option.value ? 'text-orange-800' : 'text-gray-800'
                    }`}>
                      {option.label}
                    </Text>
                    <Text className={`text-sm ${
                      leagueConfig.numberOfTeams === option.value ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {option.description}
                    </Text>
                  </View>
                  {leagueConfig.numberOfTeams === option.value && (
                    <Ionicons name="checkmark-circle" size={24} color="#FF6B35" />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Difficulty */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Difficulty</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Choose your challenge level
            </Text>
            
            {difficultyOptions.map((option) => (
              <Pressable
                key={option.value}
                className={`rounded-xl p-4 mb-3 border-2 ${
                  leagueConfig.difficulty === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                onPress={() => setLeagueConfig(prev => ({ ...prev, difficulty: option.value }))}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className={`text-lg font-bold ${
                      leagueConfig.difficulty === option.value ? 'text-orange-800' : 'text-gray-800'
                    }`}>
                      {option.label}
                    </Text>
                    <Text className={`text-sm ${
                      leagueConfig.difficulty === option.value ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {option.description}
                    </Text>
                  </View>
                  {leagueConfig.difficulty === option.value && (
                    <Ionicons name="checkmark-circle" size={24} color="#FF6B35" />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* League Summary */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">League Summary</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Ionicons name="basketball" size={32} color="#FF6B35" />
              <View className="ml-4">
                <Text className="text-xl font-bold text-gray-800">
                  {leagueConfig.leagueName}
                </Text>
                <Text className="text-gray-600">Your New League</Text>
              </View>
            </View>
            
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Season Length:</Text>
                <Text className="font-semibold text-gray-800">
                  {leagueConfig.seasonLength} weeks
                </Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Difficulty:</Text>
                <Text className="font-semibold text-gray-800 capitalize">
                  {leagueConfig.difficulty}
                </Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-600">League Size:</Text>
                <Text className="font-semibold text-gray-800">
                  {leagueConfig.numberOfTeams} teams
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <View className="px-6 mb-8">
          <Pressable
            className="bg-orange-500 rounded-2xl p-6 shadow-sm"
            onPress={handleContinue}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white text-xl font-bold mr-3">
                Continue to Team Selection
              </Text>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}