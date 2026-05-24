export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  content: string;
  image: string | null;
  visibility: 'public' | 'private';
  user: User;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  my_reaction: ReactionType | null;
  reactions: Reaction[];
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  user_id: number;
  post_id: number;
  parent_id: number | null;
  content: string;
  user: User;
  replies: Comment[];
  likes_count: number;
  is_liked: boolean;
  created_at: string;
}

export type ReactionType = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'care' | 'angry';

export interface Reaction {
  id: number;
  post_id: number;
  user_id: number;
  type: ReactionType;
  user: User;
  created_at: string;
}

export interface Like {
  id: number;
  user_id: number;
  user: User;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  user: User;
}
