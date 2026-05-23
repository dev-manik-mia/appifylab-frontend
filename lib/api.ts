const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://appifylab-backend.test/api';

class ApiClient {
  private baseUrl: string;

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
      throw new Error(error.message || 'Request failed');
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
    return this.post<{ success: boolean; message: string }>('/auth/logout');
  }

  async me() {
    return this.get<{ success: boolean; data: unknown }>('/auth/me');
  }

  // Posts
  async getPosts() {
    return this.get<{ success: boolean; data: unknown[] }>('/posts');
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

  async likeToggle(data: { likeable_id: number; likeable_type: string }) {
    return this.post<{ success: boolean; data: unknown }>('/likes/toggle', data);
  }
}

export const api = new ApiClient(API_BASE_URL);
