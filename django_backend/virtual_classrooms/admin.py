from django.contrib import admin
from .models import VirtualClassroom, ClassroomEnrollment, ClassroomSession, ClassroomAnnouncement, ClassroomResource

admin.site.register(VirtualClassroom)
admin.site.register(ClassroomEnrollment)
admin.site.register(ClassroomSession)
admin.site.register(ClassroomAnnouncement)
admin.site.register(ClassroomResource)