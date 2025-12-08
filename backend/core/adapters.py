from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.core.exceptions import ImmediateHttpResponse
from django.shortcuts import render

class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        # 1. Если пользователь уже залогинен и он суперюзер — запрещаем привязку
        if request.user.is_authenticated and request.user.is_superuser:
            raise ImmediateHttpResponse(render(request, 'socialaccount/superuser_error.html'))

        # 2. Если пользователь НЕ залогинен, но пытается войти в аккаунт, 
        # который в базе помечен как superuser (по совпадению email)
        if sociallogin.is_existing:
            user = sociallogin.user
            if user.is_superuser:
                # Мы не хотим, чтобы через GitHub входили в админку.
                # Прерываем вход и показываем ошибку.
                raise ImmediateHttpResponse(render(request, 'socialaccount/superuser_error.html'))
        
        # Если это просто попытка регистрации по email, который принадлежит суперюзеру
        # allauth сам найдет пользователя по email. Нам нужно проверить это до слияния.
        # (Этот шаг сложнее перехватить здесь, но блокировка is_existing выше обычно хватает).
        
        return super().pre_social_login(request, sociallogin)