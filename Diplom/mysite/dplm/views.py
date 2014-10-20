import os
import shutil
from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse
from django.template import RequestContext, loader
from django.core.files.uploadedfile import UploadedFile, File
#from django.core.context_processors import csrf
from dplm.models import Mesh
from dplm.models import Doc
from .decimation import decimate_pro
#from dplm.models import UploadFileForm

#These are for file upload------------------------------
from django.shortcuts import render_to_response
from .forms import UploadFileForm
#-------------------------------------------------------

# Create your views here.
def CreateDecimateName(origName):
    strLen = len(origName)
    dotPos = 0
    while origName[dotPos] != '.' and dotPos < strLen:
        dotPos += 1
    decFile = origName[0:dotPos]
    decFile += '_dec.STL'
    return decFile


meshesFolder = "D:\\Diplom\\mysite\\mysite\\files\\media\\dplm\\meshes\\"
g_uploadedFileName = settings.UPLOAD_FOLDER + "\\uploaded.STL"
g_uploadedDecFileName = CreateDecimateName(g_uploadedFileName)

def index(request):
    mesh_list = Mesh.objects.all()
    template = loader.get_template('dplm/index.html')
    context = RequestContext(request, {
        'mesh_list': mesh_list,
    })
    return HttpResponse(template.render(context))


def get_mesh_data(request):
    mesh_name = request.POST.get('msh_name', False)
    mesh = Mesh.objects.get(m_name=mesh_name)
    mesh_file = mesh.m_decimMeshFile
    mesh_file_url = mesh_file.url
    return HttpResponse(mesh_file_url)


def get_mesh_related_info(request):
    #TODO: this method must be tested
    meshName = request.POST.get('msh_name')
    mesh = Mesh.objects.get(m_name=meshName)
    comment = mesh.m_commentForRelatedFiles
    relatedFilesString = mesh.m_stringWithRelatedFiles

    relatedFilesUrls = ""
    folderWithRelatedFiles = os.path.join(settings.RELATED_FOLDER, mesh_name)
    # for fileName in relatedFilesString.split(";"):
    #     relatedFilesUrls += os.path.join(folderWithRelatedFiles, fileName)
    #     relatedFilesUrls += ";"

    responseString = "<xml><comment>"
    # responseString += comment
    responseString += "</comment><related_files>"
    # responseString += relatedFilesUrls
    responseString += "</related_files></xml>"

    return HttpResponse(responseString)


def delete_mesh(request):
    #Deleting mesh
    name_of_deleting_mesh = request.POST.get('name', False)
    deleting_mesh = Mesh.objects.get(m_name=name_of_deleting_mesh)
    deleting_mesh.delete()

    #Build new list
    mesh_list = Mesh.objects.all()
    template = loader.get_template_from_string(
        "{% for mesh in mesh_list %}<option value=\"{{mesh.m_name}}\">{{mesh.m_name}}</option>{% endfor %})"
    )
    context = RequestContext(request, {
        'mesh_list': mesh_list,
    })
    return HttpResponse(template.render(context))


def insert_to_db(request):
    #return HttpResponse("Hello")
    mesh_name = request.POST.get('name', False)
    #Check, is there mesh with name mesh_name in data base already
    #Mesh.objects.get(m_name=mesh_name)
    #form = MediaFrom(request.GET, request.FILES)
    #if form.is_valid():
    #       form.save()
    data_line = request.POST.get('data', False) #TODO: delete
    new_mesh = Mesh(m_name = mesh_name, m_msg = data_line)
    new_mesh.save()
    return HttpResponse("Success")


def is_there_model(request):
    newObjectTitle = request.POST.get('title')
    result = GetMeshByName(newObjectTitle)
    if result == None:
        return HttpResponse("false")
    else:
        return HttpResponse("true")


def try_to_upload(request):
    if request.method == "POST":
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            newObjectTitle = request.POST.get('title')
            CreateDecimatedFileInUploadFolder(request)

            #Redirect to page, where user can set reduce value and other properties of mesh
            template = loader.get_template('dplm/decimation.html')
            context = RequestContext(request, {
                'mesh_name' : newObjectTitle,
                'data_line' : request.POST.get('dataLine'),
                'uploaded' : g_uploadedFileName,
                'uploaded_dec' : g_uploadedDecFileName,
            })
            return HttpResponse(template.render(context))
    else:
        form = UploadFileForm()
        template = loader.get_template('dplm/upload.html')
        context = RequestContext(request, {
            #'form': form
        })
        return HttpResponse(template.render(context))


def first_upload_step(request):
    if request.FILES == None:
          return HttpResponse("Can't upload detail without STL file")

    newObjectTitle = request.POST.get('title')
    comment = request.POST.get('comment')

    #First of all, prepare upload process folder for related files by deleting all files in it
    DeleteAllFilesInFolder(settings.RELATED_MID_FOLDER)

    #Now put all related files in RELATED_MID_FOLDER
    relatedFilesString = "relatedFiles: "
    for f in request.FILES.getlist('relatedFiles'): #TODO: maybe here we need to use another name as argument in request.FILES.getlist()
        relatedFilesString += f.name
        relatedFilesString += ";"
        HandleRelatedFile(f)

    #Creates files upload.STL and decimated upload_dec.STL in UPLOAD_FOLDER
    CreateDecimatedFileInUploadFolder(request)

    #Redirect to page, where user can set reduce value and other properties of mesh
    template = loader.get_template('dplm/decimation.html')
    context = RequestContext(request, {
        'mesh_name' : newObjectTitle,
        'data_line' : request.POST.get('dataLine'),
        'uploaded' : g_uploadedFileName,
        'uploaded_dec' : g_uploadedDecFileName,
        'comment' : comment,
        'related_files_string' : relatedFilesString
    })
    return HttpResponse(template.render(context))


def HandleRelatedFile(relatedFile):
    #TODO: make file copy
    destFileName = os.path.join(settings.RELATED_MID_FOLDER, relatedFile.name)
    destination = open(destFileName, 'wb+') #TODO: here we must wrote folder where we want to upload related file
    for chunk in relatedFile.chunks():
        destination.write(chunk)
    destination.close()
    return 1


def DeleteAllFilesInFolder(folder):
    for the_file in os.listdir(folder):
        file_path = os.path.join(folder, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
        except Exception, e:
            print e


def decimate(request):
    reduce_value = request.POST.get('reduce_value', False)
    decimate_pro(g_uploadedFileName, g_uploadedDecFileName, float(reduce_value))
    return HttpResponse(g_uploadedFileName)


def second_upload_step(request):
    #Creating mesh files as copies of uploaded files in UPLOAD_FOLDER
    newObjectTitle = request.POST.get('title')
    meshOrigFileName = newObjectTitle + ".STL"
    meshDecimFileName = newObjectTitle + "_dec.STL"

    origFile = open(g_uploadedFileName, 'r')
    djangoOrigFile = File(origFile)

    decFile = open(g_uploadedDecFileName, 'r')
    djangoDecimFile = File(decFile)

    #Creating folder where we put related files of the new detail
    newFolderName = os.path.join(settings.RELATED_FOLDER, newObjectTitle)
    #os.makedirs(newFolderName)

    #And put files in it
    #CopyFilesFromOneFolderToAnother(settings.RELATED_MID_FOLDER, newFolderName)

    #Creating new object in data base
    newMesh = Mesh()
    newMesh.m_name = (newObjectTitle)
    newMesh.m_msg = (newObjectTitle)#TODO: delete this line
    newMesh.m_commentForRelatedFiles = request.POST.get('comment')
    newMesh.m_stringWithRelatedFiles = request.POST.get('related_files_string')
    newMesh.m_origMeshFile.save(meshOrigFileName, djangoOrigFile)#TODO: if djangoOrigFile is binary, this is doesn't work
    newMesh.m_decimMeshFile.save(meshDecimFileName, djangoDecimFile)
    newMesh.save()


def CopyFilesFromOneFolderToAnother(dir_src, dir_dst):
    for file in os.listdir(dir_src):
        src_file = os.path.join(dir_src, file)
        dst_file = os.path.join(dir_dst, file)
        shutil.move(src_file, dst_file)


def CreateDecimatedFileInUploadFolder(request):
    origFile = request.FILES['stlFile']

    #saving original file in folder UPLOAD_FOLDER
    WriteFileToDestination(origFile, g_uploadedFileName)

    #Creating decimated file in UPLOADED_FOLDER
    decimate_pro(g_uploadedFileName, g_uploadedDecFileName, 0.5)


def WriteFileToDestination(file, destUrl):
    with open(destUrl, "wb") as destination:
        for chunk in file.chunks():
            destination.write(chunk)
    return 1


def GetMeshByName(name):
    try:
        return Mesh.objects.get(m_name=name)
    except Mesh.DoesNotExist:
        return None


def get_stl_links(request):
    name = request.POST.get('msh_name')
    mesh = Mesh.objects.get(m_name=name)
    links = mesh.m_origMeshFile.url
    links += ";"
    links += mesh.m_decimMeshFile.url
    return HttpResponse(links)

#---------------------------------------------------------------------------------------
#Views for docs
#---------------------------------------------------------------------------------------
def docs(request):
    template = loader.get_template('dplm/docs.html')
    context = RequestContext(request, {
    })
    return HttpResponse(template.render(context))

def get_detail_description(request):
    name = request.POST.get('name')
    doc = Doc.objects.get(m_name=name)
    fileContain = ReadFileIntoString(doc.m_docFile)
    return HttpResponse(fileContain)

def ReadFileIntoString(file):
    data = file.read()
    return data


def add_new_doc(request):
    template = loader.get_template('dplm/add_new_doc.html')
    context = RequestContext(request, {
    })
    return HttpResponse(template.render(context))


def add_new_doc_from_form(request):
    newObjectTitle = request.POST.get('title')

    origFile = request.FILES['stlFile']
    uploadedFileName = settings.DOCS_UPLOAD_FOLDER + "\\upload.xml"
    with open(uploadedFileName, "wb") as destination:
        for chunk in origFile.chunks():
            destination.write(chunk)

    file = open(uploadedFileName, 'r')
    djangoOrigFile = File(file)

    nameOfResultFile = newObjectTitle + ".xml"

    newDoc = Doc()
    newDoc.m_name = newObjectTitle
    newDoc.m_docFile.save(nameOfResultFile, djangoOrigFile)
    newDoc.save()


def get_cone_gear_xml(request):
    #return HttpResponse('fdfdfd')
    #filename = os.path.join(MEDIA_ROOT, 'dplm', 'docs', 'coneGear.xml')
    filename = "D:\\Diplom\\mysite\\mysite\\files\\media\\dplm\\docs\\coneGear.xml"
    with open (filename, "r") as myfile:
        data = myfile.read().replace('\\n', '')
    return HttpResponse(data)

def get_autoBody_xml(request):
    #return HttpResponse('fdfdfd')
    #filename = os.path.join(MEDIA_ROOT, 'dplm', 'docs', 'coneGear.xml')
    filename = "D:\\Diplom\\mysite\\mysite\\files\\media\\dplm\\docs\\autoBody.xml"
    with open (filename, "r") as myfile:
        data = myfile.read().replace('\\n', '')
    return HttpResponse(data)


def get_wheel_xml(request):
    #return HttpResponse('fdfdfd')
    #filename = os.path.join(MEDIA_ROOT, 'dplm', 'docs', 'coneGear.xml')
    filename = "D:\\Diplom\\mysite\\mysite\\files\\media\\dplm\\docs\\wheel.xml"
    with open (filename, "r") as myfile:
        data = myfile.read().replace('\\n', '')
    return HttpResponse(data)