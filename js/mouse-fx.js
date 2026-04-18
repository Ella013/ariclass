(function() {
    var isHome = /\/(index\.html)?$/.test(window.location.pathname);

    var style = document.createElement('style');
    style.textContent = '.fx-star{pointer-events:none;position:fixed;font-size:26px;font-weight:bold;color:#FFD700;z-index:9999;animation:fx-star-anim 0.6s ease-out forwards;}@keyframes fx-star-anim{0%{opacity:1;transform:translate(0,0) scale(1);}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0.3);}}@keyframes fx-pulse{0%{transform:translate(-50%,-50%) scale(1);}50%{transform:translate(-50%,-50%) scale(2);}100%{transform:translate(-50%,-50%) scale(1);}}#mouse-circle{pointer-events:none;position:fixed;width:22px;height:22px;border-radius:50%;background:rgba(255,215,0,0.35);z-index:9998;transform:translate(-50%,-50%);display:none;}';
    document.head.appendChild(style);

    var mc = document.createElement('div');
    mc.id = 'mouse-circle';
    document.body.appendChild(mc);
    document.addEventListener('mousemove', function(e) {
        mc.style.display = 'block';
        mc.style.left = e.clientX + 'px';
        mc.style.top  = e.clientY + 'px';
    });

    var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    function burst(x, y) {
        for (var i = 0; i < 6; i++) {
            var el = document.createElement('div');
            el.className = 'fx-star';
            el.textContent = alpha[Math.floor(Math.random() * alpha.length)];
            var angle = (i / 6) * Math.PI * 2;
            var dist = 60 + Math.random() * 50;
            el.style.left = x + 'px';
            el.style.top  = y + 'px';
            el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
            el.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
            document.body.appendChild(el);
            el.addEventListener('animationend', function(){ this.remove(); });
        }
    }

    function pulse() {
        mc.style.animation = 'none';
        mc.offsetWidth;
        mc.style.animation = 'fx-pulse 0.3s ease-in-out';
    }

    document.addEventListener('click', function(e) {
        if (isHome) burst(e.clientX, e.clientY);
        else pulse();
    }, true);
})();
