class Tree {
  constructor(options = {}) {
    this.size = options.size || 220;
    this.maxLevel = options.maxLevel || 11;
    this.rot = 0.35;
    this.lenRand = 0.7;
    this.branchProb = 0.95;
    this.rotRand = 0.25;

    this.leafColor = "#6FBF73"; // soft green
    this.woodColor = "#5B3A1E"; // brown wood

    this.randSeed = Math.floor(Math.random() * 1000);
  }
}

let prog = 1;
let growing = true;
let trees = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  let count = windowWidth > 1200 ? 2 : 5;
  for (let i = 0; i < count; i++) {
    trees.push(new Tree());
  }

  for (let tree of trees) startGrow(tree);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function startGrow(tree) {
  prog = 1;
  grow(tree);
}

function grow(tree) {
  if (prog > tree.maxLevel + 2) return;
  prog += 0.03;
  setTimeout(() => grow(tree), 20);
}

function draw() {
  background(114, 137, 218); // #7289DA

  for (let i = 0; i < trees.length; i++) {
    push();
    translate(width * (0.3 + i * 0.2), height + 20);
    scale(1, -1);
    branch(trees[i], 1);
    pop();
  }
}

function branch(tree, level) {
  if (prog < level) return;

  stroke(tree.woodColor);
  strokeWeight(10 * Math.pow((tree.maxLevel - level + 1) / tree.maxLevel, 2));

  let len = tree.size * (1 + random(-tree.lenRand, tree.lenRand));
  line(0, 0, 0, len / level);
  translate(0, len / level);

  if (level < tree.maxLevel && random() < tree.branchProb) {
    push();
    rotate(tree.rot);
    branch(tree, level + 1);
    pop();

    push();
    rotate(-tree.rot);
    branch(tree, level + 1);
    pop();
  } else {
    drawBodhiLeaf(tree, len, level);
  }
}

function drawBodhiLeaf(tree, len, level) {
  let p = Math.min(1, Math.max(0, prog - level));
  let leafSize = (tree.size / 10) * p;

  fill(tree.leafColor);
  noStroke();

  beginShape();
  vertex(0, 0);

  // Left heart curve
  bezierVertex(
    -leafSize, leafSize * 0.3,
    -leafSize * 0.6, leafSize,
    0, leafSize * 1.2
  );

  // Long Bodhi drip tip
  vertex(0, leafSize * 2.2);

  // Right heart curve
  bezierVertex(
    leafSize * 0.6, leafSize,
    leafSize, leafSize * 0.3,
    0, 0
  );

  endShape(CLOSE);
}
