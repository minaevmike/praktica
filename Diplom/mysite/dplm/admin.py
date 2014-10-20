from django.contrib import admin
from dplm.models import Mesh

class MeshAdmin(admin.ModelAdmin):
    list_display = ('m_name', 'm_msg')

admin.site.register(Mesh, MeshAdmin)