import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/useAuthStore';
import { AVATAR_OPTIONS, getDefaultAvatarUrl } from '../../assets/avatars';
import { InputField } from '../../components/InputField';
import { RadioGroup } from '../../components/RadioGroup';
import { Dropdown, DropdownOption } from '../../components/Dropdown';
import { Button } from '../../components/Button';
import { Gender } from '../../types/auth';
import { validateEmail, validateMobile } from '../../utils/validation';

const CITY_OPTIONS: DropdownOption[] = [
  { label: 'Bengaluru', value: 'Bengaluru' },
  { label: 'Mumbai', value: 'Mumbai' },
  { label: 'Delhi NCR', value: 'Delhi NCR' },
  { label: 'Hyderabad', value: 'Hyderabad' },
  { label: 'Pune', value: 'Pune' },
  { label: 'Chennai', value: 'Chennai' },
  { label: 'Kolkata', value: 'Kolkata' },
  { label: 'Ahmedabad', value: 'Ahmedabad' },
  { label: 'Jaipur', value: 'Jaipur' },
  { label: 'Surat', value: 'Surat' },
  { label: 'Chandigarh', value: 'Chandigarh' },
  { label: 'Kochi', value: 'Kochi' },
];

export const ProfileScreen: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Edit Form Fields
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [gender, setGender] = useState<Gender>(user?.gender || 'Male');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const openEditModal = () => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setMobile(user.mobile);
      setGender(user.gender);
      setAddress(user.address);
      setCity(user.city);
    }
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    const errors: Record<string, string> = {};

    if (!fullName.trim()) errors.fullName = 'Full Name is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(email)) errors.email = 'Invalid email format';

    if (!mobile.trim()) errors.mobile = 'Mobile is required';
    else if (!validateMobile(mobile)) errors.mobile = 'Must be exactly 10 digits';

    if (!address.trim()) errors.address = 'Address is required';
    if (!city.trim()) errors.city = 'Please select a city';

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      const success = await updateProfile({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        gender,
        address: address.trim(),
        city,
      });

      if (success) {
        setIsEditModalOpen(false);
      } else {
        Alert.alert('Error', 'Unable to update profile.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarSelect = async (avatarId: string) => {
    await updateProfile({ avatarId });
    setIsAvatarModalOpen(false);
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to sign out of FotoOwl?')) {
        logout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out of FotoOwl?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: () => logout(),
          },
        ]
      );
    }
  };

  const currentAvatarUrl = getDefaultAvatarUrl(user?.avatarId);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openEditModal}
          style={[styles.editPillBtn, { backgroundColor: theme.primaryLight }]}
        >
          <Ionicons name="create-outline" size={16} color={theme.primary} />
          <Text style={[styles.editPillText, { color: theme.primary }]}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card with Avatar */}
        <View
          style={[
            styles.userCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.avatarSection}>
            <Image source={{ uri: currentAvatarUrl }} style={styles.avatarImage} />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsAvatarModalOpen(true)}
              style={[styles.changeAvatarBtn, { backgroundColor: theme.primary }]}
            >
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.userName, { color: theme.text }]}>
            {user?.fullName || 'Guest User'}
          </Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
            {user?.email || 'user@example.com'}
          </Text>

          <View style={[styles.verifiedPill, { backgroundColor: theme.successSurface }]}>
            <Ionicons name="shield-checkmark" size={14} color={theme.success} />
            <Text style={[styles.verifiedText, { color: theme.success }]}>
              Verified FotoOwl Member
            </Text>
          </View>
        </View>

        {/* Profile Details List */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
            PERSONAL INFORMATION
          </Text>

          {/* Full Name */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconCol}>
              <Ionicons name="person-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.infoContentCol}>
              <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                Full Name
              </Text>
              <Text style={[styles.infoVal, { color: theme.text }]}>
                {user?.fullName || '—'}
              </Text>
            </View>
          </View>

          <View style={[styles.rowDivider, { backgroundColor: theme.borderSubtle }]} />

          {/* Email Address */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconCol}>
              <Ionicons name="mail-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.infoContentCol}>
              <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                Email Address
              </Text>
              <Text style={[styles.infoVal, { color: theme.text }]}>
                {user?.email || '—'}
              </Text>
            </View>
          </View>

          <View style={[styles.rowDivider, { backgroundColor: theme.borderSubtle }]} />

          {/* Mobile Number */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconCol}>
              <Ionicons name="call-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.infoContentCol}>
              <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                Mobile Number
              </Text>
              <Text style={[styles.infoVal, { color: theme.text }]}>
                +91 {user?.mobile || '—'}
              </Text>
            </View>
          </View>

          <View style={[styles.rowDivider, { backgroundColor: theme.borderSubtle }]} />

          {/* Gender */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconCol}>
              <Ionicons name="transgender-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.infoContentCol}>
              <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                Gender
              </Text>
              <Text style={[styles.infoVal, { color: theme.text }]}>
                {user?.gender || '—'}
              </Text>
            </View>
          </View>

          <View style={[styles.rowDivider, { backgroundColor: theme.borderSubtle }]} />

          {/* City */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconCol}>
              <Ionicons name="business-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.infoContentCol}>
              <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                City
              </Text>
              <Text style={[styles.infoVal, { color: theme.text }]}>
                {user?.city || '—'}
              </Text>
            </View>
          </View>

          <View style={[styles.rowDivider, { backgroundColor: theme.borderSubtle }]} />

          {/* Address */}
          <View style={styles.infoRow}>
            <View style={styles.infoIconCol}>
              <Ionicons name="location-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.infoContentCol}>
              <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                Residential Address
              </Text>
              <Text style={[styles.infoVal, { color: theme.text }]}>
                {user?.address || '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Preferences & Settings */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionHeading, { color: theme.textSecondary }]}>
            PREFERENCES
          </Text>

          {/* Dark Mode Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingLabelRow}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny'}
                size={20}
                color={isDark ? theme.primary : theme.warning}
              />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  Dark Theme
                </Text>
                <Text style={[styles.settingSub, { color: theme.textMuted }]}>
                  {isDark ? 'Interstellar Dark Mode' : 'Clean Light Mode'}
                </Text>
              </View>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: theme.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Logout Button */}
        <Button
          title="Sign Out of FotoOwl"
          variant="danger"
          onPress={handleLogout}
          size="lg"
          icon={<Ionicons name="log-out-outline" size={20} color="#FFFFFF" />}
          style={{ marginBottom: 40 }}
        />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalSheet,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: theme.borderSubtle }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Edit Profile Details
              </Text>
              <TouchableOpacity
                onPress={() => setIsEditModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 460, paddingHorizontal: 20, paddingTop: 14 }}>
              <InputField
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                error={editErrors.fullName}
                required
              />

              <InputField
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                error={editErrors.email}
                required
              />

              <InputField
                label="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={10}
                error={editErrors.mobile}
                required
              />

              <RadioGroup
                label="Gender"
                options={[
                  { label: 'Male', value: 'Male' },
                  { label: 'Female', value: 'Female' },
                  { label: 'Other', value: 'Other' },
                ]}
                selectedValue={gender}
                onSelect={(val) => setGender(val as Gender)}
                required
              />

              <Dropdown
                label="City"
                options={CITY_OPTIONS}
                selectedValue={city}
                onSelect={setCity}
                error={editErrors.city}
                required
              />

              <InputField
                label="Address"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
                error={editErrors.address}
                required
              />

              <View style={{ height: 20 }} />
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: theme.borderSubtle }]}>
              <Button
                title="Cancel"
                variant="ghost"
                onPress={() => setIsEditModalOpen(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Save Changes"
                variant="primary"
                onPress={handleSaveProfile}
                loading={isSaving}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Choose Avatar Modal */}
      <Modal
        visible={isAvatarModalOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsAvatarModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.avatarSheet,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={[styles.modalHeader, { borderBottomColor: theme.borderSubtle }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Choose Your Avatar
              </Text>
              <TouchableOpacity
                onPress={() => setIsAvatarModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((item) => {
                const isSelected = (user?.avatarId || 'avatar_1') === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => handleAvatarSelect(item.id)}
                    style={[
                      styles.avatarOptionCard,
                      {
                        borderColor: isSelected ? theme.primary : theme.border,
                        backgroundColor: isSelected ? theme.primaryLight : theme.inputBackground,
                      },
                    ]}
                  >
                    <Image source={{ uri: item.url }} style={styles.avatarChoiceImg} />
                    <Text
                      style={[
                        styles.avatarChoiceName,
                        {
                          color: isSelected ? theme.primary : theme.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  editPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  editPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    maxWidth: 580,
    width: '100%',
    alignSelf: 'center',
  },
  userCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarSection: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#6366F1',
  },
  changeAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIconCol: {
    width: 36,
    alignItems: 'flex-start',
  },
  infoContentCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoVal: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  rowDivider: {
    height: 1,
    marginVertical: 4,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: 12,
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalSheet: {
    width: '100%',
    maxWidth: 480,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  avatarSheet: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 20,
    borderWidth: 1,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    justifyContent: 'center',
  },
  avatarOptionCard: {
    width: 110,
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 2,
  },
  avatarChoiceImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  avatarChoiceName: {
    fontSize: 12,
  },
});
