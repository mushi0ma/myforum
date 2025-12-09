// frontend/src/services/ai.ts
const API_URL = '/api/tools'; // Nginx проксирует это на бэкенд

interface CommitResponse {
  message: string;
}

interface CodeReviewResponse {
  issues: any[];
  markdown: string;
}

// Хелпер для заголовков (берет токен из cookies/localStorage, если используете dj-rest-auth)
const getHeaders = () => {
  // Если используете cookies (credentials: include), токен можно не слать явно.
  // Но если храните в localStorage:
  // const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    // 'Authorization': `Token ${token}`, 
  };
};

export const aiService = {
  // Генерация коммита
  async generateCommitMessage(filename: string, diff: string): Promise<string> {
    const response = await fetch(`${API_URL}/generate-commit/`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ filename, diff }),
    });

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
    });

    if (!response.ok) throw new Error('AI Review failed');

    return await response.json(); // Возвращает { issues: [], markdown: "..." }
  }
};