document.addEventListener("DOMContentLoaded", () => {
  const currentWordDiv = document.getElementById("current-word");
  const userWordInput = document.getElementById("user-word");
  const submitButton = document.getElementById("submit-word");
  const messageDiv = document.getElementById("message");
  const scoreDiv = document.getElementById("score");
  const timerSpan = document.getElementById("time");
  const streakSpan = document.getElementById("streakCount");
  const restartButton = document.getElementById("restart");

  let currentWord = "";
  let totalScore = 0;
  let streakCount = 0;
  let timer;
  const roundTime = 10;
  let timeLeft = roundTime;

  function startTimer() {
    timeLeft = roundTime;
    timerSpan.textContent = timeLeft;
    timer = setInterval(() => {
      timeLeft--;
      timerSpan.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        gameOver("Time's up!");
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  function gameOver(message) {
    messageDiv.textContent = message;
    userWordInput.disabled = true;
    submitButton.disabled = true;
    restartButton.style.display = "block";
  }

  function loadInitialWord() {
    fetch("/start")
      .then((response) => response.json())
      .then((data) => {
        console.log("Received from /start:", data);
        currentWord = data.word;
        currentWordDiv.textContent = currentWord;
        startTimer();
      })
      .catch((error) => {
        console.error("Error fetching /start:", error);
        currentWordDiv.textContent = "Error loading word.";
      });
  }

  loadInitialWord();

  submitButton.addEventListener("click", () => {
    const userWord = userWordInput.value.trim();
    if (!userWord) return;
    clearInterval(timer);
    fetch("/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ previousWord: currentWord, userWord }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from /play:", data);
        if (data.success) {
          streakCount++;
          const bonus = (streakCount - 1) * 2;
          const wordScore = data.score + bonus;
          totalScore += wordScore;
          streakSpan.textContent = streakCount;
          scoreDiv.textContent = "Score: " + totalScore;
          currentWord = data.newWord;
          currentWordDiv.textContent = currentWord;
          messageDiv.textContent = "";
          userWordInput.value = "";
          resetTimer();
        } else {
          streakCount = 0;
          streakSpan.textContent = streakCount;
          messageDiv.textContent = data.message;
          userWordInput.value = "";
          resetTimer();
        }
      })
      .catch((error) => {
        console.error("Error fetching /play:", error);
        messageDiv.textContent = "Error processing your word.";
        resetTimer();
      });
  });

  restartButton.addEventListener("click", () => {
    totalScore = 0;
    streakCount = 0;
    scoreDiv.textContent = "Score: " + totalScore;
    streakSpan.textContent = streakCount;
    userWordInput.disabled = false;
    submitButton.disabled = false;
    restartButton.style.display = "none";
    messageDiv.textContent = "";
    loadInitialWord();
  });
});
