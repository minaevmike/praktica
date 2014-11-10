__author__ = 'Mike'
import os
import shutil
from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.core.files.uploadedfile import UploadedFile, File
#from django.core.context_processors import csrf
from dplm.models import Mesh
from dplm.models import Doc, User, Project
from .decimation import decimate_pro
from django.contrib.auth import login, logout, authenticate
from django.views.decorators.csrf import csrf_exempt
#from dplm.models import UploadFileForm

def cabinet(request):
    error=''
    try:
        try:
            error = request.GET['error']
        except:
            error = None
        user = request.user
        projects = Project.objects.filter(user=user)
        context = RequestContext(request, {'error':error, 'projects':projects})
        template = loader.get_template('dplm/cabinet.html')
        return HttpResponse(template.render(context))
    except:
        context = RequestContext(request, {'error':'Need to auth'})
        template = loader.get_template('dplm/cabinet.html')
        return HttpResponse(template.render(context))


def add_new_project(request):
    #try:
    name = request.POST['name']
    desc = request.POST['desc']
    user = request.user
    p = Project(m_name=name, description=desc, user=user)
    p.save()
    return HttpResponseRedirect('/dplm/cabinet')
    #except Exception, e:
    #    print e
    #    return HttpResponseRedirect('/dplm/cabinet&error=Project with same name already exist')