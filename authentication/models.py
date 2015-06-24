from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, Group, AbstractUser
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.contrib.auth.models import BaseUserManager


class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have a valid email address.')

        if not kwargs.get('username'):
            raise ValueError('Users must have a valid username.')

        account = self.model(
            email=self.normalize_email(email), username=kwargs.get('username')
        )

        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)
        self.make_account_admin(account)

        return account

    def make_account_admin(self, account):
        admin_group = Group.objects.get(name="Admin")
        account.save()
        account.groups.add(admin_group)


class Account(AbstractUser):

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    calorie_target = models.IntegerField(default=2000)

    objects = AccountManager()

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        return ' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        return self.first_name

    @staticmethod
    def check_admin_password(password):
        return password == settings.ADMIN_PASSWORD

    @property
    def is_admin(self):
        try:
            self.groups.get(name="Admin")
            return True
        except ObjectDoesNotExist:
            return False

