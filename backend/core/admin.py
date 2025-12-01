from django.contrib import admin
from .models import Users, Repositories, Commits, Issues, PullRequests, Organizations

@admin.register(Users)
class UsersAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_admin', 'created_at')
    search_fields = ('username', 'email')

@admin.register(Repositories)
class RepositoriesAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_public', 'created_at')
    list_filter = ('is_public',)

@admin.register(Commits)
class CommitsAdmin(admin.ModelAdmin):
    list_display = ('hash', 'message', 'branch', 'committed_at')
    search_fields = ('hash', 'message')

admin.site.register(Issues)
admin.site.register(PullRequests)
admin.site.register(Organizations)