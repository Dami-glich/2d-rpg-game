const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const healthEl = document.getElementById('health');
const cashEl = document.getElementById('cash');
const repEl = document.getElementById('rep');
const objectiveEl = document.getElementById('objective');
const messageEl = document.getElementById('message');

const world = {
  width: 2200,
  height: 1600,
};

const keys = {};

const player = {
  x: 820,
  y: 890,
  radius: 18,
  speed: 220,
  health: 100,
  cash: 150,
  rep: 0,
};

const questState = {
  current: 0,
  color: '#9be7ff',
  complete: false,
  text: 'Explore the city and complete your first district missions.',
};

const zoneQuests = [
  { name: 'Houses', x: 300, y: 260, w: 440, h: 320, reward: 50, rep: 5 },
  { name: 'River', x: 1220, y: 260, w: 630, h: 330, reward: 70, rep: 8 },
  { name: 'Casino', x: 1050, y: 980, w: 760, h: 420, reward: 100, rep: 10 },
  { name: 'Admin Zone', x: 300, y: 930, w: 500, h: 420, reward: 120, rep: 12 },
];

const buildings = [
  { name: 'Old House', x: 80, y: 110, w: 190, h: 150, color: '#d5b881', type: 'house' },
  { name: 'Violet Apartments', x: 340, y: 120, w: 240, h: 160, color: '#9e7ddd', type: 'apartment' },
  { name: 'Harbor Dwellings', x: 690, y: 110, w: 210, h: 160, color: '#a8d5d8', type: 'house' },
  { name: 'North Garage', x: 1180, y: 110, w: 260, h: 180, color: '#b68d5b', type: 'garage' },
  { name: 'Canal Row', x: 1500, y: 100, w: 230, h: 190, color: '#8cb5a2', type: 'apartment' },
  { name: 'Riverview Homes', x: 1820, y: 110, w: 220, h: 170, color: '#c1b1f3', type: 'house' },

  { name: 'Sunset Block', x: 80, y: 620, w: 220, h: 160, color: '#d39b72', type: 'apartment' },
  { name: 'Green Park Homes', x: 420, y: 620, w: 220, h: 180, color: '#7fbf9b', type: 'house' },
  { name: 'The Gables', x: 780, y: 600, w: 240, h: 180, color: '#d8c086', type: 'house' },
  { name: 'Riverfront Plaza', x: 1250, y: 650, w: 260, h: 200, color: '#c0c9d5', type: 'shop' },
  { name: 'Lucky Palace', x: 1640, y: 620, w: 310, h: 250, color: '#f7c863', type: 'casino' },

  { name: 'Metro Lofts', x: 110, y: 1160, w: 220, h: 180, color: '#96baea', type: 'apartment' },
  { name: 'Old Town Homes', x: 430, y: 1160, w: 220, h: 170, color: '#d99d82', type: 'house' },
  { name: 'Luna Garage', x: 1020, y: 1180, w: 270, h: 180, color: '#c4a66e', type: 'garage' },
  { name: 'Snowline Casino', x: 1480, y: 1140, w: 300, h: 220, color: '#f4b77f', type: 'casino' },
  { name: 'City Admin', x: 190, y: 1360, w: 280, h: 150, color: '#6bc5ff', type: 'admin' },
  { name: 'City Hall', x: 760, y: 1350, w: 330, h: 150, color: '#8fe0d2', type: 'admin' },
];

const cars = [
  { x: 530, y: 420, w: 60, h: 34, color: '#f97316' },
  { x: 1080, y: 520, w: 64, h: 34, color: '#38bdf8' },
  { x: 1450, y: 820, w: 68, h: 34, color: '#f43f5e' },
  { x: 1650, y: 1030, w: 62, h: 34, color: '#a78bfa' },
  { x: 820, y: 1050, w: 60, h: 34, color: '#34d399' },
  { x: 1890, y: 760, w: 64, h: 34, color: '#facc15' },
];

const npcs = [
  { name: 'Maya', x: 550, y: 260, color: '#f9a8d4' },
  { name: 'Ruben', x: 1380, y: 330, color: '#93c5fd' },
  { name: 'Jax', x: 1380, y: 1260, color: '#fca5a5' },
  { name: 'Sofia', x: 620, y: 1380, color: '#86efac' },
];

const factionZones = [
  { name: 'East Faction', x: 1040, y: 220, w: 930, h: 350, color: 'rgba(250, 204, 21, 0.14)' },
  { name: 'River Crew', x: 1180, y: 680, w: 860, h: 470, color: 'rgba(59, 130, 246, 0.12)' },
  { name: 'South Gang', x: 80, y: 1120, w: 820, h: 380, color: 'rgba(239, 68, 68, 0.12)' },
  { name: 'Admin District', x: 160, y: 1290, w: 760, h: 280, color: 'rgba(96, 165, 250, 0.15)' },
];

const roads = [
  { x: 0, y: 500, w: 2200, h: 120 },
  { x: 0, y: 1000, w: 2200, h: 120 },
  { x: 500, y: 0, w: 120, h: 1600 },
  { x: 1100, y: 0, w: 120, h: 1600 },
  { x: 1700, y: 0, w: 120, h: 1600 },
];

const river = { x: 1180, y: 0, w: 820, h: 520 };

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function rectCircleCollision(cx, cy, radius, rect) {
  const closestX = clamp(cx, rect.x, rect.x + rect.w);
  const closestY = clamp(cy, rect.y, rect.y + rect.h);
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy < radius * radius;
}

function collidesWithBuilding(x, y) {
  return buildings.some((building) => rectCircleCollision(x, y, player.radius, building));
}

function collidesWithCars(x, y) {
  return cars.some((car) => rectCircleCollision(x, y, player.radius, {
    x: car.x - 12,
    y: car.y - 12,
    w: car.w + 24,
    h: car.h + 24,
  }));
}

function hasCollision(x, y) {
  if (x < player.radius || y < player.radius || x > world.width - player.radius || y > world.height - player.radius) {
    return true;
  }
  return collidesWithBuilding(x, y) || collidesWithCars(x, y);
}

function updatePlayer() {
  let dx = 0;
  let dy = 0;

  if (keys['w'] || keys['arrowup']) dy -= 1;
  if (keys['s'] || keys['arrowdown']) dy += 1;
  if (keys['a'] || keys['arrowleft']) dx -= 1;
  if (keys['d'] || keys['arrowright']) dx += 1;

  if (dx !== 0 || dy !== 0) {
    const length = Math.hypot(dx, dy) || 1;
    dx /= length;
    dy /= length;

    const nextX = player.x + dx * player.speed * (1/60);
    const nextY = player.y + dy * player.speed * (1/60);

    if (!hasCollision(nextX, player.y)) {
      player.x = nextX;
    }

    if (!hasCollision(player.x, nextY)) {
      player.y = nextY;
    }
  }
}

function updateZoneProgress() {
  const activeQuest = zoneQuests[questState.current];

  if (!activeQuest) {
    questState.complete = true;
    questState.text = 'All district missions complete. The city is yours.';
    objectiveEl.textContent = 'Objective: All district missions complete.';
    return;
  }

  const inZone =
    player.x > activeQuest.x &&
    player.x < activeQuest.x + activeQuest.w &&
    player.y > activeQuest.y &&
    player.y < activeQuest.y + activeQuest.h;

  if (inZone) {
    player.cash += activeQuest.reward;
    player.rep += activeQuest.rep;
    questState.current += 1;
    messageEl.textContent = `Mission complete: ${activeQuest.name} district secured.`;

    if (questState.current < zoneQuests.length) {
      const nextQuest = zoneQuests[questState.current];
      objectiveEl.textContent = `Objective: Reach the ${nextQuest.name} district.`;
      questState.text = `Next target: ${nextQuest.name}`;
    } else {
      objectiveEl.textContent = 'Objective: All district missions complete.';
      questState.text = 'The city belongs to you.';
      questState.complete = true;
    }
  } else {
    if (questState.current < zoneQuests.length) {
      objectiveEl.textContent = `Objective: Reach the ${activeQuest.name} district.`;
    }
  }
}

function updateNPCInteraction() {
  let nearest = null;
  let nearestDistance = Infinity;

  npcs.forEach((npc) => {
    const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
    if (dist < 100 && dist < nearestDistance) {
      nearest = npc;
      nearestDistance = dist;
    }
  });

  if (nearest) {
    messageEl.textContent = `Press E to speak with ${nearest.name}.`;

    if (keys['e'] && !keys.locked) {
      keys.locked = true;
      player.cash += 25;
      player.rep += 2;
      messageEl.textContent = `${nearest.name}: “The city is changing. Stay sharp.”`;
    }
  } else if (!keys['e']) {
    keys.locked = false;
    if (!questState.complete) {
      messageEl.textContent = 'Move with WASD or Arrow Keys.';
    }
  }
}

function updateHud() {
  healthEl.textContent = Math.round(player.health);
  cashEl.textContent = `$${player.cash}`;
  repEl.textContent = player.rep;
}

function update() {
  updatePlayer();
  updateZoneProgress();
  updateNPCInteraction();
  updateHud();
}

function drawBackground(cameraX, cameraY) {
  ctx.fillStyle = '#2d4d3d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(-cameraX, -cameraY);

  ctx.fillStyle = '#264d38';
  ctx.fillRect(0, 0, world.width, world.height);

  ctx.fillStyle = '#3b3b3b';
  roads.forEach((road) => ctx.fillRect(road.x, road.y, road.w, road.h));

  ctx.fillStyle = '#3d7dc9';
  ctx.fillRect(river.x, river.y, river.w, river.h);

  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  for (let x = 0; x < world.width; x += 80) {
    ctx.fillRect(x, 0, 2, world.height);
  }
  for (let y = 0; y < world.height; y += 80) {
    ctx.fillRect(0, y, world.width, 2);
  }

  factionZones.forEach((zone) => {
    ctx.fillStyle = zone.color;
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '18px Arial';
    ctx.fillText(zone.name, zone.x + 20, zone.y + 28);
  });

  buildings.forEach((building) => {
    ctx.fillStyle = building.color;
    ctx.fillRect(building.x, building.y, building.w, building.h);
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.strokeRect(building.x, building.y, building.w, building.h);
    ctx.fillStyle = '#111827';
    ctx.font = '14px Arial';
    ctx.fillText(building.name, building.x + 10, building.y + 22);
  });

  cars.forEach((car) => {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.w, car.h);
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(car.x + 8, car.y + 6, 12, 10);
    ctx.fillRect(car.x + car.w - 20, car.y + 6, 12, 10);
    ctx.fillRect(car.x + 8, car.y + car.h - 16, 12, 10);
    ctx.fillRect(car.x + car.w - 20, car.y + car.h - 16, 12, 10);
  });

  npcs.forEach((npc) => {
    ctx.beginPath();
    ctx.fillStyle = npc.color;
    ctx.arc(npc.x, npc.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ecf7ff';
    ctx.font = '12px Arial';
    ctx.fillText(npc.name, npc.x - 18, npc.y - 22);
  });

  ctx.restore();
}

function drawPlayer(cameraX, cameraY) {
  ctx.beginPath();
  ctx.fillStyle = '#39d0ff';
  ctx.arc(player.x - cameraX, player.y - cameraY, player.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = '#d5f3ff';
  ctx.lineWidth = 2;
  ctx.moveTo(player.x - cameraX, player.y - cameraY);
  ctx.lineTo(player.x - cameraX + 10, player.y - cameraY - 18);
  ctx.stroke();
}

function drawQuestPanel() {
  ctx.fillStyle = 'rgba(7, 11, 18, 0.56)';
  ctx.fillRect(20, canvas.height - 80, 420, 50);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.strokeRect(20, canvas.height - 80, 420, 50);

  ctx.fillStyle = '#eaf8ff';
  ctx.font = '16px Arial';
  ctx.fillText(questState.text, 36, canvas.height - 48);
}

function render() {
  const cameraX = clamp(player.x - canvas.width / 2, 0, world.width - canvas.width);
  const cameraY = clamp(player.y - canvas.height / 2, 0, world.height - canvas.height);

  drawBackground(cameraX, cameraY);
  drawPlayer(cameraX, cameraY);
  drawQuestPanel();
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  keys[key] = true;
  if (key === 'e') {
    keys.locked = false;
  }
});

window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  keys[key] = false;
});

window.addEventListener('resize', resizeCanvas);

resizeCanvas();
updateHud();
objectiveEl.textContent = `Objective: Reach the ${zoneQuests[0].name} district.`;

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
