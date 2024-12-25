let sprites = {
    player1: {
      idle: { img: null, width: 82.4, height: 71, frames: 9 },
      walk: { img: null, width: 77.4, height: 72, frames: 9 },
      jump: { img: null, width: 94.375, height: 79, frames: 8 }
    },
    player2: {
      idle: { img: null, width: 94.375, height: 86, frames: 8 },
      walk: { img: null, width: 92.55, height: 73, frames: 11 },
      jump: { img: null, width: 88.4, height: 88, frames: 10 }
    }
  };
  
  let player1 = {
    x: 200,
    y: 200,
    speedX: 20,      // 水平移動速度
    speedY: 15,      // 垂直速度
    gravity: 1,   // 重力
    jumpForce: -10, // 跳躍力道
    isJumping: false,
    groundY: 300,   // 地面位置
    currentFrame: 0,
    currentAction: 'idle',
    direction: -1    // 1 表示向右，-1 表示向左
  };
  
  let player2 = {
    x: 1500,
    y: 200,
    speedX: 20,      // 水平移動速度
    speedY: 15,      // 垂直速度
    gravity: 1,   // 重力
    jumpForce: -10, // 跳躍力道
    isJumping: false,
    groundY: 300,   // 地面位置
    currentFrame: 0,
    currentAction: 'idle',
    direction: 1    // 1 表示向右，-1 表示向左
  };
  
  let backgroundImg;
  
  function preload() {
    // 載入背景圖片
    backgroundImg = loadImage('assets/background.png');  // 請替換成你的背景圖片路徑
  
    // 載入 Player 1 的精靈圖
    sprites.player1.idle.img = loadImage('assets/player1_idle.png');
    sprites.player1.walk.img = loadImage('assets/player1_walk.png');
    sprites.player1.jump.img = loadImage('assets/player1_jump.png');
  
    // 載入 Player 2 的精靈圖
    sprites.player2.idle.img = loadImage('assets/player2_idle.png');
    sprites.player2.walk.img = loadImage('assets/player2_walk.png');
    sprites.player2.jump.img = loadImage('assets/player2_jump.png');
  }
  
  function setup() {
    createCanvas(windowWidth, windowHeight);
    imageMode(CENTER)
    frameRate(8); // 設定動畫速度
  }
  
  function draw() {
    // 繪製背景
    image(backgroundImg, width/2, height/2, width, height);
  
    // 設定文字樣式
    textSize(32);  // 設定文字大小
    textAlign(CENTER, CENTER);  // 文字置中對齊
    fill(255);  // 文字顏色（白色）
    stroke(0);  // 文字邊框顏色（黑色）
    strokeWeight(2);  // 文字邊框粗細
    
    // 繪製文字
    text('淡江教科*AI', width/2, 50);  // 在畫面上方中間位置顯示文字
  
    // 處理物理運動
    updatePhysics(player1);
    updatePhysics(player2);
  
    // 檢查按鍵
    checkKeys();
  
    // 繪製角色
    drawCharacter(player1, sprites.player1);
    drawCharacter(player2, sprites.player2);
  }
  
  function drawCharacter(character, characterSprites) {
    // 取得當前動作的精靈資訊
    let currentSprite = characterSprites[character.currentAction];
    
    // 確保精靈圖已經載入
    if (!currentSprite || !currentSprite.img) {
      console.error('Sprite not loaded:', character.currentAction);
      return;
    }
  
    // 更新當前幀
    character.currentFrame = (character.currentFrame + 1) % currentSprite.frames;
  
    // 計算精靈圖的位置
    let sx = character.currentFrame * currentSprite.width;
  
    // 設定放大倍數（例如：2倍大小）
    let scale_factor = 2;  // 你可以調整這個數值來改變大小
  
    // 根據方向繪製精靈圖
    push();
    translate(character.x + (character.direction === -1 ? currentSprite.width * scale_factor : 0), character.y);
    scale(character.direction * scale_factor, scale_factor);  // 修改這裡，加入縮放因子
    image(currentSprite.img,
      0, 0,                                     // 畫布上的位置
      currentSprite.width, currentSprite.height, // 顯示的大小
      sx, 0,                                    // 精靈圖的起始位置
      currentSprite.width, currentSprite.height  // 精靈圖的裁切大小
    );
    pop();
  }
  
  function updatePhysics(character) {
    // 應用重力
    if (character.y < character.groundY) {
      character.speedY += character.gravity;
      character.isJumping = true;
    }
  
    // 更新垂直位置
    character.y += character.speedY;
  
    // 檢查是否著地
    if (character.y >= character.groundY) {
      character.y = character.groundY;
      character.speedY = 0;
      character.isJumping = false;
    }
  }
  
  function checkKeys() {
    // Player 1 控制
    if (keyIsDown(68)) { // A鍵
      player1.x += player1.speedX;
      player1.currentAction = 'walk';
      player1.direction = -1;
    } else if (keyIsDown(65)) { // D鍵
      player1.x -= player1.speedX;
      player1.currentAction = 'walk';
      player1.direction = 1;
    } else if (!player1.isJumping) {
      player1.currentAction = 'idle';
    }
  
    if (keyIsDown(87) && !player1.isJumping) { // W鍵
      player1.speedY = player1.jumpForce;
      player1.isJumping = true;
      player1.currentAction = 'jump';
    }
  
    // Player 2 控制
    if (keyIsDown(RIGHT_ARROW)) {
      player2.x += player2.speedX;
      player2.currentAction = 'walk';
      player2.direction = -1;
    } else if (keyIsDown(LEFT_ARROW)) {
      player2.x -= player2.speedX;
      player2.currentAction = 'walk';
      player2.direction = 1;
    } else if (!player2.isJumping) {
      player2.currentAction = 'idle';
    }
  
    // 跳躍控制
    if (keyIsDown(UP_ARROW) && !player2.isJumping) {
      player2.speedY = player2.jumpForce;
      player2.isJumping = true;
      player2.currentAction = 'jump';
    }
  
    // 如果正在跳躍中，保持跳躍動作（分別檢查兩個玩家）
    if (player1.isJumping) {
      player1.currentAction = 'jump';
    }
    if (player2.isJumping) {
      player2.currentAction = 'jump';
    }
  } 
    