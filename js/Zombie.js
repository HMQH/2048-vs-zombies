function Zombie(health, speed, gameContainer, url, gameManager) {
    this.health = health;
    this.speed = speed;
    this.gameContainer = gameContainer;
    this.alive = true; // 添加 alive 状态
    this.url = url;
    this.gameManager = gameManager; // 保存 GameManager 实例
    this.isColliding = false; // 增加 isColliding 标志
    this.create();
    this.intervalId = setInterval(() => {
        this.move();
    }, 100); // 控制移动速度的定时器
    console.log('Zombie created');
}

Zombie.prototype.move = function () {
    if (!this.alive || this.isColliding) return; // 如果僵尸已经死亡或正在碰撞，不再移动

    this.position.x -= this.speed;
    this.element.style.left = this.position.x + 'px';

    if (this.position.x < 0) {
        if (this.element.parentNode) { // 检查 parentNode 是否存在
            this.element.parentNode.removeChild(this.element); // 如果僵尸走出屏幕，移除它
            this.gameManager.over = true; // 设置游戏结束标志
            this.gameManager.actuate();
        }
        clearInterval(this.intervalId); // 停止间隔调用
    }
};

Zombie.prototype.checkCollision = function () {
    if (!this.alive) return;

    let isColliding = false;
    // 碰撞检测
    this.gameManager.grid.cells.forEach(column => {
        column.forEach(cell => {
            if (cell && this.checkCollisionWithTile(cell)) {
                this.hitTile(cell, this.gameManager);
                this.switchToAttackImage();
                isColliding = true;
            }
        });
    });

    // 如果没有碰撞，则恢复原始图片和不透明度
    if (!isColliding) {
        this.isColliding = false;
        this.restoreImage();
    }
};

Zombie.prototype.hit = function (damage) {
    this.health -= damage;
    if (this.health <= 0) {
        this.die();
    } else {
        this.flash();
        // 检查是否需要进入暴走状态
        if (this.health < 60 && this.url.includes('NewspaperZombie')) {
            this.enterRageMode();
            console.log('Zombie is in rage mode');
        }
    }
};

Zombie.prototype.enterRageMode = function () {
    this.speed = 3.6; // 提升速度
    const rageUrl = `./image/Zombie/NewspaperZombieAngry.gif?${new Date().getTime()}`; // 动态添加时间戳，防止缓存
    this.url = rageUrl; // 更新图片路径
    this.element.style.backgroundImage = `url(${rageUrl})`;
};

Zombie.prototype.flash = function () {
    this.element.classList.add('flash');
    setTimeout(() => {
        this.element.classList.remove('flash');
    }, 300); // 闪烁动画的持续时间
};

Zombie.prototype.create = function () {
    this.element = document.createElement('div');
    this.element.classList.add('zombie');
    const numbers = [0, 121, 242, 363, 484];
    this.position = {
        x: this.gameContainer.offsetWidth - this.element.offsetWidth - this.element.offsetWidth, // 从最右侧开始
        y: numbers[Math.floor(Math.random() * numbers.length)]
    };
    this.element.style.top = `${this.position.y}px`;
    this.element.style.left = `${this.position.x}px`;
    this.element.style.backgroundImage = `url(${this.url})`;

    // 判断是否为报纸僵尸，并设置相应的宽度和高度
    if (this.url.includes('NewspaperZombie')) {
        this.element.style.width = '150px';
        this.element.style.height = '150px';
    } else {
        this.element.style.width = '91px';
        this.element.style.height = '140px';
    }

    this.gameContainer.appendChild(this.element);

      // 启动碰撞检测定时器
      this.collisionIntervalId = setInterval(() => {
        this.checkCollision();
    }, 100); // 每0.1秒执行一次碰撞检测
};


// 僵尸和子弹的碰撞检测 碰撞——True
Zombie.prototype.collidesWith = function (bullet) {

    var zombieRect = this.element.getBoundingClientRect();
    var bulletRect = bullet.element.getBoundingClientRect();
    return !!(zombieRect.right < bulletRect.left ||
        zombieRect.left + 30 > bulletRect.right ||
        zombieRect.bottom < bulletRect.top ||
        zombieRect.top > bulletRect.bottom);
};

Zombie.prototype.die = function () {
    this.alive = false; // 设置僵尸为死亡状态
    clearInterval(this.intervalId); // 停止移动定时器

    // 隐藏原来的僵尸元素
    this.element.style.display = 'none';

    // 判断是否为报纸僵尸，并使用相应的死亡图片
    let zombieDieGif;
    let zombieHeadImg;
    let zombieDieWidth = '203px';
    let zombieDieHeight = '98px';
    let Zombietop = 30;
    let Zombieleft = 79.5;

    if (this.url.includes('NewspaperZombie')) {
        zombieDieGif = `./image/Zombie/NewspaperZombieDiebody.gif?${new Date().getTime()}`; // 动态添加时间戳，防止缓存
        zombieHeadImg = `./image/Zombie/NewspaperZombieDiehead.gif?${new Date().getTime()}`; // 动态添加时间戳，防止缓存
        zombieDieWidth = '150px'; // 调整大小
        zombieDieHeight = '150px';
        Zombietop = 10;
        Zombieleft = 70;
    } else {
        zombieDieGif = `./image/Zombie/ZombieDie.gif?${new Date().getTime()}`; // 动态添加时间戳，防止缓存
        zombieHeadImg = `./image/Zombie/ZombieHead.gif?${new Date().getTime()}`; // 动态添加时间戳，防止缓存

    }

    const zombieDieElement = document.createElement('div');
    zombieDieElement.style.position = 'absolute';
    zombieDieElement.style.top = `${this.position.y + Zombietop}px`;
    zombieDieElement.style.left = `${this.position.x - Zombieleft}px`;
    zombieDieElement.style.backgroundImage = `url(${zombieDieGif})`;
    zombieDieElement.style.backgroundSize = 'contain'; // 根据需要调整
    zombieDieElement.style.width = zombieDieWidth; // 调整大小
    zombieDieElement.style.height = zombieDieHeight;
    zombieDieElement.style.backgroundRepeat = 'no-repeat';
    zombieDieElement.style.zIndex = '100';
    this.gameContainer.appendChild(zombieDieElement);

    // 创建并显示僵尸头的图片
    const zombieHeadElement = document.createElement('div');
    zombieHeadElement.style.backgroundImage = `url('${zombieHeadImg}')`;
    zombieHeadElement.style.backgroundSize = 'contain';
    zombieHeadElement.style.backgroundRepeat = 'no-repeat';
    zombieHeadElement.style.position = 'absolute';
    zombieHeadElement.style.width = '150px'; // 根据需要调整大小
    zombieHeadElement.style.height = '186px';
    zombieHeadElement.style.left = this.position.x + 'px'; // 放置在僵尸当前位置
    zombieHeadElement.style.top = this.position.y + 'px'; // 放置在僵尸上方
    zombieHeadElement.style.zIndex = '101'; // 设置较高的 z-index
    this.gameContainer.appendChild(zombieHeadElement);

    // 可选：延时移除僵尸
    setTimeout(() => {
        zombieDieElement.remove();
        zombieHeadElement.remove();
    }, 1000); // 动图持续时间，单位毫秒
};

Zombie.prototype.checkCollisionWithTile = function (tile) {
    var zombieRect = this.element.getBoundingClientRect();
    var tileElement = document.querySelector('.tile-position-' + (tile.x + 1) + '-' + (tile.y + 1));
    if (tileElement) {
        var tileRect = tileElement.getBoundingClientRect();

        // 缩小僵尸碰撞区域，只检测核心区域
        var collisionBuffer = 45; // 调整这个值来缩小碰撞检测区域
        var coreZombieRect = {
            left: zombieRect.left + collisionBuffer,
            right: zombieRect.right - collisionBuffer,
            top: zombieRect.top + collisionBuffer,
            bottom: zombieRect.bottom - collisionBuffer
        };

        if (!(coreZombieRect.right < tileRect.left ||
            coreZombieRect.left > tileRect.right ||
            coreZombieRect.bottom < tileRect.top ||
            coreZombieRect.top > tileRect.bottom)) {
            // 碰撞检测
            console.log('Zombie collides with tile');
            return true;
        }
    }
    return false;
};


Zombie.prototype.hitTile = function (tile, gameManager) {
      this.isColliding = true; // 标记碰撞状态
    // 每0.1秒对方块造成1点伤害
    
    const damageInterval = setInterval(() => {
        if (!this.alive || tile.health <= 0) {
            clearInterval(damageInterval); // 停止对方块的伤害
            if (tile.health <= 0) {
                gameManager.grid.removeTile(tile);
                this.isColliding = false; // 重置碰撞标志
                // 删除方块的 DOM 元素
                const tileElement = document.querySelector('.tile-position-' + (tile.x + 1) + '-' + (tile.y + 1));
                if (tileElement) {
                    tileElement.remove();
                }

                this.restoreImage(); // 恢复原始图片
            }
            return;
        }

         // 逐渐增加的伤害，最大上限为 0.5
         let damage = 0.01 * gameManager.globalElapsedTime;
         if (damage > 0.4) {
             damage = 0.4;
         }
         let damagemax = Math.max(damage, 0.01);
        if (this.isColliding){
            tile.health -= damagemax; // 每次碰撞减少damage点血量
        }
     
        if (tile.health <= 0) {
            gameManager.grid.removeTile(tile);
            clearInterval(damageInterval); // 停止对方块的伤害
            this.isColliding = false; // 重置碰撞标志
            // 删除方块的 DOM 元素
            const tileElement = document.querySelector('.tile-position-' + (tile.x + 1) + '-' + (tile.y + 1));
            if (tileElement) {
                tileElement.remove();
            }

        } else {
            // 更新血量条的宽度
            const healthBar = tile.healthBar;
            if (healthBar) {
                requestAnimationFrame(() => {
                    healthBar.style.width = (tile.health / tile.value * 100) + "%"; // 更新血量条宽度
                });
            }
        }
        console.log('Zombie hit tile');
    }, 100); // 每0.1秒执行一次
};

Zombie.prototype.switchToAttackImage = function () {
    // 切换为攻击状态图片，并降低不透明度
    if (this.url.includes('Zombie_walking.gif')) {
        this.element.style.backgroundImage = "url('./image/Zombie/ZombieAttack.gif')";
    } else if (this.url.includes('BucketheadZombie.gif')) {
        this.element.style.backgroundImage = "url('./image/Zombie/BucketheadZombieAttack.gif')";
    } else if (this.url.includes('NewspaperZombiewalking.gif')) {
        this.element.style.backgroundImage = "url('./image/Zombie/NewspaperZombieAttack.gif')";
        this.element.style.width = '130px';
        this.element.style.height = '130px';
    }
    this.element.style.opacity = '0.5';
};

Zombie.prototype.restoreImage = function () {
    // 恢复原始图片和不透明度
    this.element.style.backgroundImage = `url(${this.url})`;
    if (this.url.includes('NewspaperZombie')) {
        this.element.style.width = '130px';
        this.element.style.height = '130px';
        this.element.style.backgroundSize = 'contain';
        this.element.style.backgroundRepeat = 'no-repeat';
    } else {
        this.element.style.width = '91px';
        this.element.style.height = '140px';
    }
    this.element.style.opacity = '1';
};