import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Team } from '../types/basketball';

interface TeamCardProps {
  team: Team;
  isSelected?: boolean;
  onPress?: () => void;
  showStats?: boolean;
}

export default function TeamCard({ team, isSelected = false, onPress, showStats = true }: TeamCardProps) {
  const formatSalary = (salary: number) => {
    return `$${(salary / 1000000).toFixed(1)}M`;
  };

  const averageOverall = Math.round(
    team.roster.reduce((sum, p) => sum + p.overall, 0) / team.roster.length
  );

  return (
    <Pressable
      className={`rounded-2xl p-6 mb-4 shadow-sm border-2 ${
        isSelected
          ? 'border-orange-500 bg-orange-50'
          : 'border-transparent bg-white'
      }`}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View className="flex-row items-center">
        {/* Team Logo/Colors */}
        <View 
          className="w-16 h-16 rounded-full items-center justify-center mr-4"
          style={{ backgroundColor: team.colors.primary }}
        >
          <Text className="text-white font-bold text-lg">
            {team.abbreviation}
          </Text>
        </View>

        {/* Team Info */}
        <View className="flex-1">
          <Text className={`text-xl font-bold mb-1 ${
            isSelected ? 'text-orange-800' : 'text-gray-800'
          }`}>
            {team.city} {team.name}
          </Text>
          
          {showStats && (
            <>
              <Text className={`text-sm mb-2 ${
                isSelected ? 'text-orange-600' : 'text-gray-600'
              }`}>
                {team.roster.length} players • {team.wins}-{team.losses} record
              </Text>
              
              {/* Team Stats Preview */}
              <View className="flex-row">
                <View className="mr-4">
                  <Text className={`text-xs ${
                    isSelected ? 'text-orange-500' : 'text-gray-500'
                  }`}>
                    Avg Overall
                  </Text>
                  <Text className={`font-semibold ${
                    isSelected ? 'text-orange-800' : 'text-gray-800'
                  }`}>
                    {averageOverall}
                  </Text>
                </View>
                <View>
                  <Text className={`text-xs ${
                    isSelected ? 'text-orange-500' : 'text-gray-500'
                  }`}>
                    Salary Cap
                  </Text>
                  <Text className={`font-semibold ${
                    isSelected ? 'text-orange-800' : 'text-gray-800'
                  }`}>
                    {formatSalary(team.salary)}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Selection Indicator */}
        {isSelected && (
          <Ionicons name="checkmark-circle" size={32} color="#FF6B35" />
        )}
      </View>
    </Pressable>
  );
}