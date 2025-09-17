import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OffensiveStrategy, DefensiveStrategy, TeamStrategy } from '../types/basketball';
import StrategyCard from './StrategyCard';
import { cn } from '../utils/cn';

interface StrategySelectorProps {
  currentStrategy: TeamStrategy;
  onStrategyChange: (strategy: TeamStrategy) => void;
  title?: string;
  showRecommendations?: boolean;
}

export default function StrategySelector({ 
  currentStrategy, 
  onStrategyChange, 
  title = "Select Team Strategy",
  showRecommendations = false 
}: StrategySelectorProps) {
  const [selectedType, setSelectedType] = useState<'offensive' | 'defensive'>('offensive');

  const offensiveStrategies = Object.values(OffensiveStrategy);
  const defensiveStrategies = Object.values(DefensiveStrategy);

  const handleStrategySelect = (strategy: OffensiveStrategy | DefensiveStrategy) => {
    if (selectedType === 'offensive') {
      onStrategyChange({
        ...currentStrategy,
        offensive: strategy as OffensiveStrategy
      });
    } else {
      onStrategyChange({
        ...currentStrategy,
        defensive: strategy as DefensiveStrategy
      });
    }
  };

  const currentSelectedStrategy = selectedType === 'offensive' 
    ? currentStrategy.offensive 
    : currentStrategy.defensive;

  const strategies = selectedType === 'offensive' 
    ? offensiveStrategies 
    : defensiveStrategies;

  return (
    <View className="bg-gray-50 rounded-2xl p-4">
      <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
        {title}
      </Text>

      {/* Strategy Type Selector */}
      <View className="flex-row bg-white rounded-xl p-1 mb-4">
        <Pressable
          className={cn(
            "flex-1 py-3 px-4 rounded-lg",
            selectedType === 'offensive' ? "bg-orange-500" : "bg-transparent"
          )}
          onPress={() => setSelectedType('offensive')}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons 
              name="basketball" 
              size={18} 
              color={selectedType === 'offensive' ? 'white' : '#9CA3AF'} 
            />
            <Text className={cn(
              "ml-2 font-semibold",
              selectedType === 'offensive' ? "text-white" : "text-gray-500"
            )}>
              Offensive
            </Text>
          </View>
        </Pressable>

        <Pressable
          className={cn(
            "flex-1 py-3 px-4 rounded-lg",
            selectedType === 'defensive' ? "bg-blue-500" : "bg-transparent"
          )}
          onPress={() => setSelectedType('defensive')}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons 
              name="shield" 
              size={18} 
              color={selectedType === 'defensive' ? 'white' : '#9CA3AF'} 
            />
            <Text className={cn(
              "ml-2 font-semibold",
              selectedType === 'defensive' ? "text-white" : "text-gray-500"
            )}>
              Defensive
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Current Selection Display */}
      <View className="bg-white rounded-xl p-4 mb-4">
        <Text className="text-sm font-semibold text-gray-600 mb-2">
          Current {selectedType} Strategy
        </Text>
        <StrategyCard
          strategy={currentSelectedStrategy}
          type={selectedType}
          showDetails={false}
        />
      </View>

      {/* Strategy Options */}
      <ScrollView 
        className="max-h-96" 
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <Text className="text-lg font-bold text-gray-800 mb-3">
          Available {selectedType === 'offensive' ? 'Offensive' : 'Defensive'} Strategies
        </Text>
        
        {strategies.map((strategy) => (
          <View key={strategy} className="mb-3">
            <StrategyCard
              strategy={strategy}
              type={selectedType}
              isSelected={strategy === currentSelectedStrategy}
              onPress={() => handleStrategySelect(strategy)}
              showDetails={true}
            />
          </View>
        ))}
      </ScrollView>

      {showRecommendations && (
        <View className="mt-4 p-4 bg-yellow-50 rounded-xl">
          <View className="flex-row items-center mb-2">
            <Ionicons name="bulb" size={20} color="#F59E0B" />
            <Text className="ml-2 font-semibold text-yellow-800">
              Strategy Tip
            </Text>
          </View>
          <Text className="text-sm text-yellow-700">
            {selectedType === 'offensive' 
              ? "Choose strategies that match your roster's strengths. Fast teams excel with Pace & Space or Run & Gun."
              : "Defensive strategies should complement your offensive approach. Balanced teams can adapt to any situation."
            }
          </Text>
        </View>
      )}
    </View>
  );
}