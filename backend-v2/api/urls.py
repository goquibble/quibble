from ninja import NinjaAPI

from .views.root import router as root_router
from .views.user import router as user_router
from .views.quiblet import router as quiblet_router
from .views.quib import router as quib_router

api_v1 = NinjaAPI(version="v1")
api_v1.add_router("/", root_router)
api_v1.add_router("/user", user_router)
api_v1.add_router("/quiblet", quiblet_router)
api_v1.add_router("/quib", quib_router)
