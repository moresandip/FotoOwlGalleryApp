import { NavigatorScreenParams } from '@react-navigation/native';
import { PicsumImage } from './gallery';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  ImageDetail: { image?: PicsumImage; id?: string };
};
