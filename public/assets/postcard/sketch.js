let img, maskImg, maskGraphic;
let flowers, girl;
let universFont;
let interlopeFont;

// Current flavour config (will be set in setup)
let currentFlavour;

// Postcard flip state
let postcardState = 'front'; // 'front' | 'flipping' | 'back'
let flipProgress = 0;
let frontImg = null;
let frontImgData = null;
let backImgData = null;


// FLAVOUR CONFIGURATIONS
// Each flavour defines which keys trigger which effects
const flavours = {
  original: {
    name: 'Original',
    palettes: { primary: 'cherryBlossomBloom', secondary: 'palette2' },
    intensity: 1.0,
    keyMap: {
      dots: ['e','E'],
      lines: ['t','T'],
      shapes: ['a','A'],
      rings: ['o','O'],
      verticalMarks: ['i','I'],
      wavyLines: ['n','N'],
      snakes: ['s','S'],
      horizontalBars: ['h','H'],
      rectangles: ['r','R'],
      columns: ['l','L'],
      diagonals: ['d','D'],
      ripples: ['c','C'],
      arches: ['u','U'],
      mountains: ['m','M'],
      waves: ['w','W'],
      flowers: ['f','F'],
      grid: ['g','G'],
      trees: ['y','Y'],
      bubbles: ['p','P'],
      girl: ['b','B'],
      verticalGlitch: ['v','V'],
      kaleidoscope: ['k','K'],
      jitter: ['j','J'],
      xMarks: ['x','X'],
      maskedImage: ['q','Q'],
      threshold: ['z','Z'],
      pixelGlitch: ['1','2','3'],
      colorShift: ['4','5','6'],
      filters: ['7','8','9','0'],
      trustMeLarge: ['.'],
      trustMePoints: ['!','?'],
      sparkles: [',',';',':'],
      quotes: ["'",'"'],
      symbols: ['@','#','$','%'],
      frames: ['(',')','[',']','{','}'],
      // Classic effects (not used in original)
      tallRects: [],
      shortRects: [],
      purpleGrid: [],
      diagonalFlowers: [],
      thresholdMirror: []
    }
  },

  periwink: {
    name: 'periwink',
    palettes: { primary: 'periwink', secondary: 'palette2' },
    intensity: 1.5,
    keyMap: {
      dots: ['e','E','a','A'],
      lines: ['t','T','l','L'],
      shapes: ['s','S'],
      rings: ['o','O','c','C'],
      verticalMarks: ['i','I'],
      wavyLines: ['w','W'],
      snakes: ['u','U'],
      horizontalBars: ['h','H'],
      rectangles: ['r','R','d','D'],
      columns: ['k','K'],
      diagonals: [],
      ripples: ['q','Q','x','X',],
      arches: [],
      mountains: ['m','M'],
      waves: [],
      flowers: ['f','F','p','P'],
      grid: ['g','G'],
      trees: ['y','Y'],
      bubbles: ['b','B'],
      girl: ['n','N','z','Z'],  
      verticalGlitch: ['v','V','j','J'],
      kaleidoscope: [],
      jitter: [],
      xMarks: [],
      maskedImage: [],
      threshold: [],
      pixelGlitch: ['1','2','3'],
      colorShift: ['4','5','6'],
      filters: ['7','8','9','0'],
      trustMeLarge: ['.'],
      trustMePoints: ['!','?'],
      sparkles: [',',';',':'],
      quotes: ["'",'"'],
      symbols: ['@','#','$','%'],
      frames: ['(',')','[',']','{','}'],
      // Classic effects (not used in periwink)
      tallRects: [],
      shortRects: [],
      purpleGrid: [],
      diagonalFlowers: [],
      thresholdMirror: []
    }
  },

  minimal: {
    name: 'Minimal',
    palettes: { primary: 'mini', secondary: 'mini' },
    intensity: 0.5,
    keyMap: {
      dots: ['e','E','a','A','o','O','i','I'],
      lines: ['t','T','n','N','s','S','l','L'],
      shapes: [],
      rings: [],
      verticalMarks: [],
      wavyLines: [],
      snakes: [],
      horizontalBars: ['h','H'],
      rectangles: ['r','R'],
      columns: [],
      diagonals: ['d','D'],
      ripples: ['c','C'],
      arches: ['u','U'],
      mountains: [],
      waves: ['w','W'],
      flowers: [],
      grid: [],
      trees: [],
      bubbles: ['p','P'],
      girl: [],
      verticalGlitch: [],
      kaleidoscope: [],
      jitter: [],
      xMarks: [],
      maskedImage: [],
      threshold: [],
      pixelGlitch: [],
      colorShift: [],
      filters: [],
      trustMeLarge: ['.'],
      trustMePoints: [],
      sparkles: [',',';',':','!','?'],
      quotes: ["'",'"'],
      symbols: [],
      frames: ['(',')','[',']','{','}'],
      // Classic effects (not used in minimal)
      tallRects: [],
      shortRects: [],
      purpleGrid: [],
      diagonalFlowers: [],
      thresholdMirror: []
    }
  },

  classic: {
    name: 'Classic',
    palettes: { primary: 'cherryBlossomBloom', secondary: 'palette2' },
    intensity: 1.0,
    keyMap: {
      // Disable most new effects
      dots: [],
      lines: [],
      shapes: [],
      rings: [],
      verticalMarks: [],
      wavyLines: [],
      snakes: [],
      horizontalBars: [],
      rectangles: [],
      columns: [],
      diagonals: [],
      ripples: [],
      arches: [],
      mountains: [],
      waves: [],
      flowers: [],
      grid: [],
      trees: [],
      bubbles: [],
      kaleidoscope: [],
      jitter: [],
      xMarks: [],
      colorShift: [],
      filters: [],
      quotes: [],
      symbols: [],
      frames: [],
      sparkles: [],
      // Classic effects
      tallRects: ['a','o','A','O'],
      shortRects: ['e','i','E','I'],
      purpleGrid: ['u','y','U','Y'],
      diagonalFlowers: ['b','c','d','f','g','B','C','D','F','G'],
      girl: ['h','j','k','l','m','H','J','K','L','M'],
      bubbles: ['n','p','q','r','s','N','P','Q','R','S'],
      thresholdMirror: ['t','v','w','x','z','T','V','W','X','Z'],
      pixelGlitch: ['1','2','3','4','5'],
      maskedImage: ['6','7','8','9','0'],
      verticalGlitch: [':',',',';'],
      trustMeLarge: ['.','!'],
      trustMePoints: ["'",'"','@','(',')']
    }
  }
};

// Helper function to check if key matches an effect in current flavour
function keyMatches(effectName) {
  return currentFlavour.keyMap[effectName]?.includes(key) || false;
}

// Helper to get palette by name
function getPalette(name) {
  if (name === 'cherryBlossomBloom') return cherryBlossomBloom;
  if (name === 'palette2') return palette2;
  if (name === 'palette1') return palette1;
  if (name === 'mini') return mini;
  if (name === 'periwink') return periwink;
  return palette2;
}

// Get primary/secondary palette for current flavour
function primaryPalette() {
  return getPalette(currentFlavour.palettes.primary);
}

function secondaryPalette() {
  return getPalette(currentFlavour.palettes.secondary);
}

function preload() {
  img = loadImage('/assets/postcard/gfx/015.GIF');
  maskImg = loadImage('/assets/postcard/gfx/picmix.gif');
  universFont = loadFont('/assets/postcard/fonts/UniversBold.ttf');
  interlopeFont = loadFont('/assets/postcard/fonts/Interlope-Regular.ttf');
  girl = loadImage('/assets/postcard/gfx/giribal.gif');
  flowers = loadImage('/assets/postcard/gfx/flowers02.gif');
}

function setup() {
  let canvas = createCanvas(480, 480);
  canvas.parent('canvas-container');
  background(0); // Match body background #000
  noStroke();
  textFont(interlopeFont);

  // Reference HTML elements
  let userInput = select('#userInput');
  let flavourSelect = select('#flavourSelect');

  // Track previous text length for detecting backspace
  let previousLength = 0;

  // Handle input for art creation
  userInput.input(function() {
    let currentText = this.value();
    let currentLength = currentText.length;

      // Check if text was deleted (backspace/delete)
    if (currentLength < previousLength) {
      keyCode = BACKSPACE;
      keyPressed();
    }
    // Text was added
    else if (currentLength > previousLength) {
      let lastChar = currentText.charAt(currentLength - 1);
      key = lastChar;
      keyTyped(); // Trigger the art creation!
    }

    previousLength = currentLength;
  });

  // Initialize current flavour
  currentFlavour = flavours.classic;

  // Handle flavour selection
  flavourSelect.changed(function() {
    let flavourName = this.value();
    currentFlavour = flavours[flavourName];
    console.log('Switched to flavour:', currentFlavour.name);
    // Clear canvas when switching flavours
    background(27, 27, 27);
  });

  frameRate(3);
  img.mask(maskImg);

  maskGraphic = createGraphics(100, 40);
  maskGraphic.background(0);
  maskGraphic.fill(255);
  maskGraphic.ellipse(50, 20, 80, 30);
}

function draw() {
  if (postcardState !== 'flipping') return;

  const FLIP_SPEED = 16;
  const DITHER_EDGE = 48;
  const CELL = 4;

  image(frontImg, 0, 0);

  noStroke();
  fill(255);
  rect(0, 0, max(0, flipProgress - DITHER_EDGE), height);

  for (let x = max(0, flipProgress - DITHER_EDGE); x < min(width, flipProgress); x += CELL) {
    let t = (x - (flipProgress - DITHER_EDGE)) / DITHER_EDGE;
    for (let y = 0; y < height; y += CELL) {
      if (random() < t) {
        fill(255);
        rect(x, y, CELL, CELL);
      }
    }
  }

  flipProgress += FLIP_SPEED;

  if (flipProgress >= width + DITHER_EDGE) {
    postcardState = 'back';
    frameRate(3);
    showBackSide();
  }
}

function keyTyped() {
  const activeEl = document.activeElement;
  if (activeEl === document.getElementById('senderName') ||
      activeEl === document.getElementById('recipientEmail')) {
    // TODO: border decoration — each keypress places a randomly picked graphic
    // along the edges of the backside canvas (top/bottom/left/right strip),
    // without overlapping the central text area.
    // Graphics to pick from: TBD (new assets to be added to gfx/)
    // See plan notes for sizing, placement logic, and asset list.
    return;
  }
  textFont(interlopeFont);
  let intensity = currentFlavour.intensity;

  // === DOTS ===
  if (keyMatches('dots')) {
    let count = random(15, 35) * intensity;
    for (let j = 0; j < count; j++) {
      let c = color(random(primaryPalette()));
      c.setAlpha(random(80, 220));
      fill(c);
      let size = random(1, 25);
      let x = random(width);
      let y = random(height);
      if (random() > 0.6) {
        circle(x, y, size);
      } else {
        rect(x, y, size, size);
      }
    }
  }

  // === LINES ===
  if (keyMatches('lines')) {
    let lineCount = floor(random(5, 12) * intensity);
    for (let j = 0; j < lineCount; j++) {
      let c = color(random(secondaryPalette()));
      c.setAlpha(random(100, 200));
      stroke(c);
      strokeWeight(random(1, 4));
      let x1 = random(width);
      let y1 = random(height);
      let x2 = x1 + random(-150, 150);
      let y2 = y1 + random(-150, 150);
      line(x1, y1, x2, y2);
    }
    noStroke();
  }

  // === SHAPES ===
  if (keyMatches('shapes')) {
    let count = floor(random(8, 20) * intensity);
    for (let j = 0; j < count; j++) {
      let c = color(random(primaryPalette()));
      c.setAlpha(random(60, 180));
      fill(c);
      let x = random(width);
      let y = random(height);
      let size = random(5, 40);
      let shapeType = floor(random(4));
      if (shapeType === 0) {
        rect(x, y, size, size);
      } else if (shapeType === 1) {
        circle(x, y, size);
      } else if (shapeType === 2) {
        triangle(x, y, x + size, y + size, x + random(-size/2, size/2), y + size);
      } else {
        push();
        translate(x, y);
        rotate(random(TWO_PI));
        rect(-size/4, -size/4, size/2, size/2);
        pop();
      }
    }
  }

  // === RINGS ===
  if (keyMatches('rings')) {
    let count = floor(random(5, 15) * intensity);
    for (let j = 0; j < count; j++) {
      noFill();
      let c = color(random(primaryPalette()));
      c.setAlpha(random(80, 200));
      stroke(c);
      strokeWeight(random(1, 5));
      let x = random(width);
      let y = random(height);
      let size = random(10, 120);
      circle(x, y, size);
    }
    for (let j = 0; j < 5; j++) {
      let c = color(random(secondaryPalette()));
      c.setAlpha(random(100, 180));
      fill(c);
      circle(random(width), random(height), random(5, 20));
    }
    noStroke();
  }

  // === VERTICAL MARKS ===
  if (keyMatches('verticalMarks')) {
    let count = floor(random(10, 20) * intensity);
    for (let j = 0; j < count; j++) {
      let x = random(width);
      let y = random(height);
      let c = color(random(secondaryPalette()));
      c.setAlpha(random(120, 200));
      fill(c);
      rect(x, y, random(1, 6), random(10, 60));
      if (random() > 0.4) {
        circle(x + 2, y - random(5, 15), random(2, 8));
      }
    }
  }

  // === WAVY LINES ===
  if (keyMatches('wavyLines')) {
    let count = floor(random(3, 8) * intensity);
    for (let k = 0; k < count; k++) {
      let c = color(random(primaryPalette()));
      c.setAlpha(random(120, 200));
      stroke(c);
      strokeWeight(random(1, 5));
      noFill();
      beginShape();
      let startX = random(width);
      let startY = random(height);
      for (let i = 0; i < 8; i++) {
        curveVertex(startX + i * 15, startY + sin(i + k) * random(15, 50));
      }
      endShape();
    }
    noStroke();
  }

  // === SNAKES ===
  if (keyMatches('snakes')) {
    let count = floor(random(4, 10) * intensity);
    for (let j = 0; j < count; j++) {
      noFill();
      let c = color(random(secondaryPalette()));
      c.setAlpha(random(140, 220));
      stroke(c);
      strokeWeight(random(2, 7));
      let x = random(width);
      let y = random(height);
      bezier(x, y,
             x + random(30, 80), y + random(-60, 60),
             x + random(-40, 40), y + random(60, 120),
             x + random(-30, 30), y + random(90, 140));
    }
    noStroke();
  }

  // === HORIZONTAL BARS ===
  if (keyMatches('horizontalBars')) {
    let count = floor(random(7, 15) * intensity);
    for (let j = 0; j < count; j++) {
      let c = color(random(primaryPalette()));
      c.setAlpha(random(100, 220));
      fill(c);
      let y = random(height);
      rect(random(width * 0.1), y, random(80, 300), random(2, 18));
    }
  }

  // === RECTANGLES ===
  if (keyMatches('rectangles')) {
    let count = random(15, 30) * intensity;
    for (let j = 0; j < count; j++) {
      let c = color(random(secondaryPalette()));
      c.setAlpha(random(80, 200));
      fill(c);
      rect(random(width), random(height), random(3, 30), random(3, 30));
    }
  }

  // === COLUMNS ===
  if (keyMatches('columns')) {
    let count = floor(random(8, 16) * intensity);
    for (let j = 0; j < count; j++) {
      let c = color(random(primaryPalette()));
      c.setAlpha(random(110, 220));
      fill(c);
      let x = random(width);
      rect(x, random(height * 0.2), random(2, 15), random(40, 180));
    }
  }

  // === DIAGONALS ===
  if (keyMatches('diagonals')) {
    let count = floor(random(8, 18) * intensity);
    for (let j = 0; j < count; j++) {
      push();
      translate(random(width), random(height));
      rotate(random(-PI, PI));
      let c = color(random(secondaryPalette()));
      c.setAlpha(random(130, 200));
      fill(c);
      rect(0, 0, random(20, 100), random(4, 20));
      pop();
    }
  }

  // === RIPPLES ===
  if (keyMatches('ripples')) {
    let centerCount = floor(random(3, 7) * intensity);
    for (let k = 0; k < centerCount; k++) {
      let x = random(width);
      let y = random(height);
      let rings = floor(random(3, 8));
      noFill();
      for (let i = 0; i < rings; i++) {
        let c = color(random(primaryPalette()));
        c.setAlpha(random(80, 220));
        stroke(c);
        strokeWeight(random(1, 4));
        circle(x, y, 15 + i * random(10, 25));
      }
    }
    noStroke();
  }

  // === ARCHES ===
  if (keyMatches('arches')) {
    let count = floor(random(5, 12) * intensity);
    for (let j = 0; j < count; j++) {
      noFill();
      let c = color(random(secondaryPalette()));
      c.setAlpha(random(150, 230));
      stroke(c);
      strokeWeight(random(2, 7));
      let arcType = random();
      if (arcType < 0.33) {
        arc(random(width), random(height), random(30, 100), random(30, 100), 0, PI, OPEN);
      } else if (arcType < 0.66) {
        arc(random(width), random(height), random(30, 100), random(30, 100), PI, TWO_PI, OPEN);
      } else {
        arc(random(width), random(height), random(30, 100), random(30, 100), random(TWO_PI), random(TWO_PI), OPEN);
      }
    }
    noStroke();
  }

  // === MOUNTAINS ===
  if (keyMatches('mountains')) {
    let ranges = floor(random(2, 5) * intensity);
    for (let r = 0; r < ranges; r++) {
      let c = color(random(primaryPalette()));
      c.setAlpha(random(100, 200));
      fill(c);
      let x = random(width);
      let y = random(height);
      let peaks = floor(random(3, 8));
      for (let i = 0; i < peaks; i++) {
        triangle(x + i * random(20, 40), y,
                 x + i * random(20, 40) + random(10, 25), y - random(25, 80),
                 x + i * random(20, 40) + random(25, 45), y);
      }
    }
  }

  // === WAVES ===
  if (keyMatches('waves')) {
    let count = floor(random(4, 10) * intensity);
    for (let k = 0; k < count; k++) {
      let c = color(random(primaryPalette()));
      c.setAlpha(random(120, 200));
      stroke(c);
      strokeWeight(random(1, 6));
      noFill();
      beginShape();
      let startY = random(height);
      let freq = random(0.02, 0.08);
      for (let i = 0; i < width; i += 10) {
        vertex(i, startY + sin(i * freq + k) * random(15, 50));
      }
      endShape();
    }
    noStroke();
  }

  // === FLOWERS ===
  if (keyMatches('flowers')) {
    let count = floor(random(3, 10) * intensity);
    for (let j = 0; j < count; j++) {
      push();
      translate(random(width), random(height));
      scale(random(0.2, 1.0));
      rotate(random(TWO_PI));
      tint(255, random(150, 255));
      image(flowers, 0, 0);
      noTint();
      pop();
    }
  }

  // === GRID ===
  if (keyMatches('grid')) {
    let gridCount = floor(random(2, 5) * intensity);
    for (let g = 0; g < gridCount; g++) {
      let x = random(width - 180);
      let y = random(height - 180);
      let cols = floor(random(4, 12));
      let rows = floor(random(4, 12));
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let c = color(random(secondaryPalette()));
          c.setAlpha(random(80, 220));
          fill(c);
          rect(x + i * random(10, 20), y + j * random(10, 20), random(6, 15), random(6, 15));
        }
      }
    }
  }

  // === TREES ===
  if (keyMatches('trees')) {
    let count = floor(random(5, 15) * intensity);
    for (let j = 0; j < count; j++) {
      let x = random(width);
      let y = random(height);
      let c = color(random(primaryPalette()));
      c.setAlpha(random(150, 220));
      stroke(c);
      strokeWeight(random(1, 5));
      let stemLength = random(25, 70);
      line(x, y, x, y - stemLength);
      line(x, y - stemLength * 0.6, x - random(10, 30), y - stemLength);
      line(x, y - stemLength * 0.6, x + random(10, 30), y - stemLength);
    }
    noStroke();
  }

  // === BUBBLES ===
  if (keyMatches('bubbles')) {
    let clusterCount = floor(random(3, 8) * intensity);
    for (let c = 0; c < clusterCount; c++) {
      let centerX = random(width);
      let centerY = random(height);
      let count = floor(random(5, 15));
      for (let j = 0; j < count; j++) {
        let col = color(random(primaryPalette()));
        col.setAlpha(random(100, 220));
        fill(col);
        let offsetX = random(-60, 60);
        let offsetY = random(-60, 60);
        circle(centerX + offsetX, centerY + offsetY, random(5, 40));
      }
    }
  }

  // === GIRL IMAGE ===
  if (keyMatches('girl')) {
    let count = floor(random(2, 6) * intensity);
    for (let j = 0; j < count; j++) {
      push();
      translate(random(width), random(height));
      scale(random(0.2, 1.0));
      rotate(random(-0.3, 0.3));
      tint(255, random(120, 255));
      image(girl, 0, 0);
      noTint();
      pop();
    }
  }

  // === VERTICAL GLITCH ===
  if (keyMatches('verticalGlitch')) {
    let count = floor(random(3, 8) * intensity);
    for (let j = 0; j < count; j++) {
      let stripWidth = random(15, 80);
      let sourceX = random(width - stripWidth);
      let destX = random(width - stripWidth);
      let strip = get(sourceX, 0, stripWidth, height);
      let filterType = random();
      if (filterType < 0.5) {
        strip.filter(DILATE);
      } else {
        strip.filter(ERODE);
      }
      image(strip, destX, 0);
    }
  }

  // === KALEIDOSCOPE ===
  if (keyMatches('kaleidoscope')) {
    let section = get(0, 0, width/2, height/2);
    if (random() > 0.5) {
      section.filter(INVERT);
    }

    push();
    let tintCol1 = color(random(primaryPalette()));
    tintCol1.setAlpha(random(180, 255));
    tint(tintCol1);
    scale(-1, 1);
    image(section, -width, 0, width/2, height/2);
    pop();

    push();
    let tintCol2 = color(random(primaryPalette()));
    tintCol2.setAlpha(random(180, 255));
    tint(tintCol2);
    scale(1, -1);
    image(section, 0, -height, width/2, height/2);
    pop();

    push();
    let tintCol3 = color(random(primaryPalette()));
    tintCol3.setAlpha(random(180, 255));
    tint(tintCol3);
    scale(-1, -1);
    image(section, -width, -height, width/2, height/2);
    pop();
    noTint();
  }

  // === JITTER ===
  if (keyMatches('jitter')) {
    loadPixels();
    let d = pixelDensity();
    for (let pass = 0; pass < 3; pass++) {
      let offset = floor(random(5, 70));
      for (let y = 0; y < height; y++) {
        if (random() > 0.5) {
          let rowStart = 4 * (y * width * d * d);
          let rowEnd = rowStart + (width * 4 * d * d);
          for (let i = rowStart; i < rowEnd - offset * 4; i += 4) {
            pixels[i] = pixels[i + offset * 4];
            pixels[i + 1] = pixels[i + offset * 4 + 1];
            pixels[i + 2] = pixels[i + offset * 4 + 2];
          }
        }
      }
    }
    updatePixels();
  }

  // === X MARKS ===
  if (keyMatches('xMarks')) {
    let count = floor(random(10, 25) * intensity);
    for (let j = 0; j < count; j++) {
      let x = random(width);
      let y = random(height);
      let size = random(10, 60);
      let c = color(random(primaryPalette()));
      c.setAlpha(random(120, 255));
      stroke(c);
      strokeWeight(random(1, 6));
      line(x - size, y - size, x + size, y + size);
      line(x - size, y + size, x + size, y - size);
    }
    noStroke();
  }

  // === MASKED IMAGE ===
  if (keyMatches('maskedImage')) {
    let count = floor(random(2, 5) * intensity);
    for (let j = 0; j < count; j++) {
      push();
      translate(random(width), random(height));
      scale(random(0.3, 1.5));
      rotate(random(-0.2, 0.2));
      let tintCol = color(random(primaryPalette()));
      tintCol.setAlpha(random(150, 255));
      tint(tintCol);
      image(img, 0, 0);
      noTint();
      pop();
    }
  }

  // === THRESHOLD ===
  if (keyMatches('threshold')) {
    let count = floor(random(2, 5) * intensity);
    for (let j = 0; j < count; j++) {
      let section = get(random(width/3), random(height/3), random(width/4, width/2), random(height/4, height/2));
      section.filter(THRESHOLD, random(0.2, 0.8));
      if (random() > 0.5) {
        section.filter(INVERT);
      }
      image(section, random(width/2), random(height/2));
    }
  }

  // === PIXEL GLITCH ===
  if (keyMatches('pixelGlitch')) {
    let d = pixelDensity();
    let totalPixels = 4 * (d * width) * (d * height);

    for (let pass = 0; pass < floor(random(2, 5)); pass++) {
      let chunkSize = floor(random(totalPixels / 10, totalPixels / 3));
      let offset = floor(random(totalPixels - chunkSize));

      loadPixels();
      for (let i = 0; i < chunkSize; i += 4) {
        let sourceIdx = floor(random(totalPixels));
        pixels[offset + i] = pixels[sourceIdx];
        pixels[offset + i + 1] = pixels[sourceIdx + 1];
        pixels[offset + i + 2] = pixels[sourceIdx + 2];
        pixels[offset + i + 3] = pixels[sourceIdx + 3];
      }
      updatePixels();
    }
  }

  // === COLOR SHIFT ===
  if (keyMatches('colorShift')) {
    loadPixels();
    let shiftType = floor(random(3));

    for (let i = 0; i < pixels.length; i += 4) {
      if (random() > 0.5) {
        if (shiftType === 0) {
          let temp = pixels[i];
          pixels[i] = pixels[i + 1];
          pixels[i + 1] = pixels[i + 2];
          pixels[i + 2] = temp;
        } else if (shiftType === 1) {
          pixels[i] = 255 - pixels[i];
          pixels[i + 2] = 255 - pixels[i + 2];
        } else {
          pixels[i + floor(random(3))] = constrain(pixels[i] + random(-100, 100), 0, 255);
        }
      }
    }
    updatePixels();
  }

  // === FILTERS ===
  if (keyMatches('filters')) {
    let filters = [INVERT, POSTERIZE, BLUR, GRAY, THRESHOLD];
    let count = floor(random(2, 6) * intensity);

    for (let j = 0; j < count; j++) {
      let chosenFilter = random(filters);
      let section = get(random(width/4), random(height/4), random(width/4, width/2), random(height/4, height/2));

      if (chosenFilter === POSTERIZE) {
        section.filter(chosenFilter, floor(random(2, 10)));
      } else if (chosenFilter === BLUR) {
        section.filter(chosenFilter, floor(random(1, 5)));
      } else if (chosenFilter === THRESHOLD) {
        section.filter(chosenFilter, random(0.2, 0.8));
      } else {
        section.filter(chosenFilter);
      }

      image(section, random(width * 0.5), random(height * 0.5));
    }
  }

  // === TRUST ME LARGE ===
  if (keyMatches('trustMeLarge')) {
    let count = floor(random(1, 4) * intensity);
    for (let j = 0; j < count; j++) {
      textSize(random(60, 250));
      let c = color(random(primaryPalette()));
      c.setAlpha(random(150, 230));
      fill(c);
      let strokeCol = color(random(secondaryPalette()));
      strokeCol.setAlpha(random(100, 200));
      stroke(strokeCol);
      strokeWeight(random(2, 8));
      push();
      translate(random(-100, width), random(50, height));
      rotate(random(-0.2, 0.2));
      text('trust me', 0, 0);
      pop();
    }
    noStroke();
  }

  // === TRUST ME POINTS ===
  if (keyMatches('trustMePoints')) {
    let count = floor(random(2, 5) * intensity);
    for (let k = 0; k < count; k++) {
      let size = random(20, 70);
      textSize(size);
      let c = color(random(primaryPalette()));
      c.setAlpha(random(150, 255));
      stroke(c);
      strokeWeight(random(1, 4));

      let points = universFont.textToPoints('trust me', random(width - 250), random(height), size, {
        sampleFactor: random(0.2, 0.8)
      });

      for (let p of points) {
        if (random() > 0.2) {
          point(p.x, p.y);
        }
      }
    }
    noStroke();
  }

  // === SPARKLES ===
  if (keyMatches('sparkles')) {
    let count = floor(random(10, 25) * intensity);
    for (let j = 0; j < count; j++) {
      let c = color(random(secondaryPalette()));
      c.setAlpha(random(150, 255));
      fill(c);
      circle(random(width), random(height), random(1, 4));
    }
  }

  // === QUOTES ===
  if (keyMatches('quotes')) {
    let count = floor(random(5, 15) * intensity);
    for (let j = 0; j < count; j++) {
      textSize(random(30, 120));
      let c = color(random(primaryPalette()));
      c.setAlpha(random(140, 220));
      fill(c);
      let quotes = ['"', "'", '"', '"', '\u2018', '\u2019', '\u201E', '\u201F'];
      text(random(quotes), random(width), random(height));
    }
  }

  // === SYMBOLS ===
  if (keyMatches('symbols')) {
    let symbolList = ['@', '#', '$', '%', '&', '*', '~', '+', '=', '/', '\\'];
    let count = floor(random(15, 35) * intensity);
    for (let j = 0; j < count; j++) {
      textSize(random(12, 50));
      let c = color(random(primaryPalette()));
      c.setAlpha(random(100, 240));
      fill(c);
      push();
      translate(random(width), random(height));
      rotate(random(-PI, PI));
      text(random(symbolList), 0, 0);
      pop();
    }
  }

  // === FRAMES ===
  if (keyMatches('frames')) {
    let count = floor(random(5, 15) * intensity);
    for (let j = 0; j < count; j++) {
      noFill();
      let c = color(random(secondaryPalette()));
      c.setAlpha(random(150, 230));
      stroke(c);
      strokeWeight(random(1, 6));
      let x = random(width - 120);
      let y = random(height - 120);
      let w = random(30, 200);
      let h = random(30, 200);
      if (random() > 0.5) {
        rect(x, y, w, h);
      } else {
        ellipse(x + w/2, y + h/2, w, h);
      }
    }
    noStroke();
  }

  // === CLASSIC EFFECTS ===

  // Tall pink rectangles (vowels1 in classic)
  if (keyMatches('tallRects')) {
    let x = 50, y = 50;
    for (let j = 0; j < 7; j++) {
      fill(random(primaryPalette()));
      rect(x + 70*j, y, 20, 120);
    }
  }

  // Short rectangles at bottom (vowels2 in classic)
  if (keyMatches('shortRects')) {
    let x = 20, y = 420;
    for (let j = 0; j < 7; j++) {
      fill(random(primaryPalette()));
      rect(x + 70*j, y, 60, 30);
    }
  }

  // Purple grid pattern (vowels3 in classic)
  if (keyMatches('purpleGrid')) {
    let x = 40, y = 130;
    for (let j = 0; j < 7; j++) {
      for (let k = 0; k < 7; k++) {
        fill(random(secondaryPalette()));
        rect(x + 70*j, y + 30*k, 4, 6);
      }
    }
  }

  // Diagonal flower cascade (consonants1 in classic)
  if (keyMatches('diagonalFlowers')) {
    let x = 340, y = 30;
    for (let j = 0; j < 5; j++) {
      image(flowers, x - (j*10), y*j);
    }
  }

  // Threshold mirror effect (consonants4 in classic)
  if (keyMatches('thresholdMirror')) {
    let topHalf = get(0, 0, width, height/2);
    topHalf.filter(THRESHOLD);
    image(topHalf, 0, height/2);
  }
}

function captureSmall() {
  let src = document.querySelector('#canvas-container canvas');
  return src.toDataURL('image/png');
}

function startFlip() {
  if (postcardState !== 'front') return;
  frontImg = get();
  frontImgData = captureSmall();
  flipProgress = 0;
  postcardState = 'flipping';
  frameRate(30);
}

function showBackSide() {
  background(255);
  textFont(interlopeFont);
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  textWrap(WORD);
  textSize(36);
  let boxW = width * 0.8;
  let boxX = width * 0.1;
  let boxY = height * 0.1;
  let inputText = document.getElementById('userInput').value || '—';
  text(inputText, boxX, boxY, boxW, height * 0.8);
  textAlign(LEFT, BASELINE);
  backImgData = captureSmall();
}

function keyPressed() {
  const activeEl = document.activeElement;
  if (activeEl === document.getElementById('senderName') ||
      activeEl === document.getElementById('recipientEmail')) return;
  // SPACEBAR - random overlay effect
  if (key === ' ') {
    let choice = floor(random(5));

    if (choice === 0) {
      for (let i = 0; i < floor(random(15, 30)); i++) {
        let c = color(random(secondaryPalette()));
        c.setAlpha(random(3, 25));
        fill(c);
        rect(0, random(height), width, random(10, 50));
      }
    } else if (choice === 1) {
      for (let j = 0; j < floor(random(25, 60)); j++) {
        let c = color(random(primaryPalette()));
        c.setAlpha(random(50, 200));
        fill(c);
        circle(random(width), random(height), random(1, 8));
      }
    } else if (choice === 2) {
      for (let i = 0; i < floor(random(3, 8)); i++) {
        let c = color(random(primaryPalette()));
        c.setAlpha(random(5, 20));
        fill(c);
        rect(0, 0, width, height);
      }
    } else if (choice === 3) {
      for (let i = 0; i < floor(random(10, 25)); i++) {
        let c = color(random(secondaryPalette()));
        c.setAlpha(random(5, 30));
        fill(c);
        push();
        translate(random(width), random(height));
        rotate(random(-PI, PI));
        rect(0, 0, random(50, 200), random(2, 15));
        pop();
      }
    } else {
      for (let j = 0; j < floor(random(15, 40)); j++) {
        let c = color(random(primaryPalette()));
        c.setAlpha(random(20, 80));
        fill(c);
        if (random() > 0.5) {
          circle(random(width), random(height), random(3, 15));
        } else {
          rect(random(width), random(height), random(3, 15), random(3, 15));
        }
      }
    }
  }

  // DELETE/BACKSPACE - fade layer
  if (keyCode === DELETE || keyCode === BACKSPACE) {
    fill(27, 27, 27, 30); // Match background color
    noStroke();
    rect(0, 0, width, height);
  }
}

