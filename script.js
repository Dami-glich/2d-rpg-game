const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const healthEl = document.getElementById('health');
const cashEl = document.getElementById('cash');
const repEl = document.getElementById('rep');
const medkitsEl = document.getElementById('medkits');
const objectiveEl = document.getElementById('objective');
const messageEl = document.getElementById('message');
const inventoryPanel = document.getElementById('inventoryPanel');
const inventoryList = document.getElementById('inventoryList');
const shopList = document.getElementById('shopList');
const closeInventoryButton = document.getElementById('closeInventory');
const jobBoardPanel = document.getElementById('jobBoardPanel');
const closeJobBoardButton = document.getElementById('closeJobBoard');
const jobListEl = document.getElementById('jobList');
const completedJobsListEl = document.getElementById('completedJobsList');
const activeMissionDisplayEl = document.getElementById('activeMissionDisplay');
const noActiveMissionEl = document.getElementById('noActiveMission');
const activeMissionDetailsEl = document.getElementById('activeMissionDetails');
const activeMissionNameEl = document.getElementById('activeMissionName');
const activeMissionDescEl = document.getElementById('activeMissionDesc');
const activeMissionRewardEl = document.getElementById('activeMissionReward');
const abandonJobBtn = document.getElementById('abandonJobBtn');
const factionPanel = document.getElementById('factionPanel');
const closeFactionButton = document.getElementById('closeFactionPanel');
const factionListEl = document.getElementById('factionList');

const world = { width: 2200, height: 1600 };
const keys = {};

const shopItems = [
  { id: 'medkit', label: 'Medkit', cost: 25, effect: 'medkit' },
  { id: 'armor', label: 'Armor Plate', cost: 40, effect: 'armor' },
  { id: 'energy', label: 'Energy Drink', cost: 15, effect: 'energy' },
];

const sharedRankRequirements = [0, 50, 120, 200, 300, 450, 650, 900, 1200, 1600];

const factionDefinitions = {
  'Black Vipers': { type: 'crime', color: '#ef4444', ranks: ['Prospect', 'Street Runner', 'Enforcer', 'Driver', 'Dealer', 'Specialist', 'Crew Leader', 'Senior Enforcer', 'Underboss', 'Boss'] },
  'Iron Wolves': { type: 'crime', color: '#f87171', ranks: ['Prospect', 'Street Runner', 'Enforcer', 'Driver', 'Dealer', 'Specialist', 'Crew Leader', 'Senior Enforcer', 'Underboss', 'Boss'] },
  'Crown Syndicate': { type: 'crime', color: '#f59e0b', ranks: ['Associate', 'Courier', 'Enforcer', 'Driver', 'Specialist', 'Security Officer', 'Crew Leader', 'Captain', 'Underboss', 'Boss'] },
  'Metro Police Department': { type: 'police', color: '#3b82f6', ranks: ['Police Recruit', 'Police Officer', 'Senior Officer', 'Patrol Officer', 'Traffic Officer', 'Detective', 'Corporal', 'Sergeant', 'Lieutenant', 'Police Captain'] },
  'City Highway Patrol': { type: 'police', color: '#60a5fa', ranks: ['Cadet', 'Patrol Officer', 'Traffic Officer', 'Highway Officer', 'Senior Patrol Officer', 'Motorcycle Officer', 'Corporal', 'Sergeant', 'Lieutenant', 'Highway Commander'] },
  'National Defense Force': { type: 'military', color: '#22c55e', ranks: ['Recruit', 'Private', 'Private First Class', 'Specialist', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Lieutenant', 'Captain', 'Major'] },
  'State Intelligence Service': { type: 'intelligence', color: '#a78bfa', ranks: ['Trainee', 'Intelligence Analyst', 'Field Agent', 'Surveillance Agent', 'Intelligence Officer', 'Senior Agent', 'Special Agent', 'Field Supervisor', 'Intelligence Director', 'SIS Director'] },
  'Central City Medical Center': { type: 'medical', color: '#34d399', ranks: ['Medical Intern', 'Medical Assistant', 'Nurse', 'Paramedic', 'Senior Nurse', 'Doctor', 'Emergency Doctor', 'Surgeon', 'Medical Director', 'Hospital Director'] },
  'Riverside General Hospital': { type: 'medical', color: '#2dd4bf', ranks: ['Medical Intern', 'Medical Assistant', 'Nurse', 'Paramedic', 'Senior Nurse', 'Doctor', 'Emergency Doctor', 'Surgeon', 'Medical Director', 'Hospital Director'] },
  'Urban News Network': { type: 'news', color: '#fbbf24', ranks: ['News Intern', 'Camera Assistant', 'Reporter', 'News Photographer', 'Field Reporter', 'Investigative Journalist', 'Senior Reporter', 'News Producer', 'News Editor', 'Network Director'] },
  'City Government Administration': { type: 'government', color: '#e2e8f0', ranks: ['Administrative Intern', 'Clerk', 'Administrative Assistant', 'Government Officer', 'Senior Officer', 'Department Officer', 'Department Manager', 'Deputy Director', 'Government Director', 'City Administrator'] },
};

const player = {
  x: 820,
  y: 890,
  radius: 18,
  speed: 220,
  health: 100,
  cash: 150,
  rep: 0,
  medkits: 1,
  armor: 0,
  energy: 0,
  attackCooldown: 0,
  activeJob: null,
  jobProgress: {},
  completedJobs: [],
  activeFaction: null,
  factionSwitchCooldown: 0,
  factions: {},
};

Object.keys(factionDefinitions).forEach((factionName) => {
  player.factions[factionName] = {
    rep: 0,
    rankIndex: 0,
    rank: factionDefinitions[factionName].ranks[0],
    active: false,
    jobsCompleted: 0,
  };
});

const questState = {
  current: 0,
  complete: false,
  text: 'Explore the city and complete your first district missions.',
};

const zoneQuests = [
  { name: 'Houses', x: 300, y: 260, w: 440, h: 320, reward: 50, rep: 5 },
  { name: 'River', x: 1220, y: 260, w: 630, h: 330, reward: 70, rep: 8 },
  { name: 'Casino', x: 1050, y: 980, w: 760, h: 420, reward: 100, rep: 10 },
  { name: 'Admin Zone', x: 300, y: 930, w: 500, h: 420, reward: 120, rep: 12 },
];

const beginnerJobs = [
  {
    id: 'delivery_boy',
    name: 'Delivery Boy',
    location: { x: 340, y: 120, building: 'Violet Apartments' },
    mission: 'Deliver packages to the River District',
    targetZone: { x: 1220, y: 260, w: 630, h: 330 },
    payment: 30,
    rep: 2,
    requirements: 'Requires 0 rep',
    locked: false,
  },
  {
    id: 'shop_clerk',
    name: 'Shop Clerk',
    location: { x: 1250, y: 650, building: 'Riverfront Plaza' },
    mission: 'Stock shelves and help customers',
    targetZone: { x: 1180, y: 620, w: 300, h: 200 },
    payment: 25,
    rep: 1,
    requirements: 'Requires 0 rep',
    locked: false,
  },
  {
    id: 'parking_attendant',
    name: 'Parking Attendant',
    location: { x: 1180, y: 110, building: 'North Garage' },
    mission: 'Monitor and manage the North Garage parking lot',
    targetZone: { x: 1100, y: 50, w: 300, h: 200 },
    payment: 20,
    rep: 1,
    requirements: 'Requires 0 rep',
    locked: false,
  },
  {
    id: 'mail_carrier',
    name: 'Mail Carrier',
    location: { x: 690, y: 110, building: 'Harbor Dwellings' },
    mission: 'Deliver mail throughout Harbor District',
    targetZone: { x: 600, y: 80, w: 250, h: 200 },
    payment: 28,
    rep: 2,
    requirements: 'Requires 0 rep',
    locked: false,
  },
  {
    id: 'janitor',
    name: 'Janitor',
    location: { x: 760, y: 1350, building: 'City Hall' },
    mission: 'Clean and maintain City Hall',
    targetZone: { x: 700, y: 1300, w: 350, h: 200 },
    payment: 22,
    rep: 1,
    requirements: 'Requires 0 rep',
    locked: false,
  },
];

const regularJobs = [
  {
    id: 'security_guard',
    name: 'Security Guard',
    location: { x: 1640, y: 620, building: 'Lucky Palace' },
    mission: 'Patrol the casino and protect patrons',
    targetZone: { x: 1580, y: 580, w: 350, h: 280 },
    payment: 75,
    rep: 8,
    requirements: 'Requires 5+ rep',
    locked: true,
  },
  {
    id: 'courier',
    name: 'Courier',
    location: { x: 80, y: 110, building: 'Old House' },
    mission: 'Fast delivery across the entire city',
    targetZone: { x: 400, y: 400, w: 600, h: 600 },
    payment: 65,
    rep: 6,
    requirements: 'Requires 5+ rep',
    locked: true,
  },
  {
    id: 'enforcer',
    name: 'Enforcer',
    location: { x: 1480, y: 1140, building: 'Snowline Casino' },
    mission: 'Ensure debts are paid at the casino',
    targetZone: { x: 1380, y: 1050, w: 300, h: 250 },
    payment: 85,
    rep: 10,
    requirements: 'Requires 5+ rep',
    locked: true,
  },
  {
    id: 'bodyguard',
    name: 'Bodyguard',
    location: { x: 550, y: 260, building: 'Riverside NPC Station' },
    mission: 'Protect a VIP traveling through the city',
    targetZone: { x: 300, y: 200, w: 800, h: 500 },
    payment: 70,
    rep: 7,
    requirements: 'Requires 5+ rep',
    locked: true,
  },
  {
    id: 'debt_collector',
    name: 'Debt Collector',
    location: { x: 190, y: 1360, building: 'City Admin' },
    mission: 'Collect outstanding debts from citizens',
    targetZone: { x: 100, y: 1300, w: 400, h: 250 },
    payment: 80,
    rep: 9,
    requirements: 'Requires 5+ rep',
    locked: true,
  },
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

const enemies = [
  { x: 530, y: 610, radius: 18, hp: 60, speed: 65, color: '#ef4444', damage: 12, name: 'Gang Scout' },
  { x: 840, y: 360, radius: 17, hp: 65, speed: 75, color: '#f97316', damage: 15, name: 'Street Thug' },
  { x: 1470, y: 800, radius: 18, hp: 70, speed: 68, color: '#f43f5e', damage: 16, name: 'River Runner' },
  { x: 600, y: 1320, radius: 18, hp: 80, speed: 72, color: '#dc2626', damage: 18, name: 'South Raider' },
  { x: 1820, y: 1220, radius: 18, hp: 90, speed: 70, color: '#a855f7', damage: 20, name: 'Faction Enforcer' },
];

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

function getAllJobs() {
  return [...beginnerJobs, ...regularJobs];
}

function getFactionInfo(factionName) {
  const faction = factionDefinitions[factionName];
  if (!faction) return null;

  const state = player.factions[factionName];
  const rankIndex = state.rankIndex;
  const rankName = faction.ranks[rankIndex] || faction.ranks[faction.ranks.length - 1];
  const nextThreshold = sharedRankRequirements[rankIndex + 1] ?? null;

  return {
    faction,
    state,
    rankName,
    rankIndex,
    nextThreshold,
  };
}

function refreshInventoryUI() {
  const items = [
    { label: 'Medkits', value: player.medkits },
    { label: 'Armor Plates', value: player.armor },
    { label: 'Energy Drinks', value: player.energy },
    { label: 'Cash', value: `$${player.cash}` },
  ];

  inventoryList.innerHTML = items
    .map((item) => `<li><span>${item.label}</span><strong>${item.value}</strong></li>`)
    .join('');

  shopList.innerHTML = shopItems
    .map((item) => `
      <div class="shop-item">
        <span>${item.label} ($${item.cost})</span>
        <button type="button" data-buy="${item.id}">Buy</button>
      </div>
    `)
    .join('');
}

function toggleInventory(forceOpen) {
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !inventoryPanel.classList.contains('hidden');
  inventoryPanel.classList.toggle('hidden', !shouldOpen);
  if (shouldOpen) refreshInventoryUI();
}

function toggleJobBoard(forceOpen) {
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !jobBoardPanel.classList.contains('hidden');
  jobBoardPanel.classList.toggle('hidden', !shouldOpen);
  if (shouldOpen) renderJobBoard();
}

function toggleFactionPanel(forceOpen) {
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !factionPanel.classList.contains('hidden');
  factionPanel.classList.toggle('hidden', !shouldOpen);
  if (shouldOpen) renderFactionPanel();
}

function buyItem(itemId) {
  const item = shopItems.find((entry) => entry.id === itemId);
  if (!item) return;

  if (player.cash < item.cost) {
    messageEl.textContent = `Not enough cash for ${item.label}.`;
    return;
  }

  player.cash -= item.cost;

  if (item.effect === 'medkit') {
    player.medkits += 1;
    messageEl.textContent = 'You purchased a medkit.';
  }

  if (item.effect === 'armor') {
    player.armor += 1;
    player.health = Math.min(100, player.health + 15);
    messageEl.textContent = 'You bought armor plating and repaired some damage.';
  }

  if (item.effect === 'energy') {
    player.energy += 1;
    player.speed += 10;
    messageEl.textContent = 'You bought an energy drink and feel faster.';
  }

  refreshInventoryUI();
  updateHud();
}

function useMedkit() {
  if (player.medkits > 0 && player.health < 100) {
    player.medkits -= 1;
    player.health = Math.min(100, player.health + 35);
    messageEl.textContent = 'You used a medkit and restored health.';
  } else if (player.health >= 100) {
    messageEl.textContent = 'Your health is already full.';
  } else {
    messageEl.textContent = 'No medkits remaining.';
  }

  refreshInventoryUI();
  updateHud();
}

function acceptJob(jobId) {
  const job = getAllJobs().find((j) => j.id === jobId);
  if (!job) return;

  const requiredRep = job.requirements.includes('5+') ? 5 : 0;
  if (player.rep < requiredRep) {
    messageEl.textContent = `You need ${requiredRep} reputation for this job.`;
    return;
  }

  player.activeJob = jobId;
  player.jobProgress[jobId] = { started: true, completed: false };
  messageEl.textContent = `Job accepted: ${job.name}. ${job.mission}`;
  objectiveEl.textContent = `Job: ${job.name} - ${job.mission}`;
  renderJobBoard();
}

function abandonJob() {
  if (!player.activeJob) return;

  const job = getAllJobs().find((j) => j.id === player.activeJob);
  player.activeJob = null;
  if (job) {
    player.jobProgress[job.id] = { started: false, completed: false };
    messageEl.textContent = `You abandoned the ${job.name} job.`;
  }
  objectiveEl.textContent = 'Objective: Accept a new job or explore the city.';
  renderJobBoard();
}

function completeJob(jobId) {
  const job = getAllJobs().find((j) => j.id === jobId);
  if (!job || !player.jobProgress[jobId]) return;

  player.cash += job.payment;
  player.rep += job.rep;
  player.jobProgress[jobId].completed = true;
  if (!player.completedJobs.includes(job.name)) {
    player.completedJobs.push(job.name);
  }
  player.activeJob = null;

  messageEl.textContent = `Job completed: ${job.name}! You earned $${job.payment} and ${job.rep} rep.`;
  objectiveEl.textContent = 'Objective: Accept a new job or explore the city.';
  renderJobBoard();
}

function renderJobBoard() {
  const allJobs = getAllJobs();
  const activeJob = player.activeJob ? allJobs.find((job) => job.id === player.activeJob) : null;

  noActiveMissionEl.classList.toggle('hidden', !!activeJob);
  activeMissionDetailsEl.classList.toggle('hidden', !activeJob);

  if (activeJob) {
    activeMissionNameEl.textContent = activeJob.name;
    activeMissionDescEl.textContent = `${activeJob.mission} • ${activeJob.location.building}`;
    activeMissionRewardEl.textContent = `Reward: $${activeJob.payment} + ${activeJob.rep} rep`;
  }

  jobListEl.innerHTML = allJobs
    .map((job) => {
      const isActive = player.activeJob === job.id;
      const isUnlocked = player.rep >= (job.requirements.includes('5+') ? 5 : 0);
      const isCompleted = player.completedJobs.includes(job.name);

      return `
        <div class="job-card ${isActive ? 'active' : ''} ${!isUnlocked ? 'job-card-locked' : ''}">
          <div class="job-card-header">
            <p class="job-card-title">${job.name}</p>
            <span class="job-card-rep">+${job.rep} rep</span>
          </div>
          <p class="job-card-location">@ ${job.location.building}</p>
          <p class="job-card-mission">${job.mission}</p>
          <p class="job-card-reward">Payment: $${job.payment}</p>
          <p class="job-card-requirement">${job.requirements}</p>
          <button
            type="button"
            class="accept-btn"
            data-job-id="${job.id}"
            ${!isUnlocked || isActive || isCompleted ? 'disabled' : ''}
          >
            ${isCompleted ? 'Completed' : isActive ? 'Active' : 'Accept Job'}
          </button>
        </div>
      `;
    })
    .join('');

  completedJobsListEl.innerHTML =
    player.completedJobs.length > 0
      ? player.completedJobs
          .map((jobName) => `<div class="completed-job-entry"><strong>${jobName}</strong> completed.</div>`)
          .join('')
      : '<div class="no-jobs-message">No completed jobs yet.</div>';
}

function renderFactionPanel() {
  const entries = Object.entries(factionDefinitions);

  factionListEl.innerHTML = entries
    .map(([factionName, faction]) => {
      const state = player.factions[factionName];
      const currentInfo = getFactionInfo(factionName);
      const nextRequirement = currentInfo.nextThreshold ?? 'Max rank';
      const isActive = player.activeFaction === factionName;
      const isLocked = !isActive && Date.now() < player.factionSwitchCooldown && player.activeFaction &&
        (
          (factionDefinitions[player.activeFaction].type === 'crime' && faction.type === 'police') ||
          (factionDefinitions[player.activeFaction].type === 'police' && faction.type === 'crime')
        );

      return `
        <div class="faction-card ${isActive ? 'active' : ''}">
          <div class="faction-card-header">
            <div>
              <p class="faction-card-name" style="border-left: 6px solid ${faction.color}; padding-left: 10px;">${factionName}</p>
              <small class="faction-card-type">${faction.type}</small>
            </div>
            <span class="faction-card-rank">${state.rank}</span>
          </div>
          <div class="faction-scores">
            <span>Rep: ${state.rep}</span>
            <span>Next: ${nextRequirement}</span>
          </div>
          <div class="faction-progress-bar">
            <div class="faction-progress-fill" style="width: ${(state.rep / 1600) * 100}%"></div>
          </div>
          <button class="faction-select-btn" data-faction-name="${factionName}" ${isLocked ? 'disabled' : ''}>
            ${isActive ? 'Active Faction' : isLocked ? 'Cooldown Active' : 'Set Active'}
          </button>
        </div>
      `;
    })
    .join('');
}

function setActiveFaction(factionName) {
  if (!factionDefinitions[factionName]) return;

  const activeFactionName = player.activeFaction;
  const currentTime = Date.now();

  if (activeFactionName && activeFactionName !== factionName) {
    const currentType = factionDefinitions[activeFactionName].type;
    const targetType = factionDefinitions[factionName].type;
    const isDirectRival = (currentType === 'crime' && targetType === 'police') || (currentType === 'police' && targetType === 'crime');

    if (isDirectRival) {
      if (currentTime < player.factionSwitchCooldown) {
        messageEl.textContent = 'This faction switch is on cooldown.';
        return;
      }

      player.factions[activeFactionName].rep = Math.max(0, player.factions[activeFactionName].rep - 25);
      player.factions[factionName].rep = Math.max(0, player.factions[factionName].rep - 10);
      player.factionSwitchCooldown = currentTime + 60000;
    }
  }

  Object.keys(player.factions).forEach((name) => {
    player.factions[name].active = name === factionName;
  });

  player.activeFaction = factionName;
  messageEl.textContent = `${factionName} is now your active faction.`;
  renderFactionPanel();
}

function updateFactionRankState() {
  Object.keys(factionDefinitions).forEach((factionName) => {
    const info = getFactionInfo(factionName);
    const state = info.state;

    let nextIndex = 0;
    while (nextIndex < sharedRankRequirements.length - 1 && state.rep >= sharedRankRequirements[nextIndex + 1]) {
      nextIndex += 1;
    }

    state.rankIndex = Math.min(nextIndex, factionDefinitions[factionName].ranks.length - 1);
    state.rank = factionDefinitions[factionName].ranks[state.rankIndex];
  });
}

function updateJobProgress() {
  if (!player.activeJob) return;

  const job = getAllJobs().find((j) => j.id === player.activeJob);
  if (!job) return;

  const inZone =
    player.x > job.targetZone.x &&
    player.x < job.targetZone.x + job.targetZone.w &&
    player.y > job.targetZone.y &&
    player.y < job.targetZone.y + job.targetZone.h;

  if (inZone && !player.jobProgress[player.activeJob]?.completed) {
    completeJob(player.activeJob);
  }
}

function updatePlayer(dt) {
  if (!inventoryPanel.classList.contains('hidden')) {
    return;
  }

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

    const nextX = player.x + dx * player.speed * dt;
    const nextY = player.y + dy * player.speed * dt;

    if (!hasCollision(nextX, player.y)) {
      player.x = nextX;
    }

    if (!hasCollision(player.x, nextY)) {
      player.y = nextY;
    }
  }

  player.attackCooldown = Math.max(0, player.attackCooldown - dt);
}

function performAttack() {
  if (!inventoryPanel.classList.contains('hidden')) return;
  if (player.attackCooldown > 0) return;

  player.attackCooldown = 0.35;
  let hit = false;

  enemies.forEach((enemy) => {
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist < 90) {
      enemy.hp -= 30;
      hit = true;
      messageEl.textContent = `You hit ${enemy.name} for 30 damage.`;

      if (enemy.hp <= 0) {
        player.cash += 25;
        player.rep += 4;
        messageEl.textContent = `${enemy.name} was taken down. Cash +$25, Rep +4.`;
      }
    }
  });

  if (!hit) {
    messageEl.textContent = 'Your strike misses the target.';
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
  } else if (!questState.complete) {
    objectiveEl.textContent = `Objective: Reach the ${activeQuest.name} district.`;
  }
}

function updateNPCInteraction() {
  if (!inventoryPanel.classList.contains('hidden')) return;

  let nearest = null;
  let nearestDistance = Infinity;

  npcs.forEach((npc) => {
    const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
    if (dist < 100 && dist < nearestDistance) {
      nearest = npc;
      nearestDistance = dist;
    }
  });

  const allJobs = getAllJobs();
  let nearestJob = null;
  let nearestJobDistance = Infinity;

  allJobs.forEach((job) => {
    const dist = Math.hypot(player.x - job.location.x, player.y - job.location.y);
    if (dist < 100 && dist < nearestJobDistance) {
      nearestJob = job;
      nearestJobDistance = dist;
    }
  });

  if (nearestJob && (!nearest || nearestJobDistance < nearestDistance)) {
    const actionText = player.activeJob === nearestJob.id ? 'continue' : 'accept';
    messageEl.textContent = `Press E near ${nearestJob.location.building} to ${actionText} job: ${nearestJob.name}.`;

    if (keys['e'] && !keys.interactLock) {
      keys.interactLock = true;
      if (player.activeJob !== nearestJob.id) {
        acceptJob(nearestJob.id);
      }
    }
  } else if (nearest) {
    messageEl.textContent = `Press E to speak with ${nearest.name}.`;

    if (keys['e'] && !keys.interactLock) {
      keys.interactLock = true;
      player.cash += 25;
      player.rep += 2;
      messageEl.textContent = `${nearest.name}: "The city is changing. Stay sharp."`;
    }
  } else if (!keys['e']) {
    keys.interactLock = false;
    if (!questState.complete && !keys['f']) {
      messageEl.textContent = 'Move with WASD or Arrow Keys.';
    }
  }
}

function updateEnemies(dt) {
  enemies.forEach((enemy) => {
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist < 260) {
      const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
      const mvx = Math.cos(angle) * enemy.speed * dt;
      const mvy = Math.sin(angle) * enemy.speed * dt;

      const nextX = enemy.x + mvx;
      const nextY = enemy.y + mvy;

      if (!hasCollision(nextX, enemy.y)) {
        enemy.x = nextX;
      }
      if (!hasCollision(enemy.x, nextY)) {
        enemy.y = nextY;
      }
    }

    if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < enemy.radius + player.radius + 6) {
      player.health -= enemy.damage * dt;
      if (player.health <= 0) {
        player.health = 100;
        player.x = 820;
        player.y = 890;
        player.cash = Math.max(0, player.cash - 20);
        messageEl.textContent = 'You were knocked out and respawned at the city center.';
      }
    }
  });

  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].hp <= 0) {
      enemies.splice(i, 1);
    }
  }
}

function updateHud() {
  healthEl.textContent = Math.round(player.health);
  cashEl.textContent = `$${player.cash}`;
  repEl.textContent = player.rep;
  medkitsEl.textContent = player.medkits;
}

function update(dt) {
  updatePlayer(dt);
  updateZoneProgress();
  updateNPCInteraction();
  updateJobProgress();
  updateFactionRankState();
  updateEnemies(dt);
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

  const allJobs = getAllJobs();
  allJobs.forEach((job) => {
    ctx.fillStyle = player.activeJob === job.id ? '#00ff00' : '#ffeb3b';
    ctx.beginPath();
    ctx.arc(job.location.x, job.location.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.fillText(job.name.substring(0, 4), job.location.x - 12, job.location.y + 3);
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

  enemies.forEach((enemy) => {
    ctx.beginPath();
    ctx.fillStyle = enemy.color;
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(enemy.x - 20, enemy.y - 30, 40, 6);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(enemy.x - 20, enemy.y - 30, 40 * (enemy.hp / 90), 6);
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
  ctx.fillRect(20, canvas.height - 80, 480, 50);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.strokeRect(20, canvas.height - 80, 480, 50);

  ctx.fillStyle = '#eaf8ff';
  ctx.font = '16px Arial';
  ctx.fillText(questState.text, 36, canvas.height - 48);
}

function drawControls() {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(canvas.width - 290, 18, 260, 110);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.strokeRect(canvas.width - 290, 18, 260, 110);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '15px Arial';
  ctx.fillText('Controls', canvas.width - 260, 42);
  ctx.font = '13px Arial';
  ctx.fillText('WASD / Arrows = move', canvas.width - 260, 66);
  ctx.fillText('F = strike / attack', canvas.width - 260, 88);
  ctx.fillText('H = medkit', canvas.width - 260, 110);
  ctx.fillText('E = talk/job', canvas.width - 260, 132);
}

function render() {
  const cameraX = clamp(player.x - canvas.width / 2, 0, world.width - canvas.width);
  const cameraY = clamp(player.y - canvas.height / 2, 0, world.height - canvas.height);

  drawBackground(cameraX, cameraY);
  drawPlayer(cameraX, cameraY);
  drawQuestPanel();
  drawControls();
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  keys[key] = true;

  if (key === 'i') {
    toggleInventory();
  }

  if (key === 'j') {
    toggleJobBoard();
  }

  if (key === 'k') {
    toggleFactionPanel();
  }

  if (key === 'f') {
    performAttack();
  }

  if (key === 'h') {
    useMedkit();
  }

  if (key === 'e') {
    keys.interactLock = false;
  }

  if (key === ' ') {
    keys['space'] = true;
    performAttack();
  }
});

window.addEventListener('keyup', (event) => {
  const key = event.key.toLowerCase();
  keys[key] = false;
  if (key === ' ') {
    keys['space'] = false;
  }
});

shopList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-buy]');
  if (!button) return;
  buyItem(button.dataset.buy);
});

jobListEl.addEventListener('click', (event) => {
  const button = event.target.closest('[data-job-id]');
  if (!button) return;
  acceptJob(button.dataset.jobId);
});

factionListEl.addEventListener('click', (event) => {
  const button = event.target.closest('[data-faction-name]');
  if (!button) return;
  setActiveFaction(button.dataset.factionName);
});

closeInventoryButton.addEventListener('click', () => toggleInventory(false));
closeJobBoardButton.addEventListener('click', () => toggleJobBoard(false));
closeFactionButton.addEventListener('click', () => toggleFactionPanel(false));
abandonJobBtn.addEventListener('click', () => abandonJob());
window.addEventListener('resize', resizeCanvas);

resizeCanvas();
updateHud();
refreshInventoryUI();
renderJobBoard();
renderFactionPanel();
objectiveEl.textContent = `Objective: Reach the ${zoneQuests[0].name} district.`;

let lastTime = 0;
function gameLoop(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000 || 0.016, 0.033);
  lastTime = timestamp;

  update(dt);
  render();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
