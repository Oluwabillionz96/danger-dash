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
    startY: 200
  },
  
  DIFFICULTY: {
    easy: {
      startSpeed: 1.8,
      speedIncrease: 0.15,
      speedIncreaseInterval: 10,
      coinFrequency: 25,
      islandGapMin: 50,
      islandGapMax: 80
    },
    normal: {
      startSpeed: 2.2,
      speedIncrease: 0.2,
      speedIncreaseInterval: 8,
      coinFrequency: 30,
      islandGapMin: 60,
      islandGapMax: 100
    },
    hard: {
      startSpeed: 3.0,
      speedIncrease: 0.3,
      speedIncreaseInterval: 5,
      coinFrequency: 40,
      islandGapMin: 70,
      islandGapMax: 120
    }
  },
  
  ISLAND: {
    spawnInterval: 50,
    minY: 290,
    maxY: 330,
    minWidth: 150,
    maxWidth: 220
  }
};
