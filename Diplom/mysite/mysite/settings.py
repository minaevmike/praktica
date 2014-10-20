"""
Django settings for mysite project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
#BASE_DIR: D:\Diplom\mysite\mysite\

# Quick-start development settings - unsuitable for production


# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'oqj1sr9t=@t3^!jx^9r(&nc#!ld*#7t@x(=$kx*#26(d6qbyco'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
	#'polls',
	'dplm',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'mysite.urls'

WSGI_APPLICATION = 'mysite.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'djangodb',
        'USER': 'root',
        'PASSWORD': '1',
        'HOST': 'localhost', 
        'PORT': '3306',
    }
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

_PATH = os.path.abspath(os.path.dirname(__file__))
#_PATH: D:\Diplom\mysite\mysite\

MEDIA_ROOT = os.path.join(_PATH, 'files', 'media')
#MEDIA_ROOT: D:\Diplom\mysite\mysite\files\media

MEDIA_URL = '/media/'

UPLOAD_FOLDER = os.path.join(MEDIA_ROOT, 'dplm', 'meshes', 'uploadProcess')
MESH_FOLDER = os.path.join(MEDIA_ROOT, 'dplm', 'meshes')
RELATED_FOLDER = os.path.join(MEDIA_ROOT, 'dplm', 'related')
RELATED_MID_FOLDER = os.path.join(MEDIA_ROOT, 'dplm', 'relatedUploadProcess')

DOCS_UPLOAD_FOLDER = os.path.join(MEDIA_ROOT, 'dplm', 'docs', 'upload')

STATIC_ROOT = os.path.join(_PATH, 'files', 'static')
#STATIC_ROOT: D:\Diplom\mysite\mysite\files\static

STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(_PATH, 'static'), #D:\Diplom\mysite\mysite\static
    os.path.join(_PATH, 'files',  'static', 'dplm'),
    os.path.join(_PATH, 'files', 'media', 'dplm', 'meshes', 'uploadProcess'),
    os.path.join(_PATH, 'files', 'media', 'dplm', 'related')
)
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

ADMIN_MEDIA_PREFIX = '/static/admin/'
