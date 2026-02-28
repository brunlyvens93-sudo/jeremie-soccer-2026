import os  # Vérifiez que cette ligne est en haut du fichier

# CORS settings - Configuration complète et permissive
CORS_ALLOW_ALL_ORIGINS = False  # On ne veut PAS tout autoriser
CORS_ALLOWED_ORIGINS = [
    "https://jeremie-soccer-2026.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://jeremie-soccer-2026.onrender.com",
]

# Important pour les requêtes avec credentials (authentification)
CORS_ALLOW_CREDENTIALS = True

# Autoriser tous les en-têtes nécessaires
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Autoriser toutes les méthodes HTTP nécessaires
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Configuration supplémentaire pour les mobiles
CORS_EXPOSE_HEADERS = ['content-type', 'authorization']
CORS_PREFLIGHT_MAX_AGE = 86400  # 24 heures








# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # LIGNE IMPORTANTE

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')