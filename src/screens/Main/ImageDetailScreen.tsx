import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types/navigation';
import { PicsumImage } from '../../types/gallery';
import { useTheme } from '../../hooks/useTheme';
import { useGalleryStore } from '../../store/useGalleryStore';
import { downloadImageToDevice, shareImage } from '../../utils/fileDownloader';
import { Button } from '../../components/Button';

type ImageDetailRouteProp = RouteProp<RootStackParamList, 'ImageDetail'>;
type ImageDetailNavigationProp = StackNavigationProp<RootStackParamList, 'ImageDetail'>;

interface Props {
  route: ImageDetailRouteProp;
  navigation: ImageDetailNavigationProp;
}

export const ImageDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const favorites = useGalleryStore((state) => state.favorites);

  const fallbackId = route.params?.id || '0';
  const image: PicsumImage =
    route.params?.image ||
    favorites.find((img) => img.id === route.params?.id) || {
      id: fallbackId,
      author: 'Photographer',
      width: 1200,
      height: 900,
      url: `https://picsum.photos/id/${fallbackId}/1200/900`,
      download_url: `https://picsum.photos/id/${fallbackId}/1200/900`,
    };

  const { theme } = useTheme();

  const toggleFavorite = useGalleryStore((state) => state.toggleFavorite);
  const isFavorited = useGalleryStore((state) =>
    state.favorites.some((f) => f.id === image.id)
  );

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  // Accordion section open/close states
  const [openPhoto, setOpenPhoto] = useState(true);
  const [openTechnical, setOpenTechnical] = useState(true);
  const [openAbout, setOpenAbout] = useState(false);

  // High quality display URL
  const fullSizeUrl = `https://picsum.photos/id/${image.id}/1200/900`;

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccessMsg(null);
    try {
      const result = await downloadImageToDevice(
        image.download_url,
        `picsum_photo_${image.id}.jpg`
      );

      if (result.success) {
        setDownloadSuccessMsg(result.message);
        if (Platform.OS !== 'web') {
          Alert.alert('Download Complete', result.message);
        }
      } else {
        Alert.alert('Download Failed', result.message);
      }
    } catch (err) {
      Alert.alert('Error', 'Unable to complete download.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    shareImage(image.author, image.download_url);
  };

  const handleToggleFav = async () => {
    await toggleFavorite(image);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top App Bar */}
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.topBarTitle, { color: theme.text }]} numberOfLines={1}>
          Photo #{image.id}
        </Text>

        <View style={styles.topBarActions}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleShare}
            style={styles.iconActionBtn}
          >
            <Ionicons name="share-social-outline" size={20} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleToggleFav}
            style={styles.iconActionBtn}
          >
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorited ? theme.favorite : theme.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Image Card with Full Screen Tap trigger */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => setIsFullScreen(true)}
          style={[
            styles.imageWrapper,
            {
              backgroundColor: '#111827',
              borderColor: theme.border,
            },
          ]}
        >
          <Image
            source={{ uri: fullSizeUrl }}
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* Tap to expand overlay indicator */}
          <View style={styles.expandOverlay}>
            <Ionicons name="scan-outline" size={16} color="#FFFFFF" />
            <Text style={styles.expandText}>Tap for Full Screen</Text>
          </View>
        </TouchableOpacity>

        {/* Download Success Notice */}
        {downloadSuccessMsg && (
          <View
            style={[
              styles.successBanner,
              {
                backgroundColor: theme.successSurface,
                borderColor: theme.success,
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={18} color={theme.success} />
            <Text style={[styles.successText, { color: theme.success }]}>
              {downloadSuccessMsg}
            </Text>
          </View>
        )}

        {/* Metadata Card with Accordion Sections */}
        <View
          style={[
            styles.metaCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          {/* Author Row */}
          <View style={styles.authorSection}>
            <View
              style={[
                styles.authorAvatarCircle,
                { backgroundColor: theme.primaryLight },
              ]}
            >
              <Ionicons name="camera" size={24} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.photographerLabel, { color: theme.textSecondary }]}>
                Photographer / Creator
              </Text>
              <Text style={[styles.authorName, { color: theme.text }]}>
                {image.author}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

          {/* ── ACCORDION: Photo Info ── */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setOpenPhoto(!openPhoto)}
            style={styles.accordionHeader}
          >
            <View style={styles.accordionHeaderLeft}>
              <Ionicons name="image-outline" size={18} color={theme.primary} />
              <Text style={[styles.accordionTitle, { color: theme.text }]}>Photo Info</Text>
            </View>
            <Ionicons
              name={openPhoto ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={theme.textMuted}
            />
          </TouchableOpacity>
          {openPhoto && (
            <View style={styles.accordionBody}>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Photo ID</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>#{image.id}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Provider</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>Lorem Picsum</Text>
                </View>
              </View>
            </View>
          )}

          <View style={[styles.accordionDivider, { backgroundColor: theme.borderSubtle }]} />

          {/* ── ACCORDION: Technical Details ── */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setOpenTechnical(!openTechnical)}
            style={styles.accordionHeader}
          >
            <View style={styles.accordionHeaderLeft}>
              <Ionicons name="settings-outline" size={18} color={theme.primary} />
              <Text style={[styles.accordionTitle, { color: theme.text }]}>Technical Details</Text>
            </View>
            <Ionicons
              name={openTechnical ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={theme.textMuted}
            />
          </TouchableOpacity>
          {openTechnical && (
            <View style={styles.accordionBody}>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Native Resolution</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{image.width} × {image.height} px</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Aspect Ratio</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{(image.width / image.height).toFixed(2)} : 1</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Width</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{image.width} px</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.textMuted }]}>Height</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{image.height} px</Text>
                </View>
              </View>
            </View>
          )}

          <View style={[styles.accordionDivider, { backgroundColor: theme.borderSubtle }]} />

          {/* ── ACCORDION: About ── */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setOpenAbout(!openAbout)}
            style={styles.accordionHeader}
          >
            <View style={styles.accordionHeaderLeft}>
              <Ionicons name="information-circle-outline" size={18} color={theme.primary} />
              <Text style={[styles.accordionTitle, { color: theme.text }]}>About this Photo</Text>
            </View>
            <Ionicons
              name={openAbout ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={theme.textMuted}
            />
          </TouchableOpacity>
          {openAbout && (
            <View style={styles.accordionBody}>
              <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
                This image is provided by Lorem Picsum, a free service for beautiful placeholder photos.
                The photo was contributed by {image.author} and is available for use under the Picsum Photos license.
              </Text>
              <Text style={[styles.aboutText, { color: theme.textSecondary, marginTop: 8 }]}>
                Download URL: picsum.photos/id/{image.id}/{image.width}/{image.height}
              </Text>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: theme.borderSubtle }]} />

          {/* Primary Action Buttons */}
          <View style={styles.actionsContainer}>
            <Button
              title="Download to Gallery"
              onPress={handleDownload}
              loading={isDownloading}
              size="lg"
              icon={
                <Ionicons name="cloud-download-outline" size={20} color="#FFFFFF" />
              }
            />
            <View style={styles.secondaryActionsRow}>
              <Button
                title={isFavorited ? 'Remove Favorite' : 'Add to Favorites'}
                variant="outline"
                onPress={handleToggleFav}
                style={{ flex: 1 }}
                icon={
                  <Ionicons
                    name={isFavorited ? 'heart-dislike-outline' : 'heart-outline'}
                    size={18}
                    color={theme.primary}
                  />
                }
              />
              <Button
                title="Share"
                variant="secondary"
                onPress={handleShare}
                style={{ flex: 1 }}
                icon={
                  <Ionicons name="share-outline" size={18} color={theme.text} />
                }
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Full Screen Image Viewer Modal */}
      <Modal
        visible={isFullScreen}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsFullScreen(false)}
      >
        <View style={styles.fullScreenContainer}>
          {/* Close & Action Overlay */}
          <View style={styles.fullScreenOverlay}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsFullScreen(false)}
              style={styles.fullScreenCloseBtn}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.fullScreenRightActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleShare}
                style={styles.fullScreenCloseBtn}
              >
                <Ionicons name="share-social" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleDownload}
                style={[styles.fullScreenCloseBtn, { backgroundColor: theme.primary }]}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="download" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Full Screen Image */}
          <Image
            source={{ uri: image.download_url }}
            style={styles.fullImage}
            resizeMode="contain"
          />

          {/* Bottom Author Caption */}
          <View style={styles.captionOverlay}>
            <Text style={styles.captionAuthor}>Photo by {image.author}</Text>
            <Text style={styles.captionSub}>
              ID: #{image.id} • {image.width} × {image.height} px
            </Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconActionBtn: {
    padding: 8,
  },
  scrollContent: {
    padding: 16,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
    marginBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  expandOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  expandText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  successText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  metaCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    marginBottom: 40,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  authorAvatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photographerLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  authorName: {
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 18,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 14,
    marginBottom: 24,
  },
  infoItem: {
    width: '50%',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionsContainer: {
    gap: 12,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  fullScreenRightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  fullScreenCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  captionOverlay: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  captionAuthor: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  captionSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  // ── Accordion styles ──
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  accordionBody: {
    paddingBottom: 8,
  },
  accordionDivider: {
    height: 1,
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
