// Shared utility function for getting avatar URLs based on gender
export function getAvatarUrl(gender?: string): string {
  const maleAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
  const femaleAvatar = 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png';
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png';
  
  if (!gender) return defaultAvatar;
  const normalizedGender = gender.toLowerCase();
  if (normalizedGender === 'male') return maleAvatar;
  if (normalizedGender === 'female') return femaleAvatar;
  return defaultAvatar;
}
