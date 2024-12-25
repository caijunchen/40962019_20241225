// ===== 角色設定 =====
let sprites = {
  player1: {
    idle: { img: null, width: 82.4, height: 71, frames: 9 }, // 閒置動作
    walk: { img: null, width: 77.4, height: 72, frames: 9 }, // 行走動作
    jump: { img: null, width: 94.375, height: 79, frames: 8 } // 跳躍動作 
  },
  player2: {
    idle: { img: null, width: 94.375, height: 86, frames: 8 }, 
    walk: { img: null, width: 92.55, height: 73, frames: 11 }, 
    jump: { img: null, width: 88.4, height: 88, frames: 10 } 
  }
};

let projectiles = []; // 存放所有發射物件
const PROJECTILE_SPEED = 100; // 發射物體速度

//設定兩個角色的基本資料
let player1 = {
  x: 300,
  y: 800,
  speedX: 20,      // 水平移動速度
  speedY: 15,      // 垂直速度
  gravity: 15,   // 重力
  jumpForce: -50, // 跳躍力道
  isJumping: false, // 是否跳躍
  groundY: 800,   // 地面位置
  currentFrame: 0, // 當前幀數
  currentAction: 'idle', // 當前動作
  direction: -1,    // 1 表示向右，-1 表示向左
  health: 100, // 生命值
  projectiles: [], // 該玩家發射的物件
  lastShootTime: 0, // 上次發射時間
  shootCooldown: 500 // 發射冷卻時間（毫秒）
};

let player2 = {
  x: 2000,
  y: 800,
  speedX: 20, 
  speedY: 15, 
  gravity: 15,
  jumpForce: -50, 
  isJumping: false, 
  groundY: 800,
  currentFrame: 0,
  currentAction: 'idle', 
  direction: 1, 
  health: 100, 
  projectiles: [], 
  lastShootTime: 0, 
  shootCooldown: 500 
};

let backgroundImg; // 背景圖片
let gameOver = false; // 遊戲是否結束
let restartButton; // 重新開始按鈕

// ===== 畫圖的內容 =====
function preload() {
  // 載入背景圖片
  backgroundImg = loadImage('assets/background.png');  // 請替換成你的背景圖片路徑

  // 載入 Player 1 的精靈圖
  sprites.player1.idle.img = loadImage('assets/player1_idle.png');  // 閒置動作
  sprites.player1.walk.img = loadImage('assets/player1_walk.png');  // 行走動作
  sprites.player1.jump.img = loadImage('assets/player1_jump.png');  // 跳躍動作

  // 載入 Player 2 的精靈圖
  sprites.player2.idle.img = loadImage('assets/player2_idle.png');
  sprites.player2.walk.img = loadImage('assets/player2_walk.png');
  sprites.player2.jump.img = loadImage('assets/player2_jump.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  frameRate(8);
  
  // 設定全域字體
  textFont('Microsoft JhengHei');
  
  // 創建重新開始按鈕（初始時隱藏）
  restartButton = createButton('重新開始'); 
  restartButton.position(width/2 - 100, height/2 + 50); // 設鈕位置
  restartButton.size(200, 80); // 大小
  restartButton.style('font-size', '30px'); // 字體大小
  restartButton.style('font-family', 'Microsoft JhengHei'); // 字體
  restartButton.style('font-weight', 'bold'); // 粗體 
  restartButton.style('border-radius', '10px'); // 圓角
  restartButton.style('background-color', '#4CAF50'); // 顏色
  restartButton.style('color', 'white'); // 文字顏色
  restartButton.style('border', 'none'); // 邊框
  restartButton.style('cursor', 'pointer'); // 滑鼠指標
  restartButton.mousePressed(restartGame); // 按下時執行 restartGame 函式
  restartButton.hide(); // 隱藏
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
  

  // 更新物理
  updatePhysics(player1);
  updatePhysics(player2);
  
  // 檢查按鍵
  checkKeys();
  
  // 更新和繪製發射物件
  updateAndDrawProjectiles();
  
  // 繪製角色
  drawCharacter(player1, sprites.player1); 
  drawCharacter(player2, sprites.player2);
  
  // 繪製生命值
  drawHealthBars(); 

  // 檢查遊戲結束
  if ((player1.health <= 0 || player2.health <= 0) && !gameOver) { // 如果玩家生命值小於等於0且遊戲未結束
    gameOver = true; // 遊戲結束
    textAlign(CENTER, CENTER); // 文字置中對齊
    textSize(64); 
    textStyle(BOLD); 
    noStroke(); 
    if (player1.health <= 0) { // 如果玩家1生命值小於等於0
      fill(0, 0, 255); 
      text('Player 2 勝利!', width/2, height/2);  
    } else { 
      fill(255, 0, 0); 
      text('Player 1 勝利!', width/2, height/2);
    }
    restartButton.show(); // 顯示按鈕
    noLoop(); // 停止循環
  }
}

// ===== 畫各種角色 =====
function drawCharacter(character, characterSprites) { 
  let currentSprite = characterSprites[character.currentAction]; // 取得當前動作的精靈資訊
  
  // 確保精靈圖已經載入
  if (!currentSprite || !currentSprite.img) {  // 如果精靈圖未載入
    console.error('Sprite not loaded:', character.currentAction); // 顯示錯誤訊息
    return; // 返回
  }

  character.currentFrame = (character.currentFrame + 1) % currentSprite.frames;  // 更新當前幀

  let sx = character.currentFrame * currentSprite.width; // 計算精靈圖的位置
  let scale_factor = 4;  // 角色放大倍數

  // 根據方向繪製精靈圖
  push(); 
  translate(character.x + (character.direction === -1 ? currentSprite.width * scale_factor : 0), character.y);
  scale(character.direction * scale_factor, scale_factor);  // 修改這裡，加入縮放因子
  image(
    currentSprite.img, 0, 0, // 畫布上的位置
    currentSprite.width, currentSprite.height,sx, 0, // 精靈圖的裁切大小
    currentSprite.width, currentSprite.height  // 精靈圖的裁切大小
  );
  pop();
}

// ===== 畫出生命值 =====
function drawHealthBars() {
  // Player 1 生命值和操作說明
  fill(255);
  textAlign(LEFT); // 靠左對齊
  text(`Player 1 : ${player1.health}`, 30, 30);
  fill(255, 0, 0);
  rect(30, 60, player1.health, 15);
  
  // Player 1 操作說明
  fill(255);
  textSize(30);
  text('player1', 30, 100);
  text('A:向左', 30, 140);
  text('D:向右', 30, 180);
  text('W:跳躍', 30, 220);
  text('空白鍵:發射子彈', 30, 260);

  // Player 2 生命值和操作說明
  fill(0);
  stroke(255)
  textSize(30);
  textAlign(RIGHT); // 靠右對齊
  text(`Player 2 : ${player2.health}`, width - 30, 30);
  fill(0, 0, 255);
  rect(width - 130, 60, player2.health, 15);
  
  // Player 2 操作說明
  fill(0);
  stroke(255)
  textSize(30);
  text('player2', width - 30, 100);
  text('←鍵:向左', width - 30, 140);
  text('→鍵:向右', width - 30, 180);
  text('↑鍵:跳躍', width - 30, 220);
  text('enter鍵:發射子彈', width - 30, 260);
}

// ===== 跳起來物理現象 =====
function updatePhysics(character) {
  // 應用重力
  if (character.y < character.groundY) {
    character.speedY += character.gravity;
    character.isJumping = true;
  }

  // 更新垂直位置
  character.y += character.speedY;

  // 檢查是否落地
  if (character.y >= character.groundY) {
    character.y = character.groundY;
    character.speedY = 0;
    character.isJumping = false;
  }
}

// ===== 鍵盤控制 =====
function checkKeys() {
  // Player 1 控制
  if (keyIsDown(68)) { // D鍵
    player1.x += player1.speedX;
    player1.currentAction = 'walk';
    player1.direction = -1;
  } else if (keyIsDown(65)) { // A鍵
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

  // Player 1 發射 (空白鍵)
  if (keyIsDown(32)) { // 空白鍵
    shoot(player1);
  }

  // Player 2 發射 (Enter鍵)
  if (keyIsDown(ENTER)) {
    shoot(player2);
  }
}

// ===== 發射子彈 =====
function shoot(player) {
  let currentTime = millis();
  if (currentTime - player.lastShootTime < player.shootCooldown) {
    return; // 如果還在冷卻中，不發射
  }

  player.lastShootTime = currentTime;
  
  let projectile = {
    x: player.x + (player.direction === -1 ? 180 : -50),
    y: player.y + 25,
    speed: PROJECTILE_SPEED * -player.direction,
    size: 20,
    owner: player // 記錄是誰發射的
  };
  
  projectiles.push(projectile);
}

// ===== 畫發射後的子彈　檢查子彈是否擊中 =====
function updateAndDrawProjectiles() {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let p = projectiles[i];
    p.x += p.speed;

    // 檢查是否擊中對手
    let target = p.owner === player1 ? player2 : player1;
    if (checkHit(p, target)) {
      target.health -= 10; // 扣血
      projectiles.splice(i, 1); // 立即移除擊中的子彈
      continue; // 跳過後續的繪製
    }

    // 檢查是否超出畫面
    if (p.x < 0 || p.x > width) {
      projectiles.splice(i, 1);
      continue;
    }

    // 只有未擊中的子彈才會被繪製
    fill(255, 255, 255);
    noStroke();
    circle(p.x, p.y, p.size);
  }
}

// ===== 檢查碰撞 =====
function checkHit(projectile, target) {
  let hitbox = 100; // 增加碰撞箱大小
  return (
    projectile.x > target.x - hitbox &&
    projectile.x < target.x + hitbox &&
    projectile.y > target.y - hitbox &&
    projectile.y < target.y + hitbox
  );
  
  return hit;
}

// ===== 遊戲重置 =====
function restartGame() {
  // 重置玩家狀態
  player1.health = 100;
  player2.health = 100;
  player1.x = 300;
  player2.x = 2000;
  player1.y = player1.groundY;
  player2.y = player2.groundY;
  player1.currentAction = 'idle';
  player2.currentAction = 'idle';
  
  // 清空所有子彈
  projectiles = [];
  
  // 重置遊戲狀態
  gameOver = false;
  restartButton.hide();
  loop(); // 重新開始遊戲循環
} 
  