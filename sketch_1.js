let sprites = {
  idle: {
    img: null,
    width: 94.58,
    height: 178,
    frames: 12
  },
  walk: {
    img: null,
    width: 127.375,
    height: 195,
    frames: 8
  },
  jump: {
    img: null,
    width: 162.17,
    height: 225,
    frames: 6
  }
};

let character = {
  x: 200,
  y: 200,
  currentFrame: 0,
  currentAction: 'idle'
};

function preload() {
  // 載入三個不同的精靈圖
  sprites.idle.img = loadImage('idle.png');
  sprites.walk.img = loadImage('walk.png');
  sprites.jump.img = loadImage('jump.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(12); // 設定動畫速度
}

function draw() {
  background(220);
  
  // 取得當前動作的精靈資訊
  let currentSprite = sprites[character.currentAction];
  
  // 更新當前幀
  character.currentFrame = (character.currentFrame + 1) % currentSprite.frames;
  
  // 計算精靈圖的位置
  let sx = character.currentFrame * currentSprite.width;
  
  // 繪製精靈圖
  image(currentSprite.img, 
    character.x, character.y,                 // 畫布上的位置
    currentSprite.width, currentSprite.height, // 顯示的大小
    sx, 0,                                    // 精靈圖的起始位置
    currentSprite.width, currentSprite.height  // 精靈圖的裁切大小
  );
  
  // 檢查鍵盤輸入
  checkKeys();
}

function checkKeys() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
    character.currentAction = 'walk';
  } else if (keyIsDown(UP_ARROW)) {
    character.currentAction = 'jump';
  } else {
    character.currentAction = 'idle';
  }
}