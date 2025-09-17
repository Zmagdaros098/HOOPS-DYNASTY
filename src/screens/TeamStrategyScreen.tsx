import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameStore } from '../state/gameStore';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TeamStrategy } from '../types/basketball';
import StrategyCard from '../components/StrategyCard';
import StrategySelector from '../components/StrategySelector';
import { calculateStrategyFit, suggestOptimalStrategy, getCombinedStrategyEffects } from '../utils/strategyUtils';
import { cn } from '../utils/cn';

type TeamStrategyScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function TeamStrategyScreen() {
  const navigation = useNavigation<TeamStrategyScreenNavigationProp>();
  const { currentTeam, allTeams, updateTeamStrategy } = useGameStore();
  const [showSelector, setShowSelector] = useState(false);
  const [tempStrategy, setTempStrategy] = useState<TeamStrategy | null>(null);

  if (!currentTeam) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">No team selected</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentStrategy = currentTeam.strategy;
  const strategyEffects = getCombinedStrategyEffects(currentStrategy);
  const strategyFit = calculateStrategyFit(currentTeam, currentStrategy);
  const optimalStrategy = suggestOptimalStrategy(currentTeam);

  const handleStrategyChange = (newStrategy: TeamStrategy) => {
    setTempStrategy(newStrategy);
  };

  const confirmStrategyChange = () => {
    if (!tempStrategy) return;
    
    Alert.alert(
      "Change Team Strategy",
      "Are you sure you want to change your team's strategy? This will affect future game simulations.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm", 
          onPress: () => {
            updateTeamStrategy(currentTeam.id, tempStrategy);
            setTempStrategy(null);
            setShowSelector(false);
          }
        }
      ]
    );
  };

  const cancelStrategyChange = () => {
    setTempStrategy(null);
    setShowSelector(false);
  };

  const displayStrategy = tempStrategy || currentStrategy;

  // Calculate league strategy distribution
  const leagueStrategies = allTeams.reduce((acc, team) => {
    const offensive = team.strategy.offensive;
    const defensive = team.strategy.defensive;
    acc.offensive[offensive] = (acc.offensive[offensive] || 0) + 1;
    acc.defensive[defensive] = (acc.defensive[defensive] || 0) + 1;
    return acc;
  }, { offensive: {} as Record<string, number>, defensive: {} as Record<string, number> });

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
              Team Strategy
            </Text>
          </View>

          <Text className="text-gray-600 text-lg mb-4">
            {currentTeam.city} {currentTeam.name}
          </Text>
        </View>

        {!showSelector ? (
          <>
            {/* Current Strategy Display */}
            <View className="px-6 mb-6">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Current Strategy
              </Text>
              
              <View className="space-y-3">
                <StrategyCard
                  strategy={displayStrategy.offensive}
                  type="offensive"
                  showDetails={true}
                />
                <StrategyCard
                  strategy={displayStrategy.defensive}
                  type="defensive"
                  showDetails={true}
                />
              </View>

              <Pressable
                className="bg-orange-500 rounded-xl p-4 mt-4"
                onPress={() => setShowSelector(true)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="create" size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Change Strategy
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Strategy Effects */}
            <View className="px-6 mb-6">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Strategy Effects
              </Text>
              
              <View className="bg-white rounded-2xl p-4 shadow-sm">
                <View className="flex-row justify-between">
                  <View className="space-y-3">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Game Pace:</Text>
                      <Text className={cn(
                        "font-semibold",
                        strategyEffects.paceModifier > 1.05 ? "text-green-600" :
                        strategyEffects.paceModifier < 0.95 ? "text-red-600" : "text-gray-800"
                      )}>
                        {strategyEffects.paceModifier > 1.05 ? "Fast" :
                         strategyEffects.paceModifier < 0.95 ? "Slow" : "Normal"}
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">3PT Focus:</Text>
                      <Text className="font-semibold text-gray-800">
                        {Math.round(strategyEffects.threePointAttemptRate * 100)}%
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Ball Movement:</Text>
                      <Text className={cn(
                        "font-semibold",
                        strategyEffects.assistRate > 1.1 ? "text-green-600" :
                        strategyEffects.assistRate < 0.9 ? "text-red-600" : "text-gray-800"
                      )}>
                        {strategyEffects.assistRate > 1.1 ? "High" :
                         strategyEffects.assistRate < 0.9 ? "Low" : "Normal"}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="space-y-3">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Defense:</Text>
                      <Text className={cn(
                        "font-semibold",
                        strategyEffects.opponentFGModifier < 0.95 ? "text-green-600" :
                        strategyEffects.opponentFGModifier > 1.05 ? "text-red-600" : "text-gray-800"
                      )}>
                        {strategyEffects.opponentFGModifier < 0.95 ? "Strong" :
                         strategyEffects.opponentFGModifier > 1.05 ? "Weak" : "Average"}
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Rebounding:</Text>
                      <Text className={cn(
                        "font-semibold",
                        strategyEffects.reboundingModifier > 1.05 ? "text-green-600" :
                        strategyEffects.reboundingModifier < 0.95 ? "text-red-600" : "text-gray-800"
                      )}>
                        {strategyEffects.reboundingModifier > 1.05 ? "Strong" :
                         strategyEffects.reboundingModifier < 0.95 ? "Weak" : "Average"}
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Turnovers:</Text>
                      <Text className={cn(
                        "font-semibold",
                        strategyEffects.turnoverRate < 0.95 ? "text-green-600" :
                        strategyEffects.turnoverRate > 1.05 ? "text-red-600" : "text-gray-800"
                      )}>
                        {strategyEffects.turnoverRate < 0.95 ? "Low" :
                         strategyEffects.turnoverRate > 1.05 ? "High" : "Average"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Strategy Fit Analysis */}
            <View className="px-6 mb-6">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                Strategy Analysis
              </Text>
              
              <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-lg font-semibold text-gray-800">
                    Roster Fit
                  </Text>
                  <View className="flex-row items-center">
                    <View className={cn(
                      "w-3 h-3 rounded-full mr-2",
                      strategyFit > 0.7 ? "bg-green-500" :
                      strategyFit > 0.5 ? "bg-yellow-500" : "bg-red-500"
                    )} />
                    <Text className={cn(
                      "font-bold",
                      strategyFit > 0.7 ? "text-green-600" :
                      strategyFit > 0.5 ? "text-yellow-600" : "text-red-600"
                    )}>
                      {Math.round(strategyFit * 100)}%
                    </Text>
                  </View>
                </View>
                
                <Text className="text-gray-600 text-sm">
                  {strategyFit > 0.7 
                    ? "Your current strategy is well-suited to your roster's strengths."
                    : strategyFit > 0.5
                    ? "Your strategy is decent but could be optimized for better results."
                    : "Consider changing your strategy to better match your players' abilities."
                  }
                </Text>
              </View>

              {/* Optimal Strategy Suggestion */}
              {(optimalStrategy.offensive !== currentStrategy.offensive || 
                optimalStrategy.defensive !== currentStrategy.defensive) && (
                <View className="bg-blue-50 rounded-2xl p-4">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="bulb" size={20} color="#3B82F6" />
                    <Text className="ml-2 text-lg font-semibold text-blue-800">
                      Recommended Strategy
                    </Text>
                  </View>
                  
                  <Text className="text-blue-700 text-sm mb-3">
                    Based on your roster composition, consider these strategies:
                  </Text>
                  
                  <View className="space-y-2">
                    {optimalStrategy.offensive !== currentStrategy.offensive && (
                      <Text className="text-blue-600 text-sm">
                        • Offensive: {optimalStrategy.offensive}
                      </Text>
                    )}
                    {optimalStrategy.defensive !== currentStrategy.defensive && (
                      <Text className="text-blue-600 text-sm">
                        • Defensive: {optimalStrategy.defensive}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>

            {/* League Strategy Distribution */}
            <View className="px-6 mb-6">
              <Text className="text-xl font-bold text-gray-800 mb-4">
                League Trends
              </Text>
              
              <View className="bg-white rounded-2xl p-4 shadow-sm">
                <Text className="text-lg font-semibold text-gray-800 mb-3">
                  Most Popular Strategies
                </Text>
                
                <View className="space-y-2">
                  <View>
                    <Text className="text-sm font-semibold text-orange-600 mb-1">
                      Offensive
                    </Text>
                    {Object.entries(leagueStrategies.offensive)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                      .map(([strategy, count]) => (
                        <Text key={strategy} className="text-sm text-gray-600">
                          {strategy}: {count} teams
                        </Text>
                      ))}
                  </View>
                  
                  <View>
                    <Text className="text-sm font-semibold text-blue-600 mb-1">
                      Defensive
                    </Text>
                    {Object.entries(leagueStrategies.defensive)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                      .map(([strategy, count]) => (
                        <Text key={strategy} className="text-sm text-gray-600">
                          {strategy}: {count} teams
                        </Text>
                      ))}
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          /* Strategy Selector */
          <View className="px-6 mb-6">
            <StrategySelector
              currentStrategy={displayStrategy}
              onStrategyChange={handleStrategyChange}
              title="Choose New Strategy"
              showRecommendations={true}
            />
            
            {tempStrategy && (
              <View className="flex-row space-x-3 mt-4">
                <Pressable
                  className="flex-1 bg-green-500 rounded-xl p-4"
                  onPress={confirmStrategyChange}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Text className="text-white font-bold text-center">
                    Confirm Changes
                  </Text>
                </Pressable>
                
                <Pressable
                  className="flex-1 bg-gray-500 rounded-xl p-4"
                  onPress={cancelStrategyChange}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Text className="text-white font-bold text-center">
                    Cancel
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}