#!/usr/bin/env bash
sudo apt-get update

sudo apt-get install -y \
        build-essential \
        libcurl4-openssl-dev \
        python-dev \
        python-pip \
	  libvtk5-dev python-vtk
sudo pip install django
