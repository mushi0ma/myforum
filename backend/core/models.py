from django.db import models

class Users(models.Model):
    username = models.CharField(unique=True, max_length=50)
    email = models.CharField(unique=True, max_length=100)
    password_hash = models.CharField(max_length=255)
    avatar_url = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    website = models.CharField(max_length=255, blank=True, null=True)
    is_admin = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'

class Organizations(models.Model):
    owner = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(unique=True, max_length=50)
    description = models.TextField(blank=True, null=True)
    avatar_url = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'organizations'

class Repositories(models.Model):
    owner = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    org = models.ForeignKey(Organizations, models.DO_NOTHING, blank=True, null=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_public = models.BooleanField(blank=True, null=True)
    fs_path = models.CharField(max_length=255)
    default_branch = models.CharField(max_length=50, blank=True, null=True)
    forked_from = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    stars_count = models.IntegerField(blank=True, null=True)
    forks_count = models.IntegerField(blank=True, null=True)
    open_issues_count = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'repositories'

class Commits(models.Model):
    repo = models.ForeignKey(Repositories, models.DO_NOTHING, blank=True, null=True)
    author = models.ForeignKey(Users, models.DO_NOTHING, blank=True, null=True)
    hash = models.CharField(max_length=40)
    message = models.TextField()
    branch = models.CharField(max_length=255, blank=True, null=True)
    is_verified = models.BooleanField(blank=True, null=True)
    committed_at = models.DateTimeField()
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'commits'

class Issues(models.Model):
    repo = models.ForeignKey(Repositories, models.DO_NOTHING, blank=True, null=True)
    author = models.ForeignKey(Users, models.DO_NOTHING, blank=True, null=True)
    title = models.CharField(max_length=255)
    body = models.TextField(blank=True, null=True)
    is_closed = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'issues'

class PullRequests(models.Model):
    repo = models.ForeignKey(Repositories, models.DO_NOTHING, blank=True, null=True)
    author = models.ForeignKey(Users, models.DO_NOTHING, blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    source_branch = models.CharField(max_length=255)
    target_branch = models.CharField(max_length=255)
    status = models.CharField(max_length=20, blank=True, null=True)
    is_merged = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pull_requests'