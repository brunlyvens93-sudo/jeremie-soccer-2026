from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class EventSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    created_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='created_by', write_only=True
    )
    is_favorited = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'sport_type', 
            'date', 'location', 'address', 'created_by', 
            'created_by_id', 'created_at', 'updated_at',
            'favorites', 'is_favorited'
        ]
        read_only_fields = ['favorites']
    
    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user in obj.favorites.all()
        return False
    
    def validate_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("La date de l'événement ne peut pas être dans le passé")
        return value