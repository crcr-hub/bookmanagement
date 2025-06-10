
from books import views
from django.urls import path

from .views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,)

from .views import (CustomTokenObtainPairView,Registeriew,UserDetails,LogoutView,
                    UserProfile,BookView)
from rest_framework_simplejwt.views import (
    TokenRefreshView

)


urlpatterns = [
    path('',views.getRoutes,name='routes'),
    path('token/',CustomTokenObtainPairView.as_view(),name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',Registeriew.as_view(),name='register'),
    path('logout/',LogoutView.as_view(),name='logout'),
    path('user_details/',UserDetails.as_view(),name='user_details'),
    path('user_profile/',UserProfile.as_view(),name='user_profile'),
    path('books/',BookView.as_view(),name='books'),

]
