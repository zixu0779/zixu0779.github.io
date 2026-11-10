---
title: 'Sentences-Desktop: quotes on the Windows desktop'
translation_id: sentences-desktop
source_digest: 6a3d442e07613830bec52a3275a9c87b03578cf46ceddd4fb9be5d26cd099379
tags:
  - Electron
  - JavaScript
  - Hitokoto
categories:
  - Software Development
  - App Development
sections: {"what-it-does": "项目做了什么", "windows-and-ui": "窗口与界面", "fetching-a-quote": "从接口取得一句话", "saving-and-applying-settings": "设置如何保存和生效", "custom-apis": "自定义接口", "packaging-and-what-id-revisit": "打包与后续"}
---

Project: [Sentences-Desktop](https://github.com/noneSycamore/Sentences-Desktop)

I’d call this personal project finished, even though I’m not entirely happy with it and no longer use it myself. It does look rather nice. The quotes come from [Hitokoto](https://hitokoto.cn/).

I’ll update it when I have time. The way I handled the Windows desktop still has a few problems.

# What it does

Sentences-Desktop is a small quote window that sits on the Windows desktop. By default it fetches quotes from Hitokoto. The interface is plain HTML, CSS and JavaScript, with Electron providing the windows and settings. I didn’t use Vue.

The window shows a title, the quote and its source. You can advance to the next quote by hand. In Settings you can change the opacity, corner radius and font size for each of the three text elements. You can also remember the window’s size and position, use the system tray, start the app at login or configure a different quote API.

I added the implementation notes below after reading revision `321c85a` of the repository. I didn’t rerun the old Windows application for this write-up.

# Windows and UI

Most of the code lives in three files:

- `main.js` creates the main and settings windows and handles the tray, context menu and window operations.
- `src/js/index.js` fetches the quote, updates its text and attribution, and sends the content height back to the main process.
- `src/js/setting.js` reads the settings, handles sliders and switches, and notifies the main process over IPC.

The main window has no frame, a transparent background and no taskbar entry. The app then calls `attach(mainWindow)` from `electron-addtodesktop` to attach it to the desktop. Setting a transparent background in CSS covers only the page; the native window needs its own configuration too.

I wrote that native extension for this feature. I cover window handles, the desktop window hierarchy and packaging the extension for npm in [Embedding an Electron window in the desktop](/en/软件开发/应用开发/把%20Electron%20窗口嵌入桌面/).

The settings window loads `src/setting.html` separately. If it already exists, the app shows it. Closing it clears the reference so it can be recreated next time. The app also takes a single-instance lock: launching it a second time focuses the existing main window.

# Fetching a quote

The entry point is `fetchHitokoto()`. It reads the categories saved through the context menu and builds one query parameter per enabled category, in the form `c=category`. Multiple parameters are joined with `&`. If no categories are selected, it leaves the query string out.

The default address is `https://v1.hitokoto.cn/${Types}`. In the JSON response, `data.hitokoto` holds the quote and `data.from` its source. When `data.from_who` is present, the app appends the author to the source with a middle dot.

After replacing the text, the UI sends a `change-H` message with the content height plus a small margin. The main process resizes the window accordingly, so a short quote doesn’t leave a tall empty frame.

A successful response saves the quote and its source to `LastData`. On the next launch the app shows the previous quote while it fetches a new one. If the request fails, the existing text stays on screen and turns red. That’s about as far as the feedback goes: there’s no detailed error message or automatic retry.

# Saving and applying settings

The app stores configuration with `electron-store`. The main process defines defaults in `Preferences` and groups the saved settings under `Appearance`, `Other`, `RightClick` and `LastData`. At startup it checks for missing fields and fills them from the defaults.

The opacity, corner radius and font size sliders save their values and send IPC messages. The main process uses `webContents.executeJavaScript` to update the relevant element styles in the main window. The page doesn’t need to reload. A font size change also triggers the height calculation.

When position and size tracking is enabled, the settings page listens for the window’s `resize` and `move` events and displays the current values. Before exit, `ifSaveXYWH()` checks the switches and either saves the geometry or restores the defaults. The next window reads those values on creation.

That approach was straightforward, but building UI scripts in the main process coupled window management to presentation details. If I maintained this again, I’d have the main process send explicit settings values and let the UI update its own styles.

# Custom APIs

I later added a custom API option. Alongside the request address, you can supply a little JavaScript that explains how to extract the quote and its source from the response. That accommodated different response formats without a code change for every new service.

The existing implementation runs both the address expression and the parsing code through `eval`, in a window with Node integration enabled. It served my own experiments, but I wouldn’t expose that arrangement to arbitrary user scripts. In a rewrite I’d use a restricted field mapping, keep desktop privileges in the main process and expose explicit operations to the UI.

# Packaging and what I’d revisit

The project’s `package.json` lists Electron 12 and electron-builder. Its Windows packaging configuration includes x64 and ia32 targets and an NSIS installer that lets you choose the installation directory. There are macOS and Linux packaging commands too, but the README specifies Windows. I haven’t tested the other platforms.

The main features are there, though it never quite became a tool I wanted to use every day. I’d keep the path from fetching a quote to displaying it on the desktop and saving the user’s settings. If I revisit it, I’ll start with settings updates, custom APIs and the boundary between processes before adding more appearance options.
