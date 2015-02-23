// Generated by CoffeeScript 1.7.1
(function() {
  var APP, CIRCLE_SEGMENTS, HEXAGONS_HIGH, Hexagon, INNER_RING_RADIUS, OUTER_RING_RADIUS, SCREEN_RATIO, SMALL_HEXAGONS_HIGH, TAN30, distanceFromCenter,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TAN30 = Math.tan(Math.PI / 6);

  OUTER_RING_RADIUS = 0.95;

  INNER_RING_RADIUS = 0.7;

  HEXAGONS_HIGH = 55;

  SCREEN_RATIO = 16 / 9;

  SMALL_HEXAGONS_HIGH = 75;

  CIRCLE_SEGMENTS = 32;

  distanceFromCenter = function(v) {
    return Math.pow(Math.pow(v[0], 2) + Math.pow(v[1], 2), 0.5);
  };

  Hexagon = (function() {

    /*
       1 ____ 2
       /|\  /|\
     6/ | \/ | \3
      \ | /\ | /
      5\|/__\|/4
     */
    function Hexagon(x, y, size, maxRadius, minRadius) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.maxRadius = maxRadius;
      this.minRadius = minRadius;
    }

    Hexagon.prototype.data = function(n) {
      var colours, edgeLength, face, faces, facesData, hexHeight, i, inside, isInside, j, k, moveVertexToward, other, point, px, py, r, target, vertex, vertexIndex, verticies, verticiesData, x, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _m, _n, _o, _p, _ref, _ref1;
      edgeLength = this.size;
      hexHeight = edgeLength / TAN30;
      verticies = [[this.x - edgeLength / 2, this.y + hexHeight / 2], [this.x + edgeLength / 2, this.y + hexHeight / 2], [this.x + edgeLength, this.y], [this.x + edgeLength / 2, this.y - hexHeight / 2], [this.x - edgeLength / 2, this.y - hexHeight / 2], [this.x - edgeLength, this.y]];
      faces = [[1, 4, 2], [2, 4, 3], [1, 5, 4], [1, 6, 5]];
      for (_i = 0, _len = verticies.length; _i < _len; _i++) {
        vertex = verticies[_i];
        r = distanceFromCenter(vertex);
        isInside = (this.minRadius <= r && r <= this.maxRadius);
        vertex.push(isInside);
      }
      moveVertexToward = function(vertex, otherVertex, minR, maxR) {
        var badBound, goodBound, guess, i, moveToward, _j, _ref;
        guess = vertex.slice();
        badBound = vertex;
        goodBound = otherVertex;
        moveToward = function(v) {
          guess[0] = (guess[0] + v[0]) / 2;
          guess[1] = (guess[1] + v[1]) / 2;
        };
        moveToward(goodBound);
        for (i = _j = 0; _j <= 5; i = ++_j) {
          if ((minR <= (_ref = distanceFromCenter(guess)) && _ref <= maxR)) {
            goodBound = guess;
            moveToward(badBound);
          } else {
            badBound = guess;
            moveToward(goodBound);
          }
        }
        vertex[0] = guess[0];
        vertex[1] = guess[1];
      };
      for (i = _j = 0, _len1 = verticies.length; _j < _len1; i = ++_j) {
        vertex = verticies[i];
        if (!(vertex[2] === false)) {
          continue;
        }
        target = vertex;
        _ref = [1, 5, 2, 4, 3];
        for (k = _k = 0, _len2 = _ref.length; _k < _len2; k = ++_k) {
          j = _ref[k];
          other = verticies[(i + j) % 6];
          if (other[2]) {
            vertex[0] = target[0];
            vertex[1] = target[1];
            moveVertexToward(vertex, other, this.minRadius, this.maxRadius);
            break;
          }
          if (k % 2 === 1) {
            target = other;
          }
        }
      }
      for (i = _l = faces.length - 1; _l >= 0; i = _l += -1) {
        face = faces[i];
        inside = false;
        for (_m = 0, _len3 = face.length; _m < _len3; _m++) {
          vertexIndex = face[_m];
          vertex = verticies[vertexIndex - 1];
          inside || (inside = vertex[2]);
        }
        if (!inside) {
          faces.splice(i, 1);
        }
      }
      facesData = [];
      verticiesData = [];
      if (faces.length > 0) {
        for (_n = 0, _len4 = faces.length; _n < _len4; _n++) {
          face = faces[_n];
          for (_o = 0, _len5 = face.length; _o < _len5; _o++) {
            point = face[_o];
            facesData.push(point - 1 + n);
          }
        }
        colours = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1]];
        px = this.x;
        py = this.y;
        for (i = _p = 0, _len6 = verticies.length; _p < _len6; i = ++_p) {
          _ref1 = verticies[i], x = _ref1[0], y = _ref1[1];
          verticiesData.push(x);
          verticiesData.push(y);
          verticiesData.push(px);
          verticiesData.push(py);
        }
      }
      return {
        verticiesData: verticiesData,
        facesData: facesData
      };
    };

    return Hexagon;

  })();

  window.APP = APP = new ((function() {
    function _Class() {
      this.start = __bind(this.start, this);
      this.draw = __bind(this.draw, this);
      this.resizeCanvas = __bind(this.resizeCanvas, this);
    }

    _Class.prototype.VERTEX = 2;

    _Class.prototype.FRAGMENT = 3;

    _Class.prototype.vertexShaderSource = "attribute vec2 position;\nattribute vec2 texPosition;\nuniform float factor;\nuniform float screenRatio;\nvarying vec2 vUV;\n\nvoid main(void) {\n  vec2 pos = position;\n  pos.x *= factor;\n  gl_Position = vec4(pos, 0., 1.);\n  vec2 pos2 = texPosition;\n  pos2.x /= screenRatio;\n  pos2 = pos2 + 1.;\n  pos2 = pos2 / 2.;\n  vUV = pos2;\n}";

    _Class.prototype.fragmentShaderSource = "precision mediump float;\nuniform sampler2D sampler;\nvarying vec2 vUV;\n\nvoid main(void) {\n  gl_FragColor = texture2D(sampler, vUV);\n}";

    _Class.prototype.getShader = function(type, source) {
      var shader;
      shader = this.GL.createShader(type);
      this.GL.shaderSource(shader, source);
      this.GL.compileShader(shader);
      if (!this.GL.getShaderParameter(shader, this.GL.COMPILE_STATUS)) {
        alert("ERROR IN " + (type === this.GL.VERTEX_SHADER ? 'vertex' : 'fragment') + " SHADER : " + (this.GL.getShaderInfoLog(shader)));
        return false;
      }
      return shader;
    };

    _Class.prototype.resizeCanvas = function() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };

    _Class.prototype.initCanvas = function() {
      this.canvas = document.getElementById("canvas");
      this.resizeCanvas();
      window.addEventListener('resize', this.resizeCanvas, true);
      return true;
    };

    _Class.prototype.initGLContext = function() {
      this.GL = this.canvas.getContext("experimental-webgl", {
        antialias: true
      });
      return true;
    };

    _Class.prototype.initShaders = function() {
      var fragmentShader, shaderProgram, vertexShader;
      vertexShader = this.getShader(this.GL.VERTEX_SHADER, this.vertexShaderSource);
      fragmentShader = this.getShader(this.GL.FRAGMENT_SHADER, this.fragmentShaderSource);
      shaderProgram = this.GL.createProgram();
      this.GL.attachShader(shaderProgram, vertexShader);
      this.GL.attachShader(shaderProgram, fragmentShader);
      this.GL.linkProgram(shaderProgram);
      this.shaderProgram = shaderProgram;
      this._position = this.GL.getAttribLocation(shaderProgram, "position");
      this._texPosition = this.GL.getAttribLocation(shaderProgram, "texPosition");
      this._factor = this.GL.getUniformLocation(shaderProgram, "factor");
      this._screenRatio = this.GL.getUniformLocation(shaderProgram, "screenRatio");
      this._sampler = this.GL.getUniformLocation(shaderProgram, "sampler");
      this.GL.enableVertexAttribArray(this._position);
      this.GL.enableVertexAttribArray(this._texPosition);
      return true;
    };

    _Class.prototype.initHexagons = function(hexagons, hexagonsHigh, widthToHeight, minR, maxR) {
      var col, datum, facesData, fiddle, hexagon, highIndex, i, offsetX, offsetY, previousVerticiesCount, row, size, triangleFacesData, triangleVertexData, verticiesData, x, y, _i, _j, _k, _l, _len, _len1, _len2, _m, _ref;
      size = 2 / (hexagonsHigh / TAN30);
      fiddle = {
        x: 3 / 10,
        y: 3 / 10 * TAN30 / 2
      };
      offsetX = size * (2 + fiddle.x);
      offsetY = size * (1 / (2 * TAN30) + fiddle.y);
      for (row = _i = -hexagonsHigh; -hexagonsHigh <= hexagonsHigh ? _i <= hexagonsHigh : _i >= hexagonsHigh; row = -hexagonsHigh <= hexagonsHigh ? ++_i : --_i) {
        highIndex = hexagonsHigh * widthToHeight * TAN30 / 2;
        for (col = _j = -highIndex; -highIndex <= highIndex ? _j <= highIndex : _j >= highIndex; col = -highIndex <= highIndex ? ++_j : --_j) {
          x = Math.abs(row % 2) === 1 ? col * (offsetX + size) : (3 + fiddle.x) * size / 2 + col * (offsetX + size);
          y = row * offsetY;
          hexagons.push(new Hexagon(x, y, size, maxR, minR));
        }
      }
      triangleVertexData = [];
      triangleFacesData = [];
      for (i = _k = 0, _len = hexagons.length; _k < _len; i = ++_k) {
        hexagon = hexagons[i];
        previousVerticiesCount = triangleVertexData.length / 4;
        _ref = hexagon.data(previousVerticiesCount), verticiesData = _ref.verticiesData, facesData = _ref.facesData;
        for (_l = 0, _len1 = verticiesData.length; _l < _len1; _l++) {
          datum = verticiesData[_l];
          triangleVertexData.push(datum);
        }
        for (_m = 0, _len2 = facesData.length; _m < _len2; _m++) {
          datum = facesData[_m];
          triangleFacesData.push(datum);
        }
      }
      hexagons.triangleVertexData = triangleVertexData;
      hexagons.triangleVertex = this.GL.createBuffer();
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, hexagons.triangleVertex);
      this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(triangleVertexData), this.GL.STATIC_DRAW);
      hexagons.triangleFacesData = triangleFacesData;
      hexagons.triangleFaces = this.GL.createBuffer();
      this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, hexagons.triangleFaces);
      this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleFacesData), this.GL.STATIC_DRAW);
      return true;
    };

    _Class.prototype.initCircleSegments = function(segments, segmentCount, radius) {
      var angle, angleStep, face, faces, i, point, triangleFacesData, triangleVertexData, vertex, verticies, _i, _j, _k, _l, _len, _len1, _len2, _m;
      angleStep = 2 * Math.PI / segmentCount;
      angle = 0;
      verticies = [[0, 0]];
      for (i = _i = 0; 0 <= segmentCount ? _i < segmentCount : _i > segmentCount; i = 0 <= segmentCount ? ++_i : --_i) {
        verticies.push([radius * Math.sin(i * angleStep), radius * Math.cos(i * angleStep)]);
      }
      faces = [];
      for (i = _j = 1; 1 <= segmentCount ? _j < segmentCount : _j > segmentCount; i = 1 <= segmentCount ? ++_j : --_j) {
        faces.push([0, i, i + 1]);
      }
      faces.push([0, segmentCount, 1]);
      triangleVertexData = [];
      for (i = _k = 0, _len = verticies.length; _k < _len; i = ++_k) {
        vertex = verticies[i];
        triangleVertexData.push(vertex[0]);
        triangleVertexData.push(vertex[1]);
        triangleVertexData.push(i % 2);
        triangleVertexData.push(i % 2);
      }
      triangleFacesData = [];
      for (_l = 0, _len1 = faces.length; _l < _len1; _l++) {
        face = faces[_l];
        for (_m = 0, _len2 = face.length; _m < _len2; _m++) {
          point = face[_m];
          triangleFacesData.push(point);
        }
      }
      segments.triangleVertexData = triangleVertexData;
      segments.triangleVertex = this.GL.createBuffer();
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, segments.triangleVertex);
      this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(triangleVertexData), this.GL.STATIC_DRAW);
      segments.triangleFacesData = triangleFacesData;
      segments.triangleFaces = this.GL.createBuffer();
      this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, segments.triangleFaces);
      this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleFacesData), this.GL.STATIC_DRAW);
      return true;
    };

    _Class.prototype.initTexture = function() {
      this.texture = this.GL.createTexture();
      this.GL.pixelStorei(this.GL.UNPACK_FLIP_Y_WEBGL, true);
      this.GL.bindTexture(this.GL.TEXTURE_2D, this.texture);
      this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_WRAP_S, this.GL.CLAMP_TO_EDGE);
      this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_WRAP_T, this.GL.CLAMP_TO_EDGE);
      this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MIN_FILTER, this.GL.NEAREST);
      this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MAG_FILTER, this.GL.NEAREST);
      this.GL.bindTexture(this.GL.TEXTURE_2D, null);
    };

    _Class.prototype.init = function() {
      var e, fiddle;
      try {
        this.initCanvas();
        this.initGLContext();
        this.initShaders();
        fiddle = 1 / 150;
        this.bigHexagons = [];
        this.initHexagons(this.bigHexagons, HEXAGONS_HIGH, SCREEN_RATIO, OUTER_RING_RADIUS + fiddle, Infinity);
        this.smallHexagons = [];
        this.initHexagons(this.smallHexagons, SMALL_HEXAGONS_HIGH, 1, INNER_RING_RADIUS + fiddle, OUTER_RING_RADIUS);
        this.circleSegments = [];
        this.initCircleSegments(this.circleSegments, CIRCLE_SEGMENTS, INNER_RING_RADIUS);
        this.initTexture();
        this.video = document.getElementsByTagName('video')[0];
        this.GL.clearColor(0.0, 0.0, 0.0, 0.0);
        return true;
      } catch (_error) {
        e = _error;
        console.error(e.stack);
        alert("You are not compatible :(");
        return false;
      }
    };

    _Class.prototype.draw = function() {
      var hexagons, _i, _len, _ref;
      this.GL.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
      this.GL.clear(this.GL.COLOR_BUFFER_BIT);
      this.GL.uniform1f(this._factor, canvas.height / canvas.width);
      this.GL.uniform1f(this._screenRatio, SCREEN_RATIO);
      this.GL.uniform1i(this._sampler, 0);
      this.GL.bindTexture(this.GL.TEXTURE_2D, this.texture);
      this.GL.texImage2D(this.GL.TEXTURE_2D, 0, this.GL.RGBA, this.GL.RGBA, this.GL.UNSIGNED_BYTE, this.video);
      _ref = [this.bigHexagons, this.smallHexagons];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        hexagons = _ref[_i];
        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, hexagons.triangleVertex);
        this.GL.vertexAttribPointer(this._position, 2, this.GL.FLOAT, false, 4 * (2 + 2), 0);
        this.GL.vertexAttribPointer(this._texPosition, 2, this.GL.FLOAT, false, 4 * (2 + 2), 2 * 4);
        this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, hexagons.triangleFaces);
        this.GL.drawElements(this.GL.TRIANGLES, hexagons.triangleFacesData.length, this.GL.UNSIGNED_SHORT, 0);
      }
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.circleSegments.triangleVertex);
      this.GL.vertexAttribPointer(this._position, 2, this.GL.FLOAT, false, 4 * (2 + 2), 0);
      this.GL.vertexAttribPointer(this._texPosition, 2, this.GL.FLOAT, false, 4 * (2 + 2), 2 * 4);
      this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.circleSegments.triangleFaces);
      this.GL.drawElements(this.GL.TRIANGLES, this.circleSegments.triangleFacesData.length, this.GL.UNSIGNED_SHORT, 0);
      this.GL.flush();
      window.requestAnimationFrame(this.draw);
    };

    _Class.prototype.run = function() {
      return navigator.webkitGetUserMedia({
        video: true
      }, (function(_this) {
        return function(localMediaStream) {
          _this.video.src = window.URL.createObjectURL(localMediaStream);
          _this.GL.useProgram(_this.shaderProgram);
          return _this.draw();
        };
      })(this), function() {
        return alert("GUM fail.");
      });
    };

    _Class.prototype.start = function() {
      return this.init() && this.run();
    };

    return _Class;

  })());

  window.addEventListener('DOMContentLoaded', APP.start, false);

}).call(this);
