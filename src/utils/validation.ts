/**
 * Form validation helpers and schema rules
 * Designed with precise regex patterns and user-friendly error messages.
 */

export interface RegisterFormData {
  fullName: string;
  email: string;
  mobile: string;
  gender: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export type RegisterErrors = Partial<Record<keyof RegisterFormData, string>>;

export interface LoginFormData {
  email: string;
  password: string;
}

export type LoginErrors = Partial<Record<keyof LoginFormData, string>>;

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validateMobile = (mobile: string): boolean => {
  // Mobile must be strictly 10 digits numeric
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(mobile.trim());
};

export const validatePasswordLength = (password: string, minLength = 6): boolean => {
  return password.length >= minLength;
};

export const validateRegistrationForm = (data: RegisterFormData): { isValid: boolean; errors: RegisterErrors } => {
  const errors: RegisterErrors = {};

  // Full Name
  if (!data.fullName || !data.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  // Email
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Gender
  if (!data.gender || !data.gender.trim()) {
    errors.gender = 'Please select your gender';
  }

  // Mobile
  if (!data.mobile || !data.mobile.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!/^\d+$/.test(data.mobile.trim())) {
    errors.mobile = 'Mobile number must contain digits only';
  } else if (!validateMobile(data.mobile)) {
    errors.mobile = 'Mobile number must be exactly 10 digits';
  }

  // Address
  if (!data.address || !data.address.trim()) {
    errors.address = 'Residential address is required';
  } else if (data.address.trim().length < 5) {
    errors.address = 'Please enter a more detailed address';
  }

  // City
  if (!data.city || !data.city.trim()) {
    errors.city = 'Please choose a city from the list';
  }

  // Password
  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!validatePasswordLength(data.password, 6)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  // Confirm Password
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (data: LoginFormData): { isValid: boolean; errors: LoginErrors } => {
  const errors: LoginErrors = {};

  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email format';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 1) {
    errors.password = 'Password cannot be empty';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
