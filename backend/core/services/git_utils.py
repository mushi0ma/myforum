import logging
import git

logger = logging.getLogger(__name__)

class GitParser:
    @staticmethod
    def get_staged_files_diff(repo_path: str):
        """
        Возвращает список измененных файлов (staged) с их диффами.
        Нужно для сценария "CommitGen", когда пользователь еще не закоммитил.
        """
        try:
            repo = git.Repo(repo_path)
            # Получаем diff того, что добавлено в index (git add), по сравнению с HEAD
            diffs = repo.index.diff("HEAD", create_patch=True)
            
            files_data = []
            for d in diffs:
                # Декодируем байты в строку
                diff_text = d.diff.decode('utf-8', errors='replace') if d.diff else ""
                
                # Добавляем в список только если есть изменения
                if diff_text:
                    files_data.append({
                        "filename": d.a_path,
                        "diff": diff_text
                    })
            
            return files_data
        except Exception as e:
            logger.error(f"Git parsing error: {e}")
            return []

    @staticmethod
    def clean_diff(raw_diff: str, max_lines: int = 2000) -> str:
        """
        Утилита для обрезки слишком больших диффов, чтобы не взорвать контекст Gemini/Llama.
        """
        if not raw_diff:
            return ""
        lines = raw_diff.split('\n')
        if len(lines) > max_lines:
            return '\n'.join(lines[:max_lines]) + "\n... (Diff truncated)"
        return raw_diff