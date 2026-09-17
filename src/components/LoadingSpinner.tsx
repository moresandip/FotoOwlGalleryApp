import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  containerStyle?: ViewStyle;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'large',
  containerStyle,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator size={size} color={theme.primary} />
      {message && (
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
