import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import RosterScreen from '../screens/RosterScreen';
import TradeScreen from '../screens/TradeScreen';
import SimulationScreen from '../screens/SimulationScreen';
import PlayerDetailScreen from '../screens/PlayerDetailScreen';
import GameDetailScreen from '../screens/GameDetailScreen';
import PlayoffsScreen from '../screens/PlayoffsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NewLeagueScreen from '../screens/NewLeagueScreen';
import TeamSelectionScreen from '../screens/TeamSelectionScreen';
import TeamManagementScreen from '../screens/TeamManagementScreen';
import EditPlayerScreen from '../screens/EditPlayerScreen';
import TeamStrategyScreen from '../screens/TeamStrategyScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  PlayerDetail: { playerId: string };
  TradeProposal: { targetTeamId: string };
  GameDetail: { gameId: string };
  NewLeague: undefined;
  TeamSelection: { leagueConfig: any };
  TeamManagement: undefined;
  EditPlayer: { playerId: string };
  TeamStrategy: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Roster: undefined;
  Trade: undefined;
  Simulation: undefined;
  Playoffs: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Roster') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Trade') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          } else if (route.name === 'Simulation') {
            iconName = focused ? 'play-circle' : 'play-circle-outline';
          } else if (route.name === 'Playoffs') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60
        },
        headerStyle: {
          backgroundColor: '#FF6B35',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Team Dashboard' }}
      />
      <Tab.Screen 
        name="Roster" 
        component={RosterScreen}
        options={{ title: 'Roster' }}
      />
      <Tab.Screen 
        name="Trade" 
        component={TradeScreen}
        options={{ title: 'Trades' }}
      />
      <Tab.Screen 
        name="Simulation" 
        component={SimulationScreen}
        options={{ title: 'Season' }}
      />
      <Tab.Screen 
        name="Playoffs" 
        component={PlayoffsScreen}
        options={{ title: 'Playoffs' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="PlayerDetail" component={PlayerDetailScreen} />
        <Stack.Screen name="GameDetail" component={GameDetailScreen} />
        <Stack.Screen name="TeamManagement" component={TeamManagementScreen} />
        <Stack.Screen name="EditPlayer" component={EditPlayerScreen} />
        <Stack.Screen name="TeamStrategy" component={TeamStrategyScreen} />
        <Stack.Screen 
          name="NewLeague" 
          component={NewLeagueScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen 
          name="TeamSelection" 
          component={TeamSelectionScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}