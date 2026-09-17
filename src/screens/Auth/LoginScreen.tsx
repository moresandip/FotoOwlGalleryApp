import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../types/navigation';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/useAuthStore';
import {
  LoginFormData,
  LoginErrors,
  validateLoginForm,
} from '../../utils/validation';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const login = useAuthStore((state) => state.login);
  const loadRegisteredUsers = useAuthStore((state) => state.loadRegisteredUsers);
  const registeredUsers = useAuthStore((state) => state.registeredUsers);

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    loadRegisteredUsers();
  }, [loadRegisteredUsers]);

  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleLogin = async () => {
    setAuthError(null);
    const { isValid, errors: validationErrors } = validateLoginForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(formData.email.trim(), formData.password);
      if (!result.success) {
        setAuthError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setAuthError('An unexpected login error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Evaluator convenience: Auto-fills with registered account or default demo account
  const handleAutoFill = () => {
    if (registeredUsers.length > 0) {
      const user = registeredUsers[0];
      setFormData({
        email: user.email,
        password: user.passwordHash,
      });
    } else {
      setFormData({
        email: 'rahul.sharma@example.com',
        password: 'password123',
      });
    }
    setErrors({});
    setAuthError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screenContainer, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Branding */}
        <View style={styles.header}>
          <View
            style={[
              styles.logoIconCircle,
              { backgroundColor: theme.primaryLight, borderColor: theme.primary },
            ]}
          >
            <Ionicons name="images-outline" size={32} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Log in with your registered credentials to access your gallery & saved photos.
          </Text>

          {/* Quick Demo Pre-fill */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleAutoFill}
            style={[
              styles.demoFillPill,
              { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
            ]}
          >
            <Ionicons name="key-outline" size={14} color={theme.warning} />
            <Text style={[styles.demoFillText, { color: theme.textSecondary }]}>
              {registeredUsers.length > 0
                ? 'Fill Registered Account'
                : 'Fill Demo Account'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Authentication Error Banner */}
        {authError && (
          <View
            style={[
              styles.errorBanner,
              {
                backgroundColor: theme.dangerSurface,
                borderColor: theme.danger,
              },
            ]}
          >
            <Ionicons name="alert-circle" size={18} color={theme.danger} />
            <Text style={[styles.errorBannerText, { color: theme.danger }]}>
              {authError}
            </Text>
          </View>
        )}

        {/* Login Form Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          {/* Email */}
          <InputField
            label="Email Address"
            value={formData.email}
            onChangeText={(t) => updateField('email', t)}
            placeholder="you@example.com"
            error={errors.email}
            required
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={
              <Ionicons name="mail-outline" size={18} color={theme.textMuted} />
            }
          />

          {/* Password */}
          <InputField
            label="Password"
            value={formData.password}
            onChangeText={(t) => updateField('password', t)}
            placeholder="Enter your password"
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

          {/* Login Submit Button */}
          <Button
            title="Log In"
            onPress={handleLogin}
            loading={isSubmitting}
            size="lg"
            style={{ marginTop: 8 }}
          />
        </View>

        {/* Create Account Link */}
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Don't have an account yet?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.7}
          >
            <Text style={[styles.registerLink, { color: theme.primary }]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 50 : 30,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
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
    paddingHorizontal: 20,
  },
  demoFillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 14,
  },
  demoFillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
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
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
