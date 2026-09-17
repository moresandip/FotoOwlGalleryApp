import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PicsumImage } from '../types/gallery';
import { useTheme } from '../hooks/useTheme';
import { useGalleryStore } from '../store/useGalleryStore';

interface ImageCardProps {
  image: PicsumImage;
  onPress: () => void;
  containerStyle?: ViewStyle;
}

export const ImageCard: React.FC<ImageCardProps> = memo(({
  image,
  onPress,
  containerStyle,
}) => {
  const { theme } = useTheme();
  const toggleFavorite = useGalleryStore((state) => state.toggleFavorite);
  const isFavorited = useGalleryStore((state) =>
    state.favorites.some((f) => f.id === image.id)
  );

  const handleFavoritePress = async (e: any) => {
    e?.stopPropagation?.();
    await toggleFavorite(image);
  };

  // Optimize thumbnail URL with Picsum sizing to keep bandwidth lean and snappy
  const thumbnailUrl = `https://picsum.photos/id/${image.id}/500/350`;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.cardShadow,
        },
        containerStyle,
      ]}
    >
      {/* Image Preview Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Top Badges: ID Badge & Favorite Heart */}
        <View style={styles.topOverlay}>
          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>#{image.id}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleFavoritePress}
            style={[
              styles.favoriteButton,
              {
                backgroundColor: isFavorited
                  ? 'rgba(244, 63, 94, 0.9)'
                  : 'rgba(15, 23, 42, 0.65)',
              },
            ]}
          >
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Resolution Pill */}
        <View style={styles.resolutionBadge}>
          <Text style={styles.resolutionText}>
            {image.width} × {image.height}
          </Text>
        </View>
      </View>

      {/* Card Info Section */}
      <View style={styles.content}>
        <View style={styles.authorRow}>
          <Ionicons
            name="person-circle-outline"
            size={18}
            color={theme.primary}
            style={{ marginRight: 6 }}
          />
          <Text
            numberOfLines={1}
            style={[styles.authorName, { color: theme.text }]}
          >
            {image.author}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        cursor: 'pointer',
      },
    }),
  },
  imageContainer: {
    width: '100%',
    height: 210,
    backgroundColor: '#1E293B',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  idBadgeText: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  favoriteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resolutionBadge: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  resolutionText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
});
