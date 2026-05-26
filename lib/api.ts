import type { Comment, PaginatedData } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    const headers: HeadersInit = {
      'Accept': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      const err = new Error(error.message || 'Request failed') as Error & { errors?: Record<string, string[]>; status?: number };
      err.errors = error.errors;
      err.status = response.status;
      if (response.status === 429) {
        err.message = 'Too many requests. Please wait a moment and try again.';
      }
      throw err;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async postForm<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  }

  // Auth
  async login(email: string, password: string) {
    return this.post<{ success: boolean; data: { token: string; user: unknown } }>('/auth/login', { email, password });
  }

  async register(data: { first_name: string; last_name: string; email: string; password: string }) {
    return this.post<{ success: boolean; data: { token: string; user: unknown } }>('/auth/register', data);
  }

  async logout() {
    return this.post<{ success: boolean; message: string }>('/logout');
  }

  async me() {
    return this.get<{ success: boolean; data: unknown }>('/me');
  }

  async refresh() {
    return this.post<{ success: boolean; data: { token: string } }>('/refresh');
  }

  // Posts
  async getPosts(page: number = 1) {
    return this.get<{ success: boolean; data: PaginatedData<unknown> }>(`/posts?page=${page}`);
  }

  async getUserPosts(userId: number, page: number = 1) {
    return this.get<{ success: boolean; data: PaginatedData<unknown> }>(`/users/${userId}/posts?page=${page}`);
  }

  async createPost(data: { content: string; visibility: string; image?: File }) {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('visibility', data.visibility);
    if (data.image) {
      formData.append('image', data.image);
    }
    return this.upload<{ success: boolean; data: unknown }>('/posts', formData);
  }

  async toggleReaction(postId: number, reactionId: number) {
    return this.post<{ success: boolean; data: { my_reaction: string | null; reactions: unknown[] } }>(`/posts/${postId}/reactions`, { reaction_id: reactionId });
  }

  async getReactions(postId: number) {
    return this.get<{ success: boolean; data: unknown[] }>(`/posts/${postId}/reactions`);
  }

  // Comments
  async getComments(postId: number) {
    return this.get<{ success: boolean; data: Comment[] }>(`/posts/${postId}/comments`);
  }

  async createComment(postId: number, data: { content: string; parent_id?: number | null }) {
    return this.post<{ success: boolean; data: Comment }>(`/posts/${postId}/comments`, data);
  }

  async deleteComment(commentId: number) {
    return this.delete<{ success: boolean; message: string }>(`/comments/${commentId}`);
  }

  // Comment Reactions
  async toggleCommentReaction(commentId: number, reactionId: number) {
    return this.post<{ success: boolean; data: { is_liked: boolean; reactions: unknown[] } }>(`/comments/${commentId}/reactions`, { reaction_id: reactionId });
  }

  async getCommentReactions(commentId: number) {
    return this.get<{ success: boolean; data: unknown[] }>(`/comments/${commentId}/reactions`);
  }
}

export const api = new ApiClient(API_BASE_URL);
