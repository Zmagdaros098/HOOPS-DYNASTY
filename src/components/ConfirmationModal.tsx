import React from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export default function ConfirmationModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = '#FF6B35',
  onConfirm,
  onCancel,
  destructive = false
}: ConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
          {/* Icon */}
          <View className="items-center mb-4">
            <View className={`w-16 h-16 rounded-full items-center justify-center ${
              destructive ? 'bg-red-100' : 'bg-orange-100'
            }`}>
              <Ionicons 
                name={destructive ? 'warning' : 'help-circle'} 
                size={32} 
                color={destructive ? '#EF4444' : '#FF6B35'} 
              />
            </View>
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-gray-800 text-center mb-3">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-gray-600 text-center text-base leading-6 mb-6">
            {message}
          </Text>

          {/* Buttons */}
          <View className="flex-row space-x-3">
            <Pressable
              className="flex-1 bg-gray-100 rounded-xl py-4"
              onPress={onCancel}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-gray-700 font-semibold text-center text-lg">
                {cancelText}
              </Text>
            </Pressable>

            <Pressable
              className="flex-1 rounded-xl py-4"
              style={({ pressed }) => [
                { backgroundColor: destructive ? '#EF4444' : confirmColor },
                { opacity: pressed ? 0.7 : 1 }
              ]}
              onPress={onConfirm}
            >
              <Text className="text-white font-semibold text-center text-lg">
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}