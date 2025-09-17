import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameStore } from '../state/gameStore';
import { RootStackParamList } from '../navigation/AppNavigator';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { currentTeam, currentSeason, currentWeek, allTeams, resetSeason } = useGameStore();
  const [isResetting, setIsResetting] = useState(false);

  const handleNewLeague = () => {
    Alert.alert(
      "Start New League",
      "This will permanently delete your current league progress and start fresh. Are you sure you want to continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Start New League",
          style: "destructive",
          onPress: () => {
            navigation.navigate('NewLeague');
          }
        }
      ]
    );
  };

  const handleResetConfirmation = () => {
    Alert.alert(
      "Reset Current Season",
      "This will reset the current season to week 1 but keep your team and players. Continue?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset Season",
          style: "destructive",
          onPress: () => {
            setIsResetting(true);
            resetSeason();
            setTimeout(() => {
              setIsResetting(false);
              Alert.alert("Success", "Season has been reset to week 1");
            }, 1000);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Settings
          </Text>
          <Text className="text-gray-600 text-lg">
            Manage your league and game preferences
          </Text>
        </View>

        {/* Current League Info */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Current League</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center mb-4">
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mr-4"
                style={{ backgroundColor: currentTeam?.colors.primary || '#FF6B35' }}
              >
                <Ionicons name="basketball" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-800">
                  {currentTeam?.city} {currentTeam?.name}
                </Text>
                <Text className="text-gray-600">
                  Your Team
                </Text>
              </View>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Season:</Text>
              <Text className="font-semibold text-gray-800">{currentSeason}</Text>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Current Week:</Text>
              <Text className="font-semibold text-gray-800">{currentWeek} / 30</Text>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-600">Record:</Text>
              <Text className="font-semibold text-gray-800">
                {currentTeam?.wins}-{currentTeam?.losses}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Teams in League:</Text>
              <Text className="font-semibold text-gray-800">{allTeams.length}</Text>
            </View>
          </View>
        </View>

        {/* League Actions */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">League Actions</Text>
          
          {/* New League Button */}
          <Pressable
            className="bg-orange-500 rounded-2xl p-6 mb-4 shadow-sm"
            onPress={handleNewLeague}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center">
              <Ionicons name="add-circle" size={32} color="white" />
              <View className="flex-1 ml-4">
                <Text className="text-white text-xl font-bold">
                  Start New League
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  Create a fresh league with new teams and players
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </Pressable>

          {/* Team Management Button */}
          <Pressable
            className="bg-green-500 rounded-2xl p-6 mb-4 shadow-sm"
            onPress={() => navigation.navigate('TeamManagement')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center">
              <Ionicons name="people-circle" size={32} color="white" />
              <View className="flex-1 ml-4">
                <Text className="text-white text-xl font-bold">
                  Team Management
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  Edit team names, cities, colors, and player names
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </Pressable>

          {/* Team Strategy Button */}
          <Pressable
            className="bg-purple-500 rounded-2xl p-6 mb-4 shadow-sm"
            onPress={() => navigation.navigate('TeamStrategy')}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <View className="flex-row items-center">
              <Ionicons name="analytics" size={32} color="white" />
              <View className="flex-1 ml-4">
                <Text className="text-white text-xl font-bold">
                  Team Strategy
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  Set offensive and defensive strategies for your team
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </Pressable>

          {/* Reset Season Button */}
          <Pressable
            className="bg-blue-500 rounded-2xl p-6 mb-4 shadow-sm"
            onPress={handleResetConfirmation}
            disabled={isResetting}
            style={({ pressed }) => ({ opacity: pressed || isResetting ? 0.7 : 1 })}
          >
            <View className="flex-row items-center">
              <Ionicons name="refresh-circle" size={32} color="white" />
              <View className="flex-1 ml-4">
                <Text className="text-white text-xl font-bold">
                  {isResetting ? 'Resetting...' : 'Reset Current Season'}
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  Start over from week 1 with same teams
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="white" />
            </View>
          </Pressable>
        </View>

        {/* Game Settings */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Game Settings</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Difficulty Setting */}
            <Pressable
              className="flex-row items-center justify-between py-4 border-b border-gray-100"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="speedometer" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="text-lg font-semibold text-gray-800">Difficulty</Text>
                  <Text className="text-gray-600 text-sm">Normal</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>

            {/* Season Length Setting */}
            <Pressable
              className="flex-row items-center justify-between py-4 border-b border-gray-100"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="calendar" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="text-lg font-semibold text-gray-800">Season Length</Text>
                  <Text className="text-gray-600 text-sm">30 weeks</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>

            {/* Auto-save Setting */}
            <Pressable
              className="flex-row items-center justify-between py-4"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="save" size={24} color="#6B7280" />
                <View className="ml-3">
                  <Text className="text-lg font-semibold text-gray-800">Auto-save</Text>
                  <Text className="text-gray-600 text-sm">Enabled</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
          </View>
        </View>

        {/* About Section */}
        <View className="px-6 mb-8">
          <Text className="text-2xl font-bold text-gray-800 mb-4">About</Text>
          
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Ionicons name="basketball" size={32} color="#FF6B35" />
              <View className="ml-4">
                <Text className="text-xl font-bold text-gray-800">Basketball GM</Text>
                <Text className="text-gray-600">Version 1.0.0</Text>
              </View>
            </View>
            
            <Text className="text-gray-600 text-sm leading-5">
              Manage your basketball team through trades, drafts, and seasons. 
              Build a championship roster and lead your team to glory!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}