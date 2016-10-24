var Ticker = function(fn, n, ctx){
    this.fn = fn;
    this.n = n || 100;
    this.ctx = ctx || this;
    this.t = 0;
}
Ticker.prototype.play = function(){
    console.log('start');
    this.interval = setInterval((function(){
        this.t += this.n;
        this.fn.call(this, this.t);
    }).bind(this.ctx), this.n);
}
Ticker.prototype.pause = function(){
    console.log('pause');
    clearInterval(this.interval);
}

hue = 180;
lightness = 50;
saturation = 50;

var bump = function(e){
    var x = e.clientX / window.screen.width;
    var y = e.clientY / window.screen.height;
    hue = x*360;
    lightness = y*100;
    console.log('bump', hue, lightness);
}

var tick = function(n){
    var t = 400;
    var n1 = n%t;
    var s = Math.abs(n1-t/2);
    var s2 = s/2;
    saturation = s2;
}

setInterval(function(){
    var colorEl = document.getElementById('tshirt-color');
    colorEl.style= "background-color: hsla("+hue+","+saturation+"%,"+lightness+"%,1);"
}, 1);

window.onmousemove = bump;

document.getElementById('spectrum').addEventListener('DOMContentLoaded', function(){
    debugger;
    document.getElementById('spectrum').classList
}, false);

window.ticker = new Ticker(tick, 1);

window.onmousedown = function(){
    window.ticker.play();
}

window.onmouseup = function(){
    window.ticker.pause();
}
