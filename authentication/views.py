import json
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.shortcuts import render

# Create your views here.

from rest_framework import permissions, viewsets, status, views
from rest_framework.response import Response


from authentication.models import Account
from authentication.permissions import IsAccountOwner
from authentication.serializers import AccountSerializer


class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_queryset(self):
        user = self.request.user
        return Account.objects.filter(id=user.id)

    def get_permissions(self):
        if self.request.method == 'POST':
            return (permissions.AllowAny(),)

        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.',
            'errors': json.dumps(serializer.errors)
        }, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):

        username = kwargs.get("username", None)
        if username:
            instance = Account.objects.get(username=username)
            self.check_object_permissions(self.request, instance)
            serializer = self.serializer_class(instance, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()

                admin_password = serializer.validated_data.get('admin_password', None)
                if admin_password == "remove":
                    Account.objects.make_account_not_admin(instance)
                if Account.check_admin_password(admin_password):
                    Account.objects.make_account_admin(instance)
                    print "made {} an admin".format(instance)

                return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)



class LoginView(views.APIView):

    def post(self, request, format=None):
        data = json.loads(request.body)

        username = data.get('username', None)
        password = data.get('password', None)

        account = authenticate(username=username, password=password)

        if account is not None:
            if account.is_active:
                login(request, account)
                serialized = AccountSerializer(account)
                return Response(serialized.data)
            else:
                return Response({
                    'status': 'Unauthorized',
                    'message': 'This account has been disabled.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                'status': 'Unauthorized',
                'message': 'Username/password combination invalid.'
            }, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)

        return Response({}, status=status.HTTP_204_NO_CONTENT)