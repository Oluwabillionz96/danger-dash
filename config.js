// Game configuration and difficulty settings
const CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,

  PLAYER: {
    width: 30,
    height: 40,
    gravity: 0.7,
    jumpPower: -11,
    doubleJumpPower: -13.5,
    startX: 150,
    startY: 200,
  },

  DIFFICULTY: {
    easy: {
      startSpeed: 3.5,
      speedIncrease: 0.2,
      speedIncreaseInterval: 10,
      coinFrequency: 25,
      islandGapMin: 50,
      islandGapMax: 80,
      mobileIslandGapMin: 120,
      mobileIslandGapMax: 180,
    },
    normal: {
      startSpeed: 4,
      speedIncrease: 0.25,
      speedIncreaseInterval: 8,
      coinFrequency: 50,
      islandGapMin: 60,
      islandGapMax: 100,
      mobileIslandGapMin: 150,
      mobileIslandGapMax: 220,
    },
    hard: {
      startSpeed: 4.5,
      speedIncrease: 0.35,
      speedIncreaseInterval: 5,
      coinFrequency: 70,
      islandGapMin: 70,
      islandGapMax: 120,
      mobileIslandGapMin: 180,
      mobileIslandGapMax: 260,
    },
  },

  ISLAND: {
    spawnInterval: 50,
    minY: 290,
    maxY: 330,
    minWidth: 150,
    maxWidth: 220,
    mobileMinWidth: 300,
    mobileMaxWidth: 450,
  },
};
