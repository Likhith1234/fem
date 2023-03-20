# importing packages
import json
import sys

import numpy
import pandas as pd
import matplotlib.pyplot as plt
from scipy.interpolate import interp1d

file = open("data.json")
data = json.load(file)

E = float(data["E"])
sys.stdout.flush()
I = float(data["I"])
tl = float(data["beamLength"])
tn = int(data["nodesCount"])
te = tn - 1
locations = [0]
kelist = []
sum_of_lengths = 0
for i in range(te):
    L = float(data["elementsLength"][i])
    sum_of_lengths += L
    locations.append(L+locations[-1])
    ke = numpy.array([[12*E*I/L**3, 6*E*I/L**2, -12*E*I/L**3, 6*E*I/L**2],
                      [6*E*I/L**2, 4*E*I/L, -6*E*I/L**2, 2*E*I/L],
                      [-12*E*I/L**3, -6*E*I/L**2, 12*E*I/L**3, -6*E*I/L**2],
                      [6*E*I/L**2, 2*E*I/L, -6*E*I/L**2, 4*E*I/L]])
    kelist.append(ke)
    if sum_of_lengths > tl:
      te = i+1
      break
tn = te+1
GSM = numpy.zeros((2*tn,2*tn), dtype=float)


count = 0
for i in range(te):
    ke = kelist[i]
    for m in range(4):
        for n in range(4):
            GSM[m+count,n+count] = GSM[m+count, n+count]+ke[m, n]
    count = count+2

print('\n##________________________ Boundary Condition ________________________##')

dispvect = numpy.ones((2*tn,1), dtype=float)
bmvect = numpy.ones((tn,1), dtype=float)
fixedSupps = []

stypes = '\nTypes of supports: \nf - Fixed support \np - Pinned support or Roller support \n'
print(stypes)
tsup = int(data["suppsCount"])
for i in range(tsup):
    nn = int(data["supps"][i][0])
    suptype = data["supps"][i][1]
    print(suptype)
    if suptype.lower() in ["f", "fixed"]:
      fixedSupps.append(nn)
    if suptype.lower() in ["f", "fixed"]:
        dispvect[nn*2-2,0]=0
        dispvect[nn*2-1,0]=0
    if suptype.lower() in ["p", "pin", "pinned", "h", "hinge", "hinged", "roller"]:
        dispvect[(nn*2)-2,0]=0
        bmvect[(nn-1), 0] = 0
print(bmvect)

print('\n##________________________ Loading ________________________##')

forcevect = numpy.zeros((2*tn,1), dtype=float)

loadtypes = '\nTypes of loads: \np - Point load \nudl - Uniformly distributed load \n'
print(loadtypes)
tptlds = int(data["loadsCount"])
if tptlds!=0:
    for i in range(tptlds):
        nn = int(data["loads"][i][0])
        pl = float(data["loads"][i][1])
        forcevect[nn*2-2,0] = forcevect[nn*2-2,0] + pl

# tudls = int(input('\nEnter the total number of beam elements having udl (put zero(0) if none): '))
# if tudls!=0:
#     for i in range(tudls):
#         en = int(input('Enter the element number: '))
#         udl = float(input('Enter the UDL in N/mm: '))
#         eqptl = udl*L/2
#         eqmt = udl*(L**2)/12
#         forcevect[en*2-2,0] = forcevect[en*2-2,0] + eqptl
#         forcevect[en*2-1,0] = forcevect[en*2-1,0] - eqmt
#         forcevect[en*2,0] = forcevect[en*2,0] + eqptl
#         forcevect[en*2+1,0] = forcevect[en*2+1,0] + eqmt


rcdlist = []
for i in range(tn*2):
    if dispvect[i,0] == 0:
        rcdlist.append(i)

rrgsm = numpy.delete(GSM, rcdlist, 0) #row reduction
crgsm = numpy.delete(rrgsm, rcdlist, 1) #column reduction
rgsm = crgsm #reduced global stiffness matrix
rforcevect = numpy.delete(forcevect, rcdlist, 0) #reduced force mat
rdispvect = numpy.delete(dispvect, rcdlist, 0) #reduced disp mat

dispresult = numpy.matmul(numpy.linalg.inv(rgsm), rforcevect)

rin = 0
for i in range(tn*2):
    if dispvect[i,0] == 1:
        dispvect[i,0] = dispresult[rin,0]
        rin = rin+1

forceresult = numpy.matmul(GSM, dispvect)
for i in range(tn*2):
    if dispvect[i,0]==0:
        forceresult[i,0] = forceresult[i,0]-forcevect[i,0]

disp = []
rot = []
for i in range(len(dispvect)):
    if i%2 == 0:
        disp.append(dispvect[i,0])
    else:
        rot.append(dispvect[i,0])

print()


n=0
bm = []
for i in range(te):
    ke = kelist[i]
    ldisp = dispvect[n:n+4]
    n = n+2
    lforce = numpy.matmul(ke, ldisp)
    bm.append(round(float(lforce[1]), 3))
    if i == te-1:
        bm.append(round(-1*float(lforce[3]), 3))

beamlen = numpy.arange(0,tl+L,L)

nodeCount = 0
for i in range(0, len(dispvect), 2):
  nodeCount += 1
  print("The Vertical Deflection at Node-{} is {} mm".format(nodeCount, dispvect[i]))
  print("The Rotation at Node-{} is {} rad".format(nodeCount, dispvect[i+1]))


# if fixedSupps:
#   print('\nBending moment\n')
#   fixedSupps.sort()
#   for i in range(len(fixedSupps)):
#     print("Bending Moment at node-{} is {} kNm".format(fixedSupps[i], bm[i]/1000000))

print()
for i in range(len(bm)):
  bm[i] /= 1000000
  locations[i] /= 1000
  print("Bending Moment at node-{} is {} KNm".format(i+1, bm[i]))


plt.plot(locations, bm)
plt.xlabel("Length of beam (m)")
plt.ylabel("Bending Moments (kNm)")
plt.title("Bending Moment Diagram")
plt.axhline(y=0, color="r", linestyle="--")
plt.savefig("C:/Users/likku/OneDrive/Desktop/projectfem/src/assets/results/bmd.png")
plt.show()


disp = dispvect.reshape((nodeCount, 2))
displacements = [disp[i][0] for i in range(nodeCount)]

cubic = interp1d(locations, displacements, kind = "cubic")
X_ = numpy.linspace(min(locations), max(locations), 500)
Y_ = cubic(X_)

plt.plot(X_, Y_)
plt.xlabel("Length of beam (m)")
plt.ylabel("Deflections")
plt.title("Deflection Diagram")
plt.axhline(y=0, color="r", linestyle="--")
plt.savefig("C:/Users/likku/OneDrive/Desktop/projectfem/src/assets/results/def.png")
plt.show()


f = forceresult.reshape((nodeCount, 2))
forces = [round(f[i][0])/1000 for i in range(nodeCount)]

for i in range(1, len(forces)):
  forces[i] += forces[i-1]

square = interp1d(locations, forces, kind="zero")
X_ = numpy.linspace(min(locations), max(locations), 500)
Y_ = square(X_)
plt.plot(X_, Y_)
plt.xlabel("Length of beam (m)")
plt.ylabel("Shear Forces (kN)")
plt.title("Shear Force Diagram")
plt.axhline(y=0, color="r", linestyle="--")
plt.savefig("C:/Users/likku/OneDrive/Desktop/projectfem/src/assets/results/sfd.png")
plt.show()
