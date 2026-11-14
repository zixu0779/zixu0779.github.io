---
title: DASCTF July × CBCTF 2021 Misc Writeups
translation_id: dasctf-july-misc
source_digest: 1ebd0c96767b76165a3bdbb2103454061b3ca5d7c80e2475eb1c2b82dc853c36
tags:
  - Misc
  - Steganography
  - Python
categories:
  - Cybersecurity
  - CTF
---

## Misc-red_vs_blue

This was a timed game with 66 rounds of trial and error. Within a single connection the answers stayed the same: enter r or b, and after a wrong answer enter y to retry. I kept the correct prefix and replayed it on each restart so I could try the next unknown choice before the time limit.

```python
from pwn import *

# sh=process("./buu--rip")  local端
sh = remote('node4.buuoj.cn', 28699)
s = []
i=1
tag=0
q = sh.recvuntil(':')
while True:
    if i==66:
        break;
    if tag==0:
        sh.send('r')
        q=sh.recvuntil(':')
        print(q)
        if b'again'  not in q:
            i+=1;s.append('r')
            continue
        else :
             sh.send('y')
             for m in s:
                 sh.recvuntil(':')
                 sh.send(m)
             sh.recvuntil(':')  #
             tag = 1
             continue

    elif tag==1:
        sh.send('b')
        q=sh.recvuntil(':')
        print(q)
        if b'again' not in q:
            i += 1;s.append('b')
            continue
        else:
              sh.send('y')
              for m in s:
                  sh.recvuntil(':')
                  sh.send(m)
              sh.recvuntil(':')#
              tag = 0
              continue

print(i)
sh.interactive()
```

My loop had a small bug: it stopped on round 66. I still had a guess left, though, and that got me the flag.

---

## Misc-funny_maze

Similar setup, this time with a conventional maze. Find a path, submit it and repeat for the next maze.

```python
from pwn import *

dirs=[(0,1),(1,0),(0,-1),(-1,0)] #当前位置四个方向的偏移量
path=[]              #存找到的路径

def mark(maze,pos):  #给迷宫maze的位置pos标"2"表示“到过了”
    maze[pos[0]][pos[1]]=2

def passable(maze,pos): #检查迷宫maze的位置pos是否可通行
    return maze[pos[0]][pos[1]]==0

def find_path(maze,pos,end):
    mark(maze,pos)
    if pos==end:
        print(pos,end=" ")  #已到达出口，输出这个位置。成功结束
        path.append(pos)
        return True
    for i in range(4):      #否则按四个方向顺序检查
        nextp=pos[0]+dirs[i][0],pos[1]+dirs[i][1]
        #考虑下一个可能方向
        if passable(maze,nextp):        #不可行的相邻位置不管
            if find_path(maze,nextp,end):#如果从nextp可达出口，输出这个位置，成功结束
                print(pos,end=" ")
                path.append(pos)
                return True
    return False

def see_path(maze,path,leng):     #使寻找到的路径可视化
    length = 0
    for i,p in enumerate(path):
        if i==0:
            maze[p[0]][p[1]] ="E"
        elif i==len(path)-1:
            maze[p[0]][p[1]]="S"
        else:
            maze[p[0]][p[1]] =3
    print("\n")
    for r in maze:
        for c in r:
            if c==3:
                print('\033[0;31m'+"*"+" "+'\033[0m',end="")
                length+=1
            elif c=="S" or c=="E":
                print('\033[0;34m'+c+" " + '\033[0m', end="")
            elif c==2:
                print('\033[0;32m'+"#"+" "+'\033[0m',end="")
            elif c==1:
                print('\033[0;;40m'+" "*2+'\033[0m',end="")
            else:
                print(" "*2,end="")
        print()
    print(length+1)
    leng=length+1
    return leng

def maze_change(num):
    MAZE=[]
    row=col=0
    M=str(sh.recvuntil("P"))
    print(M)
    MAZE.append([])
    for m in M:
        if col == num:
            MAZE.append([])
            row+=1
            col=0
        if m == '\n':
            continue
        elif m == '#':
            MAZE[row].append(1)
            col+=1
        elif m == ' ':
            MAZE[row].append(0)
            col+=1
        elif m == 'S':
            MAZE[row].append(0)
            start=(row,col)
            col+=1
        elif m =='E':
            MAZE[row].append(0)
            end=(row,col)
            col+=1
        elif m =='P':
            break
    print(MAZE)
    return MAZE, start, end
def gets(num):
    maze=[]
    start=(0,0)
    end=(0,0)
    maze,start,end=maze_change(num)
    find_path(maze,start,end)
    leng=0
    leng=see_path(maze,path,leng)
    sh.sendline(str(leng+1))

sh=remote("node4.buuoj.cn",27512)
print(sh.recvuntil(b'game'))
sh.sendline("1")
gets(11)
print(sh.recvuntil(b'level!'))
dirs=[(0,1),(1,0),(0,-1),(-1,0)] #当前位置四个方向的偏移量
path=[]              #存找到的路径

gets(21)
print(sh.recvuntil(b'level!'))
dirs=[(0,1),(1,0),(0,-1),(-1,0)] #当前位置四个方向的偏移量
path=[]              #存找到的路径

gets(31)
print(sh.recvuntil(b'level!'))
dirs=[(0,1),(1,0),(0,-1),(-1,0)] #当前位置四个方向的偏移量
path=[]              #存找到的路径

gets(101)
sh.interactive()
```

I copied part of the maze code from [this implementation](https://blog.csdn.net/qq_29681777/article/details/83719680). What took me ages to debug was resetting the variables between rounds. I kept looking for a mistake in the order of the moves (￣_￣|||).

---

## Misc-ezSteganography

During the contest I only got the first half. The second clue pointed to the green channel, but we fixated on the first clue’s mention of QIM quantisation and went down a rabbit hole trying to work out what it meant (。﹏。).

The missing step was to XOR the Green 0 and Green 1 bit planes. StegSolve’s Image Combiner can do it directly.

![The first half of the flag and the QIM hint](https://res.cloudinary.com/sycamore/image/upload/v1792696543/Typora/2026/09/bddeddcfb73adbb1cd588aba.png)

![The second hint in Red 0](https://res.cloudinary.com/sycamore/image/upload/v1792696547/Typora/2026/09/a7aac50b91830bb4b814ac81.png)

![The second half after combining Green 0 and Green 1](https://res.cloudinary.com/sycamore/image/upload/v1792696548/Typora/2026/09/ed7bd1fb78a9d006921e429c.png)

---

## Misc-Just a GIF

I revisited this after the contest. It’s much the same idea as [running_pixel](https://mochu.blog.csdn.net/article/details/116855242). Splitting the GIF gave 451 frames: 41 groups of 11. Compare frame i of each group with frame i of the first group, marking the different pixels black:

```python
from PIL import Image

path = "Just_a_GIF/"  #填自己的路径
for i in range(11):
    picn = Image.new("RGB",(119,83),(255,255,255))
    for j in range(1,41):
        p1=Image.open(path+str(i)+'.png')
        p2=Image.open(path+str(i+j*11)+'.png')
        for w in range(119):
            for h in range(83):
                if p1.getpixel((w,h)) != p2.getpixel((w,h)):
                    picn.putpixel((w,h),(0,0,0))
    picn.save(str(i)+'.png')

```

That leaves eleven difference images:

![The eleven difference frames](https://res.cloudinary.com/sycamore/image/upload/v1792696547/Typora/2026/09/b50b073253eeb15ed0441fab.png)

I pieced them together by hand:

![The assembled Data Matrix symbol](https://res.cloudinary.com/sycamore/image/upload/v1792696547/Typora/2026/09/11cb06fe78395ad52ed1e355.png)

It looked like a Data Matrix code. Scanning it gave `DASCTF{6bb73086aeb764b5727529d82b084cce}`.

---

## Misc-Nuclear wastewater

Another one I revisited afterwards. The QR code was coloured. A teammate suggested looking at the RGB values: every block had two zero channels and a value in the third. That looked like a good place to hide the message. I extracted the numbers:

```python
from PIL import Image
img = Image.open("Nuclear wastewater.png")
for i in range(3):
    for j in range(0,230,10):
        for t in range(0,230,10):
            rgb=list(img.getpixel((t,j)))
            if rgb[i]>32 and rgb[i]<128:
                print(chr(rgb[i]),end='')
```

> `Ys>UEJht#?ppeEFtstR#~:hi~tR:@s@YRteK#e@KsR&E&:eR:Eht/#iKtteYKhYKYhhhihhKtC2tt:HVEesY&#@Rj!seRi:eitEtKsetKtEE:hh#h#eYKYihhYK(Kt@iSY$KY/@pRsEetsip:~h@eeEs!E&&::EsEEei#/iYe#/ieKKt//iKYhh`

The resulting character string contained a lot of repetitions, so I checked the frequencies:

```python
from collections import Counter
f = 'Ys>UEJht#?ppeEFtstR#~:hi~tR:@s@YRteK#e@KsR&E&:eR:Eht/#iKtteYKhYKYhhhihhKtC2tt:HVEesY&#@Rj!seRi:eitEtKsetKtEE:hh#h#eYKYihhYK(Kt@iSY$KY/@pRsEetsip:~h@eeEs!E&&::EsEEei#/iYe#/ieKKt//iKYhh'
print(Counter(f))
```

![Character frequency output](https://res.cloudinary.com/sycamore/image/upload/v1792696551/Typora/2026/09/ce0e3f6f11396dd265a8d361.png)

I initially read the result as `theKEYis:#R@/&p~!>UJ?FC2HVj(S$`, but the password didn’t work. Taoshen’s write-up pointed out that every character in the tail occurred just once. Their relative order wasn’t determined by frequency. Dropping that tail left the puzzle password `#R@/&p~!`.

Inside the archive was flag.txt. I’d been a bit optimistic about finding the flag in plain sight (T_T). Looking at its bytes revealed something else:

![Inspecting flag.txt in Hex Fiend](https://res.cloudinary.com/sycamore/image/upload/v1792696551/Typora/2026/09/5a8cff6cc774f6d8852d4755.jpg)

Zero-width characters again: U+200C, U+200D and U+200E. A [Unicode steganography decoder](https://330k.github.io/misc_tools/unicode_steganography.html) recovered the clue: “On April 13, 2021, nuclear wastewater was especially severe in CTX1 City, Citrix County.”

Citrix CTX1 meant nothing to me at first. A search suggested it was some kind of encryption. Clearly I still had a lot to learn (；′⌒`). Looking it up led me to the corresponding operation in [CyberChef](https://cyberchef.org/).

![The first CTX1 decoding pass](https://res.cloudinary.com/sycamore/image/upload/v1792696551/Typora/2026/09/071bc71e6a45cfbb2a507f37.jpg)

![The second CTX1 decoding pass](https://res.cloudinary.com/sycamore/image/upload/v1792696552/Typora/2026/09/ed451e769ca6407f871a4461.jpg)

Two passes produced `flag{98047de9ce5aaa4c0031fb55e9dfac70}`. And that was the end of Misc! (oﾟvﾟ)ノ
