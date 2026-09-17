import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  error,
  required = false,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onSelect(val);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      <Text style={[styles.label, { color: theme.textSecondary }]}>
        {label}
        {required && <Text style={{ color: theme.danger }}> *</Text>}
      </Text>

      {/* Trigger Box */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
        style={[
          styles.triggerBox,
          {
            backgroundColor: theme.inputBackground,
            borderColor: error ? theme.danger : theme.border,
            borderWidth: error ? 1.5 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.triggerText,
            {
              color: selectedOption ? theme.text : theme.textMuted,
            },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.textMuted} />
      </TouchableOpacity>

      {/* Validation Error */}
      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={theme.danger} />
          <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
        </View>
      )}

      {/* Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                {/* Modal Header */}
                <View style={[styles.modalHeader, { borderBottomColor: theme.borderSubtle }]}>
                  <Text style={[styles.modalTitle, { color: theme.text }]}>{label}</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeBtn}
                  >
                    <Ionicons name="close" size={22} color={theme.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Filter Search inside dropdown if more than 6 options */}
                {options.length > 6 && (
                  <View
                    style={[
                      styles.modalSearchBox,
                      {
                        backgroundColor: theme.inputBackground,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Ionicons name="search" size={16} color={theme.textMuted} />
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search..."
                      placeholderTextColor={theme.textMuted}
                      style={[styles.modalSearchInput, { color: theme.text }]}
                    />
                  </View>
                )}

                {/* Options List */}
                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => item.value}
                  keyboardShouldPersistTaps="handled"
                  style={{ maxHeight: 320 }}
                  renderItem={({ item }) => {
                    const isSelected = item.value === selectedValue;
                    return (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleSelect(item.value)}
                        style={[
                          styles.optionItem,
                          {
                            backgroundColor: isSelected
                              ? theme.primaryLight
                              : 'transparent',
                            borderBottomColor: theme.borderSubtle,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionLabel,
                            {
                              color: isSelected ? theme.primary : theme.text,
                              fontWeight: isSelected ? '700' : '400',
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                        {isSelected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={theme.primary}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  triggerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
  },
  triggerText: {
    fontSize: 15,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: {
    fontSize: 15,
  },
});
