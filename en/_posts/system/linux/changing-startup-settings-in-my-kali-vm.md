---
title: Changing Startup Settings in My Kali VM
translation_id: kali-startup
source_digest: 22e6a26b3ab6d34f54bbf84b71e17271bd2b001c6d7fead9fe45c47f0b89cded
edition: annotated
tags:
  - Kali
  - Linux
  - GRUB
  - LightDM
categories:
  - System
  - Linux
sections: {"allow-root-user-login": "允许-root-用户登录", "grub-temporary-start-parameters": "grub-临时启动参数", "skip-login-page-straight-in": "跳过登录页面直接进", "start-skipping-the-5s-lead-interface": "启动跳过5s引导界面", "close-automatic-lock-screen": "关闭自动锁屏"}
---

I changed autologin, the boot menu timeout and screen locking on my Kali VM to cut down on the steps between restarts.

<!-- more -->

While setting up [my Linux lab](/en/cybersecurity/linux-backdoor/setting-up-the-linux-backdoor-lab/), I kept rebooting the guest, waiting for GRUB and typing my password. I wanted to skip some of that repetition O(∩_∩)O.

:::info
This was my personal 2022 Kali VM, with Xfce and LightDM. Enabling autologin means anyone who can start that VM can reach the selected desktop session.
:::

## Allow root user login

For an occasional administrative command, use sudo from a regular account. To set a root password in this guest, I used:

```bash
sudo passwd root
```

Enter your current account password and then the new root password at the prompts. The terminal does not echo the characters.

The screenshot shows the graphical login. My old annotation about newer releases was too broad: root login depends on the account state and display manager configuration.
For other desktops see [Kali’s root login notes](https://www.kali.org/docs/general-use/enabling-root/).

![Kali Graphical Login Interface](https://res.cloudinary.com/sycamore/image/upload/v1792696298/Typora/2026/02/a402df1a20b236ddcbcf1eee3e254813.png)

### GRUB temporary start parameters

If you need to reset the root password during the configuration process and cannot use sudo with existing accounts, you can modify the temporary boot parameters of GRUB, enter the root Shell, execute `passwd root` to set the password, and then restart to return to the normal login process.  

In the boot menu, select Kali and press **E** to edit the current boot entry:  
![Editing the boot entry by pressing E in the GRUB menu](https://res.cloudinary.com/sycamore/image/upload/v1792696298/Typora/2026/02/ee9e095803026b6734c0a8c908209e6f.png)  

The next two images record the changes at the end of the `linux` line. The original content was `ro quiet splash`:  
![Original GRUB kernel parameters: ro quiet splash](https://res.cloudinary.com/sycamore/image/upload/v1792696299/Typora/2026/02/511e5615a8474f12b4de12e701c32d67.png)  

After modification, it becomes `rw init=/bin/sh splash`:  
![Modified GRUB kernel parameters: rw init=/bin/sh splash](https://res.cloudinary.com/sycamore/image/upload/v1792696301/Typora/2026/02/2711dc66462686c032f9aaa47489fe83.png)  

Here, `rw` indicates mounting the root filesystem in read-write mode, and `init=/bin/sh` specifies starting `/bin/sh` instead of the normal init program. Press **Ctrl + X** to continue booting with the modified parameters. The changes only take effect for this boot session. For normal desktop entry, retain the original boot parameters. For parameter meanings, refer to the [Linux Kernel Documentation](https://www.kernel.org/doc/html/latest/admin-guide/kernel-parameters.html).

## Skip Login Page Straight In

LightDM handles autologin. Back up the configuration before editing; changing GRUB is unnecessary for this step.

```bash
sudo vim /etc/lightdm/lightdm.conf
```

Find the active `[Seat:*]` section. The explanatory comments near the top of the file are not active settings.

![Seat configuration in lightdm.conf](https://res.cloudinary.com/sycamore/image/upload/v1792696303/Typora/2026/02/3d4b0b74cf92beadd8ecd4dfd9f9907c.png)

Set these two values in that section:

```ini
autologin-user=root
autologin-user-timeout=0
```

autologin-user selects the account. I used root in this guest; a regular account can be selected instead. A timeout of zero signs in immediately.

![Set automatic login account and waiting time](https://res.cloudinary.com/sycamore/image/upload/v1792696309/Typora/2026/02/79cd91f5f023cbad0cc14f46c39d0119.png)

In Vim, press Esc, type `:wq` and press Enter to save and quit.

For the root account, also check the LightDM autologin PAM policy:

```bash
sudo vim /etc/pam.d/lightdm-autologin
```

The line below blocks autologin for root. If it is present and you want root to log in automatically, add `#` at the start of the line to comment it out. Leave it active if you use a regular account.

```text
# auth required pam_succeed_if.so user != root quiet_success
```

The screenshot highlights the line before it was commented out:

![Configuration line for limiting root login in lightdm-autologin](https://res.cloudinary.com/sycamore/image/upload/v1792696306/Typora/2026/02/2d63a7f739e8266cde13b950dfe93f9b.png)

After saving, run `sudo reboot` and check that the VM opens the desktop of the account you selected. To restore the login screen, undo the autologin settings and restore the original PAM policy.

## Start skipping the 5s lead interface

Even with desktop autologin enabled, GRUB still waited five seconds. Pressing Enter started the default entry immediately.

![The five-second countdown in the GRUB boot menu](https://res.cloudinary.com/sycamore/image/upload/v1792696307/Typora/2026/02/7bf93978563fcf67505a8dc94ac19443.png)

To change the timeout, edit /etc/default/grub:

```bash
sudo vim /etc/default/grub
```

Find GRUB_TIMEOUT. In the screenshot it was set to 5 seconds.

![GRUB_TIMEOUT is 5 seconds before the change](https://res.cloudinary.com/sycamore/image/upload/v1792696308/Typora/2026/02/df74a7f1e325b85e1e40d39e1520b6d9.png)

I changed it to:

```ini
GRUB_TIMEOUT=0
```

Zero boots the default entry immediately. Keep a short delay if you regularly choose other kernels or recovery entries. See the [GRUB timeout documentation](https://www.gnu.org/software/grub/manual/grub/html_node/timeout.html).

Save and regenerate the configuration:

```bash
sudo update-grub
```

![Running update-grub to regenerate the boot configuration](https://res.cloudinary.com/sycamore/image/upload/v1792696310/Typora/2026/02/cc110976411f12bcacdd0c9fa001c7d6.png)

If the command finishes without errors, run `sudo reboot` to test the new timeout. To restore the delay, set GRUB_TIMEOUT back to 5 and run sudo update-grub again.

## Close automatic lock screen

While I waited for long-running commands, the idle desktop would lock and ask for my password again.
I adjusted the lock settings in Xfce’s power manager.

Click the power icon on the panel and open Settings:

![Open settings from the power menu](https://res.cloudinary.com/sycamore/image/upload/v1792696312/Typora/2026/02/0759d1a59a1f52034cc9405a21936f9c.png)

In Security, distinguish these two controls:

- **Automatically lock the session** controls locking when the screensaver activates. Choose **Never** to turn this off.
- **Lock screen when system is going to sleep** independently controls locking on suspend.

In the screenshot I cleared only the second setting. The first still says “When the screensaver is activated”. To disable both behaviours, adjust both controls.

![Screensaver and sleep locking options in Xfce Power Manager](https://res.cloudinary.com/sycamore/image/upload/v1792696315/Typora/2026/02/5d4bcd7102648ae38c3565ddc0802b9c.png)

The changes take effect immediately. Close the settings window when finished.
