---
title: "Open Generative Systems (Media Synthesis/AI)"
date: 2023-09-03T15:51:36+02:00
---

This is a bigger Guide for running generative systems (AI Stuff) locally. Most / all of this should work with 8 GB of VRAM.

This is a compilation of media synthesis tools that can be run locally on your machine. Most, if not all of them should work with 8 GB of VRAM or more.

## Overview of Tools

### Image Synthesis (txt2img, img2img, upscaling and more)

* Stable Diffusion: https://github.com/CompVis/stable-diffusion
* AUTOMATIC1111 WebUI (A fully-featured, extensible Image Synthesis suite, lots of extensions): https://github.com/AUTOMATIC1111/stable-diffusion-webui
* ComfyUI (100% node based, steeper learning curve, very flexible and automatable): https://github.com/comfyanonymous/ComfyUI
* InvokeAI (Very user friendly, support for node based workflows): https://github.com/invoke-ai/InvokeAI
* Models: https://huggingface.co/models?pipeline_tag=text-to-image and https://civitai.com
    * ControlNet (allows for much more Control during image diffusion): https://github.com/lllyasviel/ControlNet
    * ControlNet for Automatic WebUI: https://github.com/Mikubill/sd-webui-controlnet

### Audio Synthesis (samples, music)

* AudioLDM: https://github.com/haoheliu/AudioLDM
* AudioLDM2 (might require very strong hardware): https://github.com/haoheliu/AudioLDM2
* Riffusion, Sample Generation based on Stable Diffusion: https://github.com/riffusion/riffusion

### Voice Synthesis

#### Text to Speech

* Tortoise TTS: https://github.com/neonbjb/tortoise-tts
* Tortoise TTS (fast version): https://github.com/152334H/tortoise-tts-fast
* Bark: https://github.com/C0untFloyd/bark-gui

#### Speech to Speech

* Bark: https://github.com/C0untFloyd/bark-gui
* RVC: https://github.com/RVC-Project/Retrieval-based-Voice-Conversion-WebUI
* Voice Changer: https://github.com/w-okada/voice-changer

### Text Synthesis

* Text Generation WebUI, to become the AUTOMATIC1111 WebUI of Text Synthesis: https://github.com/oobabooga/text-generation-webui

## Setup Guide

1. Installation

1.1. miniconda

Miniconda is used to create isolated python environments, each with their own packages. This is very important as different Projects require different versions of same packages, and also different python versions.

On Windows, go to https://docs.conda.io/en/latest/miniconda.html and download the Windows Installer. Run the Setup. If asked to add conda to the PATH, add it.

On Linux, run the https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh script

If on Arch Linux, you can install miniconda from the AUR: https://aur.archlinux.org/miniconda3.git

(e. g. AUR helper yay or paru: $ yay -S miniconda3 ; paru -S miniconda3 )

Since conda will add python to its environments, system wide python shouldn’t be required.

If something about auto activate base is asked, disable it.

**Note: If you like conda, you might love micromamba:** https://github.com/mamba-org/mamba

1.2. git (highly recommended)

Git is a version control tool, which GitHub builds upon.

On Windows, go to https://gitforwindows.org/ and run the installer. You shouldn’t need to change any of the default settings except the default editor of your preference (possibly notepad++). If you want to use git graphically, there exist TortoiseGit and GitHub Desktop. This is optional, though. I use git through command line or VSCode(ium).

On Linux, install git through your package manager:

Debian: `$ sudo apt install git`

Fedora: `$ sudo dnf install git`

Arch: `$ sudo pacman -S git`

2. Environments & Setup

Below, `<placeholder>` is a placeholder and `[optional]` isn’t required.

2.1. Downloading a Project / Tool

You’re most likely dealing with a git repository (for example: github.com, gitlab.com, codeberg.org, something with git in the url). There should be a Download, Clone or [<> Code] button near the file explorer.

Code Button in the top right which contains the links to clone

Copy this link (Clone over HTTPS) and write into the terminal:

`~/workingdirectory $ git clone <copied url>`

This will put everything to `~/workingdirectory/<projectname>`. go into that folder (e. g. with cd)

2.2. conda, Installing & Setup

Typically, follow the instructions on the specific repo to setup the tool. Here’s what you often do:

To create a new environment:

`$ conda create -n <environment name> [python=3.10]`

Create an environment when a conda environment file environment.yaml exists. The environment file makes all requirements be installed:

`$ conda create -f environment.yaml [-n <my custom name>]`

If no environment file exists, other installation instructions exist. They should be in the Repo (README.md, what you see on the Repo page below the files).

It mostly involves installing stuff with pip (python package manager, in conda, pip is local to the environment).

e. g. `$ pip install -r requirements.txt` installs all packages listed in the text file requirements.txt

3. Troubleshooting

3.1. Cannot create python […] from […] pip-script

Use python -m pip instead of pip

3.2. Currently, pips package resolver doesn’t take all dependencies into account

Ignore this. It should still work.

3.3. git clone: Access denied (publickey)

You’re cloning over SSH. Clone over HTTPS instead. (Expect you’re cloning a private repository and you aren’t using your SSH key correctly, but this is most likely not the case)

3.4. Building for package failed (e. g. pyworld)

Do the following:

```shell
(environment) $ pip install -U pip wheel
(environment) $ pip install -r requirements.txt --no-build-isolation
```