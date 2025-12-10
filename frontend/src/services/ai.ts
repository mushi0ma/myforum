import Cookies from 'js-cookie';

const API_URL = '/api/tools';

interface CommitResponse {
  message: string;
}

interface CodeReviewResponse {
  issues: any[];
  markdown: string;
}

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Используем библиотеку js-cookie для получения токена
  const csrftoken = Cookies.get('csrftoken');

  if (csrftoken) {
    headers['X-CSRFToken'] = csrftoken;
  }

  return headers;
};

export const aiService = {
  // Генерация коммита
  async generateCommitMessage(filename: string, diff: string): Promise<string> {
    const response = await fetch(`${API_URL}/generate-commit/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ filename, diff }),
      credentials: 'include',
    });

    if (response.status === 403) {
      throw new Error('Forbidden: Ошибка доступа или CSRF. Убедитесь, что вы вошли в систему.');
    }
    if (response.status === 401) {
      throw new Error('Вы не авторизованы. Пожалуйста, войдите в систему.');
    }

    if (!response.ok) throw new Error('AI Generation failed');

    const data: CommitResponse = await response.json();
    return data.message;
  },

  // Ревью кода
  async runCodeReview(filename: string, diff: string, lang: string = 'javascript'): Promise<CodeReviewResponse> {
    const response = await fetch(`${API_URL}/code-review/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ filename, diff, lang }),
      credentials: 'include',
    });

    if (response.status === 403) {
      throw new Error('Forbidden: Ошибка доступа или CSRF. Убедитесь, что вы вошли в систему.');
    }
    if (response.status === 401) {
      throw new Error('Вы не авторизованы. Пожалуйста, войдите в систему.');
    }

    if (!response.ok) throw new Error('AI Review failed');

    return await response.json();
  }
};