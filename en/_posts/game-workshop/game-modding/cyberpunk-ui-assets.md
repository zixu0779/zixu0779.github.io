---
title: Reading Cyberpunk 2077’s UI assets
translation_id: cyberpunk-ui-assets
source_digest: ee7c9042d687c3ed509f3ca05f750330a1d2977f2a2fee9c9278e46256154283
tags:
  - WolvenKit
  - Game Asset Breakdown
  - Game UI
  - Cyberpunk 2077
categories:
  - Game Workshop
  - Game Modding
sections: {"file-types-and-what-they-do": "文件类型和作用", "what-i-found-in-the-directories": "目录对应的功能"}
---

These are my working notes on files I came across in Cyberpunk 2077’s archives while making a mod. I hadn’t worked on 3D animation or game production before, so some of the terminology here is my own best guess.

---

# File types and what they do

## xbm

An `.xbm` stores image data used as a texture in the game. WolvenKit can preview it. Here’s `expansion_logo.xbm`:

![WolvenKit preview of the expansion logos](https://res.cloudinary.com/sycamore/image/upload/v1792696360/Typora/2025/08/2c0934a8e3cdb50eaedad5bc5a2c17f0.png)

## inkatlas

An `.inkatlas` seems to describe how to use separate regions of an `.xbm` image. Here’s `expansion_logo.inkatlas`, the atlas that goes with `expansion_logo.xbm`:

![Entries in the expansion logo atlas](https://res.cloudinary.com/sycamore/image/upload/v1792696359/Typora/2025/08/90a3c1b202508200d39ecdf04f3cd021.png)

I expanded entry 3, `logo`, and compared it with entry 4, `logo_EN`:

![Boundary coordinates for logo and logo_EN](https://res.cloudinary.com/sycamore/image/upload/v1792696360/Typora/2025/08/4c4d7b17e1126d72bd67023217ae420f.png)

Bottom, Left, Right and Top look like the boundaries of a region in the texture, expressed as values between 0 and 1. Here’s how I worked out which images they might describe:

- The Bottom value for entry 3 is close to the Top value for entry 4, suggesting the two images sit one above the other.
- Those vertical coordinates are close to 1, which places them near the bottom of the texture.
- Both Left values are the same and close to 0, placing them at the far left.

My reading is that these entries correspond to the two English PHANTOM LIBERTY logos in the bottom-left corner.

## inkwidget

This file seems to describe the resources that make up an animation. Take `loading_screen_5_after_q101.inkwidget`: I think it corresponds to one of the little sequences that plays when you load a game from the main menu. These usually consist of three animations.

In the screenshot, `externalDependenciesForInternalItems` lists resources needed by the internal items. The entries under `libraryItems` describe the animations themselves. Here `ls_01`, `ls_02` and `ls_03` correspond to the three loading animations.

![Dependencies and library items in the loading screen widget](https://res.cloudinary.com/sycamore/image/upload/v1792696361/Typora/2025/08/ed815477f0502d01327d6c8fd694ca6a.png)

I opened `ls_01` for a closer look. Most of what interested me was under `children`. There are seven entries, and their names give some clues:

![The seven children of ls_01](https://res.cloudinary.com/sycamore/image/upload/v1792696363/Typora/2025/08/fb1bf0564b6749bc6c8d22e2dcad17f2.png)

For example, `shot_01_bg` appears to be the background for this shot, and `antena_light_1` a blinking signal light. Expanding an item reveals the resource it refers to.

In `ls_02`, expanding `BINK_RTW` reveals a video resource:

![Video resource referenced by BINK_RTW](https://res.cloudinary.com/sycamore/image/upload/v1792696363/Typora/2025/08/9357c4afea9961b5a46f861d1ddf4906.png)

To see what it plays, I selected **Add to Project** on the video resource and opened it with RAD Video Tools:

![Ziggy Q and the NCPD spokesperson in the video](https://res.cloudinary.com/sycamore/image/upload/v1792696364/Typora/2025/08/7ecc5753dbb2a7e5f44a2e08d451b207.png)

You might remember Ziggy Q and the NCPD spokesperson.

---

# What I found in the directories

## `base\gameplay\gui\world\loading_screens\`

The main menu background changes as you progress through the story. Several images also play in sequence when loading a save.

For example, here’s `loading_screen_5_after_q101\loading_screen_5_shot_01.xbm`:

![The loading screen texture](https://res.cloudinary.com/sycamore/image/upload/v1792696336/Typora/2025/08/ffbe63923183b7d8602c1046d1bc2b84.png)

The same image shows up on the main menu:

![The same texture displayed on the main menu](https://res.cloudinary.com/sycamore/image/upload/v1792696341/Typora/2025/08/a4e7e61df94dc872b29a72dd4b9fe6ba.png)

That led me to the corresponding `.inkwidget` as the place to change the main menu background.

[Follow-up: repairing the Ciri main menu background mod](/en/游戏工坊/游戏%20Mod/希里主菜单背景%20Mod%20修复记录/)
