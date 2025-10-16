// src/utils/permissions.js
export const PERMISSIONS = {
  student: {
    free: ['basic_matching', 'text_chat', 'search'],
    pro: ['basic_matching', 'text_chat', 'video_calls', 'verified_badge', 'project_showcase'],
    'career-plus': ['all_features', 'career_analytics', 'global_certificate']
  },
  startup: {
    free: ['create_profile', 'browse_students'],
    'scale-faster': ['unlimited_matches', 'post_projects', 'verified_profile'],
    'pro-founder': ['all_features', 'meet_investors', 'tailored_matching']
  },
  business: {
    free: ['create_profile', 'browse_students'],
    'talent-plus': ['unlimited_matches', 'internship_pipeline', 'global_access', 'project_management', 'verified_profile', 'mentor_analytics'],
    'investor-plus': ['all_features', 'global_profiles', 'verified_students']
  },
  investor: {
    free: ['browse_profiles', 'basic_contact'],
    explorer: ['browse_all', 'direct_messaging', 'investment_analytics'],
    'pro-investor': ['all_features', 'portfolio_tracking', 'exclusive_pitches', 'video_calls']
  }
};

export const canAccessFeature = (user, feature) => {
  if (!user?.role || !user?.tier) return false;
  
  const userPermissions = PERMISSIONS[user.role]?.[user.tier] || [];
  
  // If user has 'all_features' permission
  if (userPermissions.includes('all_features')) {
    return true;
  }
  
  // Check if specific feature is allowed
  return userPermissions.includes(feature);
};