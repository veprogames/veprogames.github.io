const globalEvents = new GlobalEventHandler();

const inputManager = new InputManager();

const windowManager = new WindowManager();

let numberLocale = new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })

const ABILITY_SPAWN_SPEED = 0, ABILITY_MERGER_MOVE_SPEED = 1;

let notations = [
    new ADNotations.StandardNotation(),
    new ADNotations.ScientificNotation(),
    new ADNotations.EngineeringNotation(),
    new ADNotations.LettersNotation(),
    new ADNotations.CancerNotation()
];

let images = {}

let particles = [];

let game =
{
    version: 2,
    time: 0,
    loading: true,
    currentStyle: "standard",
    floatingTexts: [],
    mergeObjects: [],
    highestMergeObject: 0,
    highestMergeObjectThisPrestige: 0,
    mergesThisPrestige: 0,
    saveTime:
    {
        time: 5,
        cd: 0
    },
    spawnTime:
    {
        time: 5,
        cd: 0
    },
    clickAbility: ABILITY_SPAWN_SPEED,
    matter: new ContentMatter(),
    prestige: new ContentPrestige(),
    energyCores: new ContentEnergyCores(),
    quantumProcessor: new ContentQuantumProcessors(),
    isotopes: new ContentIsotopes(),
    molecules: new ContentMolecules(),
    settings:
    {
        currentNotation: new ADNotations.StandardNotation(),
        currentNotationIdx: 0,
        customNotationSequence: "",
        currentTab: "upgrades",
        selectedTab: "",
        helpTab: 0,
        tabsShown: true,
        clickParticles: true,
        topBarShown: true,
        mergepediaAnimations: true,
        prestigeConfirmation: true,
        maxFps: 60,
        lowPerformanceMode: false
    },
    exportedGame: ""
};

let initialGame = SaveManager.getSaveCode(game); //used for hard reset