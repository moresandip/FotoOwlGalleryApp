import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    '/',
    'https://foto-owl-gallery-app.vercel.app',
    'http://localhost:8081',
    'http://localhost:19006',
  ],
  config: {
    screens: {
      Auth: {
        initialRouteName: 'Login',
        screens: {
          Login: {
            path: 'login',
            exact: false,
          },
          Register: 'register',
        },
      },
      Main: {
        initialRouteName: 'Home',
        screens: {
          Home: 'gallery',
          Favorites: 'favorites',
          Profile: 'profile',
        },
      },
      ImageDetail: {
        path: 'photo/:id',
        parse: {
          id: (id: string) => id,
        },
        stringify: {
          id: (id: string) => id,
        },
      },
    },
  },
};
