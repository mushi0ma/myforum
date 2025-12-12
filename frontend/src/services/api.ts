import Cookies from 'js-cookie';

const API_URL = '/api/forum/posts';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const csrftoken = Cookies.get('csrftoken');
  if (csrftoken) {
    headers['X-CSRFToken'] = csrftoken;
  }

  return headers;
};

export interface ForumPost {
  id: number;
  title: string;
  description: string;
  code_snippet?: string;
  language: string;
  author_username: string;
  views: number;
  forks_count: number;
  trending_score: number;
  is_solved: boolean;
  created_at: string;
  updated_at?: string;
  tags?: string[];
  likes_count: number;
  comments_count: number;
}

export interface ForumComment {
  id: number;
  author_username: string;
  content: string;
  created_at: string;
  parent: number | null;
  likes_count?: number;
}

export interface ExploreParams {
  search?: string;
  language?: string;
  tags?: string;
  ordering?: 'trending_score' | 'created_at' | 'views' | 'forks_count' | '-trending_score' | '-created_at' | '-views' | '-forks_count';
  page?: number;
  page_size?: number;
}

export const forumApi = {
  /**
   * Получить трендовые посты (сортировка по trending_score)
   */
  async getTrendingPosts(): Promise<ForumPost[]> {
    const response = await fetch(`${API_URL}/?ordering=-trending_score`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trending posts: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Получить посты для страницы Explore с фильтрами
   */
  async getExplorePosts(params: ExploreParams = {}): Promise<ForumPost[]> {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.append('search', params.search);
    if (params.language && params.language !== 'All') searchParams.append('language', params.language);
    if (params.tags) searchParams.append('tags', params.tags);
    if (params.ordering) searchParams.append('ordering', params.ordering);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.page_size) searchParams.append('page_size', params.page_size.toString());

    const url = `${API_URL}/?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch explore posts: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Получить один пост по ID
   */
  async getPostById(id: number): Promise<ForumPost> {
    const response = await fetch(`${API_URL}/${id}/`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Создать новый пост
   */
  async createPost(postData: Partial<ForumPost>): Promise<ForumPost> {
    const response = await fetch(`${API_URL}/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(postData),
      credentials: 'include',
    });

    if (response.status === 403) {
      throw new Error('Forbidden: Check authentication and CSRF token');
    }
    if (response.status === 401) {
      throw new Error('Unauthorized: Please log in');
    }
    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Получить комментарии для поста
   */
  async getComments(postId: number): Promise<ForumComment[]> {
    const response = await fetch(`/api/forum/comments/?post=${postId}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Создать комментарий
   */
  async createComment(postId: number, content: string, parentId?: number): Promise<ForumComment> {
    const response = await fetch(`/api/forum/comments/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        post: postId,
        content,
        parent: parentId || null,
      }),
      credentials: 'include',
    });

    if (response.status === 401) {
      throw new Error('Unauthorized: Please log in to comment');
    }
    if (!response.ok) {
      throw new Error(`Failed to create comment: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Лайкнуть пост
   */
  async votePost(postId: number): Promise<{ status: string }> {
    const response = await fetch(`${API_URL}/${postId}/vote/`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    if (response.status === 401) {
      throw new Error('Unauthorized: Please log in to vote');
    }
    if (!response.ok) {
      throw new Error(`Failed to vote: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Форкнуть пост (создать копию)
   */
  async forkPost(postId: number): Promise<ForumPost> {
    const response = await fetch(`${API_URL}/${postId}/fork/`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    });

    if (response.status === 401) {
      throw new Error('Unauthorized: Please log in to fork');
    }
    if (!response.ok) {
      throw new Error(`Failed to fork post: ${response.statusText}`);
    }

    return await response.json();
  },
};
