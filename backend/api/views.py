from rest_framework import viewsets, permissions
from .models import Project, Certificate, ContactMessage
from .serializers import ProjectSerializer, CertificateSerializer, ContactMessageSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing projects.
    Read-only for anonymous users. Full access for authenticated administrators.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CertificateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing certificates.
    Read-only for anonymous users. Full access for authenticated administrators.
    """
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ContactMessagePermission(permissions.BasePermission):
    """
    Custom permission to only allow anonymous users to create messages (POST),
    while authenticated admin users can list, retrieve, update or delete them.
    """
    def has_permission(self, request, view):
        # Anyone can create a message
        if request.method == 'POST':
            return True
        # Only authenticated admin/staff users can do list, retrieve, update, delete
        return request.user and request.user.is_authenticated and request.user.is_staff


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for submitting and managing contact messages.
    Submission is public. Management is restricted to admin.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [ContactMessagePermission]
