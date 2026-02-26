# Configuration CORS plus permissive pour le dépannage
CORS_ALLOW_ALL_ORIGINS = True  # TEMPORAIRE pour tester
CORS_ALLOW_CREDENTIALS = True

# En production, remettez ceci :
# CORS_ALLOWED_ORIGINS = [
#     "https://jeremie-soccer-2026.vercel.app",
#     "http://localhost:5173",
# ]