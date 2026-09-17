import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return theme.isDark ? '#232E4A' : '#E2E8F0';
    switch (variant) {
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.surfaceElevated;
      case 'outline':
      case 'ghost':
        return 'transparent';
      case 'danger':
        return theme.danger;
      default:
        return theme.primary;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
      return disabled ? theme.borderSubtle : theme.primary;
    }
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return theme.textMuted;
    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      case 'secondary':
        return theme.text;
      case 'outline':
        return theme.primary;
      case 'ghost':
        return theme.textSecondary;
      default:
        return '#FFFFFF';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 24, borderRadius: 14 };
      case 'md':
      default:
        return { paddingVertical: 13, paddingHorizontal: 20, borderRadius: 12 };
    }
  };

  const { paddingVertical, paddingHorizontal, borderRadius } = getPadding();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.buttonBase,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          paddingVertical,
          paddingHorizontal,
          borderRadius,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: size === 'sm' ? 13 : size === 'lg' ? 16 : 15,
                fontWeight: size === 'lg' ? '700' : '600',
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
