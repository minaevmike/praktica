from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import patterns, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from dplm import views, cabinet

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'add_new_doc', views.add_new_doc, name='add_new_doc'),
    url(r'add_new_doc_from_form', views.add_new_doc_from_form, name='add_new_doc_from_form'),
    url(r'docs', views.docs, name='docs'),
    url(r'get_detail_description', views.get_detail_description, name='get_detail_description'),
    url(r'get_mesh_data', views.get_mesh_data, name='get_mesh_data'),
    url(r'get_stl_links', views.get_stl_links, name='get_stl_links'),
    url(r'get_mesh_related_info', views.get_mesh_related_info, name='get_mesh_related_info'),
    url(r'delete_mesh', views.delete_mesh, name='delete_mesh'),
    url(r'insert_to_db', views.insert_to_db, name='insert_to_db'),
    #url(r'upload', views.upload, name='upload'),
    url(r'try_to_upload', views.try_to_upload, name='try_to_upload'), #TODO: delete
    url(r'first_upload_step', views.first_upload_step, name='first_upload_step'),
    url(r'decimate', views.decimate, name='decimate'),
    url(r'second_upload_step', views.second_upload_step, name='second_upload_step'),
    url(r'is_there_model', views.is_there_model, name='is_there_model'),
    url(r'get_cone_gear_xml', views.get_cone_gear_xml, name='get_cone_gear_xml'),
    url(r'get_autoBody_xml', views.get_autoBody_xml, name='get_autoBody_xml'),
    url(r'get_wheel_xml', views.get_wheel_xml, name='get_wheel_xml'),
    url(r'registrate', views.registrate, name='registrate'),
    url(r'register', views.register, name='register'),
    url(r'login_page', views.login_page, name='login_page'),
    url(r'login', views.login_my, name='login'),
    url(r'logout', views.logout_my, name='logout_my'),
    url(r'cabinet', cabinet.cabinet, name='cabinet'),
    url(r'add_new_project', cabinet.add_new_project, name='add_new_project')
   # url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT})

) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += staticfiles_urlpatterns()