// 等到浏览器准备好渲染游戏（避免出现故障）
document.addEventListener('DOMContentLoaded', function() {
window.requestAnimationFrame(function () {
  new GameManager(5, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});
// window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行
});