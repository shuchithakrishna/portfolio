from rest_framework import serializers
from .models import Project, Certificate, ContactMessage

class ProjectSerializer(serializers.ModelSerializer):
    image_display_url = serializers.SerializerMethodField()
    tech_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'image', 'image_url', 
            'image_display_url', 'tech_stack', 'tech_list', 
            'github_link', 'live_link', 'created_at'
        ]
        read_only_fields = ['created_at']

    def get_image_display_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            try:
                return request.build_absolute_uri(obj.image.url) if request else obj.image.url
            except Exception:
                pass
        return obj.image_url or ''

    def get_tech_list(self, obj):
        if obj.tech_stack:
            return [tech.strip() for tech in obj.tech_stack.split(',') if tech.strip()]
        return []


class CertificateSerializer(serializers.ModelSerializer):
    file_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Certificate
        fields = [
            'id', 'title', 'issuing_organization', 'issue_date', 
            'credential_id', 'credential_url', 'file', 'file_url', 
            'file_display_url', 'created_at'
        ]
        read_only_fields = ['created_at']

    def get_file_display_url(self, obj):
        request = self.context.get('request')
        if obj.file:
            try:
                return request.build_absolute_uri(obj.file.url) if request else obj.file.url
            except Exception:
                pass
        return obj.file_url or obj.credential_url or ''


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at', 'read_status']
        read_only_fields = ['created_at']
