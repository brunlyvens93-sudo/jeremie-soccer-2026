from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Event(models.Model):
    SPORT_CHOICES = [
        ('FOOT', 'Football'),
        ('BASK', 'Basketball'),
        ('TENN', 'Tennis'),
        ('RUGB', 'Rugby'),
        ('VOLL', 'Volleyball'),
        ('AUTR', 'Autre'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    sport_type = models.CharField(max_length=4, choices=SPORT_CHOICES, default='AUTR')
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    address = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Pour les favoris (relation many-to-many avec User)
    favorites = models.ManyToManyField(User, related_name='favorite_events', blank=True)
    
    class Meta:
        ordering = ['date']
    
    def __str__(self):
        return f"{self.title} - {self.date.strftime('%d/%m/%Y %H:%M')}"
    
    @property
    def is_past(self):
        return self.date < timezone.now()