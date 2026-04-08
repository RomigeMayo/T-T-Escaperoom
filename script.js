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

// 🔊 ALARM GELUID
const alarmSound = new Audio("alarm.MP3");
alarmSound.volume = 1.0;

// 🔥 AUTO SCROLL CONTROL
let shouldAutoScroll = true;

function scrollToBottomSmooth() {
    if (!shouldAutoScroll) return;

    output.scrollTo({
        top: output.scrollHeight,
        behavior: "smooth"
    });
}

// 🔐 LOGIN
function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "Admin" && pass === "6729") {
        loginScreen.style.display = "none";
        terminal.classList.remove("hidden");

        // 🔥 BOOT SEQUENCE (GEEN EXTRA SPACE)
        print("BOOTING SYSTEM...", false);
        print("LOADING KERNEL...", false);
        print("CHECKING MEMORY...", false);
        print("INITIALIZING SECURITY MODULE...", false);
        print("CONNECTING TO BANK NETWORK...", false);
        print("SECURE CONNECTION ESTABLISHED.", false);

        // 🔥 WEL SPACE HIER
        print("", true);

        // 🔥 NIEUWE BLOCK MET RUIMTE
        print("Welcome, Admin.");
        print("Type 'start' to begin.");

    } else {
        alert("Login failed");
    }
}

// 📂 PATH
function getPath() {
    return currentPath.join("\\");
}

// 🔥 PRINT
function print(text, addSpacing = true, callback) {
    queue.push({ text, addSpacing, callback });
    if (!isTyping) processQueue();
}

// 🔥 TYPE ENGINE + SMOOTH SCROLL
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

// 💀 GLITCH
function glitchEffect() {
    const original = output.innerHTML;

    output.classList.add("glitch");
    output.innerHTML = "!SECURITY BREACH DETECTED!";

    // 🔊 ALARM
    alarmSound.currentTime = 0;
    alarmSound.loop = true;
    alarmSound.play();

    setTimeout(() => {
        output.innerHTML = original;
        output.classList.remove("glitch");
    }, 2500);
}

// 💀 CRASH
function systemCrash() {

    if (hasCrashed) return;
    hasCrashed = true;

    input.disabled = true;

    // 🔊 ALARM BLIJFT VOOR ALTIJD
    alarmSound.loop = true;
    alarmSound.currentTime = 0;
    alarmSound.play();

    // 🔴 SCHERM FLASH EFFECT (extra sick)
    let flash = false;
    const flashInterval = setInterval(() => {
        document.body.style.backgroundColor = flash ? "black" : "darkred";
        flash = !flash;
    }, 200);

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
    }, 2500);
}

// ⚡ LOADING
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

// 🔐 HACK
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

// 🧠 WRONG ANSWER
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

// ⌨️ INPUT
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

// 🧠 CMD + GAME
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
            print("Level 1");
            print("Vraag: Wat gebruik je om in te loggen?");
        });
        step++;
        return;
    }

    if (step === 1) {
        if (cmd.includes("wachtwoord") || cmd.includes("password")) {
            print("Correct!");
            print("Vraag: Hoeveel cijfers heeft een PIN-code?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 2) {
        if (cmd === "4") {
            print("Correct!");
            print("Vraag: Wat gebruik je om je identiteit te bevestigen?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 3) {
        if (cmd.includes("pin") || cmd.includes("code") || cmd.includes("id")) {
            print("Correct!");
            print("Vraag: Wat is 10 + 5?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 4) {
        if (cmd === "15") {
            print("Correct!");
            print("Vraag: Wat is 20 - 7?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 5) {
        if (cmd === "13") {
            print("Correct!");
            print("Vraag: Wat beschermt een bank tegen diefstal?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 6) {
        if (cmd.includes("alarm") || cmd.includes("beveiliging")) {
            print("Correct!");
            print("Vraag: Wat is een firewall?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 7) {
        if (cmd.includes("beveiliging") || cmd.includes("netwerk")) {
            print("Correct!");
            print("Vraag: Wat is 6 x 3?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 8) {
        if (cmd === "18") {
            print("Correct!");
            print("Vraag: Wat is 12 ÷ 3?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 9) {
        if (cmd === "4") {
            print("Correct!");
            print("Vraag: Wat gebeurt er als je wachtwoord fout is?");
            step++;
        } else handleWrongAnswer(cmd);
        return;
    }

    if (step === 10) {
        if (cmd.includes("fout") || cmd.includes("blokkeren") || cmd.includes("lock")) {
            fakeHack(() => {
                print("LEVEL VOLTOOID");
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
// 🔥 ENTER = LOGIN (WORKING FIX)
window.addEventListener("DOMContentLoaded", () => {

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    usernameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            passwordInput.focus(); // eerst naar wachtwoord
        }
    });

    passwordInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            login(); // dan pas inloggen
        }
    });

});
