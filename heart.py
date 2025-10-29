import math
from turtle import bgcolor, color, done, goto, speed

def hearta(k):
    return 15*math.sin(k)**3
def heartb(k):
    return 12*math.cos(k)-5*\
              math.cos(2*k)-2*math.cos(3*k)-math.cos(4*k)
speed(100000)
bgcolor("black")
for i in range (6000):
    goto(hearta(i)*20, heartb(i)*20)
    for j in range (5):
        color("#F55ADB")
    goto(0,0)
done()


