---
title: 'TQLCTF: Ranma½'
translation_id: ranma-encoding
source_digest: dedfc12f8e8522ebde888c847abda3e264bd4e40ba1824924c025a81d0135241
tags:
  - Misc
  - UTF-8
  - Steganography
categories:
  - Cybersecurity
  - CTF
sections: {"variable-length-utf-8": "utf-8可变长编码", "how-the-puzzle-hides-information": "信息隐藏的思路", "solving-it": "解题过程"}
---

## Misc

### Ranma½

I could have done with a bit more experience for this one. And a few more pieces of wonderfully obscure trivia…

#### Variable-length UTF-8

The table shows how the bits of a Unicode code point are distributed across the bytes of its UTF-8 encoding:

![Bit patterns for one- to four-byte UTF-8 sequences](https://res.cloudinary.com/sycamore/image/upload/v1792696512/Typora/2022/02/fdfd2d8940cbcb3dad4d6ee71124333c.png)

> Read the x bits in a row from left to right to recover the code point.

For example, the Hebrew letter א has code point **U+05D0**. Its UTF-8 bytes are **D7 90**. Here’s the conversion:

- U+05D0 falls between U+0080 and U+07FF, so it uses the two-byte pattern `110xxxxx 10xxxxxx`.
- In binary, `05D0` is `10111010000` when written in eleven bits.
- Fill the first five and last six positions: `11010111 10010000`.

Those bytes are `D7 90` in hex. For the reverse conversion, remove the prefixes and join the remaining bits.

#### How the puzzle hides information

A UTF-8 character can occupy one to four bytes. Opening the challenge file as ordinary text produced mostly gibberish. The trick is that the puzzle uses the *shape* of a longer encoding for a character that should have been stored in a single byte.

Take **A**: its code point is `0x41`, or `1000001` in binary. To fit it into the eleven payload bits of a two-byte pattern, pad it to `00001000001`. Inserting those bits into the pattern gives `11000001 10000001`, or **C1 81**. This is an overlong sequence and isn’t valid UTF-8. Reading its payload bits by hand explains how the challenge encodes the letter despite an ordinary decoder rejecting it.

#### Solving it

There were a few ways to inspect the file. Vim worked, and so did WinRAR’s **View** command, of all things:

![Viewing the challenge file](https://res.cloudinary.com/sycamore/image/upload/v1792696507/Typora/2022/02/1771f16334a694ed24fac59a74971010.png)

I also tried reading the bytes with Python:

```python
import binascii

x,y,z=[],[],[]
with open("Ranma","rb") as f:
	try:
		while 1:
			Str = f.read(1)
			if not Str:break
			x.append(binascii.hexlify(Str))
	finally:
		f.close() # 读文件，将16进制字串存入list x

for i in range(len(x)):
	if int(x[i],16)<128:
		y.append(chr(int(x[i],16))) # 小于128的直接chr()转换ASCII码
	if int(x[i],16)>127:
		y.append(bin(int(x[i],16))) # 大于128的转换为二进制分析

for i in range(len(y)):
	if '0b110' in y[i]: # 如果是第二行的情况
		y[i]=chr(int(y[i][5:]+(y[i+1])[4:],2))
	if '0b1110' in y[i]: # 如果是第三行的情况
		y[i]=chr(int(y[i][6:]+(y[i+1])[4:]+(y[i+2])[4:],2))
for i in range(len(y)):
	if '0b' not in y[i]: # 去除多余项并合并
		z.append(y[i])
print(''.join(z))
```

That gave me:

> KGR/QRI 10646-1 zswtqgg d tnxcs tsdtofbrx osk ndnzhl gna Ietygfviy Idoilfvsu Arz (QQJ) hkkqk maikaglvusv ubyp cw ekg krzyj'o kitwkbj alypsdd.  Wjs rzvmebrwoa duwcuosu pqecgqamo cw ekg IFA, uussmpu, ysum aup qfxschljyk swks pcbb khxnsee drdoqpgpwfyv cbg xeupctzou, oql gneg ylv nsg bb zds upygzrxzkjh fq XVT-8, wpr uxxvnw qt wpvy isdz. XVT-8 kif zds tsdtofbrxegktf qt szryafmtqi hkm sahz LD-DUQLQ egjuv, auqjllvtc qfxschljvrehp hlvv iqyk omjehog, sieyafj lqf cwprx ocwezcfh bugp fvwb qb XA-NYYWZ gdniha oap oip wtoqacgnsee wq cwprx rocfhu. `HTTPZB{QFOLP6_KRZ1Q}`

It looked like a Vigenère ciphertext. I found two ways to proceed:

1. Use **Automatic decryption** in the [dCode Vigenère tool](https://www.dcode.fr/vigenere-cipher).
2. Recover the key the way the official write-up intended. List the encoded character lengths in order. One byte stands for a dot, two for a dash and three for a separator. Read the result as Morse code to get the key. I’m not sure how long it would have taken me to think of that one (￣▽￣)".

![Decoding the sequence of character lengths](https://res.cloudinary.com/sycamore/image/upload/v1792696508/Typora/2022/02/150cd961046421d365382e0994f34fba.png)

Flag: `TQLCTF{CODIN6_WOR1D}`
