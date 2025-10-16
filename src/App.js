import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Rocket, Building, TrendingUp, ArrowRight, CheckCircle, Star, Shield, Globe, Video,
  MessageCircle, Award, BarChart3, Calendar, User, Trash2, X, CreditCard, Lock, LogIn, UserPlus,
  Bell, Search, Filter, Send, Plus, Eye, Mail, Phone, MapPin, GraduationCap, Briefcase,
  TrendingDown, Activity, PieChart, BarChart2, MessageSquare, Users as UsersIcon, Target, Zap,
  Clock, ThumbsUp, ThumbsDown, Edit3, Settings, Home, Compass, MessageCircle as MessageIcon,
  User as UserIcon, LogOut, Hash, Award as Trophy, TrendingUp as TrendingUpIcon, Users as TeamIcon,
  BarChart, LineChart, PieChart as PieChartIcon, Calendar as CalendarIcon, Clock as ClockIcon,
  Heart, Zap as LightningIcon, Paperclip, FileText, Image, Video as VideoIcon, Map, Globe as GlobeIcon,
  Award as AwardIcon, TrendingUp as GrowthIcon, Users as NetworkIcon, Filter as FilterIcon, Save,
  AlertCircle, Check, Loader, MoreVertical
} from 'lucide-react';

// Import images (make sure these files exist in src/images/)
import homepageBackground from './images/homepage-background.jpg';
import studentImage from './images/student-image.png';
import startupImage from './images/startup-image.png';
import businessImage from './images/existing-business-image.png';
import investorImage from './images/investor-image.png';
import roleSelectionBackground from './images/role-selection-homepage.jpg';
import ResetPasswordPage from './ResetPassword';
import { canAccessFeature } from './utils/permissions';

// Use environment variable for API base URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Dashboard Navigation
const DashboardNav = ({ currentUser, onSignOut, activeTab, setActiveTab, unreadMessages }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'matches', label: 'Matches', icon: UsersIcon },
    { id: 'suggested', label: 'Suggested', icon: Target },
    { id: 'messages', label: 'Messages', icon: MessageIcon },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'upgrade', label: 'Upgrade', icon: Star }
  ];

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-indigo-600">BITE</h1>
          </div>
          
          {/* Center - Navigation Tabs */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1 text-sm font-medium ${
                    activeTab === item.id 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Right side - User actions */}
          <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 relative">
              <Bell className="w-6 h-6" />
              {unreadMessages > 0 && (
                <span className="absolute inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform -translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full top-2 right-2">
                  {unreadMessages}
                </span>
              )}
            </button>
            <div className="ml-3 flex items-center space-x-3">
              <img
                className="w-8 h-8 rounded-full"
                src={currentUser.profile?.profilePicture || 'https://placehold.co/32x32/4f46e5/white?text=U'}
                alt="Profile"
              />
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {currentUser.profile?.fullName || currentUser.email}
              </span>
              <button onClick={onSignOut} className="text-gray-400 hover:text-gray-500 p-1">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile navigation - visible on small screens */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex overflow-x-auto py-2 space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center space-y-1 min-w-max ${
                    activeTab === item.id 
                      ? 'text-indigo-600' 
                      : 'text-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Messages View
const MessagesView = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`${API_BASE}/messages`, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
          if (data.length > 0) setSelectedConversation(data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch conversations');
      }
    };
    fetchConversations();
  }, [currentUser.token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          receiverId: selectedConversation.participants.find(id => id !== (currentUser.profile?.id || currentUser.id)),
          content: newMessage
        })
      });
      if (res.ok) {
        const newMsg = await res.json();
        const updatedConvs = conversations.map(conv =>
          conv.id === selectedConversation.id
            ? { ...conv, messages: [...conv.messages, newMsg], lastMessage: newMsg.content, unreadCount: 0 }
            : conv
        );
        setConversations(updatedConvs);
        setSelectedConversation(prev => ({ ...prev, messages: [...prev.messages, newMsg] }));
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to send message');
    }
  };

  if (conversations.length === 0) return <div className="p-12">Loading messages...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Messages</h2>
        </div>
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {conversations.map(conv => {
            const other = conv.participants.find(p => p.id !== (currentUser.profile?.id || currentUser.id));
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedConversation?.id === conv.id ? 'bg-indigo-50' : ''}`}
              >
                <p className="text-sm font-medium text-gray-900">
                  {other?.fullName || other?.name}
                </p>
                <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="lg:col-span-2 bg-white shadow rounded-lg flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                {selectedConversation.participants.find(p => p.id !== (currentUser.profile?.id || currentUser.id))?.fullName}
              </p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto max-h-96">
              {selectedConversation.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.senderId === (currentUser.profile?.id || currentUser.id) ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderId === (currentUser.profile?.id || currentUser.id) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                />
                <button type="submit" className="p-2 bg-indigo-600 text-white rounded-lg">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Reset Password Page Component
const ResetPassword = ({ onBackToMain }) => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Extract token from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (resetToken) {
      setToken(resetToken);
    } else {
      setError('Invalid or missing reset token');
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          onBackToMain();
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been updated. Redirecting to login...
          </p>
          <button
            onClick={onBackToMain}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <button onClick={onBackToMain} className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 flex items-center">
            <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back to Login
          </button>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
          <p className="text-gray-600">Enter your new password below</p>
        </div>
        <form onSubmit={handleResetPassword} className="space-y-6">
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Search View
const AdvancedSearchView = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSearch = async () => {
      try {
        const params = new URLSearchParams({ q: searchTerm });
        const res = await fetch(`${API_BASE}/search?${params}`, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        if (res.ok) {
          const results = await res.json();
          setSearchResults(results);
        }
      } catch (err) {
        console.error('Search failed');
      }
    };
    const timer = setTimeout(fetchSearch, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, currentUser.token]);

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{searchResults.length} Results</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {searchResults.map(user => (
            <div key={user.id} className="p-6">
              <div className="flex items-start">
                <img
                  className="w-16 h-16 rounded-full object-cover"
                  src={user.profilePicture || `https://placehold.co/64x64/4f46e5/white?text=${(user.fullName?.charAt(0) || user.name?.charAt(0) || 'U')}`}
                  alt="Profile"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {user.fullName || user.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{user.location}</p>
                  <div className="mt-4 flex space-x-2">
                    <button className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md">
                      <MessageIcon className="w-4 h-4 mr-1" /> Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Dashboard View with Tier-Based Access
const DashboardView = ({ currentUser, setActiveTab }) => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
  // Only fetch if currentUser exists
    if (currentUser) {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch(`${API_BASE}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        const statsData = await statsRes.json();

        // Fetch activity
        const activityRes = await fetch(`${API_BASE}/dashboard/activity`, {
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        const activityData = await activityRes.json();

        setStats(statsData);
        setRecentActivity(activityData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      }
    };
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentUser]); // Add currentUser as dependency

  // Handle loading state
  if (loading) {
    return <div className="p-12 text-center">Loading dashboard...</div>;
  }

  // Handle no currentUser
  if (!currentUser) {
    return <div className="p-12 text-center">Please log in to view dashboard</div>;
  }
  
  // Handle no stats
  if (!stats) {
    return <div className="p-12 text-center text-red-500">Failed to load dashboard data</div>;
  }

  // Tier-based stat items
  const statItems = [
    { name: 'Total Matches', value: stats.totalMatches, icon: UsersIcon, change: '+0', changeType: 'positive' },
    { name: 'Active Conversations', value: stats.activeConversations, icon: MessageIcon, change: '+0', changeType: 'positive' },
    { name: 'Profile Views', value: stats.profileViews, icon: Eye, change: '+0', changeType: 'positive' },
    { name: 'Compatibility Score', value: stats.compatibilityScore, icon: Target, change: '+0%', changeType: 'positive' }
  ];

  // Tier-based quick actions
  const getQuickActions = () => {
    const actions = [
      { id: 'matches', label: 'Find Matches', icon: UsersIcon, feature: 'basic_matching' },
      { id: 'messages', label: 'Messages', icon: MessageIcon, feature: 'text_chat' },
      { id: 'search', label: 'Search', icon: Search, feature: 'search' },
      { id: 'profile', label: 'Profile', icon: UserIcon, feature: 'view_profiles' }
    ];

    // Add tier-specific actions
    if (currentUser && canAccessFeature(currentUser, 'video_calls')) {
      actions.push({ id: 'video', label: 'Video Calls', icon: Video, feature: 'video_calls' });
    }
    if (currentUser && canAccessFeature(currentUser, 'analytics')) {
      actions.push({ id: 'analytics', label: 'Analytics', icon: BarChart3, feature: 'analytics' });
    }
    if (currentUser && canAccessFeature(currentUser, 'project_management')) {
      actions.push({ id: 'projects', label: 'Projects', icon: Briefcase, feature: 'project_management' });
    }
  
    return actions;
  };

  // Tier-based recent activity
  const filteredActivity = recentActivity.filter(activity => {
    // Only filter if currentUser exists
    if (!currentUser) return true;

    if (activity.type === 'message' && !canAccessFeature(currentUser, 'text_chat')) {
      return false;
    }
    if (activity.type === 'match' && !canAccessFeature(currentUser, 'basic_matching')) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.changeType === 'positive' ? (
                          <TrendingUpIcon className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                        </span>
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredActivity.length > 0 ? (
            filteredActivity.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-center">
                <div className="flex-shrink-0">
                  {activity.icon === 'UsersIcon' ? <UsersIcon className="h-5 w-5 text-gray-400" /> : <MessageIcon className="h-5 w-5 text-gray-400" />}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type === 'match' && 'New match with '}
                    {activity.type === 'message' && 'New message from '}
                    <span className="text-indigo-600">{activity.user}</span>
                  </p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              No recent activity
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions - Tier Based */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {getQuickActions().map((action) => (
            <button 
              key={action.id}
              onClick={() => setActiveTab(action.id)}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <action.icon className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tier Upgrade Banner (for free users) */}
      {currentUser.tier === 'free' && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Unlock Premium Features!</h3>
              <p className="text-indigo-100 mt-1">
                Upgrade to access video calls, advanced analytics, and more!
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('upgrade')}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Homepage (ORIGINAL UI)
const MainHomepage = ({ onSignUp, onSignIn, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        onSignIn({ ...data.user, token: data.token });
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    }
  };

// Frontend only sends email request to backend
const handleForgotPassword = async (e) => {
  e.preventDefault();
  try {
    // Send request to YOUR backend
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: forgotPasswordEmail })
    });
    // Backend handles the actual email sending
  } catch (err) {
    setError('Network error. Please try again.');
  }
};

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${homepageBackground})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      {/* Main content container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-12">
        {/* Logo & Tagline */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">BITE</h1>
          <p className="text-xl text-white opacity-90 mb-2">Bridging Innovators, Talents, and Entrepreneurs</p>
          <p className="text-lg text-white opacity-80">Connecting Students, Startups, Businesses, and Investors worldwide</p>
        </div>
        {/* Sign In / Sign Up Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {/* Sign In Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Welcome back! Please sign in to your account</p>
            </div>
            {!isForgotPassword ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="your@email.com"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="••••••••"
                  required
                />
                <div className="text-right">
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
                  Sign In
                </button>
              </form>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Reset Your Password</h3>
                {forgotPasswordSuccess ? (
                  <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                    Password reset instructions sent to your email!
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
                    <p className="text-gray-600 text-sm">
                      Enter your email and we'll send you a link to reset your password.
                    </p>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="your@email.com"
                      required
                    />
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setError('');
                          setForgotPasswordSuccess(false);
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold"
                      >
                        Send Reset Link
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
          {/* Sign Up Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join BITE to connect with global opportunities</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={onSignUp}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up Now
              </button>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Why Join BITE?</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    AI-powered intelligent matching
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Real-time messaging system
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Advanced search & filtering
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Compatibility scoring system
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* How BITE Works Section */}
        <div className="mt-16 w-full">
          <h2 className="text-3xl font-bold text-center text-white mb-8">How BITE Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Students', desc: 'Find perfect matches with real-time messaging' },
              { icon: Rocket, title: 'Startups', desc: 'Access talent with advanced search filters' },
              { icon: Building, title: 'Businesses', desc: 'Hire students with compatibility scoring' },
              { icon: TrendingUp, title: 'Investors', desc: 'Discover opportunities with AI matching' }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Role Selection
const RoleSelection = ({ onRoleSelect, onBackToMain }) => {
  const roles = [
    { 
      id: 'student', 
      title: 'Student', 
      icon: Users, 
      description: 'Connect with startups and businesses for internships and projects',
      image: studentImage 
    },
    { 
      id: 'startup', 
      title: 'Startup', 
      icon: Rocket, 
      description: 'Find talented students to help scale your business',
      image: startupImage 
    },
    { 
      id: 'business', 
      title: 'Existing Business', 
      icon: Building, 
      description: 'Hire students for internships and access global talent',
      image: businessImage 
    },
    { 
      id: 'investor', 
      title: 'Investor', 
      icon: TrendingUp, 
      description: 'Discover promising startups and investment opportunities',
      image: investorImage 
    }
  ];
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${roleSelectionBackground})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Optional: Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      {/* Main content container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-12">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Back button - now left-aligned */}
          <div className="flex justify-start mb-6">
            <button 
              onClick={onBackToMain} 
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back to Main Page
            </button>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">BITE</h1>
          <p className="text-xl text-white opacity-90">Bridging Innovators, Talents, and Entrepreneurs</p>
        </div>
        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => onRoleSelect(role.id)}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-300 flex flex-col items-center text-center"
            >
              {/* Image - takes half the card height */}
              <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                <img
                  src={role.image}
                  alt={role.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Title & Description */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{role.title}</h3>
              <p className="text-gray-600 mb-6">{role.description}</p>
              {/* Arrow */}
              <ArrowRight className="w-6 h-6 text-indigo-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tier Selection (FULL for all 4 roles)
const TierSelection = ({ selectedRole, onTierSelect, onBack }) => {
  // Map role to background image
  const backgroundMap = {
    student: studentImage,
    startup: startupImage,
    business: businessImage,
    investor: investorImage
  };
  const currentBackground = backgroundMap[selectedRole];
  const tiers = {
    student: [
      {
        id: 'free',
        name: 'Free',
        price: '$0',
        features: [
          'Basic matching',
          'Text chat',
          '5 messages/day',
          'Access to 1 startup/business per month'
        ],
        icon: Users
      },
      {
        id: 'pro',
        name: 'Pro Student',
        price: '$4.99/month',
        features: [
          'Unlimited chats',
          'Video calls',
          'Verified badge',
          'Access to 3 startups/businesses/month',
          'Project showcase'
        ],
        icon: Star,
        popular: true,
        requiresPayment: true
      },
      {
        id: 'career-plus',
        name: 'Career+',
        price: '$9.99/month',
        features: [
          'Priority pairing',
          'Career analytics',
          'Global certificate after mentorship',
          'All Pro features included'
        ],
        icon: Award,
        requiresPayment: true
      }
    ],
    startup: [
      {
        id: 'free',
        name: 'Free',
        price: '$0',
        features: [
          'Create profile',
          'Browse limited student pool'
        ],
        icon: Rocket
      },
      {
        id: 'scale-faster',
        name: 'Scale Faster',
        price: '$19.99/month',
        features: [
          'Unlimited matches',
          'Post real projects or ideas',
          'Verified profile'
        ],
        icon: TrendingUp,
        popular: true,
        requiresPayment: true
      },
      {
        id: 'pro-founder',
        name: 'Pro Founder',
        price: '$39.99/month',
        features: [
          'Unlimited matches',
          'Post real projects or ideas',
          'Verified profile',
          'Meet real investors',
          'Tailored student matching'
        ],
        icon: Shield,
        requiresPayment: true
      }
    ],
    business: [
      {
        id: 'free',
        name: 'Free',
        price: '$0',
        features: [
          'Create profile',
          'Browse limited student pool'
        ],
        icon: Building
      },
      {
        id: 'talent-plus',
        name: 'Talent+',
        price: '$19.99/month',
        features: [
          'Unlimited posting and matches',
          'Internship pipeline access',
          'Global student access',
          'Project management tools',
          'Verified profile',
          'Mentor analytics dashboard'
        ],
        icon: Users,
        popular: true,
        requiresPayment: true
      },
      {
        id: 'investor-plus',
        name: 'Investor+',
        price: '$39.99/month',
        features: [
          'Unlimited posting and matches',
          'Global student profile access',
          'Project management tools',
          'Verified student profiles',
          'All Talent+ features included'
        ],
        icon: TrendingUp,
        requiresPayment: true
      }
    ],
    investor: [
      {
        id: 'free',
        name: 'Free',
        price: '$0',
        features: [
          'Browse limited startup/business profiles',
          'Basic contact info'
        ],
        icon: TrendingUp
      },
      {
        id: 'explorer',
        name: 'Explorer',
        price: '$24.99/month',
        features: [
          'Browsing all profiles',
          'Direct messaging',
          'Investment analytics'
        ],
        icon: Globe,
        popular: true,
        requiresPayment: true
      },
      {
        id: 'pro-investor',
        name: 'Pro Investor',
        price: '$49.99/month',
        features: [
          'Unlimited posting and matches',
          'Global student profile access',
          'Project management tools',
          'Verified student profiles',
          'Priority access to pre-screened opportunities',
          'Video calls',
          'Investment portfolio tracking',
          'Exclusive startup pitches'
        ],
        icon: Shield,
        requiresPayment: true
      }
    ]
  };

  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${currentBackground})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Optional: overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 flex items-center"
          >
            <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
            Back to role selection
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
          <p className="text-white opacity-90">Select the tier that best fits your needs</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers[selectedRole]?.map((tier) => (
            <div
              key={tier.id}
              onClick={() => onTierSelect(tier)}
              className={`bg-white rounded-xl p-8 shadow-lg cursor-pointer transition-all duration-300 ${
                tier.popular ? 'ring-2 ring-indigo-500 transform scale-105' : 'hover:shadow-xl'
              }`}
            >
              {tier.popular && (
                <div className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full mb-4 inline-block">
                  MOST POPULAR
                </div>
              )}
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <tier.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                  <p className="text-2xl font-bold text-indigo-600">{tier.price}</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                Select {tier.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Payment Form
const PaymentForm = ({ tier, onPaymentSuccess, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
  e.preventDefault();
  setIsProcessing(true);
  
  try {
    const res = await fetch(`${API_BASE}/payments/success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser?.token || localStorage.getItem('token')}`
      },
      body: JSON.stringify({ tier: tier.id })
    });
    
    const data = await res.json();
    if (res.ok) {
      onPaymentSuccess();
    } else {
      alert(data.error || 'Payment processing failed');
    }
  } catch (error) {
    alert('Network error during payment processing');
  } finally {
    setIsProcessing(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 flex items-center">
            <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back to tier selection
          </button>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h2>
          <p className="text-gray-600">For {tier.name} - {tier.price}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
            <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry *</label>
              <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
              <input type="text" placeholder="123" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required />
            </div>
          </div>
          <div className="flex justify-between pt-6">
            <button type="button" onClick={onBack} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg">← Back</button>
            <button type="submit" disabled={isProcessing} className="px-6 py-3 bg-green-600 text-white rounded-lg">
              {isProcessing ? 'Processing...' : 'Pay Now →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Basic Info Form (WITH PASSWORD RE-ENTRY AND NO USERNAME)
const BasicInfoForm = ({ onBack, onSubmit, selectedRole, selectedTier }) => {
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    country: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValues.password !== formValues.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (Object.values(formValues).every(value => value.trim()) && formValues.password === formValues.confirmPassword) {
      // Remove confirmPassword before submitting
      const { confirmPassword, ...submitData } = formValues;
      onSubmit({ ...submitData, tier: selectedTier?.id });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 flex items-center">
            <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back
          </button>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Basic Information</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" name="fullName" value={formValues.fullName} onChange={(e) => setFormValues({...formValues, fullName: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Full Name" required />
          <input type="email" name="email" value={formValues.email} onChange={(e) => setFormValues({...formValues, email: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Email" required />
          <input type="password" name="password" value={formValues.password} onChange={(e) => setFormValues({...formValues, password: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Password" required minLength={6} />
          <input type="password" name="confirmPassword" value={formValues.confirmPassword} onChange={(e) => setFormValues({...formValues, confirmPassword: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Confirm Password" required minLength={6} />
          <input type="text" name="city" value={formValues.city} onChange={(e) => setFormValues({...formValues, city: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="City" required />
          <input type="text" name="country" value={formValues.country} onChange={(e) => setFormValues({...formValues, country: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg" placeholder="Country" required />
          <div className="flex justify-between pt-6">
            <button type="button" onClick={onBack} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg">← Back</button>
            <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-lg">Next →</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Opportunities Form (REAL REGISTRATION) - FIXED FOR ALL ROLES
const OpportunitiesForm = ({ onBack, onSubmit, selectedRole, selectedTier, formData }) => {
  const [opportunitiesData, setOpportunitiesData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: formData.email,
      password: formData.password,
      role: selectedRole,
      fullName: formData.fullName,
      location: `${formData.city}, ${formData.country}`,
      tier: formData.tier || selectedTier?.id || 'free',
      ...opportunitiesData
    };
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        onSubmit({ ...data.user, token: data.token });
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      alert('Network error. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <button onClick={onBack} className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 flex items-center">
            <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back
          </button>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Opportunities & Details</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {selectedRole === 'student' && (
            <>
              <input type="text" name="institution" placeholder="Institution" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required onChange={(e) => setOpportunitiesData({...opportunitiesData, institution: e.target.value})} />
              <input type="text" name="skills" placeholder="Skills" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required onChange={(e) => setOpportunitiesData({...opportunitiesData, skills: e.target.value})} />
              <textarea name="goals" placeholder="Goals" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required onChange={(e) => setOpportunitiesData({...opportunitiesData, goals: e.target.value})} />
            </>
          )}
          {selectedRole === 'startup' && (
            <>
              <input type="text" name="companyName" placeholder="Company Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required onChange={(e) => setOpportunitiesData({...opportunitiesData, companyName: e.target.value})} />
              <textarea name="description" placeholder="Company Description" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required onChange={(e) => setOpportunitiesData({...opportunitiesData, description: e.target.value})} />
              <input type="text" name="industry" placeholder="Industry" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required onChange={(e) => setOpportunitiesData({...opportunitiesData, industry: e.target.value})} />
              <input type="text" name="fundingStage" placeholder="Funding Stage" className="w-full px-4 py-3 border border-gray-300 rounded-lg" onChange={(e) => setOpportunitiesData({...opportunitiesData, fundingStage: e.target.value})} />
            </>
          )}
          {selectedRole === 'business' && (
            <>
              <input type="text" name="companyName" placeholder="Company Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required onChange={(e) => setOpportunitiesData({...opportunitiesData, companyName: e.target.value})} />
              <input type="text" name="industry" placeholder="Industry" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required onChange={(e) => setOpportunitiesData({...opportunitiesData, industry: e.target.value})} />
              <input type="text" name="companySize" placeholder="Company Size" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required onChange={(e) => setOpportunitiesData({...opportunitiesData, companySize: e.target.value})} />
              <textarea name="hiringNeeds" placeholder="Hiring Needs" className="w-full px-4 py-3 border border-gray-300 rounded-lg" onChange={(e) => setOpportunitiesData({...opportunitiesData, hiringNeeds: e.target.value})} />
            </>
          )}
          {selectedRole === 'investor' && (
            <>
              <input type="text" name="firmName" placeholder="Firm Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required onChange={(e) => setOpportunitiesData({...opportunitiesData, firmName: e.target.value})} />
              <input type="text" name="investmentFocus" placeholder="Investment Focus" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required onChange={(e) => setOpportunitiesData({...opportunitiesData, investmentFocus: e.target.value})} />
              <input type="text" name="portfolioSize" placeholder="Portfolio Size" className="w-full px-4 py-3 border border-gray-300 rounded-lg" required onChange={(e) => setOpportunitiesData({...opportunitiesData, portfolioSize: e.target.value})} />
              <input type="text" name="preferredIndustries" placeholder="Preferred Industries" className="w-full px-4 py-3 border border-gray-300 rounded-lg" onChange={(e) => setOpportunitiesData({...opportunitiesData, preferredIndustries: e.target.value})} />
            </>
          )}
          <div className="flex justify-between pt-6">
            <button type="button" onClick={onBack} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg">← Back</button>
            <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-lg">Create Profile →</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App
const App = () => {
  const [currentView, setCurrentView] = useState('main-homepage');
  const [currentStep, setCurrentStep] = useState('role-selection');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTier, setSelectedTier] = useState(null);
  const [formData, setFormData] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const unreadMessages = useMemo(() => 0, [currentUser]);

  // Restore session on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Invalid token');
      })
      .then(user => {
        setCurrentUser({ ...user, token });
        setCurrentView('dashboard');
      })
      .catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, []);

  const handleSignUp = () => setCurrentView('signup-flow');
  const handleSignIn = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };
  const handleSignOut = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setCurrentView('main-homepage');
    setActiveTab('dashboard');
  };
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setCurrentStep('tier-selection');
  };
  const handleTierSelect = (tier) => {
    if (tier.requiresPayment) {
      setSelectedTier(tier);
      setCurrentStep('payment');
    } else {
      setSelectedTier(tier.id);
      setCurrentStep('basic-info');
    }
  };
  const handlePaymentSuccess = () => setCurrentStep('basic-info');
  const handleBasicInfoSubmit = (data) => {
    setFormData(data);
    setCurrentStep('opportunities');
  };
  const handleOpportunitiesSubmit = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };
  const handleBackToMain = () => {
    setCurrentView('main-homepage');
    setCurrentStep('role-selection');
    setSelectedRole('');
    setSelectedTier(null);
    setFormData({});
  };

  // Update your renderCurrentView function
  const renderCurrentView = () => {
   if (showResetPassword) {
    return <ResetPassword onBackToLogin={() => setShowResetPassword(false)} />;
  }

  if (currentView === 'main-homepage') {
    return <MainHomepage 
      onSignUp={handleSignUp} 
      onSignIn={handleSignIn} 
      onForgotPassword={() => setShowResetPassword(true)} 
    />;
  } else if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav 
          currentUser={currentUser} 
          onSignOut={handleSignOut} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadMessages={unreadMessages}
        />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            {activeTab === 'dashboard' && <DashboardView currentUser={currentUser} setActiveTab={setActiveTab} />}

            {activeTab === 'messages' && <MessagesView currentUser={currentUser} />}

            {activeTab === 'search' && <AdvancedSearchView currentUser={currentUser} />}

            {activeTab === 'upgrade' && <UpgradeView currentUser={currentUser} onBack={() => setActiveTab('dashboard')} />}

            {activeTab === 'profile' && <div className="bg-white shadow rounded-lg p-6"><h2 className="text-lg font-medium text-gray-900">Profile</h2><p>Email: {currentUser?.email}</p></div>}
          </div>
        </div>
      </div>
    );
  } else {
    switch (currentStep) {
      case 'role-selection': return <RoleSelection onRoleSelect={handleRoleSelect} onBackToMain={handleBackToMain} />;
      case 'tier-selection': return <TierSelection selectedRole={selectedRole} onTierSelect={handleTierSelect} onBack={() => setCurrentStep('role-selection')} />;
      case 'payment': return <PaymentForm tier={selectedTier} onPaymentSuccess={handlePaymentSuccess} onBack={() => setCurrentStep('tier-selection')} />;
      case 'basic-info': return <BasicInfoForm onBack={() => setCurrentStep(selectedTier?.requiresPayment ? 'payment' : 'tier-selection')} onSubmit={handleBasicInfoSubmit} selectedRole={selectedRole} selectedTier={selectedTier} />;
      case 'opportunities': return <OpportunitiesForm onBack={() => setCurrentStep('basic-info')} onSubmit={handleOpportunitiesSubmit} selectedRole={selectedRole} selectedTier={selectedTier} formData={formData} />;
      default: return <RoleSelection onRoleSelect={handleRoleSelect} onBackToMain={handleBackToMain} />;
    }
  }
};

  return renderCurrentView();
};

// Upgrade View Component
const UpgradeView = ({ currentUser, onBack }) => {
  const handleUpgrade = async (tier) => {
    try {
      const response = await fetch(`${API_BASE}/users/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ tier })
      });

      if (response.ok) {
        // Refresh user data
        const updatedUser = await response.json();
        onBack(updatedUser);
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
  };

  // Get available tiers based on current role
  const getAvailableTiers = () => {
    const tierMap = {
      student: [
        { id: 'pro', name: 'Pro Student', price: '$4.99/month', features: ['Unlimited chats', 'Video calls', 'Verified badge'] },
        { id: 'career-plus', name: 'Career+', price: '$9.99/month', features: ['Priority pairing', 'Career analytics', 'Global certificate'] }
      ],
      startup: [
        { id: 'scale-faster', name: 'Scale Faster', price: '$19.99/month', features: ['Unlimited matches', 'Post real projects', 'Verified profile'] },
        { id: 'pro-founder', name: 'Pro Founder', price: '$39.99/month', features: ['Meet real investors', 'Tailored student matching'] }
      ],
      business: [
        { id: 'talent-plus', name: 'Talent+', price: '$19.99/month', features: ['Internship pipeline', 'Global student access', 'Analytics dashboard'] },
        { id: 'investor-plus', name: 'Investor+', price: '$39.99/month', features: ['All Talent+ features', 'Verified student profiles'] }
      ],
      investor: [
        { id: 'explorer', name: 'Explorer', price: '$24.99/month', features: ['Browse all profiles', 'Direct messaging', 'Investment analytics'] },
        { id: 'pro-investor', name: 'Pro Investor', price: '$49.99/month', features: ['Priority access', 'Video calls', 'Portfolio tracking'] }
      ]
    };
    
    return tierMap[currentUser.role] || [];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Account</h2>
          <button 
            onClick={onBack}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getAvailableTiers().map((tier) => (
            <div key={tier.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                <span className="text-2xl font-bold text-indigo-600">{tier.price}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(tier.id)}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Upgrade to {tier.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;