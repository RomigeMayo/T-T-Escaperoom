const input = document.getElementById("input");
const output = document.getElementById("output");

const loginScreen = document.getElementById("login");
const terminal = document.getElementById("terminal");

const loadingContainer = document.getElementById("loading-container");
const loadingBar = document.getElementById("loading-bar");

let step = 0;
let wrongAnswers = new Map();

let currentPath = ["C:", "Users", "Admin"];

let queue = [];
let isTyping = false;

let hasCrashed = false;

//  AUTO SCROLL CONTROL
let shouldAutoScroll = true;

function scrollToBottomSmooth() {
    if (!shouldAutoScroll) return;

    output.scrollTo({
        top: output.scrollHeight,
        behavior: "smooth"
    });
}
//  NO CURSOR
document.body.style.cursor = "none";

//  LOGIN
function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "Admin" && pass === "6729") {
        loginScreen.style.display = "none";
        terminal.classList.remove("hidden");

        //  BOOT SEQUENCE
        print("BOOTING SYSTEM...", false);
        print("LOADING KERNEL...", false);
        print("CHECKING MEMORY...", false);
        print("INITIALIZING SECURITY MODULE...", false);
        print("CONNECTING TO BANK NETWORK...", false);
        print("SECURE CONNECTION ESTABLISHED.", false);

       
        print("", true);

        
        print("Welcome, Admin.");
        print("Type 'start' to begin.");

    } else {
        alert("Login failed");
    }
}

//  PATH
function getPath() {
    return currentPath.join("\\");
}

//  PRINT
function print(text, addSpacing = true, callback) {
    queue.push({ text, addSpacing, callback });
    if (!isTyping) processQueue();
}

//  TYPE ENGINE + SMOOTH SCROLL
function processQueue() {
    if (queue.length === 0) {
        isTyping = false;
        return;
    }

    isTyping = true;

    const { text, addSpacing, callback } = queue.shift();
    let i = 0;

    function type() {
        if (i < text.length) {
            output.innerHTML += text[i];
            i++;

            scrollToBottomSmooth();

            setTimeout(type, 8);
        } else {
            output.innerHTML += addSpacing ? "\n\n" : "\n";

            scrollToBottomSmooth();

            if (callback) callback();
            processQueue();
        }
    }

    type();
}

//  GLITCH
function glitchEffect() {
    const original = output.innerHTML;

    output.classList.add("glitch");
    output.innerHTML = "!SECURITY BREACH DETECTED!";

    setTimeout(() => {
        output.innerHTML = original;
        output.classList.remove("glitch");
    }, 4500);
}

//  CRASH
function systemCrash() {

    if (hasCrashed) return;
    hasCrashed = true;

    input.disabled = true;

    output.innerHTML = `
!SYSTEM LOCKDOWN!

Bank Security System:
> Unauthorized access detected
> LOCKING SYSTEM...

Connection lost...
`;

    scrollToBottomSmooth();

    setTimeout(() => {
        location.reload();
    }, 4500);
}

//  LOADING
function fakeLoading(callback) {
    loadingContainer.classList.remove("hidden");

    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 10;
        loadingBar.style.width = progress + "%";

        if (progress >= 100) {
            clearInterval(interval);

            setTimeout(() => {
                loadingContainer.classList.add("hidden");
                loadingBar.style.width = "0%";
                callback();
            }, 300);
        }
    }, 80);
}

//  HACK
function fakeHack(callback) {
    let count = 0;

    const interval = setInterval(() => {
        print(generateGarbage(), false);

        count++;

        if (count > 10) {
            clearInterval(interval);
            print("ACCESS GRANTED\n");
            callback();
        }
    }, 60);
}

function generateGarbage() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let text = "";

    for (let i = 0; i < 45; i++) {
        text += chars[Math.floor(Math.random() * chars.length)];
    }

    return text;
}

//  VERKEERD ANTWOORD
function handleWrongAnswer(cmd) {

    if (hasCrashed) return;

    let count = wrongAnswers.get(cmd) || 0;
    count++;
    wrongAnswers.set(cmd, count);

    queue = [];
    isTyping = false;

    print("Incorrect.");

    if (count >= 2) {
        print("Suspicious activity detected...");
    }

    const chance = Math.random();

    if (chance < 0.33) {
        // niks
    } else if (chance < 0.66) {
        setTimeout(() => glitchEffect(), 100);
    } else {
        setTimeout(() => systemCrash(), 100);
    }
}

//  INPUT
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        let value = input.value.trim().toLowerCase();

        if (!value || value.length > 50) {
            input.value = "";
            return;
        }

        output.innerHTML += `${getPath()}> ${value}\n`;

        scrollToBottomSmooth(); // 🔥 SMOOTH

        handleCommand(value);

        input.value = "";
    }
});

//  CMD + VRAGEN
function handleCommand(cmd) {

    if (cmd === "help") {
        print("Commands:");
        print("cd");
        print("dir");
        print("clear");
        print("start");
        return;
    }

    if (cmd === "clear") {
        output.innerHTML = "";
        return;
    }

    if (cmd === "dir") {
        print("Directory of " + getPath());
        print("file1.txt");
        print("file2.log");
        print("secret.exe");
        return;
    }

    if (cmd.startsWith("cd ")) {
        let folder = cmd.split(" ")[1];

        if (folder === "..") {
            if (currentPath.length > 1) currentPath.pop();
        } else {
            currentPath.push(folder);
        }

        return;
    }

    if (wrongAnswers.has(cmd)) {
        print("You already tried this.");
        return;
    }

    if (step === 0 && cmd === "start") {
        fakeLoading(() => {
            print("Vraag: Wat is het volgende getal in de reeks?");
            print("3 – 9 – 27 – 81 – 243 – ?");
        });
        step++;
        return;
    }

    if (step === 1) {
        if (cmd.includes("729")) {
            print("Correct!");
            print("Vraag: Maak één woord van deze letters:");
            print("U-L-I-S-K")
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 2) {
        if (cmd.includes("kluis")) {
            print("Correct!");
            print("vraag: Je hebt 3 cijfers: 2, 3 en 7.");
            print("Maak het getal 23 met alleen deze cijfers en +, -, ×, ÷");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 3) {
        if (cmd.includes("3 x 7 + 2") || cmd.includes("3 x 7 + 2 = 23")|| cmd.includes("3x7+2")|| cmd.includes("3x7+2=23")|| cmd.includes("3x7+2= 23")|| cmd.includes("3 x 7 + 2= 23")|| cmd.includes("7 x 3 + 2 = 23")|| cmd.includes("7x3+2=23")|| cmd.includes("7x3+2= 23")) {
            print("Correct!");
            print("Vraag: Wat is het volgende woord?");
            print("Kluis – Code – Kluis – Code – ?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 4) {
        if (cmd.includes("Kluis") || cmd.includes("kluis")) {
            print("Correct!");
            print("Vraag: Wat heeft een oog maar kan niet zien?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 5) {
        if (cmd.includes("Een naald") || cmd.includes("Een Naald")|| cmd.includes("Naald")|| cmd.includes("naald")) {
            print("Correct!");
            print("Vraag: Hoeveel maanden hebben 28 dagen?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 6) {
        if (cmd.includes("Alle maanden") || cmd.includes("alle maanden") || cmd.includes("Alle Maanden") || cmd.includes("alle") || cmd.includes("Alle")) {
            print("Correct!");
            print("Vraag: Als 3 uur 90 graden is, hoeveel graden is 6 uur dan?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 7) {
        if (cmd.includes("180 graden") || cmd.includes("180") || cmd.includes("180 Graden")) {
            print("Correct!");
            print("Vraag: Wat is het volgende getal in de reeks?");
            print("25 – 125 – 625 – 3125 – 15625 – ?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 8) {
        if (cmd.includes("78125")) {
            print("Correct!");
            print("Vraag: Wat is het ontbrekende getal?");
            print("3 × ? + 4 = 19");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 9) {
        if (cmd === "5") {
            print("Correct!");
            print("Vraag: Wat is elke bank eigennaar zijn favoriete ding?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 10) {
        if (cmd.includes("Geld") || cmd.includes("geld")) {
            fakeHack(() => {
                print("VERIFICATIE VOLTOOID...");
                print("Toegang tot systeem verkregen.");
                print("CODE: 4829");

                print("Succes... systeem blijft stabiel.");
            });
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    print("Unknown command.");
}
//  ENTER = LOGIN
window.addEventListener("DOMContentLoaded", () => {

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    usernameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            passwordInput.focus(); // naar wachtwoord
        }
    });

    passwordInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            login(); // dan pas inloggen
        }
    });

});
