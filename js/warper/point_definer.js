var ImgWarper = ImgWarper || {};

ImgWarper.PointDefiner = function(canvas, image, imgData) {
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
  this.imgWarper = new ImgWarper.Warper(c, image, imgData);
};

ImgWarper.PointDefiner.prototype.touchEnd = function(event) {
  this.dragging_ = false;
}

ImgWarper.PointDefiner.prototype.touchDrag = function(e) {
  if ((this.computing_ || !this.dragging_ || this.currentPointIndex < 0)) {
    return;
  }
  this.computing_ = true;
  e.preventDefault();
  var endX = Math.abs(e.offsetX || e.clientX - e.target.offsetLeft);
  var endY = Math.abs(e.offsetY || e.clientY - e.target.offsetTop);
  const q = new ImgWarper.Point(endX, endY)
  this.dstPoints[this.currentPointIndex] = q;
  // this.redraw();
  this.computing_ = false;
};

ImgWarper.PointDefiner.prototype.redraw = function () {
  if (this.oriPoints.length < 3) {
    // if (document.getElementById('show-control').checked) {
      this.redrawCanvas();
    // }
    return;
  }
  this.imgWarper.warp(this.oriPoints, this.dstPoints);
  if (true) {
    this.redrawCanvas();
  }
};

3
ImgWarper.PointDefiner.prototype.touchStart = function(e) {
  this.dragging_ = true;
  e.preventDefault();
  var startX = (e.offsetX || e.clientX - e.target.offsetLeft);
  var startY = (e.offsetY || e.clientY - e.target.offsetTop);
  var q = new ImgWarper.Point(startX, startY);
  // this.oriPoints.push(q);
  // this.dstPoints.push(q);
  if (e.ctrlKey) {
    this.oriPoints.push(q);
    this.dstPoints.push(q);
  } else if (e.shiftKey) {
    var pointIndex = this.getCurrentPointIndex(q);  
    if (pointIndex >= 0) {
      this.oriPoints.splice(pointIndex, 1);
      this.dstPoints.splice(pointIndex, 1);
    }
  } else if(e.cancelable) {
    this.selectedPoint = q
    this.currentPointIndex = this.getCurrentPointIndex(q);  
  }
  this.redraw();
  return q;
};

ImgWarper.PointDefiner.prototype.getCurrentPointIndex = function(q) {
  var currentPoint = -1;   

  for (var i = 0 ; i< this.dstPoints.length; i++){
    if (this.dstPoints[i].InfintyNormDistanceTo(q) <= 20) {
      currentPoint = i;
      return i;
    }
  }
  return currentPoint;
};

ImgWarper.PointDefiner.prototype.redrawCanvas = function(points) {
  points = points || this.dstPoints;
  // console.log(points)
  var ctx = this.canvas.getContext("2d");
  for (var i = 0; i < this.oriPoints.length; i++){
    if (i < points.length) {
      if (i == this.currentPointIndex) {
        this.drawOnePoint(points[i], ctx, 'orange');
      } else {
        this.drawOnePoint(points[i], ctx, '#6373CF');
      }

      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.moveTo(this.oriPoints[i].x, this.oriPoints[i].y);
      ctx.lineTo(points[i].x, points[i].y);
      // ctx.strokeStyle = '#691C50';
      ctx.stroke();
    } else {
      this.drawOnePoint(this.oriPoints[i], ctx, '#119a21');
    }
  } 
  ctx.stroke();
};

ImgWarper.PointDefiner.prototype.drawOnePoint = function(point, ctx, color) {
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
