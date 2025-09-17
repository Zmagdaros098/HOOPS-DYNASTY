import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlayerPersonality } from '../types/basketball';
import { 
  calculatePersonalityScore, 
  getPersonalityLabel, 
  getPersonalityLabelColor, 
  getPersonalityLabelBgColor,
  getPersonalityInsights,
  getTraitDisplayName,
  getTraitDescription
} from '../utils/personalityUtils';

interface PersonalityCardProps {
  personality: PlayerPersonality;
  showDetails?: boolean;
  compact?: boolean;
}

export default function PersonalityCard({ 
  personality, 
  showDetails = false, 
  compact = false 
}: PersonalityCardProps) {
  const score = calculatePersonalityScore(personality);
  const label = getPersonalityLabel(score);
  const labelColor = getPersonalityLabelColor(label);
  const labelBgColor = getPersonalityLabelBgColor(label);
  const insights = getPersonalityInsights(personality);

  if (compact) {
    return (
      <View className="flex-row items-center">
        <View 
          className="rounded-lg px-2 py-1 mr-2"
          style={{ backgroundColor: labelBgColor }}
        >
          <Text 
            className="font-semibold text-xs"
            style={{ color: labelColor }}
          >
            {label}
          </Text>
        </View>
        <Text className="text-gray-600 text-sm">
          {score.toFixed(0)}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-gray-800">Personality</Text>
        <View className="flex-row items-center">
          <View 
            className="rounded-lg px-3 py-1 mr-3"
            style={{ backgroundColor: labelBgColor }}
          >
            <Text 
              className="font-bold text-sm"
              style={{ color: labelColor }}
            >
              {label}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800">
            {score.toFixed(0)}
          </Text>
        </View>
      </View>

      {showDetails && (
        <>
          {/* Key Traits */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Key Traits</Text>
            <View className="space-y-3">
              {Object.entries(personality).map(([trait, value]) => (
                <View key={trait} className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-gray-800 font-medium">
                      {getTraitDisplayName(trait as keyof PlayerPersonality)}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {getTraitDescription(trait as keyof PlayerPersonality)}
                    </Text>
                  </View>
                  <View className="flex-row items-center ml-4">
                    <View className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <View 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${value}%`,
                          backgroundColor: value >= 70 ? '#10B981' : value >= 40 ? '#F59E0B' : '#EF4444'
                        }}
                      />
                    </View>
                    <Text className="text-gray-800 font-semibold text-sm w-8 text-right">
                      {value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Insights */}
          {insights.length > 0 && (
            <View className="mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Insights</Text>
              <View className="space-y-2">
                {insights.map((insight, index) => (
                  <View key={index} className="flex-row items-start">
                    <Ionicons 
                      name="information-circle" 
                      size={16} 
                      color="#6B7280" 
                      style={{ marginTop: 2, marginRight: 8 }}
                    />
                    <Text className="text-gray-600 text-sm flex-1">
                      {insight}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Personality Score Breakdown */}
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="text-sm font-semibold text-gray-600 mb-2">Score Calculation</Text>
            <View className="space-y-1">
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">Agreeableness (25%)</Text>
                <Text className="text-xs text-gray-700">
                  {(0.25 * personality.agreeableness).toFixed(1)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">Professionalism (20%)</Text>
                <Text className="text-xs text-gray-700">
                  {(0.20 * personality.professionalism).toFixed(1)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">Leadership (20%)</Text>
                <Text className="text-xs text-gray-700">
                  {(0.20 * personality.leadership).toFixed(1)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">Composure (15%)</Text>
                <Text className="text-xs text-gray-700">
                  {(0.15 * (100 - personality.temperament)).toFixed(1)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">Loyalty (10%)</Text>
                <Text className="text-xs text-gray-700">
                  {(0.10 * personality.loyalty).toFixed(1)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">Humility (10%)</Text>
                <Text className="text-xs text-gray-700">
                  {(0.10 * (100 - personality.ego)).toFixed(1)}
                </Text>
              </View>
              <View className="border-t border-gray-200 pt-1 mt-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm font-semibold text-gray-800">Total Score</Text>
                  <Text className="text-sm font-bold text-gray-800">
                    {score.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}