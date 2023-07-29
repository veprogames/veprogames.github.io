---
title: "How to make high refresh rates work in Xorg"
date: 2023-07-29T12:31:29+02:00
---

When having multiple monitors with different refresh rates, there may be problems, such as being limited to the lowest refresh rate, or even games showing the high FPS but the monitor not having that FPS. Even more confusion comes in when the cursor is still on a high refresh rate, because cursors mostly are not software rendered, thus are treated differently.

Below are some Ideas for fixing this.

Keep in mind those solutions could add minor tearing, but that little tradeoff is nothing against the gain of more fluidness. To fix both, consider Wayland.

## NVIDIA (propietary)

* Open `nvidia-settings`
* Go to 'X Server Display Configuration'
* In the bottom right, Click on 'Advanced...' if it says 'Advanced...'
* Make sure anything regarding 'force composition pipeline' is checked **off**
* Make sure you selected the highest refresh rates possible. You can either select it through the settings, configure it with `xrandr` or with your DEs Display Settings, is applicable

-> It should work now

## picom

* Make sure to start picom with `--no-vsync`

## Misc

If it still doesn't work, try settings these environment variables:

```
CLUTTER_DEFAULT_FPS=<your highest refresh rate>
__GL_SYNC_DISPLAY_DEVICE=<your highest refresh rate display>
__GL_SYNC_TO_VBLANK=0
```

Find the DISPLAY_DEVICE name with `xrandr | grep connected`

Add the text block above to `/etc/environment` (Tip: Use `EDITOR=<your editor, if EDITOR is not set anywhere else> sudoedit` instead of `sudo nano` or `sudo vim`)

-> `sudoedit /etc/envrionment`
