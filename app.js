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
    { symbol: "NH4", name: "ammonium", charge: 1, polyatomic: true },
    { symbol: "Mg", name: "magnesium", charge: 2 },
    { symbol: "Ca", name: "calcium", charge: 2 },
    { symbol: "Sr", name: "strontium", charge: 2 },
    { symbol: "Ba", name: "barium", charge: 2 },

    { symbol: "Al", name: "aluminum", charge: 3 },
    { symbol: "Ga", name: "gallium", charge: 3 },
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
    { symbol: "Cu", name: "copper", charges: [1, 2] },
    { symbol: "Sn", name: "tin", charges: [2, 4] },
    { symbol: "Ti", name: "titanium", charges: [2, 3, 4] },
    { symbol: "V", name: "vanadium", charges: [2, 3, 5] },
    {symbol: "Pb", name: "lead", charges: [2, 4] }
];

const anions = [
    { symbol: "F", name: "fluoride", charge: -1, polyatomic: false },
    { symbol: "Cl", name: "chloride", charge: -1, polyatomic: false },
    { symbol: "Br", name: "bromide", charge: -1, polyatomic: false},
    { symbol: "I", name: "iodide", charge: -1, polyatomic: false },
    { symbol: "N", name: "nitride", charge: -3, polyatomic: false },
    { symbol: "P", name: "phosphide", charge: -3, polyatomic: false },
    { symbol: "As", name: "arsenide", charge: -3, polyatomic: false },
    { symbol: "O", name: "oxide", charge: -2, polyatomic: false},
    { symbol: "S", name: "sulfide", charge: -2, polyatomic: false },
    { symbol: "MnO4", name: "permanganate", charge: -1, polyatomic: true },
    { symbol: "Cr2O4", name: "chromate", charge: -2, polyatomic: true },
    { symbol: "Cr2O7", name: "dichromate", charge: -2, polyatomic: true },
    { symbol: "HCO3", name: "hydrogen carbonate", charge: -1, polyatomic: true,
            alternateNames: ["bicarbonate"]},
    { symbol: "CH3CO2", name: "acetate", charge: -1, polyatomic: true },
    { symbol: "CN", name: "cyanide", charge: -1, polyatomic: true },
    { symbol: "ClO3", name: "chlorate", charge: -1, polyatomic: true },
    { symbol: "ClO", name: "hypochlorite", charge: -1, polyatomic: true },
    { symbol: "ClO2", name: "chlorite", charge: -1, polyatomic: true },
    { symbol: "ClO4", name: "perchlorate", charge: -1, polyatomic: true },

    { symbol: "NO2", name: "nitrite", charge: -1, polyatomic: true },
    { symbol: "HPO4", name: "hydrogen phosphate", charge: -2, polyatomic: true },
    { symbol: "H2PO4", name: "dihydrogen phosphate", charge: -1, polyatomic: true },
    { symbol: "HSO4", name: "hydrogen sulfate", charge: -1, polyatomic: true,
            alternateNames: ["bisulfate"]},
    { symbol: "HSO3", name: "hydrogen sulfite", charge: -1, polyatomic: true,
            alternateNames: ["bisulfite"]},


    { symbol: "NO3", name: "nitrate", charge: -1, polyatomic: true },
    { symbol: "SO3", name: "sulfite", charge: -2, polyatomic: true },
    { symbol: "SO4", name: "sulfate", charge: -2, polyatomic: true },
    { symbol: "PO3", name: "phosphite", charge: -3, polyatomic: true },
    { symbol: "PO4", name: "phosphate", charge: -3, polyatomic: true},
    { symbol: "OH", name: "hydroxide", charge: -1, polyatomic: true},
    { symbol: "CO3", name: "carbonate", charge: -2, polyatomic: true}
];

/*****************************************************************
* Covalent Compound Repositories
*****************************************************************/
const covalentCompounds = [
{formula: "CO", name: "carbon monoxide" },
    { formula: "BAs", name: "boron arsenide" },
    { formula: "CBr4", name: "carbon tetrabromide",
        alternateNames: ["tetrabromomethane"]},
    { formula: "BN", name: "boron nitride" },
    { formula: "BBr3", name: "boron tribromide" },
    { formula: "BF3", name: "boron trifluoride" },
    { formula: "BI3", name: "boron triiodide" },
    { formula: "BrO2", name: "bromine dioxide" },
    { formula: "BrCl", name: "bromine chloride" },
    { formula: "BrF", name: "bromine fluoride" },
    { formula: "CS2", name: "carbon disulfide" },
    {formula: "CCl4", name: "carbon tetrachloride",
        alternateNames: ["tetrachloromethane"]},
    { formula: "CF4", name: "carbon tetrafluoride",
        alternateNames: ["tetrafluoromethane"]},
    { formula: "CI4", name: "carbon tetraiodide",
        alternateNames: ["tetraiodomethane"]},
    { formula: "ClO2", name: "chlorine dioxide" },
    { formula: "ClF5", name: "chlorine pentafluoride" },
    { formula: "ClF3", name: "chlorine trifluoride" },
    { formula: "IF4", name: "iodine tetrafluoride" },
    { formula: "NBr3", name: "nitrogen tribromide" },
    { formula: "NCl3", name: "nitrogen trichloride" },
    { formula: "NF3", name: "nitrogen trifluoride" },
    { formula: "NI3", name: "nitrogen triiodide" },
    { formula: "OF2", name: "oxygen difluoride" },
    { formula: "P4S7", name: "tetraphosphorus heptasulfide" },
    { formula: "P4S6", name: "tetraphosphorus hexasulfide" },
    { formula: "P4O6", name: "tetraphosphorus hexoxide" },
    { formula: "PBr3", name: "phosphorus tribromide" },
    { formula: "PBr5", name: "phosphorus pentabromide" },
    { formula: "PF5", name: "phosphorus pentafluoride" },
    { formula: "PF3", name: "phosphorus trifluoride" },
    { formula: "PI3", name: "phosphorus triiodide" },
    { formula: "SCl2", name: "sulfur dichloride" },
    { formula: "SF2", name: "sulfur difluoride" },
    { formula: "SCl4", name: "sulfur tetrachloride" },
    { formula: "SeBr", name: "selenium bromide" },
    { formula: "SeCl2", name: "selenium dichloride" },
    { formula: "SeF2", name: "selenium difluoride" },
    { formula: "SeBr2", name: "selenium dibromide" },
    { formula: "SeO2", name: "selenium dioxide" },
    { formula: "SeF6", name: "selenium hexafluoride" },
    { formula: "SeS2", name: "selenium disulfide" },
    { formula: "SeBr4", name: "selenium tetrabromide" },
    { formula: "SeCl4", name: "selenium tetrachloride" },
    { formula: "SeF4", name: "selenium tetrafluoride" },
    { formula: "SeO3", name: "selenium trioxide" },
    { formula: "HCl", name: "hydrogen chloride",
        alternateNames: ["hydrochloric acid"]},
    { formula: "HF", name: "hydrogen fluoride",
        alternateNames: ["hydrofluoric acid"]},
    { formula: "HBr", name: "hydrogen bromide",
        alternateNames: ["hydrobromic acid"]},
    { formula: "HI", name: "hydrogen iodide",
        alternateNames: ["hydroiodic acid"]},
    { formula: "HCN", name: "hydrogen cyanide",
        alternateNames: ["hydrocyanic acid"]},
    { formula: "H2SO4", name: "sulfuric acid" },
    { formula: "H3PO4", name: "phosphoric acid"},
    { formula: "HNO3", name: "nitric acid" },


{formula: "CO2", name: "carbon dioxide"},
{formula: "N2O", name: "dinitrogen monoxide"},
{formula: "NO", name: "nitrogen monoxide" },
{formula: "NO2", name: "nitrogen dioxide"},
{formula: "N2O3", name: "dinitrogen trioxide"},
{formula: "N2O4", name: "dinitrogen tetroxide"},
{formula: "N2O5", name: "dinitrogen pentoxide"},
{formula: "SO2", name: "sulfur dioxide"},
{formula: "SO3", name: "sulfur trioxide"},
{formula: "PCl3", name: "phosphorus trichloride"},
{formula: "PCl5", name: "phosphorus pentachloride" },
{formula: "SF4", name: "sulfur tetrafluoride"},
{formula: "SF6", name: "sulfur hexafluoride"},
{formula: "Cl2O7", name: "dichlorine heptoxide"},
{formula: "BrF3", name: "bromine trifluoride" },
{formula: "BrF5", name: "bromine pentafluoride"},
{formula: "IF7", name: "iodine heptafluoride"}
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

    /*
     * Add the cation subscript.
     *
     * If the cation is polyatomic, parentheses are required
     * whenever more than one copy of the ion is needed.
     *
     * Example:
     * NH4+ + SO4^2- -> (NH4)2SO4
     */
    if (catSub > 1) {
        if (cation.polyatomic) {
            catPart = `(${cation.symbol})${catSub}`;
        }
        else {
            catPart += catSub;
        }
    }

    /*
     * Add the anion subscript.
     *
     * Polyatomic anions also require parentheses whenever
     * more than one copy of the ion is needed.
     *
     * Example:
     * Ca2+ + NO3- -> Ca(NO3)2
     */
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

Variable valent cations must include their <strong>charge state</strong> in parentheses in their chemical names.

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
        type: "ionic",
        cation,
        anion,
        formula,
        name,
        explanation
    };
}


/*****************************************************************
* Random Covalent Compound Generator
*****************************************************************/

function getRandomCovalentCompound() {
    
    const compound =    
    covalentCompounds[
      Math.floor(
      Math.random() * 
      covalentCompounds.length
        )
];
    
    const explanation = `

<strong>STEP 1</strong>

Recognize this as a binary covalent (molecular) compound.

Covalent compounds are composed of nonmetals bonded together.

<strong>STEP 2</strong>

Use prefixes to indicate the number of atoms present.

Common prefixes:

mono = 1
di = 2
tri = 3
tetra = 4
penta = 5
hexa = 6
hepta = 7
octa = 8
nona = 9
deca = 10

<strong>STEP 3</strong>

The Correct Chemical Formula:

<strong>${normalizeFormula(compound.formula)}</strong>

<strong>STEP 4</strong>

The Correct Chemical Name:

<strong>${
        compound.alternateNames
            ? [compound.name, ...compound.alternateNames].join(" OR ")
            : compound.name
}</strong>

`;
      
    return {
        type: "covalent",
        formula: compound.formula,

        name: compound.name,

        acceptableNames: compound.alternateNames
            ? [compound.name, ...compound.alternateNames]
            : [compound.name],

        explanation
    };
}

/*****************************************************************
* Next Question
*****************************************************************/


function nextQuestion() {

    const mode =
        document.getElementById(
            "practiceMode"
        ).value;

    let compoundType;
    let questionDirection;
    if (mode === "ionicFormulaToName") {

        compoundType = "ionic";
        questionDirection = "formulaToName";

    }
    else if (mode === "ionicNameToFormula") {

        compoundType = "ionic";
        questionDirection = "nameToFormula";

    }
    else if (mode === "covalentFormulaToName") {

        compoundType = "covalent";
        questionDirection = "formulaToName";

    }
    else if (mode === "covalentNameToFormula") {

        compoundType = "covalent";
        questionDirection = "nameToFormula";

    }
    else {

        compoundType =
            Math.random() < 0.5
                ? "ionic"
                : "covalent";

        questionDirection =
            Math.random() < 0.5
                ? "formulaToName"
                : "nameToFormula";

    }
    if (compoundType === "ionic") {

        currentCompound =
            getRandomCompound();

    }
    else {

        currentCompound =
            getRandomCovalentCompound();

    }
    currentQuestionType =
        questionDirection;
    const prompt =
        document.getElementById(
            "formula"
        );

    if (
        currentQuestionType ===
        "formulaToName"
    ) {

        prompt.innerHTML =
            normalizeFormula(
                currentCompound.formula
            );

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
    /*
        * Clear previous answer/feedback.
        */

    document.getElementById("answer").value = "";
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("explanation").textContent = "";
    document.getElementById("answer").focus();

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
            studentAnswer.toLowerCase().trim();

        const acceptableAnswers =
            currentCompound.acceptableNames
                ? currentCompound.acceptableNames.map(
                    answer => answer.toLowerCase()
                )
                : [currentCompound.name.toLowerCase()];

        correctAnswer =
            acceptableAnswers.includes(studentAnswer);
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

    let isCorrect;

    if (currentQuestionType === "formulaToName") {
        isCorrect = correctAnswer;
    }
    else {
        isCorrect =
            studentAnswer === correctAnswer;
    }

    if (isCorrect) {
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

            // Formula was given.
            // Student was asked for the NAME.
            answerDisplay =
                currentCompound.acceptableNames
                    ? currentCompound.acceptableNames.join(" OR ")
                    : currentCompound.name;
        }
        else {

            // Name was given.
            // Student was asked for the FORMULA.
            answerDisplay =
                normalizeFormula(
                    currentCompound.formula
                );
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
