import { describe, it, expect, beforeEach } from '@jest/globals';
import { useAuthStore } from '../src/store/useAuthStore';
import { Storage } from '../src/utils/storage';

describe('useAuthStore', () => {
  beforeEach(async () => {
    await Storage.clear();
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      registeredUsers: [],
    });
  });

  it('registers a new user and updates session state', async () => {
    const registrationResult = await useAuthStore.getState().register(
      {
        fullName: 'Aarav Patel',
        email: 'aarav@test.com',
        mobile: '9876543210',
        gender: 'Male',
        address: '10 SG Highway',
        city: 'Ahmedabad',
      },
      'mypassword'
    );

    expect(registrationResult.success).toBe(true);

    const currentUser = useAuthStore.getState().user;
    expect(currentUser).not.toBeNull();
    expect(currentUser?.fullName).toBe('Aarav Patel');
    expect(currentUser?.email).toBe('aarav@test.com');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('prevents registering with duplicate email', async () => {
    const userData = {
      fullName: 'Ananya Roy',
      email: 'ananya@test.com',
      mobile: '9876543210',
      gender: 'Female' as const,
      address: 'Park Street',
      city: 'Kolkata',
    };

    // First registration
    await useAuthStore.getState().register(userData, 'pass1');

    // Duplicate registration attempt
    const secondTry = await useAuthStore.getState().register(userData, 'pass2');
    expect(secondTry.success).toBe(false);
    expect(secondTry.error).toContain('already exists');
  });

  it('logs out and destroys active user session', async () => {
    await useAuthStore.getState().register(
      {
        fullName: 'Neha Gupta',
        email: 'neha@test.com',
        mobile: '9876543210',
        gender: 'Female',
        address: 'Connaught Place',
        city: 'Delhi NCR',
      },
      'securepass'
    );

    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Perform Logout
    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
