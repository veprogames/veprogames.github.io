---
title: "How to Setup Arch Linux With Btrfs and (almost) Full Disk Encrytion"
date: 2023-07-20T19:56:11+02:00
---

In this tutorial, Arch Linux will be setup with BTRFS and almost Full Disk Encryption.

## Obtain the ISO

* Go to https://archlinux.org and download an ISO through Mirror or Torrent
* Then, put the ISO on a bootable medium. Either, flash it directly with `dd`, or use a imaging tool, or use [Ventoy](https://github.com/ventoy/Ventoy).
* Boot the device you want to install Arch Linux on

If it's not booting, check if:
* Secure Boot is disabled
* Your device supports x86_64
* You flashed the arch .iso correctly
* The iso you downloaded isn't corrupt (Check the SHA256 sum with `sha256sum` or, on Windows, with 7Zip by right clicking the file -> CRC SHA)

## Initial Setup

You are now at the prompt:

`root@archiso ~ # `

When in doubt, also conduct the Arch Linux Installation Guide: https://wiki.archlinux.org/title/Installation_guide and the Arch Linux Wiki: https://wiki.archlinux.org

If you want to erase what previously was on the device/drive, use `dd` or `shred` for HDDs, `hdparm` for SATA SSDs, or `nvme` for NVMe SSDs.

**For this tutorial, we will install Arch Linux on `/dev/sda`. Replace this with your drive name.** 

Disk Names of HDDs and SSds are called sda, sdb, sdc and so on. For NVMe SSDs, it's nvme0n1, nvme0n2 and so on. They are device files, a special type of file. In Linux, everything is a file.

You might want to erase the Partition Table first. A Partition Table describes where which filesystem lies on a drive. You can wipe it with `wipefs -a /dev/sda`.

You might want to connect to Wi-Fi. To find out the name of the interface, type `ip a` and find the interface name (mostly `wlan0`). Use `iwctl to connect`:
```
root@archiso ~ # iwctl
[iwd]# station wlan0 scan
[iwd]# station wlan0 get-networks
[iwd]# station wlan0 connect <Network name from Table above>
```

Run `ping archlinux.org` to check connection. Press Ctrl-C to cancel (any) command.

## Partition the Disk

I recommend `cfdisk` to partition, it uses a TUI (Text User Interface) and is easier to use than `fdisk`, `gdisk` or `parted` (Fun Fact: If you want to automate partitioning, parted is the ideal tool).

Run `cfdisk /dev/sda`. If prompted, select `gpt` as partitioning scheme. `dos` (MBR) is legacy and the others are obscure.

Create the following partitions:

| Size | Type | Info | Resulting Partition (for /dev/sda)
| - | - | - | - |
| 1M | BIOS boot | Allows legacy devices to boot with this partitioning scheme | /dev/sda1 |
| 512M | EFI System | This is where Bootloaders go | /dev/sda2 |
| 2G-4G | Linux Filesystem | This will be where Kernels and initrds are stored. This will be unencrypted | /dev/sda3 |
| Remaining | Linux Filesystem | All of the data, this will be encrypted | /dev/sda4 |

Next, create the Filesystems. Without a Filesystem, files cannot be organized by the system.

* The BIOS boot partition needs no filesystem
* Format /dev/sda2 as vfat: `mkfs.vfat /dev/sda2`
* Format /dev/sda3 as ext4: `mkfs.ext4 /dev/sd3`. This will not BTRFS, so GRUB can store the default selection.
* Don't format /dev/sda4.

## Encrypt the Disk

Instead, create a LUKS Volume on /dev/sda4:

`cryptsetup luksFormat /dev/sda4`

Follow the insstructions. Choose a strong passphrase. Unlocking per TPM is possible, but out of scope of this tutorial.

Now, open the LUKS Volume:

`cryptsetup luksOpen /dev/sda4 rootcrypt`

A new device file will appear under `/dev/mapper/rootcrypt`.

## BTRFS

Now, create a BTRFS on the **mapped device** (not /dev/sda4!, this would destroy the LUKS volume):

`mkfs.btrfs /dev/mapper/rootcrypt`

Mount the Filesystem on /mnt:

`mount /dev/mapper/rootcrypt /mnt`

Mounting opens the filesystem and "roots" it into the target directory (/mnt here). So basically, `/dev/mapper/rootcrypt` is accessible in `/mnt` now.

A great part of BTRFS are subvolumes. They differ in partitions in that they have no fixed size, thus are more flexible. Each subvolume can be snapshot individually.

Let's create the following subvolumes:

* `btrfs subvolume create /mnt/@`
    * The root (`/`)
* `btrfs subvolume create /mnt/@home`
    * Home Directory (`/home`)
* `btrfs subvolume create /mnt/@var_log`
    * `/var/log`, uninteresting for snapshots
* `btrfs subvolume create /mnt/@var_pkg`
    * `/var/cache/pacman/pkg`, uninteresting for snapshots
* `btrfs subvolume create /mnt/@.snapshots`
    * Snapshots will be stored in `/.snapshots`

Since parts in `/var` are relevant for snapshots, especially the pacman Database, it will be included in the root volume. Slightly larger snapshots are not grave, as BTRFS snapshots are smart and only store differences.

Note that the subvolume name (e. g. @) is independent of the actual place where it will be mounted (e. g. /). Where things will be mounted, will be decided by the filesystem table file `fstab`, more on that later.

Now that all subvolumes are created, we can unmount the /dev/mapper/rootcrypt device by just specifying the mountpoint (/mnt):

`umount /mnt`

Now, let's mount the subvolumes:

`mount -o noatime,compress=ztd,subvol=@ /dev/mapper/rootcrypt /mnt`

This means: Mount the subvolume from /dev/mapper/rootcrypt on /mnt. Don't modify modification and access times and compress created files using `zstd`.

Do this for the other volumes too:

`mount --mkdir -o noatime,compress=ztd,subvol=@home /dev/mapper/rootcrypt /mnt/home`

`mount --mkdir -o noatime,compress=ztd,subvol=@.snapshots /dev/mapper/rootcrypt /mnt/.snapshots`

When mounting deeper, manual mkdirs may be required:

`mkdir -p /mnt/var/log`

`mkdir -p /mnt/var/ache/pacman/pkg`

`mount -o noatime,compress=ztd,subvol=@var_log /dev/mapper/rootcrypt /mnt/var/log`

`mount -o noatime,compress=ztd,subvol=@var_pkg /dev/mapper/rootcrypt /mnt/var/cache/pacman/pkg`

Now, mount the boot and EFI System Partition (ESP):

`mount --mkdir /dev/sda3 /mnt/boot`

`mount --mkdir /dev/sda2 /mnt/boot/efi`

Now, everything is mounted.

## Install the base system

`pacstrap` is used to install the base system. It installs the packages, and copies its keyring (used to sign packages) and mirrorlist over. (You can change the mirrorlist later, but I've always been good with the default).

Pacstrap the system; I recommend these base packages:

`pacstrap -K /mnt base linux linux-lts linux-firmware btrfs-progs man networkmanager vim sudo`

* man - access to manual pages
* networkmanager - easy way to get internet connection (wifi included)
* btrfs-progs - work with the btrfs filesystem we created (snapshots, for example)
* vim - file editing (you can also use nano or neovim or emacs)
* sudo - Elevation to root

Optionally, you can add things like zsh (Z Shell), or the `linux-zen` kernel, if you prefer.

`linux` and `linux-lts` will be installed at once, this way, if one kernel causes trouble, you can boot the other.

Note that setting up propietary NVIDIA drivers needs extra steps with multiple kernels, this is not covered here.

We will install the bootloader later.

## fstab

Next we need to generate the filesystem table file (fstab). The system will use this while booting to automatically mount everything needed.

Generate the fstab file for `/mnt`, and append (>>) it into `/mnt/etc/fstab`:

`genfstab -U /mnt >> /mnt/etc/fstab`

Don't forget the `-U`! This makes it use UUIDs instead of device file names, which would cause problems if sda would be mounted later when more drives are connected and would become /dev/sdb, causing mounting (and startup) to fail.

Next remove all occurences of `subvolid=xxx`, since static IDs are not the best idea either and the subvol name is already given.

## Setup and configure the system

Let's `arch-chroot` into `/mnt`. You might know `chroot`. `arch-chroot` does all the --rbind stuff for us so /dev, /proc and /sys will be available in the chroot. Also, let's use bash

`arch-chroot /mnt /bin/bash`

The prompt should change to:

`[root@archiso /]# `

Note that /mnt is now /, since we **ch**anged **root**.

Set the hostname by writing into `/etc/hostname`, either with a text editor like vim or echo and >.

Let's set a root password:

`passwd`

Let's generate the locales:

* Open `/etc/locale.gen` with a text editor, and uncomment all occurences of en_US and your locale, e. g. de_DE
* Run locale-gen
* Write the name of your locale (e. g. `en_US.UTF-8`) into /etc/locale.conf: `LOCALE=es_US.UTF-8`
* Optionally, write the keymap into `/etc/vconsole.conf`: `KEYMAP=de-latin1`

Now, set the timezone by symlinking the timezone file to /etc/localtime:

`ln -sf /usr/share/zoneinfo/Europe/Berlin /etc/localtime`

Fun fact: usr stands for "Unix System Resources".

The Timezone file names follow the standardized format.

Lets edit the sudoers file. Run `EDITOR=<your editor> visudo`. **Do not edit the file directly!**

Uncomment the `%wheel ALL=(ALL:ALL) ALL` line.

Let's add a regular user (e. g. `nerd`), create a home directory (-m), and give it access to sudo by adding the wheel group (-G stands for append extra groups) to them:

`useradd -mG wheel nerd`

Set their password:

`passwd nerd`

## The Boot Loader

Last Step! Let's install the bootloader. I will go with GRUB. To make GRUB work on UEFI systems, also install `efibootmgr`.

`pacman -S efibootmgr grub`

Let's install grub:

`grub-install /dev/sda`

Grub should detect the platform (x86_64-efi) automatically. But, there are quirks to be aware of:

Some Motherboards have a weird UEFI implementation, causing NVRAM entries not to work correctly. If no boot device is detected after we are done, add `--removable` when running `grub-install`.

Other bootloaders you might be interested in: systemd-boot, rEFInd (requires some configuration to autodetect BTRFS volumes).

## The Encryption again

Now we must configure more to finalize our encryption setup. First edit /etc/mkinitcpio.conf.

Add btrfs to BINARIES, so it looks like:

`BINARIES=(btrfs)`

Add `encrypt` after `block` in HOOKS, so it looks like (... is left out content):

`HOOKS=(... block encrypt filesystems ...)`

After saving the file, run:

`mkinitcpio -P`

So all initrds get regenerated with the encrypt hook.

Now, let's make GRUB use the encrypt hook. Edit `/etc/default/grub`:

First, note the PARTUUID of the LUKS volume. Run `blkid -o value -s PARTUUID /dev/sda4` (where the LUKS volume was created). The -o and -s means we only want to print the **value** with the tag **PARTUUID**

Protip: use `:r!blkid -o value -s PARTUUID /dev/sda4` in vim or nvim to directly insert it into the editor

In the GRUB_CMDLINE_LINUX_DEFAULT, add:
`cryptdevice=PARTUUID=<the value we got>:rootcrypt root=/dev/mapper/rootcrypt`

cryptdevice=... means that the LUKS Volume will be luksOpened to /dev/mapper/rootcrypt after the Passphrease was successfully input. root=... says where the partition with the / mountpoint resides.

While we're at it, uncomment GRUB_DISABLE_SUBMENU=y and GRUB_SAVEDEFAULT=true, so your decisions will be remembered.

Now generate the GRUB configuration:

`grub-mkconfig -o /boot/grub/grub.cfg`

At the very last, enable the networkmanager service: `systemctl enable NetworkManager`. When using Ethernet, you will have an Internet connection automatically on next boot, with Wi-Fi, run `nmtui` and configure your connection.

This should be all! Type `exit` to exit the chroot. Type `umount -R /mnt` to unmount everything. Type `reboot` and eject your bootable device.

## After the Installation

It worked? Congrats! The next steps are the following:

* Setup the Wi-Fi connection
* Install a Graphical Environment
* Install your applications

Those are much more straightforward than what we did before. I won't cover it here. I will probably make another article about this, especially regarding Wayland.

## Tips

* Need to fix your system through the install medium? Save yourself keystrokes of mounting by just mounting the root subvolume (to /mnt) and then type: `mount -aT /mnt/etc/fstab --target-prefix /mnt`. This reads your fstab and mounts everything for you.

* Need to edit GRUB parameters for a single run? Press e while before selecting an entry.

* More Questions? The Arch Wiki (https://wiki.archlinux.org) covers topics in much more detail.