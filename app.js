/*****************************************************************
* Ionic Compound Nomenclature Trainer
*****************************************************************/

let score = 0;
let attempts = 0;

let currentCompound = null;
let currentQuestionType = "formulaToName";

/*****************************************************************
* Ion Repositories
*****************************************************************/

const fixedChargeCations = [
    { symbol: "Li", name: "lithium", charge: 1 },
    { symbol: "Na", name: "sodium", charge: 1 },
    { symbol: "K", name: "potassium", charge: 1 },
    { symbol: "Rb", name: "rubidium", charge: 1 },
    { symbol: "Cs", name: "cesium", charge: 1 },

    { symbol: "Mg", name: "magnesium", charge: 2 },
    { symbol: "Ca", name: "calcium", charge: 2 },
    { symbol: "Sr", name: "strontium", charge: 2 },
    { symbol: "Ba", name: "barium", charge: 2 },

    { symbol: "Al", name: "aluminum", charge: 3 },

    { symbol: "Cd", name: "cadmium", charge: 2 },
    { symbol: "Zn", name: "zinc", charge: 2 },
    { symbol: "Ag", name: "silver", charge: 1 }
];

const transitionMetals = [
    { symbol: "Cr", name: "chromium", charges: [2, 3] },
    { symbol: "Co", name: "cobalt", charges: [2, 3] },
    { symbol: "Au", name: "gold", charges: [1, 3] },
    { symbol: "Mn", name: "manganese", charges: [2, 3] },
    { symbol: "Ni", name: "nickel", charges: [2, 3] },
    { symbol: "Fe", name: "iron", charges: [2, 3] },
    {symbol: "Cu", name: "copper", charges: [1, 2] },
    {symbol: "Sn", name: "tin", charges: [2, 4] },
    {symbol: "Pb", name: "lead", charges: [2, 4] }
];

const anions = [
    {symbol: "F", name: "fluoride", charge: -1, polyatomic: false },
    {symbol: "Cl", name: "chloride", charge: -1, polyatomic: false },
    {symbol: "Br", name: "bromide", charge: -1, polyatomic: false},
    {symbol: "I", name: "iodide", charge: -1, polyatomic: false },
    {symbol: "N", name: "nitride", charge: -3, polyatomic: false },
    {symbol: "P", name: "phosphide", charge: -3, polyatomic: false },
    {symbol: "As", name: "arsenide", charge: -3, polyatomic: false },
    {symbol: "O", name: "oxide", charge: -2, polyatomic: false},
    {symbol: "S", name: "sulfide", charge: -2, polyatomic: false },
    {symbol: "MnO4", name: "permanganate", charge: -1, polyatomic: true },
    {symbol: "Cr2O7", name: "dichromate", charge: -2, polyatomic: true },
    {symbol: "HCO3", name: "bicarbonate", charge: -1, polyatomic: true },
    {symbol: "CH3CO2", name: "acetate", charge: -1, polyatomic: true },
    {symbol: "CN", name: "cyanide", charge: -1, polyatomic: true },
    {symbol: "ClO3", name: "chlorate", charge: -1, polyatomic: true },
    {symbol: "ClO", name: "hypochlorite", charge: -1, polyatomic: true },
    {symbol: "NO2", name: "nitrite", charge: -1, polyatomic: true },
    {symbol: "NO3", name: "nitrate", charge: -1, polyatomic: true },
    {symbol: "SO3", name: "sulfite", charge: -2, polyatomic: true },
    {symbol: "SO4", name: "sulfate", charge: -2, polyatomic: true },
    {symbol: "PO3", name: "phosphite", charge: -3, polyatomic: true },
    {symbol: "PO4", name: "phosphate", charge: -3, polyatomic: true},
    {symbol: "OH", name: "hydroxide", charge: -1, polyatomic: true},
    {symbol: "CO3", name: "carbonate", charge: -2, polyatomic: true}
];

/*****************************************************************
* Utility Functions
*****************************************************************/

function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }

    return a;
}
function normalizeFormula(formula) {
    const subMap = {
        "0": "₀",
        "1": "₁",
        "2": "₂",
        "3": "₃",
        "4": "₄",
        "5": "₅",
        "6": "₆",
        "7": "₇",
        "8": "₈",
        "9": "₉"
    };
    return formula.replace(/\d/g, d => subMap[d]);
}
/*function normalizeFormula(formula) {
    return formula.replace(/\d+/g, match => `<sub>${match}</sub>`);
}*/

function romanNumeral(num) {
    const numerals = {
        1: "I",
        2: "II",
        3: "III",
        4: "IV",
        5: "V",
        6: "VI",
        7: "VII"
    };

    return numerals[num];
}

/*****************************************************************
* Formula Builder
*****************************************************************/

function buildFormula(cation, anion) {
    const catCharge = Math.abs(cation.charge);
    const anCharge = Math.abs(anion.charge);

    const divisor = gcd(catCharge, anCharge);

    const catSub = anCharge / divisor;
    const anSub = catCharge / divisor;

    let catPart = cation.symbol;
    let anPart = anion.symbol;

    if (catSub > 1) {
        catPart += catSub;
    }

    if (anSub > 1) {
        if (anion.polyatomic) {
            anPart = `(${anion.symbol})${anSub}`;
        }
        else {
            anPart += anSub;
        }
    }

    return catPart + anPart;
}

/*****************************************************************
* Naming Engine
*****************************************************************/

function buildName(cation, anion) {
    if (cation.variableCharge) {
        return `${cation.name}(${romanNumeral(cation.charge)}) ${anion.name}`;
    }

    return `${cation.name} ${anion.name}`;
}

/*****************************************************************
* Random Compound Generator
*****************************************************************/

function getRandomCompound() {
    const useTransitionMetal = Math.random() < 0.35;

    let cation;

    if (useTransitionMetal) {
        const metal =
            transitionMetals[
            Math.floor(Math.random() * transitionMetals.length)
            ];

        const charge =
            metal.charges[
            Math.floor(Math.random() * metal.charges.length)
            ];

        cation = {
            symbol: metal.symbol,
            name: metal.name,
            charge: charge,
            variableCharge: true
        };
    }
    else {
        const metal =
            fixedChargeCations[
            Math.floor(Math.random() * fixedChargeCations.length)
            ];

        cation = {
            ...metal,
            variableCharge: false
        };
    }

    const anion =
        anions[
        Math.floor(Math.random() * anions.length)
        ];

    const formula = buildFormula(cation, anion);

    const name = buildName(cation, anion);

    const explanation =

`<strong>STEP 1</strong>

Identify any variably valent cations and/or polyatomic ions.

Variable valent cations must include their <strong>charge state</strong> in parentheses in their chemical formulas.

Polyatomic ions must be enclosed in parentheses if a subscript > 1 is needed in the chemical formula where they are present.

<strong>STEP 2</strong>

Determine the charge states on the anion and the cation.  Charge states on variably valent cations are deduced from the total negative charges carried on the anion particles and the number of cation particles present in the chemical formula:

${cation.name} = +${cation.charge}

${anion.name} = ${anion.charge}

<strong>STEP 3</strong>

Balance the total positive and negative charge. Use the crossover method where convenient.

<strong>STEP 4</strong>

Write the chemical formula with the correct casing and spacing.  Note that I do not require upper case letters for chemical names, but this may be instructor dependent.

The Correct Chemical Formula (note that when writing these chemical formulas by hand, subscripts must clearly be subscripted!):

<strong>${normalizeFormula(formula)}</strong>

The Correct Chemical Name (note that when Roman numerals are required, they must be uppercase letters, and that no space exists between the last letter of the element symbol and the open parenthesis:

<strong>${name}</strong>`;

    return {
        cation,
        anion,
        formula,
        name,
        explanation
    };
}

/*****************************************************************
* Next Question
*****************************************************************/

function nextQuestion() {
    currentCompound = getRandomCompound();

    const mode =
        document.getElementById(
            "practiceMode"
        ).value;

    if (mode === "mixed") {
        currentQuestionType =
            Math.random() < 0.5
                ? "formulaToName"
                : "nameToFormula";
    }
    else {
        currentQuestionType = mode;
    }

    const prompt =
        document.getElementById("formula");

    if (currentQuestionType === "formulaToName") {
        prompt.innerHTML =
            normalizeFormula(currentCompound.formula);

        document.getElementById(
            "answer"
        ).placeholder =
            "Enter the compound name";
    }
    else {
        prompt.textContent =
            currentCompound.name;

        document.getElementById(
            "answer"
        ).placeholder =
            "Enter the chemical formula";
    }

    document.getElementById(
        "answer"
    ).value = "";

    document.getElementById(
        "feedback"
    ).innerHTML = "";

    document.getElementById(
        "explanation"
    ).textContent = "";
}

/*****************************************************************
* Check Answer
*****************************************************************/

function checkAnswer() {
    attempts++;

    document.getElementById(
        "attempts"
    ).textContent = attempts;

    let studentAnswer =
        document
            .getElementById("answer")
            .value
            .trim();

    let correctAnswer;

    if (currentQuestionType === "formulaToName") {
        studentAnswer =
            studentAnswer.toLowerCase();

        correctAnswer =
            currentCompound.name.toLowerCase();
    }
    else {
        studentAnswer =
            normalizeFormula(studentAnswer);

        correctAnswer =
            normalizeFormula(
                currentCompound.formula
            );
    }

    const feedback =
        document.getElementById(
            "feedback"
        );

    if (studentAnswer === correctAnswer) {
        score++;

        document.getElementById(
            "score"
        ).textContent = score;

        feedback.innerHTML =
            "<span class='correct'>✅ Correct!</span>";
    }
    else {
        let answerDisplay;

        if (currentQuestionType === "formulaToName") {
            answerDisplay =
                normalizeFormula(currentCompound.formula);
        }
        else {
            answerDisplay =
                currentCompound.formula;
        }

        feedback.innerHTML =
            `<span class='incorrect'>
❌ Incorrect
</span>

<br><br>

Correct Answer:

<strong>${answerDisplay}</strong>`;
    }

    document.getElementById(
        "explanation"
    ).innerHTML =
        currentCompound.explanation;
}

/*****************************************************************
* Enter Key Support
*****************************************************************/

document.addEventListener(
    "DOMContentLoaded",
    function () {
        document
            .getElementById("answer")
            .addEventListener(
                "keypress",
                function (event) {
                    if (event.key === "Enter") {
                        checkAnswer();
                    }
                }
            );

        nextQuestion();
    }
);
