const welcome = document.getElementById("welcome");
const surprise = document.getElementById("surprise");
const finalScreen = document.getElementById("final");

const startBtn = document.getElementById("startBtn");
const blowBtn = document.getElementById("blowBtn");

const countdown = document.getElementById("countdown");
const instruction = document.getElementById("instruction");

const candles = document.querySelectorAll(".candle");
const smokeContainer = document.getElementById("smoke-container");

let candlesBlown = false;
let microphoneStarted = false;


/* --------------------------------
   START THE BIRTHDAY
-------------------------------- */

startBtn.addEventListener("click", () => {

    welcome.classList.add("hidden");

    surprise.classList.remove("hidden");

    startCountdown();

});


/* --------------------------------
   COUNTDOWN
-------------------------------- */

function startCountdown() {

    const numbers = ["3", "2", "1"];

    let index = 0;

    showNumber(numbers[index]);

    const countdownTimer = setInterval(() => {

        index++;

        if (index < numbers.length) {

            showNumber(numbers[index]);

        } else {

            clearInterval(countdownTimer);

            countdown.textContent = "💨";

            instruction.textContent =
                "Now blow on the candles! 💨";

            // Start microphone detection
            startMicrophone();

        }

    }, 1000);

}


function showNumber(number) {

    countdown.textContent = number;

    // Restart animation
    countdown.style.animation = "none";

    void countdown.offsetWidth;

    countdown.style.animation =
        "countdownPop .8s ease";

}


/* --------------------------------
   MICROPHONE
-------------------------------- */

async function startMicrophone() {

    if (microphoneStarted) return;

    microphoneStarted = true;

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        const audioContext =
            new AudioContext();

        const analyser =
            audioContext.createAnalyser();

        const microphone =
            audioContext.createMediaStreamSource(stream);

        microphone.connect(analyser);

        analyser.fftSize = 256;

        const data =
            new Uint8Array(analyser.frequencyBinCount);


        function detectBlow() {

            if (candlesBlown) return;

            analyser.getByteTimeDomainData(data);

            let total = 0;

            for (let i = 0; i < data.length; i++) {

                total += Math.abs(
                    data[i] - 128
                );

            }

            const volume =
                total / data.length;


            // Blow threshold
            if (volume > 15) {

                blowOutCandles();

                stream.getTracks().forEach(
                    track => track.stop()
                );

                audioContext.close();

                return;
            }

            requestAnimationFrame(detectBlow);

        }

        detectBlow();

    } catch (error) {

        console.log(
            "Microphone permission unavailable."
        );

        instruction.textContent =
            "Tap the button below to blow them out 💨";

        blowBtn.classList.remove("hidden");

    }

}


/* --------------------------------
   FALLBACK BUTTON
-------------------------------- */

blowBtn.addEventListener(
    "click",
    blowOutCandles
);


/* --------------------------------
   BLOW OUT CANDLES
-------------------------------- */

function blowOutCandles() {

    if (candlesBlown) return;

    candlesBlown = true;

    instruction.textContent =
        "Make a wish... ✨";

    blowBtn.classList.add("hidden");

    countdown.textContent = "";


    candles.forEach((candle, index) => {

        setTimeout(() => {

            candle.classList.add("blown");

            createSmoke(candle);

        }, index * 120);

    });


    setTimeout(() => {

        createConfetti();

    }, 400);


    setTimeout(() => {

        surprise.classList.add("hidden");

        finalScreen.classList.remove("hidden");

    }, 1600);

}


/* --------------------------------
   SMOKE
-------------------------------- */

function createSmoke(candle) {

    const smoke =
        document.createElement("div");

    smoke.classList.add("smoke");

    const rect =
        candle.getBoundingClientRect();

    const sceneRect =
        document
            .querySelector(".cake-scene")
            .getBoundingClientRect();

    smoke.style.left =
        `${rect.left - sceneRect.left}px`;

    smoke.style.top =
        `${rect.top - sceneRect.top}px`;

    smokeContainer.appendChild(smoke);

    setTimeout(() => {

        smoke.remove();

    }, 2000);

}


/* --------------------------------
   CONFETTI
-------------------------------- */

function createConfetti() {

    const container =
        document.querySelector(".confetti");

    const symbols = [
        "♡",
        "✦",
        "✧",
        "•"
    ];

    for (let i = 0; i < 70; i++) {

        const piece =
            document.createElement("div");

        piece.classList.add(
            "confetti-piece"
        );

        piece.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];

        piece.style.left =
            Math.random() * 100 + "%";

        piece.style.fontSize =
            10 + Math.random() * 15 + "px";

        piece.style.animationDelay =
            Math.random() * .8 + "s";

        piece.style.animationDuration =
            2 + Math.random() * 2 + "s";

        container.appendChild(piece);

    }

}
