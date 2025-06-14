
from books import views
from django.urls import path

from .views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,)

from .views import (CustomTokenObtainPairView,Registeriew,UserDetails,LogoutView,
                    UserProfile,BookView,GetBooks,UpdateBook,BookDetails,SubcriptionList,
                    ReadListBook,GetReadlist,MoveReadListDown,MoveReadListUp,GetIndexBooks)
from rest_framework_simplejwt.views import (
    TokenRefreshView

)


urlpatterns = [
    path('',views.getRoutes,name='routes'),
    path('token/',CustomTokenObtainPairView.as_view(),name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',Registeriew.as_view(),name='register'),
    path('logout/',LogoutView.as_view(),name='logout'),
    path('user_details/',UserDetails.as_view(),name='user_details'),
    path('user_profile/',UserProfile.as_view(),name='user_profile'),
    path('books/',BookView.as_view(),name='books'),
    path('indexbooks/',GetIndexBooks.as_view(),name='indexbooks'),
    path('getbooks/',GetBooks.as_view(),name='getbooks'),
    path('update/<int:bid>',UpdateBook.as_view(),name='update'),
    path('bookdetail/<int:bid>',BookDetails.as_view(),name='bookdetail'),
    path('subscription/',SubcriptionList.as_view(),name='subscription'),
    path('readlist/<int:id>',ReadListBook.as_view(),name='readlist'),
    path('read/',GetReadlist.as_view(),name='read'),
    path('readlist/<int:bid>/moveup/', MoveReadListUp.as_view(), name='move-readlist-up'),
    path('readlist/<int:bid>/movedown/', MoveReadListDown.as_view(), name='move-readlist-down'),

]
