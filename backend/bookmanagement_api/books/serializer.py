from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from books.models import (User,Profile,Books,Subscription,ReadList)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from books.models import Profile, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
import re


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email','blockstatus')


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls,user):
        if user.blockstatus:
            raise AuthenticationFailed({
                "detail": "Please contact the administrator for further assistance.",
                "title":"Account Blocked",
            })
        token = super().get_token(user)
        return token


def contains_alpha(value):
    if not re.search(r'[a-zA-Z]', value):
        raise serializers.ValidationError("Must contain at least one alphabet.")
    return value    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    blockstatus = serializers.BooleanField(required = False)
    firstName = serializers.CharField(required=True)
    lastName = serializers.CharField(required=True)
    gender = serializers.CharField(required=True)
    place = serializers.CharField(required=True)
    mobile = serializers.CharField(required = True)
    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'blockstatus', 'firstName', 'lastName', 'gender', 'place','mobile')
        extra_kwargs = {
            'email': {'validators': []},       # Disable automatic unique validator
            'username': {'validators': []},    # Disable automatic unique validator
        }
   
    def validate_firstName(self, value):
        return contains_alpha(value)

    def validate_lastName(self, value):
        return contains_alpha(value)
    
    def validate_gender(self,value):
        GENDER_CHOICES = ['Male', 'Female', 'Other']
        if value.capitalize() not in GENDER_CHOICES:
            raise serializers.ValidationError("Invalid gender.")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password Fields Didn't Match"})
        
        if len(set(attrs['password'].strip())) == 1:
            raise serializers.ValidationError({"password": "Password can't be all the same character."})
        return attrs
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email is already registered with us.")
        
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise serializers.ValidationError("Enter Valid email")
        return value
    
    def validate_username(self,value):
        if User.objects.filter(username = value).exists():
            raise serializers.ValidationError("User name Not available")
        return contains_alpha(value)

  

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            blockstatus = validated_data.get('blockstatus', False),
        )

        user.set_password(validated_data['password'])
        user.save()  # Signal will now handle the creation of the StudentProfile
        profile = Profile.objects.create(
            user = user,
            firstName=validated_data['firstName'],
            lastName=validated_data['lastName'],
            gender=validated_data['gender'],
            place=validated_data['place'],
            mobile = validated_data['mobile']

        )
        profile.save()
        return user
        
class ProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset = User.objects.all())
    email = serializers.CharField(source='user.email', required=False)
    class Meta:
        model = Profile
        fields = ['id', 'user', 'firstName', 'lastName', 'gender', 'place', 'mobile', 'date','email']
    def validate_firstName(self, value):
        return contains_alpha(value)

    def validate_lastName(self, value):
        return contains_alpha(value)
        
    def validate_gender(self,value):
        GENDER_CHOICES = ['Male', 'Female', 'Other']
        if value.capitalize() not in GENDER_CHOICES:
            raise serializers.ValidationError("Invalid gender.")
        return value
        
        
    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("Email is already registered with another user.")
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise serializers.ValidationError("Enter Valid email")
        return value
           
              
    def update(self, instance, validated_data):
            # Update fields properly
        instance.firstName = validated_data.get('firstName', instance.firstName)
        instance.lastName = validated_data.get('lastName', instance.lastName)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.place = validated_data.get('place', instance.place)
        instance.mobile = validated_data.get('mobile', instance.mobile)
            # Optional: update user's email if provided
        email = validated_data.get('email')
        if email:
            instance.user.email = email
            instance.user.save()
        instance.save()
        return instance

class BookSerializer(serializers.ModelSerializer):
    images = serializers.ImageField(required=False)
    class Meta:
        model = Books
        fields = ['id','title','author','genre','publicationDate' ,'language','nopage','description','images','date_created','date_updated']

    def validate_title(self, value):
        if not re.search(r'[a-zA-Z]', value):
            raise serializers.ValidationError("Title must contain at least one alphabet.")
        return value

    def validate_author(self, value):
        if not re.search(r'[a-zA-Z]', value):
            raise serializers.ValidationError("Author name must contain at least one alphabet.")
        return value

    def validate_nopage(self, value):
        if not isinstance(value, int):
            raise serializers.ValidationError("Number of pages must be an integer.")
        if value <= 0:
            raise serializers.ValidationError("Number of pages must be greater than zero.")
        return value

    def validate_language(self, value):
        if not re.match(r'^[a-zA-Z\s]+$', value):
            raise serializers.ValidationError("Language must contain only alphabets.")
        return value

    def validate_genre(self, value):
        if not value:
            raise serializers.ValidationError("Genre is required.")
        return value

    def validate_description(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Description must be at least 5 characters long.")
        return value

class SubscriptionSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    book = serializers.PrimaryKeyRelatedField(queryset=Books.objects.all())

    class Meta:
        model = Subscription
        fields = ['user', 'book', 'date', 'updated', 'unsubscribe']
        read_only_fields = ['date', 'updated']


class ReadListSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    book = BookSerializer(read_only=True)

    class Meta:
        model = ReadList
        fields = ['user', 'book', 'date','number']
        read_only_fields = ['date', ]

class BookWithReadListSerializer(serializers.ModelSerializer):
    isinreadlist = serializers.SerializerMethodField()

    class Meta:
        model = Books
        fields = ['id','title','author','genre','publicationDate' ,'language','nopage','description','images','date_created','date_updated', 'isinreadlist']

    def get_isinreadlist(self, obj):
        user = self.context.get('user')
        if not user or user.is_anonymous:
            return False
        return ReadList.objects.filter(user=user, book=obj).exists()

