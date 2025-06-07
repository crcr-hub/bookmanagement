from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from books.models import User
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
        
