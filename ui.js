// UI Controller for menu navigation and game UI
const UI = {
  init() {
    this.setupMenuButtons();
    this.setupGameButtons();
    this.showMainMenu();
  },

  setupMenuButtons() {
    const buttons = [
      { id: "startGameBtn", action: () => this.showDifficultyScreen() },
      { id: "helpBtn", action: () => this.showHelpScreen() },
      { id: "resetScoreBtn", action: () => this.showResetConfirmation() },
      { id: "confirmResetBtn", action: () => this.resetHighScore() },
      { id: "cancelResetBtn", action: () => this.hideResetConfirmation() },
      { id: "easyBtn", action: () => this.startGame("easy") },
      { id: "normalBtn", action: () => this.startGame("normal") },
      { id: "hardBtn", action: () => this.startGame("hard") },
      { id: "backFromDiffBtn", action: () => this.showMainMenu() },
      { id: "backFromHelpBtn", action: () => this.showMainMenu() },
    ];

    buttons.forEach((btn) => {
      const element = document.getElementById(btn.id);
      element.addEventListener("click", btn.action);
      element.addEventListener("touchstart", (e) => {
        e.preventDefault();
        btn.action();
      });
    });
  },

  setupGameButtons() {
    const gameButtons = [
      {
        id: "jumpBtn",
        action: () => {
          if (Game.state === "playing") Game.jump();
        },
      },
      {
        id: "pauseBtn",
        action: () => {
          if (Game.state === "playing") Game.pause();
          else if (Game.state === "paused") Game.resume();
        },
      },
      { id: "backBtn", action: () => this.showMainMenu() },
      {
        id: "restartBtn",
        action: () => {
          this.hideGameOver();
          Game.restart();
        },
      },
      {
        id: "menuFromGameOverBtn",
        action: () => {
          this.hideGameOver();
          this.showMainMenu();
        },
      },
    ];

    gameButtons.forEach((btn) => {
      const element = document.getElementById(btn.id);
      element.addEventListener("click", btn.action);
      element.addEventListener("touchstart", (e) => {
        e.preventDefault();
        btn.action();
      });
    });
  },

  showMainMenu() {
    document.getElementById("mainMenu").classList.add("active");
    document.getElementById("difficultyMenu").classList.remove("active");
    document.getElementById("helpMenu").classList.remove("active");
    document.getElementById("gameOverModal").classList.remove("active");
    document.getElementById("gameCanvas").style.display = "none";
    document.getElementById("score").style.display = "none";
    document.getElementById("gameControls").style.display = "none";
    document.getElementById(
      "highScoreDisplay"
    ).textContent = `High Score: ${Game.highScore} coins`;
  },

  showDifficultyScreen() {
    document.getElementById("mainMenu").classList.remove("active");
    document.getElementById("difficultyMenu").classList.add("active");
    document.getElementById("helpMenu").classList.remove("active");
  },

  showHelpScreen() {
    document.getElementById("mainMenu").classList.remove("active");
    document.getElementById("difficultyMenu").classList.remove("active");
    document.getElementById("helpMenu").classList.add("active");
  },

  startGame(difficulty) {
    document.getElementById("mainMenu").classList.remove("active");
    document.getElementById("difficultyMenu").classList.remove("active");
    document.getElementById("helpMenu").classList.remove("active");
    document.getElementById("gameCanvas").style.display = "block";
    document.getElementById("score").style.display = "none";
    document.getElementById("gameControls").style.display = "flex";
    document.getElementById("gameOverModal").classList.remove("active");
    document.getElementById("pauseBtn").textContent = "PAUSE";

    Game.start(difficulty);
  },

  updateScore(coins, distance, highScore) {
    document.getElementById(
      "score"
    ).textContent = `Coins: ${coins} | Distance: ${distance} | High Score: ${highScore}`;
  },

  showGameOver(coins, distance, highScore) {
    document.getElementById("gameOverModal").classList.add("active");
    const finalScoreDiv = document.getElementById("finalScore");
    finalScoreDiv.innerHTML = `
      <p style="font-size: 28px; color: #FFD700; font-weight: bold;">💰 Coins Collected: ${coins}</p>
      <p style="font-size: 24px; color: #764ba2; font-weight: bold;">🏝️ Distance: ${distance} islands</p>
      <p style="font-size: 20px; color: #667eea;">🏆 High Score: ${highScore} coins</p>
    `;
  },

  hideGameOver() {
    document.getElementById("gameOverModal").classList.remove("active");
  },

  showResetConfirmation() {
    document.getElementById("resetConfirmModal").classList.add("active");
  },

  hideResetConfirmation() {
    document.getElementById("resetConfirmModal").classList.remove("active");
  },

  resetHighScore() {
    localStorage.removeItem("dangerDashHighScore");
    Game.highScore = 0;
    document.getElementById("highScoreDisplay").textContent =
      "High Score: 0 coins";
    this.hideResetConfirmation();
  },
};

// Initialize UI when page loads
window.addEventListener("DOMContentLoaded", () => {
  UI.init();
});
