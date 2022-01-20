function transcend()
{
    player.transcension.points = player.transcension.points.add(getTranscensionGain());
    player.generators = [];
    player.singularity.currencyAmount = 1;
    player.singularity.unlocked = false;
    initializeTier();
    player.tab = 0;
}