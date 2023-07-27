

class PointDefiner extends Warper {
  constructor(canvas, image, imgData) {
    super(canvas, image, imgData);
    this.oriPoints = new Array();
    this.dstPoints = new Array();
    this.selectedPoint = null;
    //set up points for change; 
    var c = canvas;
    this.canvas = canvas;
    var that = this;
    this.dragging_ = false;
    this.computing_ = false;
    this.currentPointIndex = -1;
    this.imgWarper = new Warper(c, image, imgData);
  };

  touchEnd(event) {
    this.dragging_ = false;
  }

  touchDrag(e) {
    if ((this.computing_ || !this.dragging_ || this.currentPointIndex < 0) && e.cancelable) {
      return;
    }

    this.computing_ = true;
    e.preventDefault();
    var endX = Math.abs(e.offsetX || e.clientX - e.target.offsetLeft);
    var endY = Math.abs(e.offsetY || e.clientY - e.target.offsetTop);
    const q = new Point(endX, endY)
    console.log(this.selectedPoint, e.offsetX, e.target.offsetLeft, e.clientX, endX, endY)
    this.dstPoints[this.currentPointIndex] = q;
    console.log(this.dstPoints)

    this.redraw();
    this.computing_ = false;
  };

  redraw() {
    if (this.oriPoints.length < 3) {
      // if (document.getElementById('show-control').checked) {
      this.redrawCanvas();
      // }
      return;
    }
    console.log(this.oriPoints)
    this.warp(this.oriPoints, this.dstPoints);
    if (true) {
      this.redrawCanvas();
    }
  };


  touchStart(e) {
    this.dragging_ = true;
    e.preventDefault();
    var startX = (e.offsetX || e.clientX - e.target.offsetLeft);
    var startY = (e.offsetY || e.clientY - e.target.offsetTop);
    var q = new Point(startX, startY);
    if (e.ctrlKey) {
      this.oriPoints.push(q);
      this.dstPoints.push(q);
    } else if (e.shiftKey) {
      var pointIndex = this.getCurrentPointIndex(q);  
      if (pointIndex >= 0) {
        this.oriPoints.splice(pointIndex, 1);
        this.dstPoints.splice(pointIndex, 1);
      }
    } else {
      this.selectedPoint = q
      this.currentPointIndex = this.getCurrentPointIndex(q);  
    }
    console.log("s", this.oriPoints)
    this.redraw();
    return q;
  };

  getCurrentPointIndex(q) {
    var currentPoint = -1;

    for (var i = 0; i < this.dstPoints.length; i++) {
      if (this.dstPoints[i].InfintyNormDistanceTo(q) <= 20) {
        currentPoint = i;
        return i;
      }
    }
    return currentPoint;
  };

  redrawCanvas(points) {
    var ctx = this.canvas.getContext("2d");
    for (var i = 0; i < this.oriPoints.length; i++) {
      if (i < this.dstPoints.length) {
        if (i == this.currentPointIndex) {
          this.drawOnePoint(this.dstPoints[i], ctx, 'orange');
        } else {
          this.drawOnePoint(this.dstPoints[i], ctx, '#6373CF');
        }

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.moveTo(this.oriPoints[i].x, this.oriPoints[i].y);
        ctx.lineTo(this.dstPoints[i].x, this.dstPoints[i].y);
        //ctx.strokeStyle = '#691C50';
        ctx.stroke();
      } else {
        this.drawOnePoint(this.oriPoints[i], ctx, '#119a21');
      }
    }
    ctx.stroke();
  };

  drawOnePoint(point, ctx, color) {
    var radius = 10;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.arc(parseInt(point.x), parseInt(point.y), radius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.arc(parseInt(point.x), parseInt(point.y), 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
  };
}
