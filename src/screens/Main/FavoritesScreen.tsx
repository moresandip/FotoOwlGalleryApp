import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import {
  MainTabParamList,
  RootStackParamList,
} from '../../types/navigation';
import { useTheme } from '../../hooks/useTheme';
import { useGalleryStore } from '../../store/useGalleryStore';
import { PicsumImage } from '../../types/gallery';
import { ImageCard } from '../../components/ImageCard';
import { SearchBar } from '../../components/SearchBar';
import { Button } from '../../components/Button';

type FavoritesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Favorites'>,
  StackNavigationProp<RootStackParamList>
>;

interface Props {
  navigation: FavoritesScreenNavigationProp;
}

export const FavoritesScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const favorites = useGalleryStore((state) => state.favorites);
  const clearAllFavorites = useGalleryStore((state) => state.clearAllFavorites);

  const [searchQuery, setSearchQuery] = useState('');

  // Real-time search inside favorites
  const filteredFavorites = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter((img) =>
      img.author.toLowerCase().includes(q)
    );
  }, [favorites, searchQuery]);

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all saved photos from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => clearAllFavorites(),
        },
      ]
    );
  };

  const handleImagePress = (item: PicsumImage) => {
    navigation.navigate('ImageDetail', { image: item });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>Favorites</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {favorites.length} {favorites.length === 1 ? 'saved photo' : 'saved photos'}
            </Text>
          </View>

          {favorites.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleClearAll}
              style={[
                styles.clearBtn,
                { backgroundColor: theme.dangerSurface, borderColor: theme.danger },
              ]}
            >
              <Ionicons name="trash-outline" size={14} color={theme.danger} />
              <Text style={[styles.clearBtnText, { color: theme.danger }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search within Favorites */}
        {favorites.length > 0 && (
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search saved photos by author..."
            containerStyle={{ marginTop: 12 }}
          />
        )}
      </View>

      {/* List */}
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageCard
            image={item}
            onPress={() => handleImagePress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.emptyIconCircle,
                { backgroundColor: theme.surfaceSubtle },
              ]}
            >
              <Ionicons
                name="heart-dislike-outline"
                size={48}
                color={theme.favorite}
              />
            </View>

            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {favorites.length === 0
                ? 'No Saved Favorites Yet'
                : 'No Matching Photos'}
            </Text>

            <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>
              {favorites.length === 0
                ? 'Tap the heart icon on any photo in the gallery to curate your personal collection here.'
                : `No saved favorites matched "${searchQuery}".`}
            </Text>

            {favorites.length === 0 && (
              <Button
                title="Browse Gallery"
                onPress={() => navigation.navigate('Home')}
                size="md"
                style={{ marginTop: 20 }}
                icon={
                  <Ionicons
                    name="images-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                }
              />
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '500',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 320,
  },
});
