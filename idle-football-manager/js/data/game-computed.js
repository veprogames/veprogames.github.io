let computed = {
    showTutorial(){
        return localStorage.getItem("idleSoccerManager") === null || game.restartedTutorial;
    }
}