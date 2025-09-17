import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameStore } from '../state/gameStore';
import { RootStackParamList } from '../navigation/AppNavigator';
import EditableText from '../components/EditableText';
import ColorPicker from '../components/ColorPicker';

type TeamManagementScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TeamManagementScreen() {
  const navigation = useNavigation<TeamManagementScreenNavigationProp>();
  const { allTeams, updateTeamInfo, validateTeamName } = useGameStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [editingColor, setEditingColor] = useState<'primary' | 'secondary' | null>(null);

  const filteredTeams = allTeams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const handleTeamNameUpdate = (teamId: string, field: 'name' | 'city' | 'abbreviation', newValue: string) => {
    updateTeamInfo(teamId, { [field]: newValue });
  };

  const handleColorUpdate = (teamId: string, colorType: 'primary' | 'secondary', color: string) => {
    const team = allTeams.find(t => t.id === teamId);
    if (!team) return;

    const newColors = {
      ...team.colors,
      [colorType]: color
    };
    
    updateTeamInfo(teamId, { colors: newColors });
    setEditingColor(null);
  };

  const validateName = (name: string, teamId: string) => {
    return validateTeamName(name, teamId);
  };

  const validateAbbreviation = (abbr: string, teamId: string) => {
    if (abbr.length !== 3) return false;
    return !allTeams.some(team => 
      team.abbreviation.toLowerCase() === abbr.toLowerCase() && team.id !== teamId
    );
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
              Team Management
            </Text>
          </View>

          <Text className="text-gray-600 text-lg mb-4">
            Edit team names, cities, and colors
          </Text>

          {/* Search */}
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <View className="flex-row items-center">
              <Ionicons name="search" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-lg text-gray-800"
                placeholder="Search teams..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </View>

        {/* Team List */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Teams ({filteredTeams.length})
          </Text>
          
          {filteredTeams.map((team) => (
            <Pressable
              key={team.id}
              className={`bg-white rounded-2xl p-4 mb-3 shadow-sm border-2 ${
                selectedTeamId === team.id
                  ? 'border-orange-500'
                  : 'border-transparent'
              }`}
              onPress={() => setSelectedTeamId(selectedTeamId === team.id ? null : team.id)}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <View className="flex-row items-center">
                {/* Team Colors */}
                <View className="flex-row mr-4">
                  <View 
                    className="w-8 h-8 rounded-full mr-1"
                    style={{ backgroundColor: team.colors.primary }}
                  />
                  <View 
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: team.colors.secondary }}
                  />
                </View>

                {/* Team Info */}
                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-800">
                    {team.city} {team.name}
                  </Text>
                  <Text className="text-gray-600">
                    {team.abbreviation} • {team.roster.length} players
                  </Text>
                </View>

                {/* Expand Icon */}
                <Ionicons 
                  name={selectedTeamId === team.id ? "chevron-up" : "chevron-down"} 
                  size={24} 
                  color="#9CA3AF" 
                />
              </View>

              {/* Expanded Edit Section */}
              {selectedTeamId === team.id && (
                <View className="mt-6 pt-6 border-t border-gray-100">
                  {/* Team Name */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-600 mb-2">Team Name</Text>
                    <EditableText
                      value={team.name}
                      onSave={(newValue) => handleTeamNameUpdate(team.id, 'name', newValue)}
                      placeholder="Enter team name"
                      maxLength={20}
                      validate={(value) => validateName(value, team.id)}
                      validationMessage="Team name already exists"
                      style="subtitle"
                    />
                  </View>

                  {/* City */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-600 mb-2">City</Text>
                    <EditableText
                      value={team.city}
                      onSave={(newValue) => handleTeamNameUpdate(team.id, 'city', newValue)}
                      placeholder="Enter city name"
                      maxLength={25}
                      style="body"
                    />
                  </View>

                  {/* Abbreviation */}
                  <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-600 mb-2">Abbreviation</Text>
                    <EditableText
                      value={team.abbreviation}
                      onSave={(newValue) => handleTeamNameUpdate(team.id, 'abbreviation', newValue.toUpperCase())}
                      placeholder="Enter 3-letter abbreviation"
                      maxLength={3}
                      validate={(value) => validateAbbreviation(value, team.id)}
                      validationMessage="Must be 3 letters and unique"
                      style="body"
                    />
                  </View>

                  {/* Colors */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-600 mb-3">Team Colors</Text>
                    
                    <View className="flex-row space-x-4">
                      <Pressable
                        className="flex-1 bg-gray-50 rounded-xl p-4"
                        onPress={() => setEditingColor(editingColor === 'primary' ? null : 'primary')}
                        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <View 
                              className="w-6 h-6 rounded-full mr-3"
                              style={{ backgroundColor: team.colors.primary }}
                            />
                            <Text className="text-gray-800 font-semibold">Primary</Text>
                          </View>
                          <Ionicons name="color-palette" size={20} color="#FF6B35" />
                        </View>
                      </Pressable>

                      <Pressable
                        className="flex-1 bg-gray-50 rounded-xl p-4"
                        onPress={() => setEditingColor(editingColor === 'secondary' ? null : 'secondary')}
                        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center">
                            <View 
                              className="w-6 h-6 rounded-full mr-3"
                              style={{ backgroundColor: team.colors.secondary }}
                            />
                            <Text className="text-gray-800 font-semibold">Secondary</Text>
                          </View>
                          <Ionicons name="color-palette" size={20} color="#FF6B35" />
                        </View>
                      </Pressable>
                    </View>

                    {/* Color Picker */}
                    {editingColor && (
                      <View className="mt-4">
                        <ColorPicker
                          selectedColor={team.colors[editingColor]}
                          onColorSelect={(color) => handleColorUpdate(team.id, editingColor, color)}
                          title={`Select ${editingColor} color`}
                        />
                      </View>
                    )}
                  </View>

                  {/* Team Stats */}
                  <View className="bg-gray-50 rounded-xl p-4">
                    <Text className="text-sm font-semibold text-gray-600 mb-2">Team Stats</Text>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Record:</Text>
                      <Text className="font-semibold text-gray-800">
                        {team.wins}-{team.losses}
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Salary:</Text>
                      <Text className="font-semibold text-gray-800">
                        ${(team.salary / 1000000).toFixed(1)}M
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}