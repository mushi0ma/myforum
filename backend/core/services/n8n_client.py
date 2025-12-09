import requests
import logging
import os
import json

logger = logging.getLogger(__name__)

class N8nClient:
    @staticmethod
    def _get_headers():
        return {
            "Content-Type": "application/json",
            "x-auth-token": os.environ.get('N8N_SECRET_KEY', 'default-secret-key')
        }

    @staticmethod
    def _handle_response(response, context="n8n"):
        """
        Безопасная обработка ответа от n8n.
        """
        try:
            # Пытаемся распарсить JSON
            return response.json()
        except json.JSONDecodeError:
            # Если вернулся не JSON (например, HTML 404/500 или текст)
            error_msg = f"N8n returned non-JSON response ({response.status_code}). Body: {response.text[:500]}"
            logger.error(f"{context} error: {error_msg}")
            return {"error": error_msg}

    @staticmethod
    def trigger_commit_generation(diff: str, filename: str):
        url = os.environ.get('N8N_COMMIT_GEN_URL')
        if not url:
            return {"error": "N8N_COMMIT_GEN_URL not set"}

        payload = {"filename": filename, "diff": diff}

        try:
            response = requests.post(
                url, 
                json=payload, 
                headers=N8nClient._get_headers(), 
                timeout=30
            )
            # Получаем JSON или ошибку с текстом ответа
            result = N8nClient._handle_response(response, "CommitGen")
            
            if result.get("success") and "data" in result:
                return {"message": result["data"].get("commit_message")}
            
            # Если JSON валиден, но там ошибка внутри
            return result

        except Exception as e:
            logger.error(f"Failed to trigger n8n commit gen: {e}")
            return {"error": str(e)}

    @staticmethod
    def trigger_code_review(diff: str, filename: str, lang: str = "javascript"):
        url = os.environ.get('N8N_CODE_REVIEW_URL')
        if not url:
            return {"error": "N8N_CODE_REVIEW_URL not set"}

        payload = {
            "filename": filename,
            "diff": diff,
            "lang": lang
        }

        try:
            response = requests.post(
                url, 
                json=payload, 
                headers=N8nClient._get_headers(), 
                timeout=30
            )
            
            result = N8nClient._handle_response(response, "CodeReview")
            
            if result.get("success"):
                return {
                    "issues": result.get("data", {}).get("issues", []),
                    "markdown": result.get("markdown", "")
                }
            
            return result

        except Exception as e:
            logger.error(f"Failed to trigger n8n review: {e}")
            return {"error": str(e)}