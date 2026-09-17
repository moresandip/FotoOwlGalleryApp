import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { FilterCategory } from '../types/gallery';
import { useTheme } from '../hooks/useTheme';

interface FilterOption {
  key: FilterCategory;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'ALL', label: 'All Photos' },
  { key: 'A-M', label: 'Author A–M' },
  { key: 'N-Z', label: 'Author N–Z' },
];

interface FilterPillsProps {
  activeFilter: FilterCategory;
  onSelectFilter: (filter: FilterCategory) => void;
  containerStyle?: ViewStyle;
}

export const FilterPills: React.FC<FilterPillsProps> = ({
  activeFilter,
  onSelectFilter,
  containerStyle,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {FILTER_OPTIONS.map((option) => {
        const isActive = activeFilter === option.key;
        return (
          <TouchableOpacity
            key={option.key}
            activeOpacity={0.75}
            onPress={() => onSelectFilter(option.key)}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? theme.primary : theme.surfaceSubtle,
                borderColor: isActive ? theme.primary : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                {
                  color: isActive ? '#FFFFFF' : theme.textSecondary,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 13,
    letterSpacing: 0.1,
  },
});
