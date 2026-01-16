// Main game logic
const Game = {
  state: 'menu',
  score: 0,
  coinsCollected: 0,
  highScore: localStorage.getItem('dangerDashHighScore') || 0,
  gameSpeed: 2.2,
  difficulty: 'normal',
  islandTimer: 0,
  
  player: {
    x: CONFIG.PLAYER.startX,
    y: CONFIG.PLAYER.startY,
    width: CONFIG.PLAYER.width,
    height: CONFIG.PLAYER.height,
    velocityY: 0,
    velocityX: 0,
    jumping: false,
    doubleJump: false,
    onIsland: false
  },
  
  islands: [],
  coins: [],
  
  init() {
    Renderer.init('gameCanvas');
    this.setupControls();
  },
  
  start(difficulty) {
    this.difficulty = difficulty;
    const settings = CONFIG.DIFFICULTY[difficulty];
    this.gameSpeed = settings.startSpeed;
    this.state = 'playing';
    this.score = 0;
    this.coinsCollected = 0;
    this.islandTimer = 0;
    this.islands = [];
    this.coins = [];
    
    // Reset player
    this.player.x = CONFIG.PLAYER.startX;
    this.player.y = CONFIG.PLAYER.startY;
    this.player.velocityY = 0;
    this.player.velocityX = 0;
    this.player.jumping = false;
    this.player.doubleJump = false;
    this.player.onIsland = false;
    
    // Create starting islands
    this.createStartingIslands();
    this.createCoins();
    
    this.loop();
  },
  
  createStartingIslands() {
    this.islands.push({ x: -50, y: 320, width: 400, height: 80, hasCoins: false });
    this.islands.push({ x: 430, y: 318, width: 180, height: 82, hasCoins: false });
    this.islands.push({ x: 680, y: 315, width: 170, height: 85, hasCoins: false });
    this.islands.push({ x: 920, y: 312, width: 160, height: 88, hasCoins: false });
    this.islands.push({ x: 1150, y: 310, width: 155, height: 90, hasCoins: false });
  },
  
  createIsland() {
    const lastIsland = this.islands[this.islands.length - 1];
    const settings = CONFIG.DIFFICULTY[this.difficulty];
    const gap = settings.islandGapMin + Math.random() * (settings.islandGapMax - settings.islandGapMin);
    const width = CONFIG.ISLAND.minWidth + Math.random() * (CONFIG.ISLAND.maxWidth - CONFIG.ISLAND.minWidth);
    const yVariation = -15 + Math.random() * 30;
    const newY = Math.max(CONFIG.ISLAND.minY, Math.min(CONFIG.ISLAND.maxY, lastIsland.y + yVariation));
    
    this.islands.push({
      x: lastIsland.x + lastIsland.width + gap,
      y: newY,
      width: width,
      height: CONFIG.CANVAS_HEIGHT - newY,
      hasCoins: false
    });
  },
  
  createCoins() {
    const settings = CONFIG.DIFFICULTY[this.difficulty];
    
    for (let island of this.islands) {
      if (island.x > -50 && island.x < CONFIG.CANVAS_WIDTH + 200 && !island.hasCoins) {
        const numCoins = Math.floor(island.width / settings.coinFrequency);
        for (let i = 0; i < numCoins; i++) {
          const coinX = island.x + 15 + i * settings.coinFrequency;
          const coinY = island.y - 15;
          
          this.coins.push({
            x: coinX,
            y: coinY,
            radius: 10,
            collected: false,
            rotation: 0
          });
        }
        island.hasCoins = true;
      }
    }
  },
  
  jump() {
    if (this.state !== 'playing') return;
    
    if (!this.player.jumping && this.player.onIsland) {
      this.player.velocityY = CONFIG.PLAYER.jumpPower;
      this.player.velocityX = this.gameSpeed * 0.6;
      this.player.jumping = true;
      this.player.doubleJump = false;
      this.player.onIsland = false;
    } else if (this.player.jumping && !this.player.doubleJump && !this.player.onIsland && this.player.velocityY > -5) {
      this.player.velocityY = CONFIG.PLAYER.doubleJumpPower;
      this.player.velocityX = this.gameSpeed * 0.95;
      this.player.doubleJump = true;
    }
  },
  
  updatePlayer() {
    this.player.velocityY += CONFIG.PLAYER.gravity;
    this.player.y += this.player.velocityY;
    
    if (!this.player.onIsland && this.player.velocityX > 0) {
      this.player.x += this.player.velocityX;
      this.player.velocityX *= 0.98;
    }
    
    if (this.player.x < 100) this.player.x = 100;
    if (this.player.x > 250) this.player.x = 250;
    
    this.player.onIsland = false;
    for (let island of this.islands) {
      if (this.player.x + this.player.width > island.x &&
          this.player.x < island.x + island.width &&
          this.player.y + this.player.height >= island.y &&
          this.player.y + this.player.height <= island.y + 20 &&
          this.player.velocityY >= 0) {
        this.player.y = island.y - this.player.height;
        this.player.velocityY = 0;
        this.player.velocityX = 0;
        this.player.jumping = false;
        this.player.doubleJump = false;
        this.player.onIsland = true;
        break;
      }
    }
    
    if (this.player.y > CONFIG.CANVAS_HEIGHT - 50) {
      return true; // Game over
    }
    
    return false;
  },
  
  updateIslands() {
    this.islandTimer++;
    if (this.islandTimer > CONFIG.ISLAND.spawnInterval) {
      this.createIsland();
      this.createCoins();
      this.islandTimer = 0;
    }
    
    const settings = CONFIG.DIFFICULTY[this.difficulty];
    
    for (let i = this.islands.length - 1; i >= 0; i--) {
      this.islands[i].x -= this.gameSpeed;
      
      if (this.islands[i].x + this.islands[i].width < 0) {
        this.islands.splice(i, 1);
        this.score++;
        if (this.score % settings.speedIncreaseInterval === 0) {
          this.gameSpeed += settings.speedIncrease;
        }
      }
    }
  },
  
  updateCoins() {
    for (let i = this.coins.length - 1; i >= 0; i--) {
      this.coins[i].x -= this.gameSpeed;
      this.coins[i].rotation += 0.08;
      
      if (!this.coins[i].collected) {
        const dx = (this.player.x + this.player.width / 2) - this.coins[i].x;
        const dy = (this.player.y + this.player.height / 2) - this.coins[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.coins[i].radius + 20) {
          this.coins[i].collected = true;
          this.coinsCollected++;
        }
      }
      
      if (this.coins[i].x < -20) {
        this.coins.splice(i, 1);
      }
    }
  },
  
  loop() {
    if (this.state !== 'playing') return;
    
    Renderer.clear();
    Renderer.drawOcean(this.gameSpeed);
    Renderer.drawIslands(this.islands);
    Renderer.drawCoins(this.coins);
    
    const gameOver = this.updatePlayer();
    this.updateIslands();
    this.updateCoins();
    
    Renderer.drawPlayer(this.player);
    Renderer.drawDifficultyBadge(this.difficulty);
    Renderer.drawScore(this.coinsCollected);
    
    if (gameOver) {
      this.gameOver();
      return;
    }
    
    requestAnimationFrame(() => this.loop());
  },
  
  gameOver() {
    this.state = 'gameover';
    if (this.coinsCollected > this.highScore) {
      this.highScore = this.coinsCollected;
      localStorage.setItem('dangerDashHighScore', this.highScore);
    }
    UI.showGameOver(this.coinsCollected, this.score, this.highScore);
  },
  
  restart() {
    this.start(this.difficulty);
  },
  
  pause() {
    if (this.state === 'playing') {
      this.state = 'paused';
      Renderer.drawPauseOverlay();
      document.getElementById('pauseBtn').textContent = 'RESUME';
    }
  },
  
  resume() {
    if (this.state === 'paused') {
      this.state = 'playing';
      document.getElementById('pauseBtn').textContent = 'PAUSE';
      this.loop();
    }
  },
  
  setupControls() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (this.state === 'playing') this.jump();
      }
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (this.state === 'playing') this.pause();
        else if (this.state === 'paused') this.resume();
      }
    });
    
    Renderer.canvas.addEventListener('click', () => {
      if (this.state === 'playing') this.jump();
    });
    
    Renderer.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (this.state === 'playing') this.jump();
    });
  }
};

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
  Game.init();
});
