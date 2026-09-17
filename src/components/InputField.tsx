import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardTypeOptions,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  containerStyle,
  required = false,
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label Row */}
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
          {required && <Text style={{ color: theme.danger }}> *</Text>}
        </Text>
      </View>

      {/* Input Box */}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.inputBackground,
            borderColor: hasError
              ? theme.danger
              : isFocused
              ? theme.primary
              : theme.border,
            borderWidth: isFocused || hasError ? 1.5 : 1,
          },
          multiline && { minHeight: 80, alignItems: 'flex-start', paddingTop: 10 },
        ]}
      >
        {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            {
              color: theme.text,
            },
            multiline && { textAlignVertical: 'top' },
          ]}
        />

        {/* Password Eye Toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            style={styles.rightIconButton}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Inline Validation Error */}
      {hasError && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={theme.danger} />
          <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  leftIconWrapper: {
    marginRight: 10,
  },
  rightIconButton: {
    padding: 6,
    marginLeft: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
