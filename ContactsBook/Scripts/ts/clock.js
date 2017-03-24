var Clock = (function () {
    function Clock() {
        this.canvas = document.getElementById("clock");
    }
    Clock.prototype.drawClock = function (ctx, radius) {
        var _this = this;
        setInterval(function () {
            _this.drawRound(ctx, radius);
            _this.drawNumbs(ctx, radius);
            _this.drawTime(ctx, radius);
        }, 1000);
    };
    Clock.prototype.drawRound = function (ctx, radius) {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.lineWidth = radius * 0.05;
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.stroke();
    };
    Clock.prototype.drawNumbs = function (ctx, radius) {
        var ang;
        var num;
        ctx.font = radius * 0.25 + "px arial";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        for (num = 1; num < 13; num++) {
            ang = num * Math.PI / 6;
            ctx.rotate(ang);
            ctx.translate(0, -radius * 0.80);
            ctx.rotate(-ang);
            ctx.fillText(num, 0, 0);
            ctx.rotate(ang);
            ctx.translate(0, radius * 0.80);
            ctx.rotate(-ang);
        }
    };
    Clock.prototype.drawArrows = function (ctx, pos, length, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    };
    Clock.prototype.drawTime = function (ctx, radius) {
        var now = new Date();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        hour = hour % 12;
        hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
        this.drawArrows(ctx, hour, radius * 0.5, radius * 0.06);
        minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
        this.drawArrows(ctx, minute, radius * 0.8, radius * 0.04);
        second = (second * Math.PI / 30);
        this.drawArrows(ctx, second, radius * 0.9, radius * 0.02);
    };
    return Clock;
}());
var clockManager;
$(function () {
    if ($("#clock").length > 0) {
        clockManager = new Clock();
        if (clockManager.canvas.getContext) {
            var ctx = clockManager.canvas.getContext('2d');
            var radius = clockManager.canvas.height / 2;
            ctx.translate(radius, radius);
            radius = radius * 0.90;
            clockManager.drawClock(ctx, radius);
        }
    }
});
//# sourceMappingURL=clock.js.map