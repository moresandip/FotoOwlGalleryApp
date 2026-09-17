export interface AvatarOption {
  id: string;
  name: string;
  url: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'avatar_1',
    name: 'Astronaut',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'avatar_2',
    name: 'Explorer',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'avatar_3',
    name: 'Creator',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'avatar_4',
    name: 'Visionary',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'avatar_5',
    name: 'Architect',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'avatar_6',
    name: 'Technologist',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
];

export const getDefaultAvatarUrl = (avatarId?: string): string => {
  const found = AVATAR_OPTIONS.find((a) => a.id === avatarId);
  return found ? found.url : AVATAR_OPTIONS[0].url;
};
