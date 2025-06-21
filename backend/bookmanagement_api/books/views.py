from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import MyTokenObtainPairSerializer, ReadListTitleSerializer
from .serializer import (MyTokenObtainPairSerializer,RegisterSerializer,ProfileSerializer,BookSerializer,ChangePasswordSerializer,
                         SubscriptionSerializer,ReadListSerializer,BookWithReadListSerializer)
from rest_framework import generics
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework import status
from rest_framework.views import APIView
from .models import Profile,Books,Subscription,ReadList,ReadlistTitle
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password, make_password



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
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class UserDetails(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
            user_data = {
                'email': user.email,
                'name': f"{profile.firstName} {profile.lastName}"
            }
            return Response(user_data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)



class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            new_password = serializer.validated_data['new_password']
            user.password = make_password(new_password)
            user.save()
            return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            print(e)
            return Response({"error": str(e)}, status=400)


class UserProfile(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
            user_data = {
                'email': user.email,
                'firstName': profile.firstName,
                'lastName' :profile.lastName,
                'place' :profile.place,
                'mobile':profile.mobile,
                'gender':profile.gender,
            }
            return Response(user_data, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            
            serializer.save()
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class GetIndexBooks(APIView):
    def get(self, request):
        genre = request.query_params.get('genre')
        books = Books.objects.all()
        if genre:
            books = books.filter(genre__iexact=genre,is_deleted= False)
        serializer = BookSerializer(books, many=True, context={'request': request})
        print(serializer.data)
        return Response(serializer.data)
    

class BookView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]
    
    def post(self,request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # attach the user
            return Response({"message": "Book added successfully"}, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def get(self, request):
        genre = request.query_params.get('genre')
        books = Books.objects.all()
        if genre:
            books = books.filter(genre__iexact=genre,is_deleted= False)
        serializer = BookSerializer(books, many=True, context={'request': request})
        return Response(serializer.data)

class GetBooks(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        books = Books.objects.filter(user = user,is_deleted=False)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class UpdateBook(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,bid):
        user = request.user
        book = get_object_or_404(Books, id=bid, user=user)
        serializer = BookSerializer(book)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self,request,bid):
        user = request.user
        book =  get_object_or_404(Books, id=bid, user=user)
        serializer = BookSerializer(book,data = request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,bid):
        book = get_object_or_404(Books, id = bid, user=request.user)
        book.is_deleted = True
        book.save()
        return Response({'message': 'Book soft-deleted successfully.'})

    
class BookDetails(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,bid):
        book = get_object_or_404(Books ,id= bid)
        user = request.user
        owner = (user == book.user)
        subscribed = Subscription.objects.filter(user=user, book=book, unsubscribe=False).exists()
        serializer = BookSerializer(book)
        return Response({
            "book": serializer.data,
            "owner": owner,
            "subscribed": subscribed
        },status=status.HTTP_200_OK)
    def post(self,request,bid):
        book = get_object_or_404(Books ,id= bid)
        user = request.user
        owner = (user == book.user)
        subscribed = Subscription.objects.filter(user=user, book=book, unsubscribe=False).exists()
        if not owner and not subscribed:
            subscription = Subscription.objects.create(user=user, book=book)
            serializer = SubscriptionSerializer(subscription)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {"detail": "Subscription not allowed (already subscribed or you're the owner)."},
                            status=status.HTTP_400_BAD_REQUEST )

class SubcriptionList(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user = request.user
        subscriptions = Subscription.objects.filter(user=user, unsubscribe=False)
        books = [subscription.book for subscription in subscriptions]
        serializer = BookWithReadListSerializer(books, many=True, context={'user': user})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ReadListBook(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request,id):
        user = request.user
        title = request.data.get('titleId')
        if not title:
            return Response({"error": "Title is required."}, status=status.HTTP_400_BAD_REQUEST)
        ReadTitle = get_object_or_404(ReadlistTitle,id=title,user = user)
        book = get_object_or_404(Books,id=id)
        subscribed = Subscription.objects.filter(user=user, book=book, unsubscribe=False).exists()
        if not subscribed:
            return Response({"error": "You must be subscribed to this book to add it to your read list."},
                            status=status.HTTP_403_FORBIDDEN)
        already_exists = ReadList.objects.filter(user=user, book=book,title=ReadTitle).exists()
        if already_exists:
            return Response({"message": "Book already in your read list."},
                            status=status.HTTP_200_OK)


        readlist = ReadList.objects.create(user=user, book=book,title = ReadTitle)
        serializer = ReadListSerializer(readlist)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    def delete(self,request,id):
        user = request.user
        book = get_object_or_404(Books,id=id)
        subscribed = Subscription.objects.filter(user=user, book=book, unsubscribe=False).exists()

        if not subscribed:
            return Response({"error": "You must be subscribed to this book to add it to your read list."},
                            status=status.HTTP_403_FORBIDDEN)

    
        readlist_item = ReadList.objects.filter(user=user, book=book).first()
       
        if readlist_item:
            title = readlist_item.title
            readlist_item.delete()
            remaining_items = ReadList.objects.filter(user=user,title=title).order_by('number')
            for index, item in enumerate(remaining_items, start=1):
                if item.number != index:
                    item.number = index
                    item.save(update_fields=["number"])
            return Response({"message": "Book removed from your read list."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Book is not in your read list."}, status=status.HTTP_404_NOT_FOUND)


class handleReadlistTitle(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        readlisttitle = ReadlistTitle.objects.filter(user=user)
        serializer = ReadListTitleSerializer(readlisttitle, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    def post(self,request):
        user = request.user
        title = request.data.get("title")  
        if not title:
            return Response({"error": "Title is required."}, status=status.HTTP_400_BAD_REQUEST)
        readlist_title = ReadlistTitle.objects.create(user=user, title = title)
        serializer = ReadListTitleSerializer(readlist_title)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class getSingleReadList(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,reqeust,tid):
        user = reqeust.user
        title = get_object_or_404(ReadlistTitle,id = tid,user = user)
        readlist = ReadList.objects.filter(user = user,title=title).select_related('book').order_by('number')
        serializer = ReadListSerializer(readlist, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    def delete(self,request,tid):
        try:
            title = ReadlistTitle.objects.get(id=tid, user=request.user)
            title.delete()  
            return Response({"detail": "Title and related items deleted."}, status=status.HTTP_204_NO_CONTENT)
        except ReadlistTitle.DoesNotExist:
            return Response({"error": "Title not found."}, status=status.HTTP_404_NOT_FOUND)
    def patch(self,request,tid):
        try:
            title = ReadlistTitle.objects.get(id=tid, user=request.user)
            new_title = request.data.get('title', '').strip()
            print(new_title)
            if ReadlistTitle.objects.filter(user=request.user, title=new_title).exclude(id=tid).exists():
                return Response({"error": "A reading list with this title already exists."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = ReadListTitleSerializer(title, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ReadlistTitle.DoesNotExist:
            return Response({"error": "Title not found."}, status=status.HTTP_404_NOT_FOUND)


class GetReadlist(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = request.user
        title = ReadlistTitle.objects.filter(user = user).first()
        readlist = ReadList.objects.filter(user=user,title=title).select_related('book').order_by('number')
        serializer = ReadListSerializer(readlist, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

class MoveReadListUp(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, bid):
        user = request.user
        title = request.data.get('titleId')
        current_item = get_object_or_404(ReadList, user=user, book_id=bid)
        current_title = get_object_or_404(ReadlistTitle,user=user,id=title)
        
        # Find item with number just before
        prev_item = ReadList.objects.filter(user=user,title=current_title, number__lt=current_item.number).order_by('-number').first()

        if prev_item:
            # Swap the numbers
            current_item.number, prev_item.number = prev_item.number, current_item.number
            current_item.save()
            prev_item.save()
            return Response({'message': 'Moved up successfully'}, status=200)
        return Response({'message': 'Already at the top'}, status=400)
class MoveReadListDown(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, bid):
        user = request.user
        title = request.data.get('titleId')
        current_item = get_object_or_404(ReadList, user=user, book_id=bid)
        current_title = get_object_or_404(ReadlistTitle,user=user,id=title)
        
        # Find item with number just after
        next_item = ReadList.objects.filter(user=user,title=current_title, number__gt=current_item.number).order_by('number').first()

        if next_item:
            # Swap the numbers
            current_item.number, next_item.number = next_item.number, current_item.number
            current_item.save()
            next_item.save()
            return Response({'message': 'Moved down successfully'}, status=200)
        return Response({'message': 'Already at the bottom'}, status=400)
