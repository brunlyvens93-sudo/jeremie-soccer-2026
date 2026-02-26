from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Event
from .serializers import EventSerializer, UserSerializer
from django.utils import timezone

# Permission personnalisée pour l'admin seulement
class IsAdminUser(permissions.BasePermission):
    """
    Permission personnalisée qui accorde l'accès uniquement à l'admin (lyvens)
    """
    def has_permission(self, request, view):
        # L'utilisateur doit être authentifié et être 'lyvens'
        return request.user.is_authenticated and request.user.username == 'lyvens'

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_permissions(self):
        """
        Permissions personnalisées selon l'action
        - create: utilisateur connecté
        - update/partial_update/destroy: seulement admin (lyvens)
        - autres: lecture seule pour tous
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        elif self.action == 'create':
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        event = self.get_object()
        user = request.user
        
        if not user.is_authenticated:
            return Response(
                {'error': 'Authentification requise'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if user in event.favorites.all():
            event.favorites.remove(user)
            return Response({'status': 'favori retiré'})
        else:
            event.favorites.add(user)
            return Response({'status': 'favori ajouté'})
    
    @action(detail=False, methods=['get'])
    def my_favorites(self, request):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentification requise'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        events = request.user.favorite_events.all()
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]