from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import MyTokenObtainPairSerializer
from .serializer import MyTokenObtainPairSerializer,RegisterSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from .models import Profile
from rest_framework_simplejwt.tokens import RefreshToken



# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    routes = [
        'api/token',
        'api/token/refresh'
    ]
    return Response(routes)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    def post(self,request,*args,**kwargs):
        response = super().post(request,*args,**kwargs)
        return response

    
class Registeriew(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()  # Calls the create() method in the serializer
            return Response({"user": user.username,"message": "Registered successfully"}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class UserDetails(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        print(user)
        try:
            profile = Profile.objects.get(user=user)
            user_data = {
                'email': user.email,
                'name': f"{profile.firstName} {profile.lastName}"
            }
            return Response(user_data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()  # Add the token to the blacklist
            return Response({"message": "Successfully logged out"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)



    

