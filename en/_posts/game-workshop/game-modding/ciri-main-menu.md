---
title: Repairing the Ciri main menu background mod
translation_id: ciri-main-menu
source_digest: a06b43ce37fc0a3f4fb1a762cb7d175abf21a6b65ca9dc4a26a00f39d8585936
tags:
  - WolvenKit
  - Mod Repair
  - Cyberpunk 2077
categories:
  - Game Workshop
  - Game Modding
sections: {"fixing-the-logo": "logo-的修改方法", "restore-the-phantom-liberty-logo": "往日之影-logo-补充", "pack-the-project": "最后的工作打包", "how-the-original-mod-works": "分析原-mod", "locating-the-background": "定位背景图片的位置", "a-closer-look-at-the-inkwidget": "进一步分析-inkwidget", "why-the-mod-replaces-every-widget": "原-mod-思路分析", "where-the-logo-fix-actually-belongs": "往日之影-logo-修复点分析", "update-restoring-the-loading-animations": "update修复丢失的加载动画", "why-the-sequence-went-missing": "加载动画丢失原因分析", "restore-the-shots-and-replace-the-menu-background": "加载动画修复方法"}
---

I wanted [Ciri in Night City – Main Menu Background Replacer](https://www.nexusmods.com/cyberpunk2077/mods/2541) to work on Cyberpunk 2077 version 2.0 and later, including the Phantom Liberty logo.

Update 1.1.0: In my 1.0.0 fix, the animations that play when loading a save disappeared. I’ve restored the sequence, although its final shot now uses the replacement main menu background.

> The missing logo and missing loading sequence have different causes. The logo disappeared because the mod shipped older textures. The sequence disappeared because of how broadly the original mod replaced the background assets.
>
> If you’re here for the loading animations, skip to the final section. That’s where I rebuild the mod from scratch.

---

Here’s the original mod at startup. The Phantom Liberty logo is missing:

![The original Ciri menu without the expansion logo](https://res.cloudinary.com/sycamore/image/upload/v1792696328/Typora/2025/08/c42fe5caab097e56ca6115aa25028bde.png)

---

# Fixing the logo

I used WolvenKit.

## Restore the Phantom Liberty logo

Open Mod Browser and locate the installed mod.

![The installed mod in WolvenKit](https://res.cloudinary.com/sycamore/image/upload/v1792696329/Typora/2025/08/5d8a49a1184590d333259cd53e8847dd.png)

Right-click the base folder and choose **Add selected items to project**. In Project Explorer, find and delete `menu_background.xbm` and `menu_background_1080p.xbm`. These are the two files causing the problem.

![The two menu background textures in Project Explorer](https://res.cloudinary.com/sycamore/image/upload/v1792696329/Typora/2025/08/f508d2dcb910791026ac4f0cf9bfa3e5.png)

## Pack the project

Choose **Build → Pack Project**. WolvenKit writes a ZIP archive in the project folder. Remove the original mod and install the newly packed version in Cyberpunk 2077. The expansion logo is back:

![The replacement background with the expansion logo restored](https://res.cloudinary.com/sycamore/image/upload/v1792696338/Typora/2025/08/fbc6ffdfb07adb1f77abc0edd380520e.png)

# How the original mod works

Some background: [Reading Cyberpunk 2077’s UI assets](/en/游戏工坊/游戏%20Mod/赛博朋克%202077%20界面资源分析/).

I took the long way round to figure this out. Here’s what I found along the way.

## Locating the background

The mod changes quite a few files. I started by looking for the actual image it replaced.

---

The main menu image changes as you progress through the story. I traced the images to `base\gameplay\gui\world\loading_screens\`.

Directory names such as `loading_screen_5_after_q101` and `loading_screen_10_after_q112` seem to correspond to story milestones. For instance, here’s `loading_screen_10_after_q112\loading_screen_10_shot_01.xbm`:

![The background associated with q112](https://res.cloudinary.com/sycamore/image/upload/v1792696336/Typora/2025/08/3609b16ee976bb030b37db1649a51d31.png)

I recognised that as the background that appears after sneaking in to install the virus on the float. Here’s another example, `loading_screen_5_after_q101\loading_screen_5_shot_01.xbm`:

![The background texture associated with q101](https://res.cloudinary.com/sycamore/image/upload/v1792696336/Typora/2025/08/ffbe63923183b7d8602c1046d1bc2b84.png)

It matches the menu in my current save:

![The same background on my main menu](https://res.cloudinary.com/sycamore/image/upload/v1792696341/Typora/2025/08/a4e7e61df94dc872b29a72dd4b9fe6ba.png)

## A closer look at the inkwidget

The corresponding `.inkwidget` seemed the likely place to change the background. The old mod still replaced it successfully, despite the missing logo, so I could use it for comparison.

I focused on `loading_screen_5_after_q101.inkwidget` because I could compare it with the menu I was actually seeing. The game file is on the left, the modded file on the right:

![Original and modified loading-screen widgets](https://res.cloudinary.com/sycamore/image/upload/v1792696341/Typora/2025/08/a23b9f1dc9b8ff26b6639b55bb702376.png)

On the right, the important file is `cp_bg_alpha_faded.bk2`, the replacement Ciri animation. On the left, my background used the first shot, so I set the second and third shots aside.

**smoke_loop.bk2** is a looping video of smoke.

**shot_01_assets.inkatlas** picks out the three light columns (`ad`) and the blinking lights (`antenna_lights`) from the texture.

![The atlas entries for the light effects](https://res.cloudinary.com/sycamore/image/upload/v1792696341/Typora/2025/08/28b987b84f447477c8c464cf7621f2cc.png)

Here’s the underlying texture, `short_01_assets.xbm`. You can see the light effects together before the atlas separates them:

![The texture containing the light effects](https://res.cloudinary.com/sycamore/image/upload/v1792696343/Typora/2025/08/01b0e79632d94fc3339833106b191ccf.png)

**loading_screen_5_shot_01.inkatlas** supplies the main background. Its four bounds run from 0 to 1, so the selected region covers the entire texture.

On the annotated menu, ① is the smoke loop and ② comes from the shot assets atlas:

![Smoke and lighting layers marked on the main menu](https://res.cloudinary.com/sycamore/image/upload/v1792696346/Typora/2025/08/48590ddd97bd03ba9d708ed367fa1ef8.png)

For the still image in this particular scene, replacing `loading_screen_5_shot_01.xbm` would do it.

## Why the mod replaces every widget

Replacing that one texture wouldn’t cover the other stages of the story. Looking more closely, I found that the modded `loading_screen_5_after_q101.inkwidget` had the same contents as the game’s `base\gameplay\gui\world\loading_screens\initial_loading_screen\initial_loading_screen.inkwidget`.

![The modded widget beside the initial loading screen widget](https://res.cloudinary.com/sycamore/image/upload/v1792696345/Typora/2025/08/99b267900fa56628ce107626801cda75.png)

The `cp_bg_alpha_faded.bk2` animation referenced by that initial widget had already been replaced with Ciri. Copying the widget into the q101 folder therefore gave that menu the Ciri background as well. The original mod did the same in every corresponding folder. If the game keeps switching backgrounds, why not replace the lot?

## Where the logo fix actually belongs

None of that detective work directly fixed the logo. I couldn’t find a logo in the original q101 widget; what I’d traced was the background replacement. But once I’d accounted for those files, the rest of the mod was much easier to inspect.

---

Two files stood out under `base\gameplay\gui\fullscreen\main_menu\`: `menu_background.xbm` and `menu_background_1080p.xbm`. Here’s the modded texture on the left and the game’s on the right:

![The old texture lacks the Phantom Liberty logo](https://res.cloudinary.com/sycamore/image/upload/v1792696347/Typora/2025/08/e99ca6d089324954b2dfb1f94b502241.png)

The game already has the right logo. The mod’s older textures override it. Removing both textures from the mod lets the game use its own copies.

# Update: restoring the loading animations

After fixing the logo, I loaded a save from the main menu. Usually there’s a short sequence that changes with the story. This time the entire load was black.

The sequence has three shots. Here are examples, in playback order:

![First loading shot](https://res.cloudinary.com/sycamore/image/upload/v1792696349/Typora/2025/08/d2aaf1434e40937c6fd9f92d2131d7fc.png)

![Second loading shot](https://res.cloudinary.com/sycamore/image/upload/v1792696350/Typora/2025/08/fe3589af6f3db84af35d50c00c442090.png)

![Third loading shot](https://res.cloudinary.com/sycamore/image/upload/v1792696352/Typora/2025/08/96c0c166085ec678bf9a94549e0ab157.png)

## Why the sequence went missing

The mod replaced each story-specific widget with `initial_loading_screen.inkwidget`. Those original widgets also define the loading shots, as described in [the inkwidget notes](/en/游戏工坊/游戏%20Mod/赛博朋克%202077%20界面资源分析/#inkwidget).

In the comparison below, the story widget has `ls_01`, `ls_02` and `ls_03`. The initial widget only has `main_menu` and `loading_screen`.

![The three shot entries are missing from the replacement](https://res.cloudinary.com/sycamore/image/upload/v1792696351/Typora/2025/08/dfc871c9dcc12b9cadeb7ca35624c9e3.png)

The first remaining entry, `main_menu`, refers to the replacement Ciri video, `cp_bg_alpha_faded.bk2`. The second refers to a different animation shown on entering the menu. The game can no longer find any of the three shots when loading a save.

## Restore the shots and replace the menu background

I started a fresh project. In Asset Browser I found the original mod’s Ciri background video, listed here as `cp_bg_alpha_faded.bk2`, and added it to the project. Then I located the game’s `loading_screen_5_after_q101.inkwidget` and `initial_loading_screen.inkwidget`. I added the former to the project for editing and used **Open without adding to project** for the latter.

Copy the `cp_bg_alpha_faded.bk2` resource from the initial widget into the q101 widget’s `externalDependenciesForInternalItems`:

![Adding the video dependency to the story widget](https://res.cloudinary.com/sycamore/image/upload/v1792696355/Typora/2025/08/a07fb28527c04bf0d6a1fac487d0e1ea.png)

In `ls_01 → children`, delete items 1–6, the layers making up the original menu background. Keep item 0, `fade_to_black`. It seems to handle the transition; without it the menu background animation stutters.

![Keeping fade_to_black while removing the original layers](https://res.cloudinary.com/sycamore/image/upload/v1792696355/Typora/2025/08/f443d45ef51c334045498bbea418f1d1.png)

From `main_menu → children` in the initial widget, copy `cp_bg_alpha`. It points to the video that the mod has replaced with Ciri.

![Copying the video child from main_menu](https://res.cloudinary.com/sycamore/image/upload/v1792696356/Typora/2025/08/bc72ba01656cc7c37368d1101c3c08b9.png)

Paste it where you removed the other children in the q101 widget:

![The replacement child in ls_01](https://res.cloudinary.com/sycamore/image/upload/v1792696357/Typora/2025/08/6da47409fffe611ec5d5bc039388b64a.png)

Repeat for the widgets in the other story folders under `loading_screens` to cover the remaining backgrounds.

---

**One limitation remains.** The main menu background and the third loading shot both use `ls_01`. The first shot uses `ls_02` and the second uses `ls_03`. Changing `ls_01` gives me the menu I wanted, but now Ciri also appears in that final shot. I haven’t found a way around that yet.
