document.body.onload = function () {
    let menu = document.querySelector(".menu");
    let open_menu = document.getElementById("open_menu");
    let videoPlayer = document.querySelector(".video-player");
    let playButtons = document.querySelectorAll(".gamepreview button.play-trailer");
    let closeVideoPlayerButton = document.querySelector(".video-player button");

    function closeMenu() {
        if (menu.classList.contains("shown")) {
            menu.classList.remove("shown");
            menu.classList.add("hidden");
        }
    }

    function openMenu() {
        if (menu.classList.contains("hidden")) {
            menu.classList.remove("hidden");
            menu.classList.add("shown");
        }
    }

    function openVideoPlayer(videoName) {
        if (!videoPlayer.classList.contains("active")) {
            videoPlayer.classList.add("active");

            for (let iframe of videoPlayer.querySelectorAll("iframe")) {
                iframe.style.display = iframe.dataset.video === videoName ? "block" : "none";
            }
        }
    }

    function closeVideoPlayer() {
        if (videoPlayer.classList.contains("active")) {
            for (let iframe of videoPlayer.querySelectorAll("iframe")) {
                iframe.setAttribute("src", iframe.getAttribute("src"));
            }

            videoPlayer.classList.remove("active");
        }
    }

    menu.querySelectorAll("ul > li").forEach(item => {
        item.onclick = e => closeMenu();
    });

    open_menu.onclick = openMenu;

    for (let button of playButtons) {
        button.onclick = e => openVideoPlayer(button.dataset.video);
    }

    closeVideoPlayerButton.onclick = closeVideoPlayer;

    let animateDivs = document.querySelectorAll("section, .review, .game-teaser");

    let animateGames = document.querySelectorAll(".game-description");

    let animateTeasers = document.querySelectorAll(".game-teaser");

    function checkFadeIns() {
        for (let el of animateDivs) {
            if (scrollY + innerHeight >= el.offsetTop) {
                el.classList.add("animate__animated", "animate__fadeIn");
            }
        }

        for (let el of animateGames) {
            if (scrollY + innerHeight >= el.offsetTop) {
                let elements = Array.from(el.querySelectorAll("ul.features li"))
                    .concat(Array.from(el.querySelectorAll(".review")));
                let character = el.querySelector(".character");

                elements.forEach((li, idx) => {
                    li.classList.add("animate__animated", "animate__zoomIn", "animate__faster");
                    li.style.animationDelay = (idx * 0.25) + "s";
                });
                character.classList.add("animate__animated", "animate__fadeInRight");
                character.style.animationDelay = (elements.length * 0.25 + 0.5) + "s";
            }
        }

        for (let el of animateTeasers) {
            if (scrollY + innerHeight >= el.offsetTop) {
                let textTitle = el.querySelector("p.title");
                let textSubTitle = el.querySelector("p.subtitle");
                textTitle.classList.add("animate__animated", "animate__fadeInLeft");
                textSubTitle.classList.add("animate__animated", "animate__fadeInRight");
                textSubTitle.style.animationDelay = "0.5s";
            }
        }
    }

    onscroll = checkFadeIns;
    checkFadeIns();
}