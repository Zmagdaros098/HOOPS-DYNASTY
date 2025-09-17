import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlayerAttributes, Player } from '../types/basketball';
import { 
  getCategoryDisplayName,
  getAttributeDisplayName,
  getAttributeDescription,
  getAttributeColor,
  getAttributeBgColor,
  getAttributeGrade,
  getTopAttributes,
  getPlayerArchetype,
  calculateOverallRating,
  AttributeCategory
} from '../utils/attributeUtils';

interface AttributeCardProps {
  attributes: PlayerAttributes;
  position: Player['position'];
  showDetails?: boolean;
  compact?: boolean;
}

export default function AttributeCard({ 
  attributes, 
  position,
  showDetails = false, 
  compact = false 
}: AttributeCardProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<AttributeCategory>>(new Set());
  
  const overall = calculateOverallRating(attributes, position);
  const topAttributes = getTopAttributes(attributes, 3);
  const archetype = getPlayerArchetype(attributes, position);

  const toggleCategory = (category: AttributeCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const renderAttributeBar = (value: number, showValue: boolean = true) => (
    <View className="flex-row items-center">
      <View className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
        <View 
          className="h-2 rounded-full"
          style={{ 
            width: `${value}%`,
            backgroundColor: getAttributeColor(value)
          }}
        />
      </View>
      {showValue && (
        <Text className="text-gray-800 font-semibold text-sm w-8 text-right">
          {value}
        </Text>
      )}
    </View>
  );

  const renderCategorySection = (categoryKey: AttributeCategory, categoryData: any) => {
    const isExpanded = expandedCategories.has(categoryKey);
    const categoryAverage = Math.round(
      Object.values(categoryData).reduce((sum: number, val: any) => sum + val, 0) / 
      Object.values(categoryData).length
    );

    return (
      <View key={categoryKey} className="mb-4">
        <Pressable
          className="flex-row items-center justify-between py-2"
          onPress={() => toggleCategory(categoryKey)}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <View className="flex-row items-center flex-1">
            <Text className="text-lg font-semibold text-gray-800 mr-3">
              {getCategoryDisplayName(categoryKey)}
            </Text>
            <View 
              className="rounded-lg px-2 py-1"
              style={{ backgroundColor: getAttributeBgColor(categoryAverage) }}
            >
              <Text 
                className="font-bold text-xs"
                style={{ color: getAttributeColor(categoryAverage) }}
              >
                {getAttributeGrade(categoryAverage)}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Text className="text-gray-600 font-semibold mr-2">
              {categoryAverage}
            </Text>
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#9CA3AF" 
            />
          </View>
        </Pressable>

        {isExpanded && (
          <View className="ml-4 mt-2 space-y-3">
            {Object.entries(categoryData).map(([attributeKey, value]) => (
              <View key={attributeKey} className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium">
                    {getAttributeDisplayName(attributeKey)}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {getAttributeDescription(attributeKey)}
                  </Text>
                </View>
                <View className="flex-row items-center ml-4 w-24">
                  {renderAttributeBar(value as number)}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (compact) {
    return (
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View 
            className="rounded-lg px-2 py-1 mr-2"
            style={{ backgroundColor: getAttributeBgColor(overall) }}
          >
            <Text 
              className="font-semibold text-xs"
              style={{ color: getAttributeColor(overall) }}
            >
              {overall} OVR
            </Text>
          </View>
          <Text className="text-gray-600 text-sm">
            {archetype}
          </Text>
        </View>
        <View className="flex-row">
          {topAttributes.slice(0, 2).map((attr, index) => (
            <View 
              key={index}
              className="rounded px-1 py-0.5 ml-1"
              style={{ backgroundColor: getAttributeBgColor(attr.value) }}
            >
              <Text 
                className="text-xs font-medium"
                style={{ color: getAttributeColor(attr.value) }}
              >
                {getAttributeDisplayName(attr.attribute).split(' ')[0]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-gray-800">Attributes</Text>
        <View className="flex-row items-center">
          <View 
            className="rounded-lg px-3 py-1 mr-3"
            style={{ backgroundColor: getAttributeBgColor(overall) }}
          >
            <Text 
              className="font-bold text-sm"
              style={{ color: getAttributeColor(overall) }}
            >
              {overall} OVR
            </Text>
          </View>
          <Text className="text-gray-600 font-semibold">
            {getAttributeGrade(overall)}
          </Text>
        </View>
      </View>

      {/* Player Archetype */}
      <View className="mb-4 p-3 bg-gray-50 rounded-xl">
        <Text className="text-sm font-semibold text-gray-600 mb-1">Player Type</Text>
        <Text className="text-lg font-bold text-gray-800">{archetype}</Text>
      </View>

      {/* Top Attributes */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Strengths</Text>
        <View className="flex-row flex-wrap">
          {topAttributes.map((attr, index) => (
            <View 
              key={index}
              className="rounded-lg px-3 py-2 mr-2 mb-2"
              style={{ backgroundColor: getAttributeBgColor(attr.value) }}
            >
              <Text 
                className="font-semibold text-sm"
                style={{ color: getAttributeColor(attr.value) }}
              >
                {getAttributeDisplayName(attr.attribute)} ({attr.value})
              </Text>
            </View>
          ))}
        </View>
      </View>

      {showDetails && (
        <>
          {/* Attribute Categories */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Detailed Attributes</Text>
            {Object.entries(attributes).map(([categoryKey, categoryData]) =>
              renderCategorySection(categoryKey as AttributeCategory, categoryData)
            )}
          </View>

          {/* Overall Rating Breakdown */}
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="text-sm font-semibold text-gray-600 mb-2">Overall Rating Breakdown</Text>
            <Text className="text-xs text-gray-500 mb-3">
              Based on {position} position weights
            </Text>
            <View className="space-y-1">
              {Object.entries(attributes).map(([categoryKey, categoryData]) => {
                const categoryAverage = Math.round(
                  Object.values(categoryData).reduce((sum: number, val: any) => sum + val, 0) / 
                  Object.values(categoryData).length
                );
                return (
                  <View key={categoryKey} className="flex-row justify-between">
                    <Text className="text-xs text-gray-500">
                      {getCategoryDisplayName(categoryKey as AttributeCategory)}
                    </Text>
                    <Text className="text-xs text-gray-700">
                      {categoryAverage}
                    </Text>
                  </View>
                );
              })}
              <View className="border-t border-gray-200 pt-1 mt-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm font-semibold text-gray-800">Overall Rating</Text>
                  <Text className="text-sm font-bold text-gray-800">
                    {overall}
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