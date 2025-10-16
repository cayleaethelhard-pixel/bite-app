// src/utils/permissions.js
export const canAccessFeature = (user, feature) => {
  if (!user?.role || !user?.tier) {
    return false;
  }

  const PERMISSIONS = {
    student: {
      free: ['basic_matching', 'text_chat', 'search'],
      pro: ['basic_matching', 'text_chat', 'video_calls', 'verified_badge', 'project_showcase', 'search'],
      'career-plus': ['all_features', 'career_analytics', 'global_certificate']
    },
    startup: {
      free: ['create_profile', 'browse_students', 'search'],
      'scale-faster': ['unlimited_matches', 'post_projects', 'verified_profile', 'search'],
      'pro-founder': ['all_features', 'meet_investors', 'tailored_matching']
    },
    business: {
      free: ['create_profile', 'browse_students', 'search'], // ✅ Added 'search'
      'talent-plus': ['unlimited_matches', 'internship_pipeline', 'global_access', 'project_management', 'verified_profile', 'mentor_analytics', 'search'],
      'investor-plus': ['all_features', 'global_profiles', 'verified_students']
    },
    investor: {
      free: ['browse_profiles', 'basic_contact', 'search'], // ✅ Added 'search'
      explorer: ['browse_all', 'direct_messaging', 'investment_analytics', 'search'],
      'pro-investor': ['all_features', 'portfolio_tracking', 'exclusive_pitches', 'video_calls']
    }
  };
  
  const userPermissions = PERMISSIONS[user.role]?.[user.tier] || [];
  return userPermissions.includes('all_features') || userPermissions.includes(feature);
};