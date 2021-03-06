from django.db import models

# Create your models here.
from django.utils import timezone
from authentication.models import Account


class Meal(models.Model):
    """
    Our core meal model.
    """

    eater = models.ForeignKey(Account)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    calories = models.IntegerField()
    meal_time = models.DateTimeField(default=timezone.now)  # if not time provided, assume it's the approriate local time
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return '{0}'.format(self.name)