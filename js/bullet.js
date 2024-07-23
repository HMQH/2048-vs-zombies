function Bullet(value, position) {
  this.value = value; // 子弹的伤害值，与数字相同
  this.position = position; // 子弹的初始位置
  this.element = null; // 子弹的DOM元素
  const initialBulletImg = './image/Plants/PB01.gif'; // 子弹的初始图像
  const hitBulletImg = './image/Plants/PeaBulletHit.gif'; // 子弹击中后的图像
  this.create = function () {
    this.element = document.createElement('div');
    this.element.classList.add('bullet');
    this.element.textContent = this.value; // 设置子弹上的数字
    this.element.style.left = `${this.position.x}px`;
    this.element.style.top = `${this.position.y}px`;
    this.element.style.backgroundImage = `url(${initialBulletImg})`; // 设置初始图像
    this.element.style.backgroundSize = 'cover'; // 根据需要调整
    document.querySelector('.game-container').appendChild(this.element);
    console.log('子弹创建成功 at position', this.position);
  };

  this.shoot = function (zombies) {
    var self = this;
    var gridBound = document.querySelector('.game-container').getBoundingClientRect();

    function moveRight() {
        self.position.x += 0.71; // 每次移动1px
        self.element.style.left = self.position.x + 'px';

        // 碰撞和移出屏幕的检测逻辑保持不变
        for (var i = 0; i < zombies.length; i++) {
          if (!zombies[i].collidesWith(self) && zombies[i].alive) {
            clearInterval(moveRight);
            self.element.style.backgroundImage = `url(${hitBulletImg})`; // 更改为击中图像
            zombies[i].hit(self.value); // 对僵尸造成伤害
            console.log('子弹击中僵尸');
            // 播放击中僵尸的声音
            const hitSound = new Audio('./audio/splat3.mp3');
            hitSound.play();
            // 延时移除子弹
            setTimeout(() => {
              self.element.remove();
            }, 200); // 击中动画持续时间
  
            return;
          };
        };

        if (self.position.x < gridBound.width) {
            requestAnimationFrame(moveRight); // 继续动画
        } else {
            self.element.remove(); // 移除子弹
            console.log('子弹移出屏幕');
        }
    }

    requestAnimationFrame(moveRight); // 开始动画
};

  this.create(); // 创建子弹DOM元素
}