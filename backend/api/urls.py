from ninja import NinjaAPI

from .views.root import router as root_router
from .views.quiblet import router as quiblet_router
from .views.ai import router as ai_router

from ai_search.api import router as ai_search_router

api_v1 = NinjaAPI(version="v1")
api_v1.add_router("/", root_router)
api_v1.add_router("/quiblet", quiblet_router)
api_v1.add_router("/ai", ai_router)
api_v1.add_router("/ai", ai_search_router)  # merges with /ai prefix
