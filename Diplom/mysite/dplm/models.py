from django.db import models
from django.forms.models import modelform_factory
from django.db.models.signals import post_delete
from django.core.files.storage import default_storage
from django.contrib.auth.models import User
#import sys
#import vtk
#from vtk import *

class MediaModel(models.Model):
    title = models.CharField(max_length = 200)
    secondTitle = models.CharField(max_length = 200)
    media_file = models.FileField(upload_to='dplm/meshes/')

class Project(models.Model):
    m_name = models.CharField(max_length=200)
    user = models.ForeignKey(User)
    description = models.CharField(max_length=1000)

class Mesh(models.Model):
    m_name = models.CharField(max_length=200)
    m_msg = models.CharField(max_length=1000)
    m_commentForRelatedFiles = models.CharField(max_length=1000)
    m_stringWithRelatedFiles = models.CharField(max_length=1000)
    m_origMeshFile = models.FileField(upload_to='dplm/meshes/')
    m_decimMeshFile = models.FileField(upload_to='dplm/meshes/')
    project = models.ForeignKey(Project)

def delete_filefield(sender, **kwargs):
    #Automatically deleted files when records are removed
    mesh = kwargs.get('instance')
    mesh.m_origMeshFile.storage.delete(mesh.m_origMeshFile.path)
    mesh.m_decimMeshFile.storage.delete(mesh.m_decimMeshFile.path)
post_delete.connect(delete_filefield, Mesh)


class Doc(models.Model):
    m_name = models.CharField(max_length=200)
    m_docFile = models.FileField(upload_to='dplm/docs/')




#UploadFileForm = modelform_factory(Mesh)