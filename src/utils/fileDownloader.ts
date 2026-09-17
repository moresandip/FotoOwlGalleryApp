import { Platform, Share, Alert } from 'react-native';

export interface DownloadResult {
  success: boolean;
  message: string;
}

/**
 * Downloads an image and saves it to the user's camera roll/device storage.
 * Works seamlessly across Android, iOS, and Web.
 */
export const downloadImageToDevice = async (
  imageUrl: string,
  fileName = `fotoowl_${Date.now()}.jpg`
): Promise<DownloadResult> => {
  try {
    // 1. Web Platform Implementation (Browser-safe, zero native module dependencies)
    if (Platform.OS === 'web') {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        return { success: true, message: 'Image downloaded to your downloads folder.' };
      } catch (webErr) {
        // Fallback for cross-origin issues
        window.open(imageUrl, '_blank');
        return { success: true, message: 'Image opened in a new tab for download.' };
      }
    }

    // 2. Mobile (Android / iOS) Implementation
    // Dynamically loaded on native devices to prevent web bundling native module errors
    const MediaLibrary = require('expo-media-library');
    const { File, Paths } = require('expo-file-system');

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'Storage permission is required to save photos to your gallery.'
      );
      return { success: false, message: 'Storage permission denied.' };
    }

    // Modern Expo SDK 57 FileSystem API
    const targetFile = new File(Paths.document, fileName);
    const downloaded = await File.downloadFileAsync(imageUrl, targetFile, {
      idempotent: true,
    });

    // Save downloaded file to user's public media gallery (Camera Roll)
    const asset = await MediaLibrary.createAssetAsync(downloaded.uri);
    await MediaLibrary.createAlbumAsync('FotoOwl Gallery', asset, false);

    return {
      success: true,
      message: 'Photo successfully saved to your device gallery!',
    };
  } catch (error) {
    console.error('[fileDownloader] Download error:', error);
    return {
      success: false,
      message: 'An error occurred while downloading the image.',
    };
  }
};

/**
 * Shares an image URL with author credit via the native system share sheet.
 */
export const shareImage = async (author: string, imageUrl: string): Promise<void> => {
  try {
    const message = `Check out this stunning photo by ${author} on FotoOwl Gallery: ${imageUrl}`;

    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({
        title: `Photo by ${author}`,
        text: message,
        url: imageUrl,
      });
      return;
    }

    await Share.share({
      message,
      url: imageUrl,
      title: `Photo by ${author}`,
    });
  } catch (error) {
    console.warn('[fileDownloader] Share cancelled or failed:', error);
  }
};
