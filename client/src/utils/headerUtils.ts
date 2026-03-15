import SessionManager from './sessionManager';
import { getAvatarUrl } from './avatarUtils';

export const getHeaderProps = () => {
  const session = SessionManager.getSession();
  
  if (!session) {
    return {
      name: 'Guest',
      role: 'Guest',
      avatar: getAvatarUrl(),
      searchPlaceholder: 'Search...',
      onSearch: (query: string) => console.log('Search:', query),
      onLogout: () => {},
    } as const;
  }

  return {
    name: session.name || 'Student',
    role: 'Student',
    gender: session.gender,
    avatar: session.profile_picture || getAvatarUrl(session.gender),
    searchPlaceholder: 'Search for courses, assignments...',
    onSearch: (query: string) => console.log('Search:', query),
    onLogout: () => {
      SessionManager.clearSession();
      window.location.href = '/login';
    },
  } as const;
};
