import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  error?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  error,
  required = false,
  containerStyle,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {label}
        {required && <Text style={{ color: theme.danger }}> *</Text>}
      </Text>

      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.7}
              onPress={() => onSelect(option.value)}
              style={[
                styles.optionPill,
                {
                  backgroundColor: isSelected ? theme.primaryLight : theme.inputBackground,
                  borderColor: isSelected ? theme.primary : theme.border,
                },
              ]}
            >
              {/* Radio circle */}
              <View
                style={[
                  styles.outerCircle,
                  {
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                {isSelected && (
                  <View style={[styles.innerCircle, { backgroundColor: theme.primary }]} />
                )}
              </View>

              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? theme.text : theme.textSecondary,
                    fontWeight: isSelected ? '600' : '400',
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && (
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
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  outerCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  innerCircle: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  optionText: {
    fontSize: 14,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
