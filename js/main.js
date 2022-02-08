document.body.onload = e => {
    let animateDivs = document.querySelectorAll("header, article");
    let parallax = document.querySelectorAll(".parallax");
    let gameWrappers = document.querySelectorAll(".game-wrapper");
    let otherProjects = document.querySelector(".other-projects");
    let otherProjectsList = document.querySelector(".other-projects-list");
    let spanYear = document.getElementById("year");

    let gameButton = document.querySelector(".dev-logo");
    let game = {
        init: false,
        games: 0,
        upgrades: [
            {
                desc: "+1 game/s",
                price: level => 1.5 ** level * 10,
                level: 0,
                effect: level => level
            },
            {
                desc: "x2 games/s",
                price: level => 2.05 ** level * 100,
                level: 0,
                effect: level => 2 ** level
            },
            {
                desc: "x4 games/s",
                price: level => 10 ** level * 1e5,
                level: 0,
                effect: level => 4 ** level
            },
            {
                desc: "x16 games/s",
                price: level => 100 ** level * 1e30,
                level: 0,
                effect: level => 16 ** level
            }
        ],
        gps: function(){
            let v = game.upgrades[0].effect(game.upgrades[0].level);
            for(let i = 1; i < game.upgrades.length; i++){
                v *= game.upgrades[i].effect(game.upgrades[i].level);
            }
            return v;
        },
        formatNumber: n => n === Infinity ? "∞" : (n >= 1e6 ? n.toExponential(2) : n.toLocaleString("en-us", {minimumFractionDigits: 0, maximumFractionDigits: 0}))
    }

    function initializeGame(){
        if(!game.init){
            game.init = true;
            document.getElementById("game").classList.add("active");

            for(let u of game.upgrades){
                let p = document.createElement("p");
                p.innerHTML = u.desc + " - " + game.formatNumber(u.price(u.level));
                p.classList.add("animated-underline");
                p.onclick = e => {
                    if(game.games >= u.price(u.level)){
                        game.games -= u.price(u.level);
                        u.level++;
                        p.innerHTML = u.desc + " - " + game.formatNumber(u.price(u.level));
                    }
                }
                document.querySelector("#game div").appendChild(p);
                document.querySelector("#game div").appendChild(document.createElement("br"));
            }

            setInterval(() => {
                game.games += game.gps() * 0.1;
                document.getElementById("game_games").innerHTML = game.formatNumber(game.games);
                if(game.games === Infinity){
                    document.querySelector("#game .win").classList.add("active");
                }
            }, 100);
        }
    }

    gameButton.onclick = e => {
        game.games++;
        document.getElementById("game_games").innerHTML = game.formatNumber(game.games);
        initializeGame();
    };

    function checkFadeIns() {
        for (let el of animateDivs) {
            if (scrollY + innerHeight > el.offsetTop) {
                el.style.visibility = "visible";
                el.classList.add("animate__animated", "animate__fadeIn");
            }
        }

        for(let el of gameWrappers) {
            if(scrollY + innerHeight > el.offsetTop) {
                el.querySelectorAll("p.title, p.subtitle, p.play, .links").forEach((text, i) => {
                    text.classList.add("animate__animated", "animate__fadeInLeft");
                    text.style.animationDelay = (i * 0.5) + "s";
                });
            }

            let features = el.querySelectorAll("ul.features");
            for(let f of features) {
                if(scrollY + innerHeight > el.offsetTop + f.offsetTop) {
                    f.querySelectorAll("li").forEach((li, i) => {
                        li.classList.add("animate__animated", "animate__zoomIn", "animate__faster");
                        li.style.animationDelay = (i * 0.25) + "s";
                    });
                }
            }
        }

        if(scrollY + innerHeight > otherProjectsList.offsetTop + otherProjects.offsetTop) {
            otherProjectsList.querySelectorAll("div").forEach((div, i) => {
                div.classList.add("animate__animated", "animate__fadeIn");
                div.style.animationDuration = "500ms";
                div.style.animationDelay = (0.1 * i + 0.25) + "s";
            });
        }
    }

    function refreshParallax() {
        for(let elem of parallax){
            elem.style.top = ((scrollY - elem.scrollTop - innerHeight / 2) * 0.25 + (elem.dataset.parallaxOffsetY ? parseInt(elem.dataset.parallaxOffsetY) : 0)) + "px";
        }
    }

    checkFadeIns();
    refreshParallax();

    spanYear.innerText = new Date().getFullYear();

    onscroll = e => {
        checkFadeIns();
        refreshParallax();
    };
};