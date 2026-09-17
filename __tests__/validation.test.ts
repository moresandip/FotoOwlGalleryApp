import { describe, it, expect } from '@jest/globals';
import {
  validateEmail,
  validateMobile,
  validatePasswordLength,
  validateRegistrationForm,
  validateLoginForm,
  RegisterFormData,
} from '../src/utils/validation';

describe('Form Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@fotoowl.ai')).toBe(true);
      expect(validateEmail('candidate.developer@example.co.in')).toBe(true);
      expect(validateEmail('user_123+tag@gmail.com')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('plainaddress')).toBe(false);
      expect(validateEmail('@missingusername.com')).toBe(false);
      expect(validateEmail('missingdomain@.com')).toBe(false);
      expect(validateEmail('missingatsign.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validateMobile', () => {
    it('should accept valid 10-digit numeric phone numbers', () => {
      expect(validateMobile('9876543210')).toBe(true);
      expect(validateMobile('8123456789')).toBe(true);
    });

    it('should reject numbers not equal to 10 digits or containing non-numeric characters', () => {
      expect(validateMobile('987654321')).toBe(false); // 9 digits
      expect(validateMobile('98765432100')).toBe(false); // 11 digits
      expect(validateMobile('98765abcde')).toBe(false); // alphabetic
      expect(validateMobile('+9198765432')).toBe(false); // with country code
      expect(validateMobile('')).toBe(false);
    });
  });

  describe('validatePasswordLength', () => {
    it('should require minimum 6 characters', () => {
      expect(validatePasswordLength('123456')).toBe(true);
      expect(validatePasswordLength('securepass')).toBe(true);
      expect(validatePasswordLength('12345')).toBe(false);
      expect(validatePasswordLength('')).toBe(false);
    });
  });

  describe('validateRegistrationForm', () => {
    const validSample: RegisterFormData = {
      fullName: 'Vikram Mehta',
      email: 'vikram@example.com',
      mobile: '9876543210',
      gender: 'Male',
      address: 'Plot 45, Jubilee Hills',
      city: 'Hyderabad',
      password: 'mypassword123',
      confirmPassword: 'mypassword123',
    };

    it('should validate a complete valid form successfully', () => {
      const result = validateRegistrationForm(validSample);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should return errors when passwords do not match', () => {
      const result = validateRegistrationForm({
        ...validSample,
        confirmPassword: 'differentpassword',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.confirmPassword).toBe('Passwords do not match');
    });

    it('should return errors for missing mandatory fields', () => {
      const result = validateRegistrationForm({
        ...validSample,
        fullName: '',
        email: '',
        mobile: '',
        city: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.fullName).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.mobile).toBeDefined();
      expect(result.errors.city).toBeDefined();
    });
  });

  describe('validateLoginForm', () => {
    it('should pass for valid email and non-empty password', () => {
      const result = validateLoginForm({
        email: 'user@example.com',
        password: 'password123',
      });
      expect(result.isValid).toBe(true);
    });

    it('should fail for empty or invalid inputs', () => {
      const result = validateLoginForm({
        email: 'invalid-email',
        password: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
      expect(result.errors.password).toBeDefined();
    });
  });
});
