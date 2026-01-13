/**
 * 🔗 Shared TypeScript Types
 * Used by both Web and Mobile frontends
 */

// User Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  cover_photo?: string;
  bio?: string;
  location?: string;
  phone?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  friends_count: number;
  followers_count: number;
  following_count: number;
  posts_count: number;
  is_friend: boolean;
  is_following: boolean;
}

// Post Types
export interface Post {
  id: number;
  author_id: number;
  content: string;
  image_url?: string;
  video_url?: string;
  privacy: 'public' | 'friends' | 'private';
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  
  // Author info (joined)
  email?: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  
  // User interaction state
  is_liked?: boolean;
}

export interface PostComment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  
  // User info
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
}

// Reel Types
export interface Reel {
  id: number;
  user_id: number;
  video_url: string;
  thumbnail_url?: string;
  caption?: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  
  // User info
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
}

// Story Types
export interface Story {
  id: number;
  user_id: number;
  image_url?: string;
  video_url?: string;
  caption?: string;
  expires_at: string;
  views_count: number;
  created_at: string;
  
  // User info
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
}

// Group Types
export interface Group {
  id: number;
  name: string;
  description?: string;
  cover_photo?: string;
  privacy: 'public' | 'private';
  created_by: number;
  members_count: number;
  created_at: string;
  
  // User membership state
  is_member?: boolean;
  is_admin?: boolean;
}

// Hang Types
export interface Hang {
  id: number;
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time?: string;
  created_by: number;
  participants_count: number;
  max_participants?: number;
  created_at: string;
  
  // User participation state
  is_participant?: boolean;
}

// SwapPoint Types
export interface SwapPoint {
  id: number;
  item_name: string;
  description?: string;
  image_url?: string;
  category?: string;
  condition?: string;
  offered_by: number;
  status: 'available' | 'pending' | 'completed';
  created_at: string;
  
  // User info
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
}

// Message Types
export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  
  // Sender info
  sender_name?: string;
  sender_avatar?: string;
}

export interface Conversation {
  id: number;
  participant_ids: number[];
  last_message?: Message;
  unread_count: number;
  updated_at: string;
  
  // Participant info
  participants?: User[];
}

// Notification Types
export interface Notification {
  id: number;
  user_id: number;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message' | 'friend_request';
  content: string;
  related_id?: number; // Post ID, User ID, etc.
  is_read: boolean;
  created_at: string;
  
  // Actor info
  actor_id?: number;
  actor_name?: string;
  actor_avatar?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Form Types
export interface CreatePostData {
  content: string;
  image?: File | string;
  video?: File | string;
  privacy: 'public' | 'friends' | 'private';
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  bio?: string;
  location?: string;
  phone?: string;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Search Types
export interface SearchResult {
  users: User[];
  posts: Post[];
  groups: Group[];
}

// Platform Detection
export type Platform = 'web' | 'ios' | 'android';

export interface DeviceInfo {
  platform: Platform;
  os_version?: string;
  app_version?: string;
  screen_width: number;
  screen_height: number;
}

// Export all
export default {
  User,
  UserProfile,
  Post,
  PostComment,
  Reel,
  Story,
  Group,
  Hang,
  SwapPoint,
  Message,
  Conversation,
  Notification,
  ApiResponse,
  PaginatedResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  CreatePostData,
  UpdateProfileData,
  ApiError,
  SearchResult,
  Platform,
  DeviceInfo,
};
