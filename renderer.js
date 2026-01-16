// Rendering functions for game graphics
const Renderer = {
  canvas: null,
  ctx: null,
  waves: [],

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    // Make canvas responsive
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    // Initialize waves for ocean effect
    for (let i = 0; i < 20; i++) {
      this.waves.push({
        x: i * 50,
        offset: Math.random() * Math.PI * 2,
        speed: 0.05 + Math.random() * 0.05,
      });
    }
  },

  resizeCanvas() {
    const container = this.canvas.parentElement;
    const containerWidth = container.offsetWidth;

    // On mobile, make canvas much bigger and fill most of the screen
    if (window.innerWidth <= 768) {
      const maxWidth = Math.min(containerWidth - 20, window.innerWidth - 20);
      const height = Math.min(window.innerHeight * 0.55, maxWidth * 0.7); // Much taller on mobile
      this.canvas.style.width = maxWidth + "px";
      this.canvas.style.height = height + "px";
    } else {
      this.canvas.style.width = "800px";
      this.canvas.style.height = "400px";
    }
  },

  drawOcean(gameSpeed) {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(0.5, "#4A90E2");
    gradient.addColorStop(1, "#2E5C8A");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Animated waves
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    for (let wave of this.waves) {
      wave.x -= gameSpeed * 0.3;
      if (wave.x < -50) wave.x = this.canvas.width;

      this.ctx.beginPath();
      for (let x = 0; x < 60; x += 2) {
        const y =
          this.canvas.height -
          40 +
          Math.sin((wave.x + x) * 0.05 + wave.offset) * 8;
        if (x === 0) this.ctx.moveTo(wave.x + x, y);
        else this.ctx.lineTo(wave.x + x, y);
      }
      this.ctx.lineTo(wave.x + 60, this.canvas.height);
      this.ctx.lineTo(wave.x, this.canvas.height);
      this.ctx.fill();

      wave.offset += wave.speed;
    }
  },

  drawPlayer(player) {
    const ctx = this.ctx;
    const time = Date.now() * 0.025; // Faster animation speed (was 0.015)

    // Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.ellipse(player.x + 15, player.y + 48, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Running animation - only when on ground
    const legCycle = player.onIsland ? Math.sin(time) : 0;
    const armCycle = player.onIsland ? Math.cos(time) : 0;

    // When in air, use fixed pose
    const legRotation = player.onIsland ? legCycle * 0.5 : 0.2; // Increased from 0.4 to 0.5
    const armRotation = player.onIsland ? armCycle * 0.6 : -0.3; // Increased from 0.5 to 0.6

    // BACK LEG
    ctx.save();
    ctx.translate(player.x + 15, player.y + 28);
    ctx.rotate(legRotation);
    ctx.fillStyle = "#2980b9";
    ctx.fillRect(-3, 0, 6, 14);
    ctx.fillStyle = "#1a5276";
    ctx.fillRect(-3, 14, 6, 4);
    // Shoe
    ctx.fillStyle = "#000";
    ctx.fillRect(-4, 18, 8, 4);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-4, 18, 8, 2);
    ctx.restore();

    // BACK ARM
    ctx.save();
    ctx.translate(player.x + 12, player.y + 15);
    ctx.rotate(-armRotation);
    ctx.fillStyle = "#e67e22";
    ctx.fillRect(-2, 0, 4, 12);
    // Hand
    ctx.fillStyle = "#d4a574";
    ctx.beginPath();
    ctx.arc(0, 12, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // BODY
    // Torso
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(player.x + 8, player.y + 10, 14, 18);
    // Belt
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(player.x + 8, player.y + 24, 14, 3);
    // Shirt details
    ctx.fillStyle = "#c0392b";
    ctx.fillRect(player.x + 14, player.y + 10, 2, 14);

    // FRONT LEG
    ctx.save();
    ctx.translate(player.x + 15, player.y + 28);
    ctx.rotate(-legRotation);
    ctx.fillStyle = "#3498db";
    ctx.fillRect(-3, 0, 6, 14);
    ctx.fillStyle = "#2471a3";
    ctx.fillRect(-3, 14, 6, 4);
    // Shoe
    ctx.fillStyle = "#000";
    ctx.fillRect(-4, 18, 8, 4);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-4, 18, 8, 2);
    ctx.restore();

    // NECK
    ctx.fillStyle = "#d4a574";
    ctx.fillRect(player.x + 13, player.y + 8, 4, 4);

    // HEAD
    // Face
    ctx.fillStyle = "#f5cba7";
    ctx.beginPath();
    ctx.arc(player.x + 20, player.y + 5, 8, 0, Math.PI * 2);
    ctx.fill();

    // Ear
    ctx.fillStyle = "#e6b896";
    ctx.beginPath();
    ctx.arc(player.x + 13, player.y + 6, 3, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = "#2c3e50";
    ctx.beginPath();
    ctx.arc(player.x + 20, player.y + 0, 9, 0, Math.PI);
    ctx.fill();
    ctx.fillRect(player.x + 11, player.y - 2, 18, 4);
    // Hair spike
    ctx.beginPath();
    ctx.moveTo(player.x + 24, player.y - 2);
    ctx.lineTo(player.x + 28, player.y - 6);
    ctx.lineTo(player.x + 26, player.y - 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "#fff";
    ctx.fillRect(player.x + 22, player.y + 4, 5, 4);
    ctx.fillStyle = "#000";
    ctx.fillRect(player.x + 24, player.y + 5, 2, 2);
    // Eye shine
    ctx.fillStyle = "#fff";
    ctx.fillRect(player.x + 25, player.y + 5, 1, 1);

    // Eyebrow
    ctx.fillStyle = "#1a252f";
    ctx.fillRect(player.x + 22, player.y + 2, 5, 1);

    // Nose
    ctx.fillStyle = "#d4a574";
    ctx.fillRect(player.x + 27, player.y + 6, 2, 3);

    // Mouth - determined expression
    ctx.fillStyle = "#000";
    ctx.fillRect(player.x + 24, player.y + 10, 4, 1);

    // FRONT ARM
    ctx.save();
    ctx.translate(player.x + 18, player.y + 15);
    ctx.rotate(armRotation);
    ctx.fillStyle = "#e67e22";
    ctx.fillRect(-2, 0, 4, 12);
    // Hand
    ctx.fillStyle = "#d4a574";
    ctx.beginPath();
    ctx.arc(0, 12, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // CAPE (when jumping)
    if (!player.onIsland) {
      ctx.fillStyle = "rgba(231, 76, 60, 0.8)";
      ctx.beginPath();
      ctx.moveTo(player.x + 10, player.y + 12);
      const capeWave = Math.sin(time * 2) * 3;
      ctx.quadraticCurveTo(
        player.x - 8,
        player.y + 20 + capeWave,
        player.x - 5,
        player.y + 35
      );
      ctx.lineTo(player.x + 5, player.y + 32);
      ctx.quadraticCurveTo(
        player.x + 8,
        player.y + 20,
        player.x + 10,
        player.y + 12
      );
      ctx.fill();

      // Cape highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.moveTo(player.x + 10, player.y + 12);
      ctx.quadraticCurveTo(
        player.x - 5,
        player.y + 18,
        player.x - 3,
        player.y + 25
      );
      ctx.lineTo(player.x + 3, player.y + 23);
      ctx.quadraticCurveTo(
        player.x + 8,
        player.y + 16,
        player.x + 10,
        player.y + 12
      );
      ctx.fill();
    }
  },

  drawIslands(islands) {
    for (let island of islands) {
      // Island top (sand/grass)
      const gradient = this.ctx.createLinearGradient(
        0,
        island.y,
        0,
        island.y + 20
      );
      gradient.addColorStop(0, "#F4D03F");
      gradient.addColorStop(1, "#D4AF37");
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(island.x, island.y, island.width, 20);

      // Island body (rock going into water)
      const rockGradient = this.ctx.createLinearGradient(
        0,
        island.y + 20,
        0,
        this.canvas.height
      );
      rockGradient.addColorStop(0, "#8B7355");
      rockGradient.addColorStop(0.5, "#6B5345");
      rockGradient.addColorStop(1, "#4A3C2F");
      this.ctx.fillStyle = rockGradient;
      this.ctx.fillRect(
        island.x,
        island.y + 20,
        island.width,
        island.height - 20
      );

      // Add some texture/cracks
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      for (let i = 0; i < 8; i++) {
        const x = island.x + Math.random() * island.width;
        const y =
          island.y + 30 + Math.random() * Math.min(island.height - 40, 60);
        this.ctx.fillRect(x, y, 3, 15);
      }

      // Add some grass tufts on top
      this.ctx.fillStyle = "#2ECC71";
      for (let i = 0; i < island.width / 40; i++) {
        const x = island.x + 20 + i * 40;
        if (x > island.x + 5 && x < island.x + island.width - 10) {
          this.ctx.fillRect(x, island.y - 5, 3, 8);
          this.ctx.fillRect(x - 3, island.y - 3, 3, 6);
          this.ctx.fillRect(x + 3, island.y - 3, 3, 6);
        }
      }
    }
  },

  drawCoins(coins) {
    for (let coin of coins) {
      if (coin.collected) continue;

      this.ctx.save();
      this.ctx.translate(coin.x, coin.y);
      this.ctx.rotate(coin.rotation);

      // Coin
      this.ctx.fillStyle = "#FFD700";
      this.ctx.beginPath();
      this.ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Coin shine
      this.ctx.fillStyle = "#FFF59D";
      this.ctx.beginPath();
      this.ctx.arc(-3, -3, 3, 0, Math.PI * 2);
      this.ctx.fill();

      // Coin border
      this.ctx.strokeStyle = "#FFA000";
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
      this.ctx.stroke();

      // Dollar sign
      this.ctx.fillStyle = "#FFA000";
      this.ctx.font = "bold 12px Arial";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText("$", 0, 0);

      this.ctx.restore();
    }
  },

  drawPauseOverlay() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 48px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText("PAUSED", this.canvas.width / 2, this.canvas.height / 2);

    this.ctx.font = "24px Arial";
    this.ctx.fillText(
      "Press RESUME or ESC to continue",
      this.canvas.width / 2,
      this.canvas.height / 2 + 50
    );
  },

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  drawDifficultyBadge(difficulty) {
    const ctx = this.ctx;
    const badges = {
      easy: { color: "#2ecc71", emoji: "😊", text: "EASY" },
      normal: { color: "#f39c12", emoji: "😐", text: "NORMAL" },
      hard: { color: "#e74c3c", emoji: "😈", text: "HARD" },
    };

    const badge = badges[difficulty];

    // Badge background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(10, 10, 120, 40);

    ctx.fillStyle = badge.color;
    ctx.fillRect(12, 12, 116, 36);

    // Badge text
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(badge.text, 50, 33);

    // Emoji
    ctx.font = "24px Arial";
    ctx.fillText(badge.emoji, 20, 36);
  },

  drawScore(coins) {
    const ctx = this.ctx;

    // Score background
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(this.canvas.width - 130, 10, 120, 40);

    ctx.fillStyle = "#FFD700";
    ctx.fillRect(this.canvas.width - 128, 12, 116, 36);

    // Coin icon
    ctx.fillStyle = "#FFA500";
    ctx.beginPath();
    ctx.arc(this.canvas.width - 105, 30, 12, 0, Math.PI * 2);
    ctx.fill();

    // Coin shine
    ctx.fillStyle = "#FFEB3B";
    ctx.beginPath();
    ctx.arc(this.canvas.width - 108, 27, 4, 0, Math.PI * 2);
    ctx.fill();

    // Dollar sign
    ctx.fillStyle = "#FFA500";
    ctx.font = "bold 16px Arial";
    ctx.textAlign = "center";
    ctx.fillText("$", this.canvas.width - 105, 35);

    // Score text
    ctx.fillStyle = "#000";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(coins.toString(), this.canvas.width - 85, 35);
  },
};
