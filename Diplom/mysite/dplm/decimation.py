import sys
import vtk
from vtk import *

def decimate_pro(nameOfInputFile, nameOfOutputFile, reductionValue):
        reader = vtkSTLReader()
        reader.SetFileName(nameOfInputFile)
        reader.Update()

        input = vtkPolyData()
        input.ShallowCopy(reader.GetOutput())

        decimate = vtkDecimatePro()
        decimate.SetInputConnection(input.GetProducerPort())
        decimate.SetTargetReduction(reductionValue)
        decimate.Update()

        decimated = vtkPolyData()
        decimated.ShallowCopy(decimate.GetOutput())

        writer = vtk.vtkSTLWriter()
        writer.SetFileName(nameOfOutputFile)
        if vtk.VTK_MAJOR_VERSION <= 5:
            writer.SetInput(decimated)
        else:
            writer.SetInputData(decimated)
        writer.Write()