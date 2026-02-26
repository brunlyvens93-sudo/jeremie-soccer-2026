from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'sport_type', 'date', 'location', 'created_by', 'created_at')
    list_filter = ('sport_type', 'date', 'created_by')
    search_fields = ('title', 'description', 'location')
    date_hierarchy = 'date'
    raw_id_fields = ('created_by',)
    filter_horizontal = ('favorites',)
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('title', 'description', 'sport_type')
        }),
        ('Lieu et date', {
            'fields': ('location', 'address', 'date')
        }),
        ('Relations', {
            'fields': ('created_by', 'favorites')
        }),
    )