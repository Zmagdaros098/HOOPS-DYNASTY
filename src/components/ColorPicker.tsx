import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  title?: string;
}

const PRESET_COLORS = [
  '#552583', // Purple
  '#1D428A', // Blue
  '#007A33', // Green
  '#98002E', // Maroon
  '#CE1141', // Red
  '#006BB6', // Blue
  '#00538C', // Navy
  '#E56020', // Orange
  '#0E2240', // Dark Blue
  '#E03A3E', // Red
  '#006747', // Forest Green
  '#5A2D81', // Purple
  '#C4CED4', // Silver
  '#5D76A9', // Light Blue
  '#0C2340', // Navy
  '#002B5C', // Dark Blue
  '#000000', // Black
  '#860038', // Burgundy
  '#1D1160', // Purple
  '#002F5F', // Navy
  '#FDB927', // Gold
  '#FFC72C', // Yellow
  '#BA9653', // Gold
  '#F9A01B', // Orange
  '#F58426', // Orange
  '#FEC524', // Yellow
  '#FFC200', // Yellow
  '#63727A', // Gray
  '#12173F', // Dark Navy
  '#C8102E', // Red
  '#EF3B24', // Red
  '#00471B', // Dark Green
  '#236192', // Blue
  '#FFFFFF', // White
  '#EEE1C6', // Cream
  '#FDBB30', // Yellow
  '#1D42BA', // Blue
  '#C1D32F', // Lime
  '#00788C', // Teal
  '#E31837', // Red
  '#C4CED4'  // Light Gray
];

export default function ColorPicker({ selectedColor, onColorSelect, title = 'Select Color' }: ColorPickerProps) {
  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm">
      <Text className="text-lg font-semibold text-gray-800 mb-4">{title}</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        <View className="flex-row flex-wrap" style={{ width: 300 }}>
          {PRESET_COLORS.map((color, index) => (
            <Pressable
              key={index}
              className="w-12 h-12 rounded-full m-1 border-2"
              style={[
                { backgroundColor: color },
                { 
                  borderColor: selectedColor === color ? '#FF6B35' : '#E5E5E5',
                  borderWidth: selectedColor === color ? 3 : 1
                }
              ]}
              onPress={() => onColorSelect(color)}
            >
              {selectedColor === color && (
                <View className="flex-1 items-center justify-center">
                  <Ionicons 
                    name="checkmark" 
                    size={20} 
                    color={color === '#FFFFFF' || color === '#EEE1C6' || color === '#C4CED4' ? '#000000' : '#FFFFFF'} 
                  />
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
      
      <View className="flex-row items-center">
        <View 
          className="w-8 h-8 rounded-full border-2 border-gray-300 mr-3"
          style={{ backgroundColor: selectedColor }}
        />
        <Text className="text-gray-600">
          Selected: {selectedColor.toUpperCase()}
        </Text>
      </View>
    </View>
  );
}