var canvas = document.getElementById("myCanvas"); // HTML の canvas 要素を参照
var ctx = canvas.getContext("2d"); // canvas API

var ballRadius = 10; // ボールの半径を定義

var x = canvas.width/2;
var y = canvas.height-30;

var dx = (Math.floor( Math.random() * 10 ) + -5); // ボールの x 軸の移動量
var dy = -2; // ボールの y 軸の移動量

// ---!!!--- 自作 ---!!!---
var paddleSpeed = 5; // パドルの速度 → -- !!!! -- → エラー発生時は変数を消去し、使用箇所を 5 に変更すること
// ---!!!--- 自作 ---!!!---

var paddleHeight = 10; // パドルの高さ
var paddleWidth = 75; // パドルの幅
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5; // ブロック群の行数 default → 5
var brickColumnCount = 5; // ブロック群の列数 default → 3
var brickWidth = 75; // ブロックの幅
var brickHeight = 20; // ブロックの高さ
var brickPadding = 10; // ブロック間の距離
var brickOffsetTop = 30; // ブロック群とキャンバス上部枠との距離
var brickOffsetLeft = 30; // ブロック群のキャンバス左部枠との距離

var score = 0; // スコア
var lives = 3; // ライフ

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}
function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if(score == brickRowCount*brickColumnCount) {
            alert("YOU WIN, CONGRATS!"); // アラート "YOU WIN, CONGRATS"
            document.location.reload(); // ページを再読み込み
          }
        }
      }
    }
  }
}

function drawBall() { // ボールを描画
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2); // ボールのサイズを指定
  ctx.fillStyle = "#0095DD"; // 塗り潰しスタイルを指定
  ctx.fill(); // 塗り潰し
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight); // パドルのサイズを指定
  ctx.fillStyle = "#0095DD"; // 塗り潰しスタイルを指定
  ctx.fill(); // 塗り潰し
  ctx.closePath();
}

function drawBricks() { // ブロックを描画
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() { // スコアを描画
  ctx.font = "16px Arial"; // フォントを指定
  ctx.fillStyle = "#0095DD"; // 文字の塗り潰しスタイルを指定
  ctx.fillText("Score: "+score, 8, 20); // スコアを描画
}

function drawLives() { // ライフを描画
  ctx.font = "16px Arial"; // フォントを指定
  ctx.fillStyle = "#0095DD"; // 文字の塗り潰しスタイルを指定
  ctx.fillText("Lives: "+lives, canvas.width-65, 20); // ライフを描画
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 描画前に canvas をクリアする
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

   // ボールの中心と辺の距離がボールの半径とちょうど等しくなったときに動く向きを変える。半径を辺の長さから引き、もう一方では足すことで衝突検出が正しく行われたような挙動にする
  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) { // 左右の衝突判定
    dx = -dx;
  }
  if(y + dy < ballRadius) { // 上下の衝突判定
    dy = -dy;
  }
  else if(y + dy > canvas.height-ballRadius) { // 下部に触れていたら
    if(x > paddleX && x < paddleX + paddleWidth) { // パドルに触れていたら
      dy = -dy;
    }
    else { // でなければ（下部に触れていて、パドルに触れていなければ）
      lives--;
      if(!lives) {
        alert("GAME OVER"); // GAME OVER を通知する
        document.location.reload(); // ページを再読み込み
      }
      else { // でなければ
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += paddleSpeed; // paddleSpeed ずつパドルを動かす
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed; // paddleSpeed ずつパドルを動かす
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw); // draw() 関数が何度も繰り返し呼び出されるようにする
}

draw(); // draw() 関数を呼び出す
