---
title: "Tip! Don't forget these useful configs for pacman ;)"
date: 2023-07-25T20:54:42+02:00
---

Simple and short, uncomment this in your `/etc/pacman.conf`:

From:

```
#VerbosePkgLists
#ParallelDownloads = 5
```

To:

```
VerbosePkgLists
ParallelDownloads = 5
```

`VerbosePkgLists` turns the "messy" string of to be changed packages into a table that's easier readable. `ParallelDownloads` help you maxing to your actual downstream performance, making the process a bit faster.

Read it also on the ArchWiki: https://wiki.archlinux.org/title/Pacman#Configuration