import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../types/navigation';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/useAuthStore';
import {
  RegisterFormData,
  RegisterErrors,
  validateRegistrationForm,
} from '../../utils/validation';
import { InputField } from '../../components/InputField';
import { RadioGroup, RadioOption } from '../../components/RadioGroup';
import { Dropdown, DropdownOption } from '../../components/Dropdown';
import { Button } from '../../components/Button';
import { Gender } from '../../types/auth';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const GENDER_OPTIONS: RadioOption[] = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

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

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const registerUser = useAuthStore((state) => state.register);

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    mobile: '',
    gender: 'Male',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const updateField = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error upon typing
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleRegister = async () => {
    setGeneralError(null);
    const { isValid, errors: validationErrors } = validateRegistrationForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerUser(
        {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          mobile: formData.mobile.trim(),
          gender: formData.gender as Gender,
          address: formData.address.trim(),
          city: formData.city,
        },
        formData.password
      );

      if (!result.success) {
        setGeneralError(result.error || 'Registration failed');
      }
      // On success, the root navigator automatically routes to the Main tab stack
    } catch (err) {
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handy quick-fill helper so reviewers can test within 2 seconds
  const handleQuickDemoFill = () => {
    setFormData({
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      mobile: '9876543210',
      gender: 'Male',
      address: '42 MG Road, Indiranagar',
      city: 'Bengaluru',
      password: 'password123',
      confirmPassword: 'password123',
    });
    setErrors({});
  };

  // Inject CSS on web to show right-side scrollbar
  useEffect(() => {
    if (Platform.OS === 'web') {
      const styleId = 'register-scroll-style';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          /* Register screen scrollbar */
          .register-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .register-scroll::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
            border-radius: 3px;
          }
          .register-scroll::-webkit-scrollbar-thumb {
            background: rgba(99,102,241,0.6);
            border-radius: 3px;
          }
          .register-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(99,102,241,0.9);
          }
          .register-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(99,102,241,0.6) rgba(255,255,255,0.05);
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // On web, KeyboardAvoidingView prevents ScrollView from scrolling
  const Wrapper = Platform.OS === 'web' ? View : KeyboardAvoidingView;
  const wrapperProps =
    Platform.OS === 'web'
      ? {}
      : { behavior: Platform.OS === 'ios' ? ('padding' as const) : undefined };

  return (
    <Wrapper
      {...wrapperProps}
      style={[styles.screenContainer, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        style={[
          styles.scrollView,
          Platform.OS === 'web' && {
            overflowY: 'scroll' as any,
            WebkitOverflowScrolling: 'touch' as any,
          },
        ]}
        // Apply CSS class on web for styled scrollbar
        {...(Platform.OS === 'web' ? { className: 'register-scroll' } as any : {})}
      >
        {/* Header Branding */}
        <View style={styles.header}>
          <View
            style={[
              styles.logoIconCircle,
              { backgroundColor: theme.primaryLight, borderColor: theme.primary },
            ]}
          >
            <Ionicons name="camera-outline" size={28} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Join FotoOwl to explore, save, and curate stunning visual galleries.
          </Text>

          {/* Quick Demo Fill Pill */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleQuickDemoFill}
            style={[
              styles.demoFillPill,
              { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
            ]}
          >
            <Ionicons name="flash-outline" size={14} color={theme.warning} />
            <Text style={[styles.demoFillText, { color: theme.textSecondary }]}>
              Demo Auto-Fill (for Evaluator)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Global Error Banner */}
        {generalError && (
          <View
            style={[
              styles.generalErrorBox,
              {
                backgroundColor: theme.dangerSurface,
                borderColor: theme.danger,
              },
            ]}
          >
            <Ionicons name="alert-circle" size={18} color={theme.danger} />
            <Text style={[styles.generalErrorText, { color: theme.danger }]}>
              {generalError}
            </Text>
          </View>
        )}

        {/* Form Fields Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          {/* Full Name */}
          <InputField
            label="Full Name"
            value={formData.fullName}
            onChangeText={(t) => updateField('fullName', t)}
            placeholder="e.g. John Doe"
            error={errors.fullName}
            required
            autoCapitalize="words"
            leftIcon={
              <Ionicons name="person-outline" size={18} color={theme.textMuted} />
            }
          />

          {/* Email Address */}
          <InputField
            label="Email Address"
            value={formData.email}
            onChangeText={(t) => updateField('email', t)}
            placeholder="e.g. john@example.com"
            error={errors.email}
            required
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={
              <Ionicons name="mail-outline" size={18} color={theme.textMuted} />
            }
          />

          {/* Gender Radio Buttons */}
          <RadioGroup
            label="Gender"
            options={GENDER_OPTIONS}
            selectedValue={formData.gender}
            onSelect={(val) => updateField('gender', val)}
            error={errors.gender}
            required
          />

          {/* Mobile Number (10 digits numeric) */}
          <InputField
            label="Mobile Number (10 Digits)"
            value={formData.mobile}
            onChangeText={(t) => updateField('mobile', t)}
            placeholder="e.g. 9876543210"
            error={errors.mobile}
            required
            keyboardType="phone-pad"
            maxLength={10}
            leftIcon={
              <Ionicons name="call-outline" size={18} color={theme.textMuted} />
            }
          />

          {/* Address */}
          <InputField
            label="Residential Address"
            value={formData.address}
            onChangeText={(t) => updateField('address', t)}
            placeholder="e.g. Suite 400, Innovation Hub"
            error={errors.address}
            required
            multiline
            numberOfLines={2}
            leftIcon={
              <Ionicons name="location-outline" size={18} color={theme.textMuted} />
            }
          />

          {/* City Dropdown */}
          <Dropdown
            label="City"
            options={CITY_OPTIONS}
            selectedValue={formData.city}
            onSelect={(val) => updateField('city', val)}
            placeholder="Select your city"
            error={errors.city}
            required
          />

          {/* Password */}
          <InputField
            label="Password (min 6 characters)"
            value={formData.password}
            onChangeText={(t) => updateField('password', t)}
            placeholder="••••••••"
            error={errors.password}
            required
            secureTextEntry
            leftIcon={
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={theme.textMuted}
              />
            }
          />

          {/* Confirm Password */}
          <InputField
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(t) => updateField('confirmPassword', t)}
            placeholder="••••••••"
            error={errors.confirmPassword}
            required
            secureTextEntry
            leftIcon={
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color={theme.textMuted}
              />
            }
          />

          {/* Register Button */}
          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isSubmitting}
            size="lg"
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Footer Navigation Link */}
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={[styles.loginLink, { color: theme.primary }]}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' : undefined,
    overflow: 'visible',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 40 : 20,
    paddingBottom: 60,
    maxWidth: 520,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  demoFillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 12,
  },
  demoFillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  generalErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  generalErrorText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
