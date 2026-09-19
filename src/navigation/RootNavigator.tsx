import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { linking } from './linking';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { ImageDetailScreen } from '../screens/Main/ImageDetailScreen';
import { useAuthStore } from '../store/useAuthStore';
import { useGalleryStore } from '../store/useGalleryStore';
import { useThemeStore } from '../store/useThemeStore';
import { useTheme } from '../hooks/useTheme';
import { LoadingSpinner } from '../components/LoadingSpinner';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { theme } = useTheme();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoadingSession = useAuthStore((state) => state.isLoadingSession);
  const loadSession = useAuthStore((state) => state.loadSession);

  const loadFavorites = useGalleryStore((state) => state.loadFavorites);
  const loadThemePreference = useThemeStore((state) => state.loadThemePreference);

  // Initialize persisted state from local storage on app mount
  useEffect(() => {
    const initializeApp = async () => {
      await Promise.all([
        loadSession(),
        loadFavorites(),
        loadThemePreference(),
      ]);
    };

    initializeApp();
  }, [loadSession, loadFavorites, loadThemePreference]);

  if (isLoadingSession) {
    return (
      <View style={[styles.loadingScreen, { backgroundColor: theme.background }]}>
        <LoadingSpinner message="Initializing FotoOwl..." />
      </View>
    );
  }

  return (
    <NavigationContainer
      linking={linking}
      fallback={
        <View style={[styles.loadingScreen, { backgroundColor: theme.background }]}>
          <LoadingSpinner message="Loading FotoOwl..." />
        </View>
      }
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.background },
        }}
      >
        {!isAuthenticated ? (
          // Unauthenticated flow
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          // Authenticated flow
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen
              name="ImageDetail"
              component={ImageDetailScreen}
              options={{
                presentation: 'card',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
