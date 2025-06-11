from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    username = models.CharField(max_length=500,unique=True)
    blockstatus = models.BooleanField(default=False)
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='books_user_groups',  # Custom related_name to avoid conflict
        blank=True
    )

    # Fix user_permissions field clash with related_name
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='books_user_permissions',  # Custom related_name to avoid conflict
        blank=True
    )
    def __str__(self):
        return self.username
    @property
    def profile(self):
        return getattr(self, '_profile_cache', None) or Profile.objects.filter(user=self).first()

    
    
class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    firstName = models.CharField(max_length=1000,blank=True,null=True)
    lastName = models.CharField(max_length=1000,blank=True,null=True)
    gender = models.CharField(max_length=100,blank=True,null=True)
    place = models.CharField(max_length=1000,blank=True,null=True)
    mobile = models.CharField(max_length=1000,blank=True,null=True)
    date = models.DateTimeField(auto_now_add=True)


def upload_to(instance, filename):
    return 'books/{filename}'.format(filename=filename)
class Books(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=5000,blank=True,null=True)
    author = models.CharField(max_length=1000,blank=True,null=True)
    genre = models.CharField(max_length=1000,blank=True,null=True)
    publicationDate = models.DateField(blank=True,null=True)
    language = models.CharField(max_length=1000,blank=True,null=True)
    nopage = models.BigIntegerField(blank=True, null=True)
    description = models.CharField(max_length=5000,blank=True,null=True)
    images = models.ImageField(upload_to=upload_to,null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    date_created = models.DateField(auto_now_add=True)
    date_updated = models.DateField(auto_now=True)

class Subscription(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    book = models.ForeignKey(Books,on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    unsubscribe = models.BooleanField(default=False)

class ReadList(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    book = models.ForeignKey(Books,on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    number = models.BigIntegerField(default=0)
    def save(self, *args, **kwargs):
        if self._state.adding and self.number == 0:
            # Count how many ReadList entries this user already has
            last_number = ReadList.objects.filter(user=self.user).count()
            self.number = last_number + 1  # start from 1
        super().save(*args, **kwargs)
