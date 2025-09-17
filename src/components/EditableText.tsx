import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
  maxLength?: number;
  validate?: (value: string) => boolean;
  validationMessage?: string;
  style?: 'title' | 'subtitle' | 'body';
  multiline?: boolean;
}

export default function EditableText({
  value,
  onSave,
  placeholder = 'Enter text',
  maxLength = 50,
  validate,
  validationMessage = 'Invalid input',
  style = 'body',
  multiline = false
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    
    if (!trimmedValue) {
      Alert.alert('Error', 'Please enter a valid value');
      return;
    }
    
    if (validate && !validate(trimmedValue)) {
      Alert.alert('Error', validationMessage);
      return;
    }
    
    onSave(trimmedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const getTextStyle = () => {
    switch (style) {
      case 'title':
        return 'text-2xl font-bold text-gray-800';
      case 'subtitle':
        return 'text-xl font-semibold text-gray-800';
      default:
        return 'text-lg text-gray-800';
    }
  };

  if (isEditing) {
    return (
      <View className="bg-white rounded-xl p-4 border-2 border-orange-500">
        <TextInput
          className="text-lg text-gray-800 mb-3"
          value={editValue}
          onChangeText={setEditValue}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          maxLength={maxLength}
          multiline={multiline}
          autoFocus
          selectTextOnFocus
        />
        
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500 text-sm">
            {editValue.length}/{maxLength}
          </Text>
          
          <View className="flex-row space-x-2">
            <Pressable
              className="bg-gray-100 rounded-lg px-4 py-2"
              onPress={handleCancel}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </Pressable>
            
            <Pressable
              className="bg-orange-500 rounded-lg px-4 py-2"
              onPress={handleSave}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-white font-semibold">Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      className="flex-row items-center justify-between py-2"
      onPress={() => setIsEditing(true)}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Text className={getTextStyle()}>
        {value || placeholder}
      </Text>
      <Ionicons name="pencil" size={20} color="#FF6B35" />
    </Pressable>
  );
}