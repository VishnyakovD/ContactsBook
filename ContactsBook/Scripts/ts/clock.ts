class Clock {
    canvas:HTMLElement;

    constructor() {
        this.canvas = document.getElementById("clock");
    }

    drawClock(ctx:any,radius:any):void {
        setInterval(() => {
            this.drawRound(ctx,radius);
        this.drawNumbs(ctx,radius);
        this.drawTime(ctx,radius);
        }, 1000);
        
    }

    drawRound(ctx:any,radius:any):void {
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.lineWidth = radius * 0.05;
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.stroke();
    }

    drawNumbs(ctx:any,radius:any):void {
        var ang;
        var num;
        ctx.font = `${radius * 0.25}px arial`;
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
    }
                     
    drawArrows(ctx:any, pos:any, length:any, width:any):void {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.moveTo(0, 0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    drawTime(ctx:any, radius:any):void {
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
    }
}
var clockManager: Clock;
$(() => {
    if ($("#clock").length > 0) {
        clockManager = new Clock();

        if ((<any>clockManager.canvas).getContext) {
            var ctx = (<any>clockManager.canvas).getContext('2d');
            var radius = (<any>clockManager.canvas).height / 2;
            ctx.translate(radius, radius);
            radius = radius * 0.90;
            clockManager.drawClock(ctx,radius);
        }
    }
});
