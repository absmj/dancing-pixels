class Warper {
  grid = [];
  constructor(canvas, img, imgData, optGridSize, optAlpha) {
    this.alpha = optAlpha || 1;
    this.gridSize = 20;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    var source = img;
    this.width = source.width;
    this.height = source.height;
    this.imgData = imgData.data;
    canvas.width = source.width;
    canvas.height = source.height;
    this.bilinearInterpolation = new BilinearInterpolation(this.width, this.height, canvas);

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(imgData, 0, 0);

    let a, b, c, d;
    for (var i = 0; i < this.width; i += this.gridSize) {
      for (var j = 0; j < this.height; j += this.gridSize) {
        a = new Point(i, j);
        b = new Point(i + this.gridSize, j);
        c = new Point(i + this.gridSize, j + this.gridSize);
        d = new Point(i, j + this.gridSize);
        this.grid.push([a, b, c, d]);
      }
    }
  }

  warp(fromPoints, toPoints) {
    
    var deformation =
      new AffineDeformation(toPoints, fromPoints, this.alpha);
      
    var transformedGrid = [];
    for (var i = 0; i < this.grid.length; ++i) {
      transformedGrid[i] = [
        deformation.pointMover(this.grid[i][0]),
        deformation.pointMover(this.grid[i][1]),
        deformation.pointMover(this.grid[i][2]),
        deformation.pointMover(this.grid[i][3])
      ]
      // break;
    }
    var newImg = this.bilinearInterpolation
      .generate(this.imgData, this.grid, transformedGrid);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.putImageData(newImg, 0, 0);


  }

  drawGrid(fromPoints, toPoints) {
    // Forward warping.
    var deformation = new AffineDeformation(fromPoints, toPoints, this.alpha);
    var context = this.canvas.getContext("2d");
    for (var i = 0; i < this.grid2.length; ++i) {
      context.beginPath();
      var point = deformation.pointMover(this.grid2[i][0]);
      context.moveTo(point.x, point.y);
      for (var j = 1; j < 4; ++j) {
        point = deformation.pointMover(this.grid2[i][j]);
        context.lineTo(point.x, point.y);
      }
      context.strokeStyle = 'rgba(170, 170, 170, 0.5)';
      context.stroke();
    }
  }
}

class AffineDeformation {
  constructor(fromPoints, toPoints, alpha) {
    this.w = null;
    this.pRelative = null;
    this.qRelative = null;
    this.A = null;
    if (fromPoints.length != toPoints.length) {
      console.error('Points are not of same length.');
      return;
    }
    this.n = fromPoints.length;
    this.fromPoints = fromPoints;
    this.toPoints = toPoints;
    this.alpha = alpha;
  }

  pointMover(point) {
    if (null == this.pRelative || this.pRelative.length < this.n) {
      this.pRelative = new Array(this.n);
    }
    if (null == this.qRelative || this.qRelative.length < this.n) {
      this.qRelative = new Array(this.n);
    }
    if (null == this.w || this.w.length < this.n) {
      this.w = new Array(this.n);
    }
    if (null == this.A || this.A.length < this.n) {
      this.A = new Array(this.n);
    }
    for (var i = 0; i < this.n; ++i) {
      // console.log(this.fromPoints[i])
      var t = this.fromPoints[i].subtract(point);

      this.w[i] = Math.pow(t.x * t.x + t.y * t.y, -this.alpha);
    }
    // console.log(this.w)


    var pAverage = Point.weightedAverage(this.fromPoints, this.w);
    var qAverage = Point.weightedAverage(this.toPoints, this.w);
    for (var i = 0; i < this.n; ++i) {
      this.pRelative[i] = this.fromPoints[i].subtract(pAverage);
      this.qRelative[i] = this.toPoints[i].subtract(qAverage);
    }


    var B = Point.matrix(0, 0, 0, 0);
    
    for (var i = 0; i < this.n; ++i) {
      B.addM(this.pRelative[i].wXtX(this.w[i]));
    }

    B = B.inverse();
    for (var j = 0; j < this.n; ++j) {
      this.A[j] = point.subtract(pAverage).multiply(B)
        .dotP(this.pRelative[j]) * this.w[j];
    }

    var r = qAverage; //r is an point 
    for (var j = 0; j < this.n; ++j) {
      r = r.add(this.qRelative[j].multiply_d(this.A[j]));
    }
    return r;
  }
}
