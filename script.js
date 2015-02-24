// Generated by CoffeeScript 1.7.1
(function() {
  var APP, CIRCLE_SEGMENTS, Decal, HEXAGONS_HIGH, Hexagon, INNER_BUMP_R, INNER_RING_RADIUS, INNER_ZOOM_FACTOR, OUTER_RING_RADIUS, OUTER_ZOOM_FACTOR, RING_WIDTH, SCREEN_RATIO, SMALL_HEXAGONS_HIGH, TAN30, distanceFromCenter,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TAN30 = Math.tan(Math.PI / 6);

  OUTER_RING_RADIUS = 0.95;

  INNER_RING_RADIUS = 0.7;

  RING_WIDTH = 1 / 200;

  HEXAGONS_HIGH = 55;

  SCREEN_RATIO = 16 / 9;

  SMALL_HEXAGONS_HIGH = 75;

  CIRCLE_SEGMENTS = 32;

  OUTER_ZOOM_FACTOR = 1.11;

  INNER_ZOOM_FACTOR = 1.06;

  INNER_BUMP_R = 0.7;

  distanceFromCenter = function(v) {
    return Math.pow(Math.pow(v[0], 2) + Math.pow(v[1], 2), 0.5);
  };

  Decal = (function() {

    /*
     4___A___1  bigR
      |  N  |
      |  G  |
      |  L  |
      |__E__|
     3       2  littleR
     */
    function Decal(r, angle, large) {
      this.r = r;
      this.angle = angle;
      this.large = large;
    }

    Decal.prototype.data = function(n) {
      var bigR, face, faces, facesData, factor, i, point, smallAngle, smallR, verticies, verticiesData, x, y, _i, _j, _k, _len, _len1, _len2, _ref;
      smallAngle = Math.PI / 1500;
      factor = 1 / 10;
      if (this.large) {
        smallAngle *= 2;
        factor *= 2;
      }
      bigR = this.r;
      smallR = this.r - (OUTER_RING_RADIUS - INNER_RING_RADIUS) * factor;
      verticies = [[bigR * Math.sin(this.angle + smallAngle), bigR * Math.cos(this.angle + smallAngle)], [smallR * Math.sin(this.angle + smallAngle), smallR * Math.cos(this.angle + smallAngle)], [smallR * Math.sin(this.angle - smallAngle), smallR * Math.cos(this.angle - smallAngle)], [bigR * Math.sin(this.angle - smallAngle), bigR * Math.cos(this.angle - smallAngle)]];
      faces = [[1, 2, 3], [1, 3, 4]];
      facesData = [];
      verticiesData = [];
      for (_i = 0, _len = faces.length; _i < _len; _i++) {
        face = faces[_i];
        for (_j = 0, _len1 = face.length; _j < _len1; _j++) {
          point = face[_j];
          facesData.push(point - 1 + n);
        }
      }
      for (i = _k = 0, _len2 = verticies.length; _k < _len2; i = ++_k) {
        _ref = verticies[i], x = _ref[0], y = _ref[1];
        verticiesData.push(x);
        verticiesData.push(y);
      }
      return {
        verticiesData: verticiesData,
        facesData: facesData
      };
    };

    return Decal;

  })();

  Hexagon = (function() {

    /*
       1 ____ 2
       /|\  /|\
     6/ | \/ | \3
      \ | /\ | /
      5\|/__\|/4
     */
    function Hexagon(x, y, size, maxRadius, minRadius, zoomFactor) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.maxRadius = maxRadius;
      this.minRadius = minRadius;
      this.zoomFactor = zoomFactor;
    }

    Hexagon.prototype.data = function(n) {
      var bestGuess, edgeLength, face, faces, facesData, fullyInside, fullyOutside, goodVerticies, hexHeight, i, isInside, maxR, minR, point, previousVertex, px, py, r, vertex, verticies, verticiesData, x, y, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref;
      edgeLength = this.size;
      hexHeight = edgeLength / TAN30;
      verticies = [[this.x - edgeLength / 2, this.y + hexHeight / 2], [this.x + edgeLength / 2, this.y + hexHeight / 2], [this.x + edgeLength, this.y], [this.x + edgeLength / 2, this.y - hexHeight / 2], [this.x - edgeLength / 2, this.y - hexHeight / 2], [this.x - edgeLength, this.y]];
      faces = [[1, 4, 2], [2, 4, 3], [1, 5, 4], [1, 6, 5]];
      fullyInside = true;
      fullyOutside = true;
      for (_i = 0, _len = verticies.length; _i < _len; _i++) {
        vertex = verticies[_i];
        r = distanceFromCenter(vertex);
        isInside = (this.minRadius <= r && r <= this.maxRadius);
        vertex.push(isInside);
        fullyInside = fullyInside && isInside;
        fullyOutside = fullyOutside && !isInside;
      }
      if (fullyOutside) {
        verticies = [];
        faces = [];
      } else if (fullyInside) {

      } else {
        minR = this.minRadius;
        maxR = this.maxRadius;
        bestGuess = function(vertex, otherVertex) {
          var badBound, goodBound, guess, i, moveToward, _j, _ref, _ref1, _ref2;
          if ((minR <= (_ref = distanceFromCenter(vertex)) && _ref <= maxR)) {
            _ref1 = [vertex, otherVertex], otherVertex = _ref1[0], vertex = _ref1[1];
          }
          guess = vertex.slice();
          badBound = vertex.slice();
          goodBound = otherVertex.slice();
          moveToward = function(v) {
            guess[0] = (guess[0] + v[0]) / 2;
            guess[1] = (guess[1] + v[1]) / 2;
          };
          moveToward(goodBound);
          for (i = _j = 0; _j <= 5; i = ++_j) {
            if ((minR <= (_ref2 = distanceFromCenter(guess)) && _ref2 <= maxR)) {
              goodBound = guess.slice();
              moveToward(badBound);
            } else {
              badBound = guess.slice();
              moveToward(goodBound);
            }
          }
          return guess;
        };
        goodVerticies = [];
        previousVertex = verticies[5];
        for (_j = 0, _len1 = verticies.length; _j < _len1; _j++) {
          vertex = verticies[_j];
          if (previousVertex[2] !== vertex[2]) {
            goodVerticies.push(bestGuess(vertex, previousVertex));
          }
          if (vertex[2]) {
            goodVerticies.push(vertex);
          }
          previousVertex = vertex;
        }
        verticies = goodVerticies;
        faces = (function() {
          var _k, _ref, _results;
          _results = [];
          for (i = _k = 2, _ref = verticies.length; 2 <= _ref ? _k < _ref : _k > _ref; i = 2 <= _ref ? ++_k : --_k) {
            _results.push([1, i, i + 1]);
          }
          return _results;
        })();
      }
      facesData = [];
      verticiesData = [];
      if (faces.length > 0) {
        for (_k = 0, _len2 = faces.length; _k < _len2; _k++) {
          face = faces[_k];
          for (_l = 0, _len3 = face.length; _l < _len3; _l++) {
            point = face[_l];
            facesData.push(point - 1 + n);
          }
        }
        px = this.x / this.zoomFactor;
        py = this.y / this.zoomFactor;
        for (i = _m = 0, _len4 = verticies.length; _m < _len4; i = ++_m) {
          _ref = verticies[i], x = _ref[0], y = _ref[1];
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
    var colourAdjustmentCode, colourAdjustmentDeclarations;

    function _Class() {
      this.start = __bind(this.start, this);
      this.draw = __bind(this.draw, this);
      this.resizeCanvas = __bind(this.resizeCanvas, this);
    }

    _Class.prototype.VERTEX = 2;

    _Class.prototype.FRAGMENT = 3;

    colourAdjustmentDeclarations = "vec3 pixelColour;\nfloat contrast = 0.8;\nfloat brightness = 0.15;";

    colourAdjustmentCode = "pixelColour = vec3(raw);\npixelColour += brightness;\npixelColour = ((pixelColour - 0.5) * max(contrast, 0.)) + 0.5;\npixelColour.x /= 2.;\npixelColour.x -= 0.3;\npixelColour.y -= 0.15;\npixelColour.z *= 0.55;\npixelColour.z += 0.45;\n\ngl_FragColor = vec4(pixelColour, 1.0);";

    _Class.prototype.hexagonVertexShaderSource = "attribute vec2 position;\nattribute vec2 texPosition;\nuniform float factor;\nuniform float screenRatio;\nvarying vec2 vUV;\n\nvoid main(void) {\n  vec2 pos = position;\n  pos.x *= factor;\n  gl_Position = vec4(pos, 0., 1.);\n  vec2 pos2 = texPosition;\n  pos2.x /= screenRatio;\n  pos2 = pos2 + 1.;\n  pos2 = pos2 / 2.;\n  vUV = pos2;\n}";

    _Class.prototype.hexagonFragmentShaderSource = "precision mediump float;\nuniform sampler2D sampler;\nuniform float brightnessAdjust;\nvarying vec2 vUV;\n\n" + colourAdjustmentDeclarations + "\n\nvoid main(void) {\n  vec4 raw = texture2D(sampler, vUV);\n  brightness += brightnessAdjust;\n  " + colourAdjustmentCode + "\n}";

    _Class.prototype.bumpVertexShaderSource = "attribute vec2 position;\nattribute float r;\nuniform float factor;\nuniform float screenRatio;\nvarying vec2 vUV;\nvarying float vR;\n\nvoid main(void) {\n  vec2 pos = position;\n  pos.x *= factor;\n  gl_Position = vec4(pos, 0., 1.);\n  vec2 pos2 = position;\n  pos2.x /= screenRatio;\n  pos2 = pos2 + 1.;\n  pos2 = pos2 / 2.;\n  vR = r;\n  vUV = pos2;\n}";

    _Class.prototype.bumpFragmentShaderSource = "precision mediump float;\nuniform sampler2D sampler;\nvarying vec2 vUV;\nvarying float vR;\n\n" + colourAdjustmentDeclarations + "\n\nvoid main(void) {\n  vec2 uv = vUV * 2. - 1.;\n  uv[0] *= pow(vR, 1.3);\n  uv[1] *= pow(vR, 1.3);\n  uv = (uv + 1.) / 2.;\n  vec4 raw = texture2D(sampler, uv);\n  " + colourAdjustmentCode + "\n}";

    _Class.prototype.backgroundVertexShaderSource = "attribute vec2 position;\nuniform float factor;\nuniform float screenRatio;\nvarying vec2 vUV;\n\nvoid main(void) {\n  gl_Position = vec4(position, 0., 1.);\n  vec2 pos2 = position;\n  pos2.x /= factor;\n  pos2.x /= screenRatio;\n  pos2 = pos2 + 1.;\n  pos2 = pos2 / 2.;\n  vUV = pos2;\n}";

    _Class.prototype.backgroundFragmentShaderSource = "precision mediump float;\nuniform sampler2D sampler;\nvarying vec2 vUV;\nfloat darkenAmount = 0.6;\n\n" + colourAdjustmentDeclarations + "\n\nvoid main(void) {\n  vec4 raw = texture2D(sampler, vUV);\n  raw = vec4(vec3(raw) - darkenAmount, 1.);\n  " + colourAdjustmentCode + "\n  gl_FragColor = vec4(pixelColour, 1.);\n}";

    _Class.prototype.decalVertexShaderSource = "attribute vec2 position;\nuniform float factor;\nuniform float screenRatio;\nuniform float angle;\n\nvoid main(void) {\n  vec2 pos = position;\n  pos.x *= factor;\n  gl_Position = vec4(pos, 0., 1.);\n}";

    _Class.prototype.decalFragmentShaderSource = "precision mediump float;\n\nvoid main(void) {\n  gl_FragColor = vec4(0.4, 0.7, 1., 0.2);\n}";

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

    _Class.prototype.createNamedShader = function(name, attributes, uniforms) {
      var fragmentShader, shaderProgram, varName, vertexShader, _i, _j, _len, _len1;
      vertexShader = this.getShader(this.GL.VERTEX_SHADER, this["" + name + "VertexShaderSource"]);
      fragmentShader = this.getShader(this.GL.FRAGMENT_SHADER, this["" + name + "FragmentShaderSource"]);
      shaderProgram = this.GL.createProgram();
      this.GL.attachShader(shaderProgram, vertexShader);
      this.GL.attachShader(shaderProgram, fragmentShader);
      this.GL.linkProgram(shaderProgram);
      for (_i = 0, _len = attributes.length; _i < _len; _i++) {
        varName = attributes[_i];
        shaderProgram["_" + varName] = this.GL.getAttribLocation(shaderProgram, varName);
      }
      for (_j = 0, _len1 = uniforms.length; _j < _len1; _j++) {
        varName = uniforms[_j];
        shaderProgram["_" + varName] = this.GL.getUniformLocation(shaderProgram, varName);
      }
      shaderProgram.use = (function(_this) {
        return function(fn) {
          var _k, _l, _len2, _len3;
          _this.GL.useProgram(shaderProgram);
          for (_k = 0, _len2 = attributes.length; _k < _len2; _k++) {
            varName = attributes[_k];
            _this.GL.enableVertexAttribArray(shaderProgram["_" + varName]);
          }
          fn(shaderProgram);
          for (_l = 0, _len3 = attributes.length; _l < _len3; _l++) {
            varName = attributes[_l];
            _this.GL.disableVertexAttribArray(shaderProgram["_" + varName]);
          }
        };
      })(this);
      return shaderProgram;
    };

    _Class.prototype.createVertexAndFaceBuffers = function(object, triangleVertexData, triangleFacesData) {
      object.triangleVertexData = triangleVertexData;
      object.triangleVertex = this.GL.createBuffer();
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, object.triangleVertex);
      this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(triangleVertexData), this.GL.STATIC_DRAW);
      object.triangleFacesData = triangleFacesData;
      object.triangleFaces = this.GL.createBuffer();
      this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, object.triangleFaces);
      this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleFacesData), this.GL.STATIC_DRAW);
      return object;
    };

    _Class.prototype.initHexagons = function(hexagonsHigh, widthToHeight, minR, maxR, zoomFactor) {
      var col, datum, facesData, fiddle, hexagon, hexagons, highIndex, i, offsetX, offsetY, previousVerticiesCount, row, size, triangleFacesData, triangleVertexData, verticiesData, x, y, _i, _j, _k, _l, _len, _len1, _len2, _m, _ref;
      hexagons = [];
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
          hexagons.push(new Hexagon(x, y, size, maxR, minR, zoomFactor));
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
      this.createVertexAndFaceBuffers(hexagons, triangleVertexData, triangleFacesData);
      return hexagons;
    };

    _Class.prototype.initCircleSegments = function(segmentCount, radius) {
      var angle, angleStep, face, faces, i, point, segments, triangleFacesData, triangleVertexData, vertex, verticies, _i, _j, _k, _l, _len, _len1, _len2, _m;
      segments = {};
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
        triangleVertexData.push((i === 0 ? INNER_BUMP_R : 1));
      }
      triangleFacesData = [];
      for (_l = 0, _len1 = faces.length; _l < _len1; _l++) {
        face = faces[_l];
        for (_m = 0, _len2 = face.length; _m < _len2; _m++) {
          point = face[_m];
          triangleFacesData.push(point);
        }
      }
      this.createVertexAndFaceBuffers(segments, triangleVertexData, triangleFacesData);
      return segments;
    };

    _Class.prototype.initBackgroundSquare = function() {
      var square, triangleFacesData, triangleVertexData;
      square = {};
      triangleVertexData = [-1, -1, 1, -1, 1, 1, -1, 1];
      triangleFacesData = [0, 1, 2, 0, 2, 3];
      this.createVertexAndFaceBuffers(square, triangleVertexData, triangleFacesData);
      return square;
    };

    _Class.prototype.initDecals = function(inner) {
      var angle, angleStep, datum, decal, decalCount, decals, facesData, i, large, largeDecalCount, previousVerticiesCount, r, r2, smallDecalCount, triangleFacesData, triangleVertexData, verticiesData, _i, _j, _k, _l, _len, _len1, _len2, _ref;
      decals = [];
      r = inner ? INNER_RING_RADIUS : OUTER_RING_RADIUS;
      r2 = r - (OUTER_RING_RADIUS - INNER_RING_RADIUS) / 2;
      smallDecalCount = 10;
      largeDecalCount = 5;
      decalCount = ((smallDecalCount + 1) * largeDecalCount) + 1;
      angleStep = (Math.PI * 2) / 4 / (decalCount - 1);
      for (i = _i = 0; 0 <= decalCount ? _i < decalCount : _i > decalCount; i = 0 <= decalCount ? ++_i : --_i) {
        large = i % (smallDecalCount + 1) === 0;
        angle = i * angleStep;
        if (!inner) {
          angle -= Math.PI / 2;
        }
        decals.push(new Decal(r, angle, large));
        decals.push(new Decal(r, angle + Math.PI, large));
        if (i === 0 || i === decalCount - 1) {
          decals.push(new Decal(r2, angle, large));
          decals.push(new Decal(r2, angle + Math.PI, large));
        }
      }
      triangleVertexData = [];
      triangleFacesData = [];
      for (i = _j = 0, _len = decals.length; _j < _len; i = ++_j) {
        decal = decals[i];
        previousVerticiesCount = triangleVertexData.length / 2;
        _ref = decal.data(previousVerticiesCount), verticiesData = _ref.verticiesData, facesData = _ref.facesData;
        for (_k = 0, _len1 = verticiesData.length; _k < _len1; _k++) {
          datum = verticiesData[_k];
          triangleVertexData.push(datum);
        }
        for (_l = 0, _len2 = facesData.length; _l < _len2; _l++) {
          datum = facesData[_l];
          triangleFacesData.push(datum);
        }
      }
      this.createVertexAndFaceBuffers(decals, triangleVertexData, triangleFacesData);
      return decals;
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
      var e;
      try {
        this.initCanvas();
        this.initGLContext();
        this.shaderProgram = this.createNamedShader('hexagon', ['position', 'texPosition'], ['factor', 'screenRatio', 'sampler', 'brightnessAdjust']);
        this.bumpShaderProgram = this.createNamedShader('bump', ['position', 'r'], ['factor', 'screenRatio', 'sampler']);
        this.backgroundShaderProgram = this.createNamedShader('background', ['position'], ['factor', 'screenRatio', 'sampler']);
        this.decalShaderProgram = this.createNamedShader('decal', ['position'], ['factor', 'screenRatio', 'angle']);
        this.bigHexagons = this.initHexagons(HEXAGONS_HIGH, SCREEN_RATIO, OUTER_RING_RADIUS + RING_WIDTH, Infinity, OUTER_ZOOM_FACTOR);
        this.smallHexagons = this.initHexagons(SMALL_HEXAGONS_HIGH, 1, INNER_RING_RADIUS + RING_WIDTH, OUTER_RING_RADIUS, INNER_ZOOM_FACTOR);
        this.circleSegments = this.initCircleSegments(CIRCLE_SEGMENTS, INNER_RING_RADIUS);
        this.backgroundSquare = this.initBackgroundSquare();
        this.innerDecals = this.initDecals(true);
        this.outerDecals = this.initDecals(false);
        this.initTexture();
        this.image = document.getElementsByTagName('img')[0];
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
      var textureSource;
      this.GL.viewport(0.0, 0.0, this.canvas.width, this.canvas.height);
      this.GL.clear(this.GL.COLOR_BUFFER_BIT);
      this.GL.bindTexture(this.GL.TEXTURE_2D, this.texture);
      textureSource = this.video.loaded && !this.video.paused ? this.video : this.image;
      this.GL.texImage2D(this.GL.TEXTURE_2D, 0, this.GL.RGBA, this.GL.RGBA, this.GL.UNSIGNED_BYTE, textureSource);
      this.backgroundShaderProgram.use((function(_this) {
        return function() {
          _this.GL.uniform1f(_this.backgroundShaderProgram._factor, canvas.height / canvas.width);
          _this.GL.uniform1f(_this.backgroundShaderProgram._screenRatio, SCREEN_RATIO);
          _this.GL.uniform1i(_this.backgroundShaderProgram._sampler, 0);
          _this.GL.bindBuffer(_this.GL.ARRAY_BUFFER, _this.backgroundSquare.triangleVertex);
          _this.GL.vertexAttribPointer(_this.backgroundShaderProgram._position, 2, _this.GL.FLOAT, false, 4 * (2 + 0), 0);
          _this.GL.bindBuffer(_this.GL.ELEMENT_ARRAY_BUFFER, _this.backgroundSquare.triangleFaces);
          return _this.GL.drawElements(_this.GL.TRIANGLES, _this.backgroundSquare.triangleFacesData.length, _this.GL.UNSIGNED_SHORT, 0);
        };
      })(this));
      this.shaderProgram.use((function(_this) {
        return function() {
          var hexagons, i, _i, _len, _ref, _results;
          _this.GL.uniform1f(_this.shaderProgram._factor, canvas.height / canvas.width);
          _this.GL.uniform1f(_this.shaderProgram._screenRatio, SCREEN_RATIO);
          _this.GL.uniform1i(_this.shaderProgram._sampler, 0);
          _ref = [_this.bigHexagons, _this.smallHexagons];
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            hexagons = _ref[i];
            _this.GL.uniform1f(_this.shaderProgram._brightnessAdjust, (i === 0 ? -0.14 : -0.06));
            _this.GL.bindBuffer(_this.GL.ARRAY_BUFFER, hexagons.triangleVertex);
            _this.GL.vertexAttribPointer(_this.shaderProgram._position, 2, _this.GL.FLOAT, false, 4 * (2 + 2), 0);
            _this.GL.vertexAttribPointer(_this.shaderProgram._texPosition, 2, _this.GL.FLOAT, false, 4 * (2 + 2), 2 * 4);
            _this.GL.bindBuffer(_this.GL.ELEMENT_ARRAY_BUFFER, hexagons.triangleFaces);
            _results.push(_this.GL.drawElements(_this.GL.TRIANGLES, hexagons.triangleFacesData.length, _this.GL.UNSIGNED_SHORT, 0));
          }
          return _results;
        };
      })(this));
      this.bumpShaderProgram.use((function(_this) {
        return function() {
          _this.GL.uniform1f(_this.bumpShaderProgram._factor, canvas.height / canvas.width);
          _this.GL.uniform1f(_this.bumpShaderProgram._screenRatio, SCREEN_RATIO);
          _this.GL.uniform1i(_this.bumpShaderProgram._sampler, 0);
          _this.GL.bindBuffer(_this.GL.ARRAY_BUFFER, _this.circleSegments.triangleVertex);
          _this.GL.vertexAttribPointer(_this.bumpShaderProgram._position, 2, _this.GL.FLOAT, false, 4 * (2 + 1), 0);
          _this.GL.vertexAttribPointer(_this.bumpShaderProgram._r, 1, _this.GL.FLOAT, false, 4 * (2 + 1), 4 * 2);
          _this.GL.bindBuffer(_this.GL.ELEMENT_ARRAY_BUFFER, _this.circleSegments.triangleFaces);
          return _this.GL.drawElements(_this.GL.TRIANGLES, _this.circleSegments.triangleFacesData.length, _this.GL.UNSIGNED_SHORT, 0);
        };
      })(this));
      this.decalShaderProgram.use((function(_this) {
        return function() {
          var decals, i, _i, _len, _ref, _results;
          _this.GL.uniform1f(_this.decalShaderProgram._factor, canvas.height / canvas.width);
          _this.GL.uniform1f(_this.decalShaderProgram._screenRatio, SCREEN_RATIO);
          _this.GL.uniform1f(_this.decalShaderProgram._angle, 0);
          _ref = [_this.innerDecals, _this.outerDecals];
          _results = [];
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            decals = _ref[i];
            _this.GL.bindBuffer(_this.GL.ARRAY_BUFFER, decals.triangleVertex);
            _this.GL.vertexAttribPointer(_this.decalShaderProgram._position, 2, _this.GL.FLOAT, false, 4 * (2 + 0), 0);
            _this.GL.bindBuffer(_this.GL.ELEMENT_ARRAY_BUFFER, decals.triangleFaces);
            _results.push(_this.GL.drawElements(_this.GL.TRIANGLES, decals.triangleFacesData.length, _this.GL.UNSIGNED_SHORT, 0));
          }
          return _results;
        };
      })(this));
      this.GL.flush();
      window.requestAnimationFrame(this.draw);
    };

    _Class.prototype.run = function() {
      this.draw();
      return navigator.webkitGetUserMedia({
        video: true
      }, (function(_this) {
        return function(localMediaStream) {
          _this.video.src = window.URL.createObjectURL(localMediaStream);
          return _this.video.loaded = true;
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
