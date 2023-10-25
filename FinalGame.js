// used when not in codehs
window.onload = function() {
// end

// scale of 1 is best when editing code or debugging in this view
// scale of 2 is best when playing in a new tab
const scale = 2;

const WIDTH = 640 * scale;
const HEIGHT = 360 * scale;
setSize(WIDTH, HEIGHT);
const FONT = " Arial";
const GRAVITY = 0.5 * (WIDTH / 640);
const GROUND_FRICTION = 0.8; // higher the value the less friction there is

Keyboard.ESCAPE = 27;

const sprites = [ // 21 entries
    "https://codehs.com/uploads/5c7ef7f91374eadaf915b8f781167d55", // gun
    "https://codehs.com/uploads/a913a4f50ba52e920048846c61919795", // player
    "https://codehs.com/uploads/dd11913e06749d1fde4b4dea8c4cc44c", // crosshair
    "https://codehs.com/uploads/8971afc6338b10557a0db74090a93aea", // green circle
    "https://codehs.com/uploads/acdc25e13edf8cb0cd586e2334936a8d", // ground
    "https://codehs.com/uploads/5bcb7c07714cd1e15108ed3a42df6ace", // heart
    "https://codehs.com/uploads/01064bb72281e26688d0a60dc61f97ae", // play button
    "https://codehs.com/uploads/ce777f7f57d399cd645f6b8fc06fbdbd", // load button
    "https://codehs.com/uploads/4fcc6a340ce47696d23a1e18799d2193", // alien title screen
    "https://codehs.com/uploads/7bc58dc27dfa4a2e9bb37470af23c267", // arrow
    "placeholder",                                                 // placeholder
    "https://codehs.com/uploads/12f496229e0a8ffe7e1a46b2f77efde0", // new gun shot
    "https://codehs.com/uploads/8551d93eb7ef02c428a969d8b9ac6e8f", // enemy
    "https://codehs.com/uploads/0da8c167f00dd64d871b9ad3639c0f66", // restart button
    "https://codehs.com/uploads/b427adce325e09b32fdab8ebb0f04508", // black and white player
    "https://codehs.com/uploads/992b6840bbf44fbf4e1fb5fcaf8edbc7", // save and quit button
    "https://codehs.com/uploads/75daac548a2e8a9867659985548c7a5f", // menu button
    "https://codehs.com/uploads/c56c6a81b6514b4c06364851ff943af2", // shot alien
    "https://codehs.com/uploads/475ea7265ee4d14e40648a47154995d9", // player hit
    "https://codehs.com/uploads/e023cc952fecb8078efbdc04ca9c023b", // alien gun
    "https://codehs.com/uploads/0a92fb2816df9be098436433f401be66", // powerup collect
    "https://codehs.com/uploads/a30fcde9bc5987b8d8b21c13690346fa", // jump
];

const GameState = {
    Menu:  1,
    Play:  2,
    Dead:  3,
    Pause: 4,
}

const PowerUp = {
    ExtraLife: sprites[5],
}

const PLAYER_X_SPEED = 0.5 * (WIDTH / 640);
const PLAYER_Y_SPEED = 12 * (WIDTH / 640);
const PLAYER_WIDTH = 22 * (WIDTH / 640);
const PLAYER_HEIGHT = 53 * (HEIGHT / 360);
const PLAYER_COOLDOWN = 200;

const ENEMY_HEIGHT = 50 * (WIDTH / 640);
const ENEMY_WIDTH = 20 * (HEIGHT / 360);

const BUTTON_WIDTH = 200 * (WIDTH / 640);
const BUTTON_HEIGHT = 50 * (HEIGHT / 360);

const PLAY_BUTTON_X = WIDTH  / 2 - BUTTON_WIDTH  / 2;
const PLAY_BUTTON_Y = HEIGHT / 2 + BUTTON_HEIGHT;
const PLAY_BUTTON_FONT = BUTTON_HEIGHT / 1.5 * (WIDTH / 1280) + "pt" + FONT;

const LOAD_BUTTON_X = PLAY_BUTTON_X;
const LOAD_BUTTON_Y = PLAY_BUTTON_Y + BUTTON_HEIGHT + 20;

const MENU_BUTTON_Y = LOAD_BUTTON_Y;

const LIFE_ICON_SIZE = 25 * (WIDTH / 640);

const BULLET_RADIUS = 2 * (WIDTH / 640);
const BULLET_COLOR = Color.yellow;
const BULLET_SPEED = 15;
const MAX_BULLET_DISTANCE = WIDTH / 2;

var levels = [];

// ------------------------------------------------------------------------------------------------- OBJECTS
var player = new WebImage(sprites[1]);
    player.setSize(PLAYER_WIDTH, PLAYER_HEIGHT);
    player.setColor("#e3e3e3");
    player.setPosition(-100, -100);

var gun = new WebImage(sprites[0]);
    gun.setSize(50 * (WIDTH / 640), 10 * (HEIGHT / 360));
    // gun.setAnchor({vertical: 0.5, horizontal: 0.5});
    gun.setPosition(-100, -100);

var crosshair = new WebImage(sprites[2]);
    crosshair.setSize(25, 25);
    crosshair.setPosition(-100, -100);

var titleScreen = new WebImage(sprites[8]);
    titleScreen.setSize(800 * (WIDTH / 1240), 400 * (HEIGHT / 720));
    titleScreen.setPosition(WIDTH / 2 - titleScreen.getWidth() / 2, 0);

var arrow = new WebImage(sprites[9]);
    arrow.setSize(360 * (WIDTH / 720), 180 * (HEIGHT / 360));
    arrow.setPosition(WIDTH + 50, HEIGHT + 50);
    add(arrow);

// ----------------------------------------------------------------------------- BUTTONS
var playButton = new WebImage(sprites[6]);
    playButton.setSize(BUTTON_WIDTH, BUTTON_HEIGHT);
    playButton.setPosition(PLAY_BUTTON_X, PLAY_BUTTON_Y);
    playButton.setColor(Color.green);

var loadButton = new WebImage(sprites[7]);
    loadButton.setSize(BUTTON_WIDTH, BUTTON_HEIGHT);
    loadButton.setPosition(LOAD_BUTTON_X, LOAD_BUTTON_Y);
    loadButton.setColor(Color.yellow);

var restartButton = new WebImage(sprites[13]);
    restartButton.setSize(BUTTON_WIDTH, BUTTON_HEIGHT);
    restartButton.setPosition(PLAY_BUTTON_X, PLAY_BUTTON_Y);
    restartButton.setColor(Color.green);
    
var returnToMenuButton = new WebImage(sprites[16]);
    returnToMenuButton.setSize(BUTTON_WIDTH, BUTTON_HEIGHT);
    returnToMenuButton.setPosition(PLAY_BUTTON_X, PLAY_BUTTON_Y + BUTTON_HEIGHT + 10);
    returnToMenuButton.setColor(Color.green);

var menuButton = new WebImage(sprites[15]);
    menuButton.setSize(BUTTON_WIDTH, BUTTON_HEIGHT);
    menuButton.setPosition(
        WIDTH / 2 - menuButton.getWidth() / 2,
        MENU_BUTTON_Y
    );

// ----------------------------------------------------------------------------- TEXT?
var pauseText = new Text("Paused", PLAY_BUTTON_FONT);
    pauseText.setPosition(
        WIDTH / 2 - pauseText.getWidth() / 2,
        HEIGHT / 2 + pauseText.getHeight() / 2
    );

var pauseBack = new Rectangle(pauseText.getWidth() + 8, pauseText.getHeight() + 8);
    pauseBack.setPosition(WIDTH / 2 - pauseBack.getWidth() / 2, HEIGHT / 2 - pauseBack.getHeight() / 2);
    pauseBack.setColor(Color.white);

var scoreText = new Text("High Score: " + score, 40 * (WIDTH / 1280) + "pt" + FONT);
    scoreText.setPosition(WIDTH - scoreText.getWidth(), HEIGHT - 10);
    add(scoreText);


// object lists
var enemies = [];
var grounds = [];
var powerUps = [];
var lifeIcons = [];
var bullets = [];
var enemyBullets = [];

// game variables
var gameState = GameState.Menu;
var speedAdjust;
var level = 1;
var levelAdjust = 0; // used to account for previous levels being deleted
var switchLevel = true;
var lives = 3;
var allowShooting;
var machineGunMode = false;
var allowMachineGunPress = true;
var allowButtonPress = false;
var score = 0;
var allowUnpause;

// io states
var mouseDown = false;
var mouseMoving = false;
var lastMousePos = [];
var mousePos = [];
var keys = {};

// ----------------------------------------------------------------------------- Setup functions and utilities to make it easier to code
function start() {
    mouseMoveMethod(mouseMove);
    mouseDownMethod(mousePressed);
    mouseUpMethod(mouseUp);
    keyDownMethod(keyPressed);
    keyUpMethod(keyNotPressed);
    
    console.log("WASD or Arrows for movement, Space or Up or W for jumping");
    console.log("Move mouse and click to shoot");
    
    menuSetup();
    setTimer(gameLoop, 5);
}

function mouseMove(e) {
    mousePos = [e.getX(), e.getY()];
}

function mousePressed() {
    mouseDown = true;
}

function mouseUp() {
    mouseDown = false;
}

function keyPressed(e) {
    keys[e.keyCode] = true;
}

function keyNotPressed(e) {
    keys[e.keyCode] = false;
}

function getLetter(letter) {
    return Keyboard.letter(letter);
}

function keyDown(letter) {
    return keys[letter];
}

function keyReleased(letter) {
    return !keys[letter];
}

// ------------------------------------------------------------------------------------------------- MAIN GAME LOOP
function gameLoop() {
    switch(gameState) {
        case GameState.Menu:
            menuLoop();
            break;
        
        case GameState.Play:
            playLoop();
            break;
        
        case GameState.Dead:
            deadLoop();
            break;
        
        case GameState.Pause:
            pauseLoop();
            break;
    }
    
    if (lastMousePos == mousePos) {
        mouseMoving = false;
    } else {
        lastMousePos = mousePos;
        mouseMoving = true;
    }
}

// ----------------------------------------------------------------------------- Menu Game State
function menuSetup() {
    add(titleScreen);
    add(playButton);
    add(loadButton);
    
    remove(crosshair);
    
    scoreText.setPosition(WIDTH - scoreText.getWidth(), HEIGHT - 10);
    scoreText.setColor(Color.black);
    
    try {
        if (localStorage.getItem('highScore') == null) {
            localStorage.setItem('highScore', 0);
        }
        scoreText.setText("High Score: " + localStorage.getItem('highScore'));
    } catch (err) {
        localStorage.setItem('highScore', 0);
        scoreText.setText("High Score: " + localStorage.getItem('highScore'));
    }
    scoreText.setPosition(WIDTH - scoreText.getWidth(), HEIGHT - 10);
    
    allowButtonPress = false;
    
    gameState = GameState.Menu;
}

function menuLoop() {
    var x = mousePos[0];
    var y = mousePos[1];
    if (!mouseDown) {
        allowButtonPress = true;
    }
    
    if (playButton.containsPoint(x, y) && mouseDown && allowButtonPress) {
        remove(titleScreen);
        
        remove(playButton);
        // remove(playButtonText);
        remove(loadButton);
        // remove(loadButtonText);
        
        gameSetup(null);
    } else if (loadButton.containsPoint(x, y) && mouseDown && allowButtonPress) {
        remove(titleScreen);
        
        remove(playButton);
        // remove(playButtonText);
        remove(loadButton);
        // remove(loadButtonText);/
        
        try {
            var saveData = JSON.parse(localStorage.getItem('saveData'));
            gameSetup(saveData);
        } catch (err) {
            gameSetup(null);
        }
    }
    
    // cheats to be enabled at the start
    if (keyDown(getLetter('M'))) {
        machineGunMode = true;
    }
}

// ----------------------------------------------------------------------------- Play Game State
// ---------------------------------------------------- Setup
function gameSetup(data) {
    add(player);
    player.setImage(sprites[1]);
    player.setSize(PLAYER_WIDTH, PLAYER_HEIGHT);
    
    levelAdjust = 0;
    switchLevel = false;
    
    mouseDown = false;
    
    for (var i = 0; i < lifeIcons; i++) {
        remove(lifeIcons[i]);
    }
    lifeIcons = [];
    
    try {
        scoreText.setText("High Score:" + localStorage.getItem('highScore'));
    } catch (err) {
        localStorage.setItem('highScore', 0);
        scoreText.setText("High Score:" + localStorage.getItem('highScore'));
    }
    //     lifeIcons.push(life);
    // }
    
    
    if (data == null) {
        levels = [];
        levels.push({
            "ground": [{'x': 0, 'y': HEIGHT - 25 * (WIDTH / 640), 'width': WIDTH, 'height': 25 * (HEIGHT / 360), 'color': Color.green}],
            "background": "#21cdfc"
        });
        randomLevelMaker();
        player.setPosition(100, HEIGHT - 150);
        player.yVelocity = 0;
        player.xVelocity = 0;
        player.deathCooldown = 0;
        level = 0;
        lives = 3;
        score = 0;
        changeLives(0);
    } else {
        levels = data.levelData;
        player.setPosition(data.player.x, data.player.y);
        player.xVelocity = data.player.xV;
        player.yVelocity = data.player.yV;
        player.deathCooldown = 0;
        level = data.level;
        lives = data.lives;
        score = data.score;
        changeLives(0);
        scoreText.setColor(Color.white);
    }
    changeLevel();
    add(gun);
    add(crosshair);
    
    
    gameState = GameState.Play;
}

// ---------------------------------------------------- Loop
function playLoop() {
    if (switchLevel) {
        randomLevelMaker();
        changeLevel();
        switchLevel = false;
    }
    
    groundDetection();
    playerMovement();
    enemyMovement();
    touchingEnemy();
    touchingPowerUp();
    
    shootingCode();
    enemyShooting();
    
    if (lives <= 0) {
        localStorage.removeItem('saveData');
        deadSetup();
    }
    
    scoreText.setText("Score: " + score);
    scoreText.setPosition(WIDTH - scoreText.getWidth(), 40 * (WIDTH / 1280));
    
    if (player.deathCooldown > 0) {
        player.deathCooldown--;
        if (player.deathCooldown == 0) {
            player.setImage(sprites[1]);
            player.setSize(PLAYER_WIDTH, PLAYER_HEIGHT);
        }
    }
    
    if (keyDown(getLetter('U'))) { // saves game
        var saveData = {
            "levelData": levels,
            "level": level,
            "levelAdjust": levelAdjust,
            "player": {'x': player.getX(), 'y': player.getY(), 'xV': player.xVelocity, 'yV': player.yVelocity},
            "score": score,
            "lives": lives
        };
        localStorage.setItem('saveData', JSON.stringify(saveData));
    }
    
    if (keyDown(getLetter('B'))) {
        console.log(player.deathCooldown);
    }
    
    if (keyReleased(Keyboard.ESCAPE)) {
        allowUnpause = true;
    }
    
    if (keyDown(Keyboard.ESCAPE) && allowUnpause) {
        allowUnpause = false;
        pauseSetup();
    }
}

// ---------------------------------------------------- Ground Detection player & enemies
function groundDetection() {
    var groundDetect = false;
    
    var numOfPoints = 4;
    
    for (var i = 0; i < numOfPoints; i++) {
        var obj = getElementAt(player.getX() + (player.getWidth() / (numOfPoints - 1) * i), player.getY() + player.getHeight());
        
        if (obj != null && obj.isGround) {
            groundDetect = true;
            player.setPosition(player.getX(), obj.getY() - player.getHeight());
        }
        
        obj = getElementAt(player.getX() + (player.getWidth() / (numOfPoints - 1) * i), player.getY() - 0);
        
        if (obj != null && obj.isGround) {
            player.yVelocity = 0;
        }
    }
    
    player.touchingGround = groundDetect;
    
    groundDetect = false;
    
    // enemy ground detection
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        groundDetect = false;
        
        numOfPoints = 4;
    
        for (var j = 0; j < numOfPoints; j++) {
            var obj = getElementAt(enemy.getX() + (enemy.getWidth() / (numOfPoints - 1) * j), enemy.getY() + enemy.getHeight());
            
            if (obj != null && obj.isGround) {
                groundDetect = true;
                enemy.setPosition(enemy.getX(), obj.getY() - enemy.getHeight());
            }
        }
        
        enemy.touchingGround = groundDetect;
    }
}

// ---------------------------------------------------- player movement
function playerMovement() {
    playerXMovement();
    playerYMovement();
    
    player.move(player.xVelocity, player.yVelocity);
    
    // if the player falls below the floor, loose life
    if (player.getY() > HEIGHT) {
        changeLives(-1);
        changeLevel();
        player.setPosition(player.getWidth(), HEIGHT - 150);
        player.xVelocity = 0;
        
        var sound = new Sound(200, "triangle");
        sound.playFor(0.1);
    }
    
    // level switching logic
    if (player.getX() + player.getWidth() / 2 > WIDTH) { // player moved passed right side
        switchLevel = true;
        level++;
        score++;
        player.setPosition(player.getWidth() / 2, player.getY());
    } else if (player.getX() + player.getWidth() / 2 < 0) { // platyer moved passed left side
        if (levels[level - 1] != undefined) {
            switchLevel = true;
            level--;
            score--;
            player.setPosition(WIDTH - player.getWidth() / 2, player.getY());
        } else {
            player.setPosition(player.getWidth() / 2, player.getY());
        }
    }
}

// ---------------------------------------------------- x movement
function playerXMovement() {
    player.xVelocity *= GROUND_FRICTION;
    
    if (keyDown(getLetter('A')) || keyDown(Keyboard.LEFT)) {
        player.xVelocity -= PLAYER_X_SPEED;
    } else {
        player.xVelocity += GROUND_FRICTION;
    }
    
    if (keyDown(getLetter('D')) || keyDown(Keyboard.RIGHT)) {
        player.xVelocity += PLAYER_X_SPEED;
    } else {
        player.xVelocity -= GROUND_FRICTION;
    }
}

// ---------------------------------------------------- y movement
function playerYMovement() {
    if (player.touchingGround) {
        player.yVelocity = 0;
    } else {
        player.yVelocity += GRAVITY;
    }
    
    if (
        keyDown(getLetter('W')) ||
        keyDown(Keyboard.SPACE) ||
        keyDown(Keyboard.UP)
    ) {
        if (player.touchingGround) {
            player.yVelocity = -PLAYER_Y_SPEED;
            
            var sound = new Audio(sprites[21]);
                sound.play();
        }
    }
}

// ---------------------------------------------------- enemy movement
function enemyMovement() {
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        
        if (enemy.touchingGround) {
            enemy.yVelocity = 0;
        } else {
            enemy.yVelocity += GRAVITY;
        }
        
        enemy.move(-enemy.speed, enemy.yVelocity);
        
        if (
            enemy.getX() < enemy.platform ||
            enemy.getX() + enemy.getWidth() > enemy.platform + enemy.platformWidth
        ) {
            enemy.speed = -enemy.speed;
        }
    }
}

// ---------------------------------------------------- player touching enemy
function touchingEnemy() {
    var corner1 = getElementAt(
        player.getX() + 1,
        player.getY() + 1
    );
    var corner2 = getElementAt(
        player.getX() + player.getWidth() - 1,
        player.getY() + 1
    );
    var corner3 = getElementAt(
        player.getX() + 1,
        player.getY() + player.getHeight() - 1
    );
    var corner4 = getElementAt(
        player.getX() + player.getWidth() - 1,
        player.getY() + player.getHeight() - 1
    );
    
    if (corner1 != null && corner1.isEnemy) {
        playerEnemyDeath(corner1);
    } else if (corner2 != null && corner2.isEnemy) {
        playerEnemyDeath(corner2);
    } else if (corner3 != null && corner3.isEnemy) {
        playerEnemyDeath(corner3);
    } else if (corner4 != null && corner4.isEnemy) {
        playerEnemyDeath(corner4);
    }
}

// ---------------------------------------------------- player died to enemy
function playerEnemyDeath(obj) {
    if (player.deathCooldown <= 0) {
        // player.setPosition(player.getWidth(), HEIGHT - 150);
        // player.xVelocity = 0;
        changeLives(-1);
        // changeLevel();
        player.deathCooldown = PLAYER_COOLDOWN;
        player.setImage(sprites[14]);
        player.setSize(PLAYER_WIDTH, PLAYER_HEIGHT);
        
        for (var i = 0; i < enemies.length; i++) {
            if (enemies[i] == obj) {
                levels[level].enemy.remove(i);
                enemies.remove(i);
                remove(obj);
            }
        }
        
        var sound = new Sound(200, "triangle");
        sound.playFor(0.1);
    }
}

// ---------------------------------------------------- 
function touchingPowerUp() {
    var corner1 = getElementAt(
        player.getX() + 1,
        player.getY() + 1
    );
    var corner2 = getElementAt(
        player.getX() + player.getWidth() - 1,
        player.getY() + 1
    );
    var corner3 = getElementAt(
        player.getX() + 1,
        player.getY() + player.getHeight() - 1
    );
    var corner4 = getElementAt(
        player.getX() + player.getWidth() - 1,
        player.getY() + player.getHeight() - 1
    );
    var corner5 = getElementAt(
        player.getX() + player.getWidth() / 2,
        player.getY() + player.getHeight() / 2
    );
    
    if (corner1 != null && corner1.isPowerUp) {
        applyPowerUp(corner1);
    } else if (corner2 != null && corner2.isPowerUp) {
        applyPowerUp(corner2);
    } else if (corner3 != null && corner3.isPowerUp) {
        applyPowerUp(corner3);
    } else if (corner4 != null && corner4.isPowerUp) {
        applyPowerUp(corner4);
    } else if (corner5 != null && corner5.isPowerUp) {
        applyPowerUp(corner5);
    }
}

function applyPowerUp(obj) {
    var sound = new Audio(sprites[20]);
        sound.play();
        
    if (obj.filename == PowerUp.Shooter) {
        player.shooting = true;
        add(ar);
        add(crosshair);
    } else if (obj.filename == PowerUp.ExtraLife) {
        changeLives(1);
    }
    
    for (var i = 0; i < powerUps.length; i++) {
        if (obj == powerUps[i]) {
            levels[level].powerup.remove(i);
            powerUps.remove(i);
            remove(obj);
        }
    }
}

function changeLives(amount) {
    lives += amount;
    
    // remove all icons
    for (var i = 0; i < lifeIcons.length; i++) {
        remove(lifeIcons[i]);
    }
    lifeIcons = [];
    
    // add icons
    for (var i = 0; i < lives; i++) {
        var life = new WebImage(sprites[5]);
        life.setSize(LIFE_ICON_SIZE, LIFE_ICON_SIZE);
        life.setPosition(i * (LIFE_ICON_SIZE + 5), 0);
        add(life);
        lifeIcons.push(life);
    }
}

function shootingCode() {
    // machine gun mode cheat, as long as the mouse is down it shoots
    if (keyDown(getLetter('M')) && machineGunMode) {
        machineGunMode = false;
    }
    
    crosshair.setPosition(
        mousePos[0] - crosshair.getWidth() / 2,
        mousePos[1] - crosshair.getHeight() / 2
    );
    
    if (mouseDown && allowShooting) {
        var bullet = new Circle(BULLET_RADIUS);
        bullet.setPosition(
            player.getX() + player.getWidth() / 2,
            player.getY() + player.getHeight() / 2
        );
        bullet.setColor(BULLET_COLOR);
        
        // calculates the direction the bullet should go based on the mouses x, y and the players x, y
        var slope = [
            mousePos[0] - bullet.getX(), // x distance between mouse and bullet
            mousePos[1] - bullet.getY()  // y distance between mouse and bullet
        ];
        var distance = Math.sqrt(slope[0]**2 + slope[1]**2); // distance between mouse and bullet
        // x divided by distance and y divided by distance gives the direction of the bullet
        bullet.speed = [
            slope[0] / distance * BULLET_SPEED,
            slope[1] / distance * BULLET_SPEED
        ];
        bullet.isBullet = true;
        bullet.isEnemyBullet = false;
        bullet.startX = bullet.getX();
        bullet.startY = bullet.getY();
        bullet.slope = slope;
        
        add(bullet);
        bullets.push(bullet);
        
        var sound = new Audio(sprites[11]);
        sound.play();
        
        if (!machineGunMode) {
            allowShooting = false;
        }
    }
    if (!mouseDown) {
        allowShooting = true;
    }
    
    gun.setPosition(
        player.getX() + player.getWidth() / 4,
        player.getY() + player.getHeight() / 2
    );
    
    // rotation is in radians
    gun.setRotation(
        Math.atan2(
            mousePos[1] - gun.getY(),
            mousePos[0] - gun.getX()
        ),
        1
    );
    
    // bullet updating
    updatePlayerBullets();
}

function updatePlayerBullets() {
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        bullet.move(bullet.speed[0], bullet.speed[1]);
        
        if (
            bullet.getX() < 0 ||
            bullet.getX() > WIDTH ||
            bullet.getY() < 0 ||
            bullet.getY() > HEIGHT
        ) {
            remove(bullet);
            bullets.remove(i);
            continue;
        }
        
        var distanceTraveled = Math.sqrt((bullet.getX() - bullet.startX)**2 + (bullet.getY() - bullet.startY)**2);
        if (distanceTraveled >= MAX_BULLET_DISTANCE) {
            remove(bullet);
            bullets.remove(i);
            continue;
        }
        
        for (var j = 0; j < enemies.length; j++) {
            var enemy = enemies[j];
            
            if (
                bullet.getX() > enemy.getX() &&
                bullet.getX() < enemy.getX() + enemy.getWidth() &&
                bullet.getY() > enemy.getY() &&
                bullet.getY() < enemy.getY() + enemy.getHeight()
            ) {
                remove(enemy);
                enemies.remove(j);
                levels[level].enemy.remove(j);
                var sound = new Audio(sprites[17]);
                sound.play();
                
                remove(bullet);
                bullets.remove(i);
                continue;
                
                j--;
                score++;
            }
        }
    }
}

function enemyShooting() {
    for (var i = 0; i < enemies.length; i++) {
        if (Randomizer.nextInt(1, 175) == 1 && level >= 5) {
            var bullet = new Circle(BULLET_RADIUS);
            var enemy = enemies[i];
            bullet.setPosition(
                enemy.getX(),
                enemy.getY() + enemy.getHeight() / 2
            );
            bullet.setColor(BULLET_COLOR);
            
            // calculates the direction the bullet should go based on the mouses x, y and the players x, y
            var slope = [
                (player.getX() + player.getWidth() / 2) - bullet.getX(), // x distance between mouse and bullet
                (player.getY() + player.getHeight() / 2) - bullet.getY()  // y distance between mouse and bullet
            ];
            var distance = Math.sqrt(slope[0]**2 + slope[1]**2); // distance between mouse and bullet
            // x divided by distance and y divided by distance gives the direction of the bullet
            bullet.speed = [
                slope[0] / distance * (BULLET_SPEED - 10),
                slope[1] / distance * (BULLET_SPEED - 10)
            ];
            bullet.isBullet = true;
            bullet.isEnemyBullet = true;
            bullet.startX = bullet.getX();
            bullet.startY = bullet.getY();
            bullet.slope = slope;
            
            add(bullet);
            enemyBullets.push(bullet);
            
            var sound = new Audio(sprites[19]);
            sound.play();
        }
    }
    
    // bullet updating
    updateEnemyBullets();
}

function updateEnemyBullets() {
    for (var i = 0; i < enemyBullets.length; i++) {
        var bullet = enemyBullets[i];
        bullet.move(bullet.speed[0], bullet.speed[1]);
        
        if (
            bullet.getX() < 0 ||
            bullet.getX() > WIDTH ||
            bullet.getY() < 0 ||
            bullet.getY() > HEIGHT
        ) {
            remove(bullet);
            enemyBullets.remove(i);
            continue;
        }
        
        var distanceTraveled = Math.sqrt((bullet.getX() - bullet.startX)**2 + (bullet.getY() - bullet.startY)**2);
        if (distanceTraveled >= MAX_BULLET_DISTANCE) {
            remove(bullet);
            enemyBullets.remove(i);
            continue;
        }
        
        if (player.containsPoint(bullet.getX(), bullet.getY())) {
            if (player.deathCooldown <= 0) {
                // player.setPosition(player.getWidth(), HEIGHT - 150);
                // player.xVelocity = 0;
                changeLives(-1);
                // changeLevel();
                player.deathCooldown = PLAYER_COOLDOWN;
                player.setImage(sprites[14]);
                player.setSize(PLAYER_WIDTH, PLAYER_HEIGHT);
                
                var sound = new Audio(sprites[18]);
                sound.play();
            }
            
            remove(bullet);
            bullets.remove(i);
            continue;
        }
    }
}

function changeLevel() {
    // removes all level components
    for (var i = 0; i < grounds.length; i++) {
        remove(grounds[i]);
    }
    grounds = [];
    for (var i = 0; i < enemies.length; i++) {
        remove(enemies[i]);
    }
    enemies = [];
    for (var i = 0; i < powerUps.length; i++) {
        remove(powerUps[i]);
    }
    powerUps = [];
    for (var i = 0; i < bullets.length; i++) {
        remove(bullets[i]);
    }
    bullets = [];
    
    
    var currentLevel = levels[level];
    
    setBackgroundColor(currentLevel.background);
    
    if (currentLevel.enemy != undefined) {
        for (var i = 0; i < currentLevel.enemy.length; i++) {
            var levelEnemy = currentLevel.enemy[i];
            var enemy = new WebImage(sprites[12]);
            enemy.setSize(ENEMY_WIDTH, ENEMY_HEIGHT);
            enemy.setPosition(levelEnemy.x, levelEnemy.y);
            enemy.setColor(Color.red);
            enemy.isEnemy = true;
            enemy.isGround = false;
            enemy.isPowerIp = false;
            enemy.speed = levelEnemy.speed;
            enemy.platform = levelEnemy.platform;
            enemy.platformWidth = levelEnemy.platformWidth;
            enemy.yVelocity = 0;
            enemies.push(enemy);
            add(enemy);
        }
    }
    
    if (currentLevel.powerup != undefined) {
        for (var i = 0; i < currentLevel.powerup.length; i++) {
            var levelPowerUp = currentLevel.powerup[i];
            var powerUp = new WebImage(levelPowerUp.type);
            if (levelPowerUp.type == PowerUp.ExtraLife) {
                powerUp.setSize(30, 30);
            }
            powerUp.setPosition(levelPowerUp.x, levelPowerUp.y);
            // powerUp.setColor(levelPowerUp.type);
            powerUp.isPowerUp = true;
            powerUp.isGround = false;
            powerUp.isEnemy = false;
            powerUps.push(powerUp);
            add(powerUp);
        }
    }
    
    for (var i = 0; i < currentLevel.ground.length; i++) {
        var levelGround = currentLevel.ground[i];
        
        if (levelGround.platform) {
            var ground = new Rectangle(levelGround.width, levelGround.height);
        } else {
            var ground = new WebImage(sprites[4]);
            ground.setSize(levelGround.width, levelGround.height);
        }
        ground.setPosition(levelGround.x, levelGround.y);
        ground.setColor(levelGround.color);
        ground.isGround = true;
        ground.isEnemy = false;
        ground.isPowerUp = false;
        grounds.push(ground);
        add(ground);
    }
    
    if (level == 0) {
        arrow.setPosition(WIDTH / 2 - arrow.getWidth() / 2, HEIGHT / 2 - arrow.getHeight() / 2);
        scoreText.setColor(Color.black);
    }
    if (level == 1) {
        arrow.setPosition(WIDTH + 50, HEIGHT + 50);
        scoreText.setColor(Color.white);
    }
}

function randomLevelMaker() {
    var currentLevel = {};
    
    var groundColor = Color.green; // Randomizer.nextColor();
    var groundAmount = Randomizer.nextInt(1, 5);
    // change this to work for any amount of ground pieces
    
    var groundData = [];
    for (var i = 0; i < groundAmount; i++) {
        var groundPiece = {
            'x': (WIDTH / (groundAmount * 2 - 1)) * i * 2,
            'y': HEIGHT - (25 * (WIDTH / 640)),
            'width': WIDTH / (groundAmount * 2 - 1),
            'height': 25 * (HEIGHT / 360),
            'platform': false,
            'color': groundColor
        };
        groundData.push(groundPiece);
    }
    
    var havePowerUp = Randomizer.nextInt(1, 10) > 8;
    var powerUpPosition = Randomizer.nextInt(1, 3);
    var powerUpType = Randomizer.nextInt(2, 2);
    
    if (powerUpType == 1) {
        powerUpType = PowerUp.Shooter;
    } else if (powerUpType == 2) {
        powerUpType = PowerUp.ExtraLife;
    }
    
    var enemyCount = Randomizer.nextInt(1, 3);
    
    var platformColor = Color.gray; // Randomizer.nextColor();
    var platformAmount = Randomizer.nextInt(1, 3);
    var platformSizes = [];
    for (var i = 0; i < platformAmount; i++) {
        var size = Randomizer.nextInt(1, 4);
        platformSizes.push(size * 25);
    }
    
    
    // ground objects
    currentLevel.ground = groundData;
    // platforms, still ground objects
    for (var i = 0; i < platformAmount; i++) {
        var height = Randomizer.nextInt(2, 3);
        var platform = {
            'x': i * (WIDTH / 3) + WIDTH / 3,
            'y': HEIGHT - HEIGHT / height,
            'width': platformSizes[i] * (WIDTH / 640),
            'height': 25 * (HEIGHT / 360),
            'platform': true,
            'color': platformColor
        };
        currentLevel.ground.push(platform);
    }
    // power ups
    currentLevel.powerup = [];
    if (havePowerUp) {
        var powerUp = {
            'x': (WIDTH / 3 * powerUpPosition) - (WIDTH / 6),
            'y': HEIGHT / 2,
            'type': powerUpType
        };
        currentLevel.powerup.push(powerUp);
    }
    // enemies
    currentLevel.enemy = [];
    
    for (var i = 0; i < enemyCount; i++) {
        var enemySpeed = Randomizer.nextInt(1, 20) / 4;
        var platform = Randomizer.nextInt(1, currentLevel.ground.length - 1);
        
        var spawnLocation = [(
            currentLevel.ground[platform].x +
            currentLevel.ground[platform].width - ENEMY_WIDTH
        ),
        (
            currentLevel.ground[platform].y
        )
        ];
        
        var enemy = {
            'x': spawnLocation[0] - ENEMY_WIDTH,
            'y': spawnLocation[1] - ENEMY_HEIGHT - 2,
            'platform': currentLevel.ground[platform].x,
            'platformWidth': currentLevel.ground[platform].width,
            'speed': enemySpeed
        };
        
        if (enemy.x >= WIDTH - ENEMY_WIDTH) {
            continue;
        }
        currentLevel.enemy.push(enemy);
    }
    currentLevel["background"] = "#1c3257"; // Randomizer.nextColor();
    
    levels.push(currentLevel);
}

// ----------------------------------------------------------------------------- Dead Game State
function deadSetup() {
    remove(player);
    remove(gun);
    // removes all level components
    for (var i = 0; i < grounds.length; i++) {
        remove(grounds[i]);
    }
    grounds = [];
    for (var i = 0; i < enemies.length; i++) {
        remove(enemies[i]);
    }
    enemies = [];
    for (var i = 0; i < powerUps.length; i++) {
        remove(powerUps[i]);
    }
    powerUps = [];
    setBackgroundColor(Color.white);
    
    add(restartButton);
    add(returnToMenuButton);
    
    if (score > localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', score);
    }
    
    
    gameState = GameState.Dead;
}

function deadLoop() {
    var x = mousePos[0];
    var y = mousePos[1];
    
    if (restartButton.containsPoint(x, y) && mouseDown) {
        remove(restartButton);
        remove(returnToMenuButton);
        localStorage.removeItem('saveData');
        
        gameSetup();
    }
    
    if (returnToMenuButton.containsPoint(x, y) && mouseDown) {
        remove(restartButton);
        remove(returnToMenuButton);
        localStorage.removeItem('saveData');
        
        menuSetup();
    }
}

// ----------------------------------------------------------------------------- Paused Game State
function pauseSetup() {
    add(pauseBack);
    add(pauseText);
    
    add(menuButton);
    
    
    gameState = GameState.Pause;
}

function pauseLoop() {
    if (keyReleased(Keyboard.ESCAPE)) {
        allowUnpause = true;
    }
    
    if (keyDown(Keyboard.ESCAPE) && allowUnpause) {
        remove(pauseBack);
        remove(pauseText);
        remove(menuButton)
        allowUnpause = false;
        gameState = GameState.Play;
    }
    
    if (menuButton.containsPoint(mousePos[0], mousePos[1]) && mouseDown) {
        var saveData = {
            "levelData": levels,
            "level": level,
            "levelAdjust": levelAdjust,
            "player": {'x': player.getX(), 'y': player.getY(), 'xV': player.xVelocity, 'yV': player.yVelocity},
            "score": score,
            "lives": lives
        };
        localStorage.setItem('saveData', JSON.stringify(saveData));
        
        remove(pauseBack);
        remove(pauseText);
        remove(menuButton);
        remove(arrow);
        
        for (var i = 0; i < lifeIcons.length; i++) {
            remove(lifeIcons[i]);
        }
        lifeIcons = [];
        
        remove(player);
        remove(gun);
        // removes all level components
        for (var i = 0; i < grounds.length; i++) {
            remove(grounds[i]);
        }
        grounds = [];
        for (var i = 0; i < enemies.length; i++) {
            remove(enemies[i]);
        }
        enemies = [];
        for (var i = 0; i < powerUps.length; i++) {
            remove(powerUps[i]);
        }
        powerUps = [];
        setBackgroundColor(Color.white);
        
        menuSetup();
    }
}

// used when not in codehs
if (typeof start === 'function') {
                    start();
                }
            };
// end
