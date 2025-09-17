import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../state/gameStore';
import { Player } from '../types/basketball';

export default function TradeScreen() {
  const { currentTeam, allTeams, trades, proposeTrade, acceptTrade, rejectTrade } = useGameStore();
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [targetTeam, setTargetTeam] = useState<string | null>(null);

  if (!currentTeam) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatSalary = (salary: number) => {
    return `$${(salary / 1000000).toFixed(1)}M`;
  };

  const otherTeams = allTeams.filter(team => team.id !== currentTeam.id);
  const pendingTrades = trades.filter(trade => trade.status === 'pending');

  const togglePlayerSelection = (player: Player) => {
    setSelectedPlayers(prev => {
      const isSelected = prev.some(p => p.id === player.id);
      if (isSelected) {
        return prev.filter(p => p.id !== player.id);
      } else {
        return [...prev, player];
      }
    });
  };

  const createTrade = () => {
    if (!targetTeam || selectedPlayers.length === 0) {
      Alert.alert("Error", "Please select players and a target team");
      return;
    }

    const targetTeamData = allTeams.find(t => t.id === targetTeam);
    if (!targetTeamData) return;

    // Simple trade logic - get random players from target team
    const targetPlayers = targetTeamData.roster
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(selectedPlayers.length, 2));

    const outgoingSalary = selectedPlayers.reduce((sum, p) => sum + p.contract.salary, 0);
    const incomingSalary = targetPlayers.reduce((sum, p) => sum + p.contract.salary, 0);
    const salaryDifference = incomingSalary - outgoingSalary;
    
    const outgoingValue = selectedPlayers.reduce((sum, p) => sum + p.overall, 0);
    const incomingValue = targetPlayers.reduce((sum, p) => sum + p.overall, 0);
    const tradeValue = incomingValue - outgoingValue;

    const trade = {
      id: Math.random().toString(36).substring(2, 11),
      fromTeam: currentTeam.id,
      toTeam: targetTeam,
      playersOut: selectedPlayers,
      playersIn: targetPlayers,
      status: 'pending' as const,
      salaryDifference,
      tradeValue
    };

    proposeTrade(trade);
    setSelectedPlayers([]);
    setTargetTeam(null);
    Alert.alert("Success", "Trade proposal sent!");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Trade Center
          </Text>
          <Text className="text-gray-600 text-lg">
            Manage your roster through trades
          </Text>
        </View>

        {/* Pending Trades */}
        {pendingTrades.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-4">
              Pending Trades
            </Text>
            
            {pendingTrades.map((trade) => (
              <View key={trade.id} className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-lg font-bold text-gray-800">
                    Trade Proposal
                  </Text>
                  <View className="bg-yellow-100 rounded-lg px-3 py-1">
                    <Text className="text-yellow-800 font-semibold text-sm">
                      Pending
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-1">
                    <Text className="text-gray-600 mb-1">Sending:</Text>
                    {trade.playersOut.map(player => (
                      <Text key={player.id} className="text-gray-800 font-semibold">
                        {player.name}
                      </Text>
                    ))}
                  </View>
                  
                  <Ionicons name="swap-horizontal" size={24} color="#FF6B35" />
                  
                  <View className="flex-1 items-end">
                    <Text className="text-gray-600 mb-1">Receiving:</Text>
                    {trade.playersIn.map(player => (
                      <Text key={player.id} className="text-gray-800 font-semibold">
                        {player.name}
                      </Text>
                    ))}
                  </View>
                </View>
                
                {/* Trade Analysis */}
                <View className="bg-gray-50 rounded-xl p-3 mb-4">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600">Salary Impact:</Text>
                    <Text className={`font-semibold ${
                      trade.salaryDifference > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {trade.salaryDifference > 0 ? '+' : ''}{formatSalary(trade.salaryDifference)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Value Impact:</Text>
                    <Text className={`font-semibold ${
                      trade.tradeValue > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.tradeValue > 0 ? '+' : ''}{trade.tradeValue.toFixed(1)}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row mt-4 space-x-3">
                  <Pressable
                    className="flex-1 bg-green-500 rounded-xl py-3"
                    onPress={() => acceptTrade(trade.id)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <Text className="text-white font-bold text-center">Accept</Text>
                  </Pressable>
                  
                  <Pressable
                    className="flex-1 bg-red-500 rounded-xl py-3"
                    onPress={() => rejectTrade(trade.id)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <Text className="text-white font-bold text-center">Reject</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Create New Trade */}
        <View className="px-6 mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Create Trade
          </Text>
          
          {/* Target Team Selection */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Select Target Team
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {otherTeams.map((team) => (
                <Pressable
                  key={team.id}
                  className={`mr-3 rounded-xl p-4 ${
                    targetTeam === team.id ? 'bg-orange-500' : 'bg-white'
                  }`}
                  onPress={() => setTargetTeam(team.id)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Text className={`font-bold ${
                    targetTeam === team.id ? 'text-white' : 'text-gray-800'
                  }`}>
                    {team.city}
                  </Text>
                  <Text className={`${
                    targetTeam === team.id ? 'text-white/80' : 'text-gray-600'
                  }`}>
                    {team.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Player Selection */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Select Players to Trade ({selectedPlayers.length})
            </Text>
            
            {currentTeam.roster.map((player) => {
              const isSelected = selectedPlayers.some(p => p.id === player.id);
              return (
                <Pressable
                  key={player.id}
                  className={`bg-white rounded-xl p-4 mb-2 border-2 ${
                    isSelected ? 'border-orange-500' : 'border-transparent'
                  }`}
                  onPress={() => togglePlayerSelection(player)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-gray-800">
                        {player.name}
                      </Text>
                      <Text className="text-gray-600">
                        {player.position} • {player.overall} OVR
                      </Text>
                    </View>
                    
                    <View className="items-end">
                      <Text className="text-gray-800 font-semibold">
                        {formatSalary(player.contract.salary)}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={24} color="#FF6B35" />
                      )}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Create Trade Button */}
          <Pressable
            className="bg-orange-500 rounded-xl py-4"
            onPress={createTrade}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <Text className="text-white font-bold text-center text-lg">
              Propose Trade
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}