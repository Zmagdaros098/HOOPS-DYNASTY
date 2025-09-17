import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OffensiveStrategy, DefensiveStrategy } from '../types/basketball';
import { OFFENSIVE_STRATEGY_INFO, DEFENSIVE_STRATEGY_INFO } from '../utils/strategyUtils';
import { cn } from '../utils/cn';

interface StrategyCardProps {
  strategy: OffensiveStrategy | DefensiveStrategy;
  type: 'offensive' | 'defensive';
  isSelected?: boolean;
  onPress?: () => void;
  showDetails?: boolean;
}

export default function StrategyCard({ 
  strategy, 
  type, 
  isSelected = false, 
  onPress, 
  showDetails = true 
}: StrategyCardProps) {
  const strategyInfo = type === 'offensive' 
    ? OFFENSIVE_STRATEGY_INFO[strategy as OffensiveStrategy]
    : DEFENSIVE_STRATEGY_INFO[strategy as DefensiveStrategy];

  const typeColor = type === 'offensive' ? 'text-orange-600' : 'text-blue-600';
  const typeBgColor = type === 'offensive' ? 'bg-orange-50' : 'bg-blue-50';
  const selectedBorderColor = type === 'offensive' ? 'border-orange-500' : 'border-blue-500';

  return (
    <Pressable
      className={cn(
        "bg-white rounded-2xl p-4 shadow-sm border-2",
        isSelected ? selectedBorderColor : "border-transparent",
        onPress && "active:opacity-70"
      )}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View className="flex-row items-center mb-3">
        <View className={cn("p-2 rounded-full mr-3", typeBgColor)}>
          <Ionicons 
            name={strategyInfo.icon} 
            size={20} 
            color={type === 'offensive' ? '#EA580C' : '#2563EB'} 
          />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">
            {strategy}
          </Text>
          <Text className={cn("text-sm font-semibold capitalize", typeColor)}>
            {type}
          </Text>
        </View>
        {isSelected && (
          <View className="p-1">
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          </View>
        )}
      </View>

      {showDetails && (
        <>
          <Text className="text-gray-600 text-sm mb-3">
            {strategyInfo.description}
          </Text>

          <View className="flex-row justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-xs font-semibold text-green-600 mb-1">
                Strengths
              </Text>
              {strategyInfo.strengths.slice(0, 2).map((strength, index) => (
                <Text key={index} className="text-xs text-gray-600">
                  • {strength}
                </Text>
              ))}
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-xs font-semibold text-red-600 mb-1">
                Weaknesses
              </Text>
              {strategyInfo.weaknesses.slice(0, 2).map((weakness, index) => (
                <Text key={index} className="text-xs text-gray-600">
                  • {weakness}
                </Text>
              ))}
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}