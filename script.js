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
const joystickBase = document.getElementById('joystickBase');
const joystickThumb = document.getElementById('joystickThumb');
const controlButtons = [...document.querySelectorAll('[data-control]')];

const world = { width: 2200, height: 1600 };
const keys = {};
const touchInput = { x: 0, y: 0, active: false };
const joystickState = { active: false, pointerId: null, radius: 48 };

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
  'Metro Police Department': { type: 'police', color: '#3b82f6', ranks: ['Police Recruit', 'Police Officer', 'Senior Officer', 'Patrol Officer', 'Traffic Officer', 'Detective', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain'] },
  'City Highway Patrol': { type: 'police', color: '#60a5fa', ranks: ['Cadet', 'Patrol Officer', 'Traffic Officer', 'Highway Officer', 'Senior Patrol Officer', 'Motorcycle Officer', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain'] },
  'National Defense Force': { type: 'military', color: '#22c55e', ranks: ['Recruit', 'Private', 'Private First Class', 'Specialist', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Lieutenant', 'Captain', 'Major'] },
  'State Intelligence Service': { type: 'intelligence', color: '#a78bfa', ranks: ['Trainee', 'Intelligence Analyst', 'Field Agent', 'Surveillance Agent', 'Intelligence Officer', 'Senior Agent', 'Operations Lead', 'Deputy Director', 'Director', 'Chief Director'] },
  'Central City Medical Center': { type: 'medical', color: '#34d399', ranks: ['Medical Intern', 'Medical Assistant', 'Nurse', 'Paramedic', 'Senior Nurse', 'Doctor', 'Emergency Doctor', 'Surgeon', 'Chief Surgeon', 'Medical Director'] },
  'Riverside General Hospital': { type: 'medical', color: '#2dd4bf', ranks: ['Medical Intern', 'Medical Assistant', 'Nurse', 'Paramedic', 'Senior Nurse', 'Doctor', 'Emergency Doctor', 'Surgeon', 'Chief Surgeon', 'Medical Director'] },
  'Urban News Network': { type: 'news', color: '#fbbf24', ranks: ['News Intern', 'Camera Assistant', 'Reporter', 'News Photographer', 'Field Reporter', 'Investigative Journalist', 'Senior Reporter', 'Producer', 'News Director', 'Editor-in-Chief'] },
  'City Government Administration': { type: 'government', color: '#e2e8f0', ranks: ['Administrative Intern', 'Clerk', 'Administrative Assistant', 'Government Officer', 'Senior Officer', 'Department Analyst', 'Section Chief', 'Deputy Director', 'Director', 'Commissioner'] },
};

const stage2FactionJobs = {
  'Black Vipers': [
    { id: 'black_vipers_prospect', rankIndex: 0, rankName: 'Prospect', title: 'Street Hand-Off', description: 'Move contraband through the East Faction strip and make the first drop clean.', payment: 140, repReward: 12, requiredFactionRep: 0, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'black_vipers_street_runner', rankIndex: 1, rankName: 'Street Runner', title: 'Courier Sweep', description: 'Run the alley routes and keep the crew supplied before dawn.', payment: 180, repReward: 15, requiredFactionRep: 40, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'black_vipers_enforcer', rankIndex: 2, rankName: 'Enforcer', title: 'Boardwalk Check', description: 'Clear a rival crew from the river approach and collect the cut.', payment: 260, repReward: 18, requiredFactionRep: 80, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'black_vipers_driver', rankIndex: 3, rankName: 'Driver', title: 'Midnight Chase', description: 'Transport a timed cargo load through the city roads and lose the tails.', payment: 330, repReward: 20, requiredFactionRep: 130, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'black_vipers_dealer', rankIndex: 4, rankName: 'Dealer', title: 'Market Takeover', description: 'Secure a distribution point and settle the local street market.', payment: 400, repReward: 24, requiredFactionRep: 200, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'black_vipers_specialist', rankIndex: 5, rankName: 'Specialist', title: 'Signal Jam', description: 'Hack and disrupt a rival surveillance effort in the East Faction block.', payment: 510, repReward: 30, requiredFactionRep: 280, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'black_vipers_crew_leader', rankIndex: 6, rankName: 'Crew Leader', title: 'Warehouse Strike', description: 'Command the crew through a protection job and secure the warehouse haul.', payment: 630, repReward: 38, requiredFactionRep: 380, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'black_vipers_senior_enforcer', rankIndex: 7, rankName: 'Senior Enforcer', title: 'Two-Block Sweep', description: 'Crush resistance in two active sectors and leave a warning behind.', payment: 760, repReward: 42, requiredFactionRep: 500, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'black_vipers_underboss', rankIndex: 8, rankName: 'Underboss', title: 'Power Play', description: 'Take control of a rival route and collect the supplier debt.', payment: 900, repReward: 52, requiredFactionRep: 700, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'black_vipers_boss', rankIndex: 9, rankName: 'Boss', title: 'Citywide Dominance', description: 'Launch the final citywide push and lock the Viper empire in place.', payment: 1150, repReward: 70, requiredFactionRep: 980, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
  ],
  'Iron Wolves': [
    { id: 'iron_wolves_prospect', rankIndex: 0, rankName: 'Prospect', title: 'Backstreet Relay', description: 'Escort a small shipment from the river edge to the safe zone.', payment: 130, repReward: 12, requiredFactionRep: 0, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'iron_wolves_street_runner', rankIndex: 1, rankName: 'Street Runner', title: 'Fence Run', description: 'Run a swift route to the market and secure the valuables before intercept.', payment: 205, repReward: 15, requiredFactionRep: 40, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'iron_wolves_enforcer', rankIndex: 2, rankName: 'Enforcer', title: 'Riot Control', description: 'Break up a rival push along the riverfront and recover the payment.', payment: 270, repReward: 18, requiredFactionRep: 80, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'iron_wolves_driver', rankIndex: 3, rankName: 'Driver', title: 'Night Route', description: 'Deliver the load through every crossroad and keep it from being flagged.', payment: 340, repReward: 20, requiredFactionRep: 130, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'iron_wolves_dealer', rankIndex: 4, rankName: 'Dealer', title: 'Warehouse Exchange', description: 'Lock down a stock transfer and secure the payout from the dealer circle.', payment: 410, repReward: 24, requiredFactionRep: 200, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'iron_wolves_specialist', rankIndex: 5, rankName: 'Specialist', title: 'Signal Breach', description: 'Plant false signals and jam the rival grid in the East Faction sectors.', payment: 520, repReward: 30, requiredFactionRep: 280, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'iron_wolves_crew_leader', rankIndex: 6, rankName: 'Crew Leader', title: 'Frontline Hold', description: 'Command a raid and hold the route until the crew clears the stock.', payment: 660, repReward: 38, requiredFactionRep: 380, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'iron_wolves_senior_enforcer', rankIndex: 7, rankName: 'Senior Enforcer', title: 'Southside Pressure', description: 'Push through the South Gang edge and keep the rival block collapsed.', payment: 780, repReward: 48, requiredFactionRep: 500, targetZone: { x: 80, y: 1120, w: 820, h: 380 } },
    { id: 'iron_wolves_underboss', rankIndex: 8, rankName: 'Underboss', title: 'Route Lock', description: 'Take over high-value transit and route each drop to the iron chain.', payment: 930, repReward: 54, requiredFactionRep: 700, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'iron_wolves_boss', rankIndex: 9, rankName: 'Boss', title: 'Final Dominion', description: 'Finish the citywide takeover and seal the Wolf coalition under one brand.', payment: 1180, repReward: 72, requiredFactionRep: 980, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
  ],
  'Crown Syndicate': [
    { id: 'crown_syndicate_associate', rankIndex: 0, rankName: 'Associate', title: 'Purse Run', description: 'Handle a quiet transfer through the river corridor and keep the ledger clean.', payment: 120, repReward: 12, requiredFactionRep: 0, targetZone: { x: 1180, y: 0, w: 820, h: 520 } },
    { id: 'crown_syndicate_courier', rankIndex: 1, rankName: 'Courier', title: 'Glass Route', description: 'Deliver a priority package between syndicate fronts before sunset.', payment: 210, repReward: 16, requiredFactionRep: 40, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'crown_syndicate_enforcer', rankIndex: 2, rankName: 'Enforcer', title: 'Harbor Pressure', description: 'Hold the harbor route against rival pressure and collect the recovered fees.', payment: 280, repReward: 18, requiredFactionRep: 80, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'crown_syndicate_driver', rankIndex: 3, rankName: 'Driver', title: 'Gold Runner', description: 'Move the cash convoy through mixed routes without losing the escort.', payment: 350, repReward: 20, requiredFactionRep: 130, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'crown_syndicate_specialist', rankIndex: 4, rankName: 'Specialist', title: 'Quiet Entry', description: 'Slip in with a false manifest and secure the premium stash before dawn.', payment: 440, repReward: 25, requiredFactionRep: 200, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'crown_syndicate_security_officer', rankIndex: 5, rankName: 'Security Officer', title: 'Vault Watch', description: 'Guard a high-value vault and stop the extraction attempt at the doors.', payment: 540, repReward: 30, requiredFactionRep: 280, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'crown_syndicate_crew_leader', rankIndex: 6, rankName: 'Crew Leader', title: 'Prize Lift', description: 'Turn the collection team into a successful extraction and secure all payments.', payment: 680, repReward: 40, requiredFactionRep: 380, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'crown_syndicate_captain', rankIndex: 7, rankName: 'Captain', title: 'Crown Sweep', description: 'Sweep the city block, clear the suspects, and dominate the syndicate lane.', payment: 800, repReward: 46, requiredFactionRep: 500, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'crown_syndicate_underboss', rankIndex: 8, rankName: 'Underboss', title: 'Golden Contract', description: 'Seal a major contract and force the remaining fronts to comply.', payment: 960, repReward: 56, requiredFactionRep: 700, targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'crown_syndicate_boss', rankIndex: 9, rankName: 'Boss', title: 'Empire Crown', description: 'Claim the city’s largest network and set the new Syndicate order in motion.', payment: 1200, repReward: 72, requiredFactionRep: 980, targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
  ],
  'Metro Police Department': [
    { id: 'mpd_recruit', rankIndex: 0, rankName: 'Police Recruit', title: 'Beat Patrol', description: 'Complete a pattern patrol near city hall and confirm local safety checks.', payment: 140, repReward: 12, requiredFactionRep: 0, targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_police_officer', rankIndex: 1, rankName: 'Police Officer', title: 'Hot Spot Scan', description: 'Respond to suspicious activity near the central district and file a clean review.', payment: 210, repReward: 16, requiredFactionRep: 40, targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_senior_officer', rankIndex: 2, rankName: 'Senior Officer', title: 'Evidence Run', description: 'Gather key evidence and secure the route during a rapid response.', payment: 280, repReward: 20, requiredFactionRep: 80, targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_patrol_officer', rankIndex: 3, rankName: 'Patrol Officer', title: 'District Sweep', description: 'Cover the city blocks and keep the route stable for the department watch.', payment: 365, repReward: 22, requiredFactionRep: 130, targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_traffic_officer', rankIndex: 4, rankName: 'Traffic Officer', title: 'Street Control', description: 'Regulate key intersections and keep movement safe during the evening rush.', payment: 440, repReward: 25, requiredFactionRep: 200, targetZone: { x: 500, y: 0, w: 120, h: 1600 } },
    { id: 'mpd_detective', rankIndex: 5, rankName: 'Detective', title: 'Case File Search', description: 'Trace the suspect pattern and collect intel before the next raid.', payment: 560, repReward: 30, requiredFactionRep: 280, targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_corporal', rankIndex: 6, rankName: 'Corporal', title: 'Night Detail', description: 'Lead a squad through a sustained check of the admin district routes.', payment: 680, repReward: 38, requiredFactionRep: 380, targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_sergeant', rankIndex: 7, rankName: 'Sergeant', title: 'Unit Response', description: 'Coordinate a high-pressure response against organized activity in the city core.', payment: 820, repReward: 46, requiredFactionRep: 500, targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_lieutenant', rankIndex: 8, rankName: 'Lieutenant', title: 'Operations Sweep', description: 'Run an organized enforcement action and secure the department’s district control.', payment: 950, repReward: 54, requiredFactionRep: 700, targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_captain', rankIndex: 9, rankName: 'Captain', title: 'City Lockdown', description: 'Lead the final citywide response and stabilize the capital district.', payment: 1220, repReward: 72, requiredFactionRep: 980, targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
  ],
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
  factionMissionProgress: {},
  activeFactionMission: null,
};

Object.keys(factionDefinitions).forEach((factionName) => {
  player.factions[factionName] = {
    rep: 0,
    rankIndex: 0,
    rank: factionDefinitions[factionName].ranks[0],
    active: false,
    jobsCompleted: 0,
  };
  player.factionMissionProgress[factionName] = {};
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

function getAllFactionJobs() {
  return Object.entries(stage2FactionJobs).flatMap(([factionName, missions]) =>
    missions.map((mission) => ({ ...mission, factionName }))
  );
}

function getFactionJobsForFaction(factionName) {
  return (stage2FactionJobs[factionName] || []).map((mission) => ({ ...mission, factionName }));
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

      const missionCards = getFactionJobsForFaction(factionName)
        .map((mission) => {
          const missionProgress = player.factionMissionProgress[factionName]?.[mission.id] || {};
          const isMissionCompleted = !!missionProgress.completed;
          const isMissionUnlocked = state.rep >= mission.requiredFactionRep;
          const isMissionActive = player.activeFactionMission && player.activeFactionMission.factionName === factionName && player.activeFactionMission.missionId === mission.id;

          return `
            <div class="faction-mission-card ${isMissionActive ? 'active' : ''} ${isMissionCompleted ? 'completed' : ''}">
              <div class="faction-mission-header">
                <strong>${mission.rankName}</strong>
                <span>${mission.title}</span>
              </div>
              <p>${mission.description}</p>
              <div class="faction-mission-meta">
                <span>Pay: $${mission.payment}</span>
                <span>Rep: +${mission.repReward}</span>
                <span>Unlock: ${mission.requiredFactionRep}</span>
              </div>
              <button
                type="button"
                class="faction-mission-btn"
                data-faction-name="${factionName}"
                data-faction-mission-id="${mission.id}"
                ${!isMissionUnlocked || isMissionCompleted || isMissionActive ? 'disabled' : ''}
              >
                ${isMissionCompleted ? 'Cleared' : isMissionActive ? 'Active' : 'Start'}
              </button>
            </div>
          `;
        })
        .join('');

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
          <div class="faction-mission-list">
            ${missionCards}
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

function startFactionMission(factionName, missionId) {
  const factionMissions = stage2FactionJobs[factionName] || [];
  const mission = factionMissions.find((entry) => entry.id === missionId);
  if (!mission) return;

  const factionState = player.factions[factionName];
  if (!factionState) return;

  if (factionState.rep < mission.requiredFactionRep) {
    messageEl.textContent = `You need ${mission.requiredFactionRep} faction rep in ${factionName} to start ${mission.title}.`;
    return;
  }

  player.activeFaction = factionName;
  player.activeFactionMission = { factionName, missionId };
  player.factionMissionProgress[factionName][missionId] = {
    started: true,
    completed: false,
  };

  objectiveEl.textContent = `Faction Mission: ${factionName} - ${mission.title}`;
  messageEl.textContent = `${factionName}: ${mission.title} is active. Reach the target zone to complete it.`;
  renderFactionPanel();
}

function completeFactionMission(factionName, missionId) {
  const factionMissions = stage2FactionJobs[factionName] || [];
  const mission = factionMissions.find((entry) => entry.id === missionId);
  if (!mission) return;

  if (!player.factionMissionProgress[factionName]) {
    player.factionMissionProgress[factionName] = {};
  }

  player.factionMissionProgress[factionName][missionId] = {
    started: true,
    completed: true,
  };

  player.cash += mission.payment;
  player.factions[factionName].rep += mission.repReward;
  player.activeFactionMission = null;

  if (player.activeFaction === factionName) {
    objectiveEl.textContent = `Faction Mission Complete: ${factionName} - ${mission.title}`;
  } else {
    objectiveEl.textContent = 'Objective: Accept a new job or explore the city.';
  }

  messageEl.textContent = `${factionName}: ${mission.title} complete. Earned $${mission.payment} and +${mission.repReward} faction rep.`;
  updateFactionRankState();
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

function updateFactionMissionProgress() {
  if (!player.activeFactionMission) return;

  const { factionName, missionId } = player.activeFactionMission;
  const mission = (stage2FactionJobs[factionName] || []).find((entry) => entry.id === missionId);
  if (!mission) {
    player.activeFactionMission = null;
    return;
  }

  const zone = mission.targetZone;
  const inZone =
    player.x > zone.x &&
    player.x < zone.x + zone.w &&
    player.y > zone.y &&
    player.y < zone.y + zone.h;

  if (inZone) {
    completeFactionMission(factionName, missionId);
  }
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

  if (touchInput.x < -0.2) dx -= 1;
  if (touchInput.x > 0.2) dx += 1;
  if (touchInput.y < -0.2) dy -= 1;
  if (touchInput.y > 0.2) dy += 1;

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
  updateFactionMissionProgress();
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
  const panelX = Math.max(18, canvas.width - 300);
  const panelY = Math.min(canvas.height - 158, canvas.height - 150);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(panelX, panelY, 260, 120);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.strokeRect(panelX, panelY, 260, 120);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '15px Arial';
  ctx.fillText('Controls', panelX + 24, panelY + 26);
  ctx.font = '13px Arial';
  ctx.fillText('WASD / Arrows = move', panelX + 24, panelY + 52);
  ctx.fillText('F = strike / attack', panelX + 24, panelY + 74);
  ctx.fillText('H = medkit', panelX + 24, panelY + 96);
  ctx.fillText('E = talk/job', panelX + 24, panelY + 118);
}

function render() {
  const cameraX = clamp(player.x - canvas.width / 2, 0, world.width - canvas.width);
  const cameraY = clamp(player.y - canvas.height / 2, 0, world.height - canvas.height);

  drawBackground(cameraX, cameraY);
  drawPlayer(cameraX, cameraY);
  drawQuestPanel();
  drawControls();
}

function handleTouchButtonPress(control) {
  const button = document.querySelector(`[data-control="${control}"]`);
  if (button) {
    button.classList.add('pressed');
    setTimeout(() => button.classList.remove('pressed'), 120);
  }

  switch (control) {
    case 'attack':
      performAttack();
      break;
    case 'interact':
      keys.e = true;
      keys.interactLock = false;
      updateNPCInteraction();
      setTimeout(() => { keys.e = false; }, 150);
      break;
    case 'medkit':
      useMedkit();
      break;
    case 'job':
      toggleJobBoard();
      break;
    case 'inventory':
      toggleInventory();
      break;
    default:
      break;
  }
}

function setJoystickFromPointer(clientX, clientY) {
  const rect = joystickBase.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = clientX - centerX;
  const dy = clientY - centerY;
  const distance = Math.min(Math.hypot(dx, dy), joystickState.radius);
  const angle = Math.atan2(dy, dx);
  const offsetX = Math.cos(angle) * distance;
  const offsetY = Math.sin(angle) * distance;

  joystickThumb.style.transform = `translate(${offsetX - 26}px, ${offsetY - 26}px)`;
  const normX = distance === 0 ? 0 : offsetX / joystickState.radius;
  const normY = distance === 0 ? 0 : offsetY / joystickState.radius;
  touchInput.x = clamp(normX, -1, 1);
  touchInput.y = clamp(normY, -1, 1);
  touchInput.active = true;
}

function resetJoystick() {
  touchInput.x = 0;
  touchInput.y = 0;
  touchInput.active = false;
  joystickThumb.style.transform = 'translate(-50%, -50%)';
  joystickState.active = false;
  joystickState.pointerId = null;
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
  const missionButton = event.target.closest('[data-faction-mission-id]');
  if (missionButton) {
    startFactionMission(missionButton.dataset.factionName, missionButton.dataset.factionMissionId);
    return;
  }

  const button = event.target.closest('[data-faction-name]');
  if (!button) return;
  setActiveFaction(button.dataset.factionName);
});

closeInventoryButton.addEventListener('click', () => toggleInventory(false));
closeJobBoardButton.addEventListener('click', () => toggleJobBoard(false));
closeFactionButton.addEventListener('click', () => toggleFactionPanel(false));
abandonJobBtn.addEventListener('click', () => abandonJob());
window.addEventListener('resize', resizeCanvas);

joystickBase.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  joystickState.active = true;
  joystickState.pointerId = event.pointerId;
  joystickBase.setPointerCapture(event.pointerId);
  setJoystickFromPointer(event.clientX, event.clientY);
});

joystickBase.addEventListener('pointermove', (event) => {
  if (!joystickState.active || event.pointerId !== joystickState.pointerId) return;
  setJoystickFromPointer(event.clientX, event.clientY);
});

joystickBase.addEventListener('pointerup', () => resetJoystick());
joystickBase.addEventListener('pointercancel', () => resetJoystick());
joystickBase.addEventListener('pointerleave', () => {
  if (joystickState.active) resetJoystick();
});

controlButtons.forEach((button) => {
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    handleTouchButtonPress(button.dataset.control);
  });
});

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

window.addEventListener('blur', () => {
  Object.keys(keys).forEach((key) => {
    keys[key] = false;
  });
  resetJoystick();
});

window.addEventListener('contextmenu', (event) => event.preventDefault());

setInterval(() => {
  if (!touchInput.active) {
    touchInput.x = 0;
    touchInput.y = 0;
  }
}, 100);

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const mobileControls = document.getElementById('mobileControls');
  if (mobileControls) {
    mobileControls.style.display = 'none';
  }
}

window.addEventListener('orientationchange', () => {
  resizeCanvas();
});

window.addEventListener('pointerup', () => {
  resetJoystick();
});

window.addEventListener('pointercancel', () => {
  resetJoystick();
});

window.addEventListener('touchstart', (event) => {
  if (event.target.closest('.touch-button')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (event.target.closest('.touch-button') || event.target.closest('.joystick-base')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchend', () => {
  resetJoystick();
});

window.addEventListener('touchcancel', () => {
  resetJoystick();
});

const alsoTouchButtons = [...document.querySelectorAll('.touch-button')];
alsoTouchButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
  });
});

const mobileControls = document.getElementById('mobileControls');
if (mobileControls) {
  mobileControls.setAttribute('aria-live', 'polite');
}

if (window.innerWidth <= 700) {
  document.body.classList.add('mobile-layout');
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    document.body.classList.add('mobile-layout');
  } else {
    document.body.classList.remove('mobile-layout');
  }
});

const pointerLockReset = () => {
  resetJoystick();
  Object.keys(keys).forEach((key) => {
    if (key.startsWith('arrow')) {
      keys[key] = false;
    }
  });
};

window.addEventListener('pointerup', pointerLockReset);
window.addEventListener('pointercancel', pointerLockReset);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
  }
});

window.addEventListener('wheel', (event) => {
  event.preventDefault();
}, { passive: false });

if ('ontouchstart' in window) {
  document.body.style.touchAction = 'none';
}

window.addEventListener('deviceorientation', () => {
  if (window.innerWidth <= 700) {
    resizeCanvas();
  }
});

const navButtons = [...document.querySelectorAll('.touch-button')];
navButtons.forEach((button) => {
  button.addEventListener('contextmenu', (event) => event.preventDefault());
});

window.addEventListener('touchstart', () => {
  if (window.innerWidth <= 700) {
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  }
}, { passive: true });

const joystickBaseRect = () => joystickBase.getBoundingClientRect();
window.addEventListener('pointermove', (event) => {
  if (joystickState.active && joystickBaseRect && event.pointerId === joystickState.pointerId) {
    setJoystickFromPointer(event.clientX, event.clientY);
  }
});

window.addEventListener('dragstart', (event) => event.preventDefault());

if (window.innerWidth <= 700) {
  document.body.style.overflow = 'hidden';
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'hidden';
  }
});

window.addEventListener('mouseleave', () => resetJoystick());

if (window.innerWidth <= 700) {
  const hud = document.getElementById('hud');
  if (hud) {
    hud.style.paddingTop = '10px';
  }
}

const actionButtons = [...document.querySelectorAll('.touch-button')];
actionButtons.forEach((button) => {
  button.addEventListener('pointerup', () => button.classList.remove('pressed'));
  button.addEventListener('pointercancel', () => button.classList.remove('pressed'));
});

if (window.innerWidth <= 700) {
  drawControls = () => {};
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    drawControls = () => {};
  } else {
    drawControls = function drawControls() {
      const panelX = Math.max(18, canvas.width - 300);
      const panelY = Math.min(canvas.height - 158, canvas.height - 150);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(panelX, panelY, 260, 120);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.strokeRect(panelX, panelY, 260, 120);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '15px Arial';
      ctx.fillText('Controls', panelX + 24, panelY + 26);
      ctx.font = '13px Arial';
      ctx.fillText('WASD / Arrows = move', panelX + 24, panelY + 52);
      ctx.fillText('F = strike / attack', panelX + 24, panelY + 74);
      ctx.fillText('H = medkit', panelX + 24, panelY + 96);
      ctx.fillText('E = talk/job', panelX + 24, panelY + 118);
    };
  }
});

if (window.innerWidth <= 700) {
  const controlsPanel = document.getElementById('gameCanvas');
  if (controlsPanel) {
    controlsPanel.style.pointerEvents = 'auto';
  }
}

requestAnimationFrame(gameLoop);

if (window.innerWidth <= 700) {
  if (mobileControls) {
    mobileControls.style.display = 'flex';
  }
}

if (window.innerWidth > 700) {
  if (mobileControls) {
    mobileControls.style.display = 'none';
  }
}

window.addEventListener('resize', () => {
  const mobileControlsVisible = window.innerWidth <= 700;
  if (mobileControls) {
    mobileControls.style.display = mobileControlsVisible ? 'flex' : 'none';
  }
});

window.addEventListener('pointerdown', () => {
  if (!document.body.classList.contains('mobile-layout')) return;
  if (window.innerWidth > 700) return;
  document.body.style.overscrollBehavior = 'none';
});

window.addEventListener('touchmove', (event) => {
  if (window.innerWidth <= 700) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('keydown', (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
    event.preventDefault();
  }
});

window.addEventListener('touchstart', (event) => {
  if (window.innerWidth <= 700 && event.target.closest('.touch-button')) {
    event.preventDefault();
  }
}, { passive: false });

if (window.innerWidth <= 700) {
  window.addEventListener('resize', () => {
    resizeCanvas();
  });
}

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') {
    event.preventDefault();
  }
}, { passive: false });

const uiReferences = {
  hud: document.getElementById('hud'),
  mobileControls,
  canvas,
};

if (uiReferences.hud && window.innerWidth <= 700) {
  uiReferences.hud.style.zIndex = '12';
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    if (uiReferences.hud) uiReferences.hud.style.zIndex = '12';
  }
});

window.dispatchEvent(new Event('resize'));

const controlsButton = document.querySelector('.touch-button-job');
if (controlsButton) {
  controlsButton.addEventListener('click', () => toggleJobBoard());
}

const inventoryButton = document.querySelector('.touch-button-inventory');
if (inventoryButton) {
  inventoryButton.addEventListener('click', () => toggleInventory());
}

window.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    resetJoystick();
  }
});

window.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch') {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (event.target instanceof HTMLElement && event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

const defaultDrawControls = function drawControls() {
  const panelX = Math.max(18, canvas.width - 300);
  const panelY = Math.min(canvas.height - 158, canvas.height - 150);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(panelX, panelY, 260, 120);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.strokeRect(panelX, panelY, 260, 120);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '15px Arial';
  ctx.fillText('Controls', panelX + 24, panelY + 26);
  ctx.font = '13px Arial';
  ctx.fillText('WASD / Arrows = move', panelX + 24, panelY + 52);
  ctx.fillText('F = strike / attack', panelX + 24, panelY + 74);
  ctx.fillText('H = medkit', panelX + 24, panelY + 96);
  ctx.fillText('E = talk/job', panelX + 24, panelY + 118);
};

if (window.innerWidth > 700) {
  drawControls = defaultDrawControls;
}

if (window.innerWidth <= 700) {
  drawControls = () => {};
}

const handleControlButtonPress = (button) => {
  if (!button) return;
  const action = button.dataset.control;
  handleTouchButtonPress(action);
};

controlButtons.forEach((button) => {
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    handleControlButtonPress(button);
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    drawControls = () => {};
  } else {
    drawControls = defaultDrawControls;
  }
});

if (window.innerWidth <= 700) {
  document.body.classList.add('touch-device');
}

if (window.innerWidth > 700) {
  document.body.classList.remove('touch-device');
}

const docTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (docTouch) {
  document.body.classList.add('touch-device');
}

window.addEventListener('resize', () => {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.body.classList.add('touch-device');
  }
});

window.addEventListener('touchstart', () => {
  if (window.innerWidth <= 700) {
    document.body.classList.add('touch-device');
  }
}, { passive: true });

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') {
    document.body.classList.add('touch-device');
  }
}, { passive: true });

window.addEventListener('pointerup', () => {
  if (window.innerWidth <= 700) {
    document.body.classList.add('touch-device');
  }
}, { passive: true });

const touchActiveCheck = () => {
  if (window.innerWidth <= 700) {
    document.body.classList.add('touch-device');
  }
};

window.addEventListener('resize', touchActiveCheck);
window.addEventListener('orientationchange', touchActiveCheck);

if (window.innerWidth <= 700) {
  resizeCanvas();
}

if (window.innerWidth <= 700) {
  Object.defineProperty(window, 'innerWidth', { value: window.innerWidth, writable: true });
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    resizeCanvas();
  }
});

window.addEventListener('load', () => {
  resizeCanvas();
});

const controlsOnly = document.querySelector('#mobileControls');
if (controlsOnly && window.innerWidth <= 700) {
  controlsOnly.style.display = 'flex';
}

if (window.innerWidth > 700) {
  if (controlsOnly) {
    controlsOnly.style.display = 'none';
  }
}

window.addEventListener('resize', () => {
  if (controlsOnly) {
    controlsOnly.style.display = window.innerWidth <= 700 ? 'flex' : 'none';
  }
});

if (window.innerWidth <= 700) {
  document.body.style.touchAction = 'none';
}

window.addEventListener('resize', () => {
  document.body.style.touchAction = window.innerWidth <= 700 ? 'none' : 'auto';
});

window.addEventListener('touchmove', (event) => {
  if (event.target instanceof Node && event.target.closest('#gameCanvas')) {
    event.preventDefault();
  }
}, { passive: false });

const finalButtonBindings = [...document.querySelectorAll('.touch-button')];
finalButtonBindings.forEach((button) => {
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    button.classList.add('pressed');
  });
  button.addEventListener('pointerup', () => button.classList.remove('pressed'));
  button.addEventListener('pointerleave', () => button.classList.remove('pressed'));
  button.addEventListener('pointercancel', () => button.classList.remove('pressed'));
});

window.addEventListener('contextmenu', (event) => {
  if (event.target.closest('.touch-button') || event.target.closest('.joystick-base')) {
    event.preventDefault();
  }
});

const keyboardActionButtons = [...document.querySelectorAll('[data-control]')];
keyboardActionButtons.forEach((button) => {
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTouchButtonPress(button.dataset.control);
    }
  });
});

const hudStats = document.querySelectorAll('.stats div');
hudStats.forEach((stat) => {
  stat.style.position = 'relative';
  stat.style.zIndex = '12';
});

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    hudStats.forEach((stat) => {
      stat.style.minWidth = '72px';
    });
  } else {
    hudStats.forEach((stat) => {
      stat.style.minWidth = '90px';
    });
  }
});

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  document.querySelectorAll('.touch-button').forEach((button) => {
    button.style.fontSize = '0.72rem';
    button.style.padding = '10px 8px';
  });
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    document.querySelectorAll('.touch-button').forEach((button) => {
      button.style.fontSize = '0.72rem';
      button.style.padding = '10px 8px';
    });
  } else {
    document.querySelectorAll('.touch-button').forEach((button) => {
      button.style.fontSize = '0.8rem';
      button.style.padding = '12px 8px';
    });
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch' && window.innerWidth <= 700) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (window.innerWidth <= 700 && event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('pointerdown', (event) => {
  if (window.innerWidth <= 700 && event.pointerType === 'touch' && event.target.closest('.touch-button')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('orientationchange', () => {
  if (window.innerWidth <= 700) {
    resizeCanvas();
  }
});

window.addEventListener('focus', () => {
  resizeCanvas();
});

window.addEventListener('load', () => {
  if (window.innerWidth <= 700) {
    resizeCanvas();
  }
});

window.dispatchEvent(new Event('load'));

window.addEventListener('keydown', (event) => {
  const activeElement = document.activeElement;
  if (activeElement && activeElement.tagName === 'BUTTON') {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
    }
  }
});

window.addEventListener('pointerdown', (event) => {
  if (window.innerWidth <= 700 && event.pointerType !== 'mouse') {
    document.body.classList.add('mobile-layout');
  }
});

window.addEventListener('resize', () => {
  document.body.classList.toggle('mobile-layout', window.innerWidth <= 700);
});

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  document.body.style.background = 'radial-gradient(circle at top, #15253f 0%, #0b1220 60%)';
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    document.body.style.background = 'radial-gradient(circle at top, #15253f 0%, #0b1220 60%)';
  }
});

window.addEventListener('resize', () => {
  resizeCanvas();
  if (window.innerWidth <= 700 && mobileControls) {
    mobileControls.style.display = 'flex';
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerleave', () => {
  resetJoystick();
});

window.addEventListener('pointerout', () => {
  if (document.pointerLockElement === null) {
    resetJoystick();
  }
});

if (typeof window !== 'undefined') {
  window.setTimeout(() => {
    resizeCanvas();
  }, 50);
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    canvas.setAttribute('aria-label', 'Urban Outlaw RPG game area');
  }
});

if (window.innerWidth <= 700) {
  canvas.setAttribute('aria-label', 'Urban Outlaw RPG game area');
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    const controls = document.querySelectorAll('.touch-button');
    controls.forEach((control) => {
      control.setAttribute('aria-label', control.dataset.control);
    });
  }
});

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  joystickBase.style.touchAction = 'none';
  document.querySelectorAll('.touch-button').forEach((button) => {
    button.style.touchAction = 'manipulation';
  });
}

if (window.innerWidth <= 700) {
  const header = document.querySelector('h1');
  if (header) header.style.fontSize = '1rem';
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    const header = document.querySelector('h1');
    if (header) header.style.fontSize = '1rem';
  }
});

const ensureMobileHud = () => {
  if (window.innerWidth <= 700) {
    document.getElementById('hud').style.padding = '10px 12px 4px';
  }
};

window.addEventListener('resize', ensureMobileHud);
window.addEventListener('load', ensureMobileHud);
ensureMobileHud();

const actionButtonsContainer = document.getElementById('actionButtons');
if (actionButtonsContainer && window.innerWidth <= 700) {
  actionButtonsContainer.style.width = 'min(230px, 46vw)';
}

window.addEventListener('resize', () => {
  if (actionButtonsContainer && window.innerWidth <= 700) {
    actionButtonsContainer.style.width = 'min(230px, 46vw)';
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    toggleInventory(false);
    toggleJobBoard(false);
    toggleFactionPanel(false);
  }
});

const doubleTapGuard = { last: 0 };
controlButtons.forEach((button) => {
  button.addEventListener('pointerdown', (event) => {
    const now = Date.now();
    if (now - doubleTapGuard.last < 180) {
      event.preventDefault();
    }
    doubleTapGuard.last = now;
  });
});

window.addEventListener('pointerdown', (event) => {
  if (window.innerWidth <= 700 && event.pointerType === 'touch' && event.target.closest('#gameCanvas')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchstart', (event) => {
  if (window.innerWidth <= 700 && event.target.closest('#gameCanvas')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (window.innerWidth <= 700 && event.target.closest('#gameCanvas')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchend', () => {
  resetJoystick();
}, { passive: true });

window.addEventListener('pointerup', () => {
  resetJoystick();
}, { passive: true });

window.addEventListener('pointercancel', () => {
  resetJoystick();
}, { passive: true });

window.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
  updateHud();
});

window.dispatchEvent(new Event('DOMContentLoaded'));

const triggerAction = (control) => handleTouchButtonPress(control);
const controlMap = {
  attack: () => triggerAction('attack'),
  interact: () => triggerAction('interact'),
  medkit: () => triggerAction('medkit'),
  job: () => triggerAction('job'),
  inventory: () => triggerAction('inventory'),
};

Object.entries(controlMap).forEach(([key, action]) => {
  const btn = document.querySelector(`[data-control="${key}"]`);
  if (btn) {
    btn.addEventListener('click', action);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    document.body.style.height = `${window.innerHeight}px`;
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && window.innerWidth <= 700) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchstart', (event) => {
  if (window.innerWidth <= 700) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (window.innerWidth <= 700) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchend', () => {
  resetJoystick();
}, { passive: true });

const safeButtonConfig = [...document.querySelectorAll('.touch-button')];
safeButtonConfig.forEach((button) => {
  button.setAttribute('role', 'button');
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'Escape') {
    keys.interactLock = false;
    resetJoystick();
  }
});

window.addEventListener('pointerup', () => {
  if (window.innerWidth <= 700) {
    resetJoystick();
  }
});

window.addEventListener('pointercancel', () => {
  if (window.innerWidth <= 700) {
    resetJoystick();
  }
});

if (window.innerWidth <= 700) {
  canvas.style.touchAction = 'none';
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    canvas.style.touchAction = 'none';
  }
});

window.addEventListener('touchmove', (event) => {
  if (event.target.closest('#mobileControls')) {
    event.preventDefault();
  }
}, { passive: false });

const cleanupPointer = () => resetJoystick();
window.addEventListener('pointerleave', cleanupPointer);
window.addEventListener('blur', cleanupPointer);
window.addEventListener('visibilitychange', () => {
  if (document.hidden) cleanupPointer();
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('load', () => {
  resizeCanvas();
  updateHud();
});

if (window.innerWidth <= 700) {
  document.querySelectorAll('.touch-button').forEach((button) => button.style.fontSize = '0.7rem');
}

resizeCanvas();
updateHud();
renderJobBoard();
renderFactionPanel();
objectiveEl.textContent = `Objective: Reach the ${zoneQuests[0].name} district.`;

requestAnimationFrame(gameLoop);

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('#mobileControls')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchstart', (event) => {
  if (event.target.closest('#mobileControls')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (event.target.closest('#mobileControls')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchend', resetJoystick, { passive: true });
window.addEventListener('pointerup', resetJoystick, { passive: true });
window.addEventListener('pointercancel', resetJoystick, { passive: true });

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && joystickBase.contains(event.target)) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchstart', (event) => {
  if (event.target.closest('.touch-button')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('resize', () => {
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
});

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  drawControls = () => {};
}

if (window.innerWidth > 700) {
  drawControls = function drawControls() {
    const panelX = Math.max(18, canvas.width - 300);
    const panelY = Math.min(canvas.height - 158, canvas.height - 150);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(panelX, panelY, 260, 120);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(panelX, panelY, 260, 120);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '15px Arial';
    ctx.fillText('Controls', panelX + 24, panelY + 26);
    ctx.font = '13px Arial';
    ctx.fillText('WASD / Arrows = move', panelX + 24, panelY + 52);
    ctx.fillText('F = strike / attack', panelX + 24, panelY + 74);
    ctx.fillText('H = medkit', panelX + 24, panelY + 96);
    ctx.fillText('E = talk/job', panelX + 24, panelY + 118);
  };
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    drawControls = () => {};
  } else {
    drawControls = function drawControls() {
      const panelX = Math.max(18, canvas.width - 300);
      const panelY = Math.min(canvas.height - 158, canvas.height - 150);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(panelX, panelY, 260, 120);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.strokeRect(panelX, panelY, 260, 120);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '15px Arial';
      ctx.fillText('Controls', panelX + 24, panelY + 26);
      ctx.font = '13px Arial';
      ctx.fillText('WASD / Arrows = move', panelX + 24, panelY + 52);
      ctx.fillText('F = strike / attack', panelX + 24, panelY + 74);
      ctx.fillText('H = medkit', panelX + 24, panelY + 96);
      ctx.fillText('E = talk/job', panelX + 24, panelY + 118);
    };
  }
});

window.dispatchEvent(new Event('resize'));

const finalControllerState = { last: 0 };
window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') {
    finalControllerState.last = Date.now();
  }
}, { passive: true });

window.dispatchEvent(new Event('load'));

if (window.innerWidth <= 700) {
  document.body.classList.add('app-mobile');
}

window.addEventListener('resize', () => {
  document.body.classList.toggle('app-mobile', window.innerWidth <= 700);
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('touchstart', () => {
  document.body.classList.add('app-mobile');
}, { passive: true });

window.addEventListener('pointerdown', () => {
  if (window.innerWidth <= 700) {
    document.body.classList.add('app-mobile');
  }
}, { passive: true });

if (window.innerWidth <= 700) {
  document.documentElement.style.setProperty('--mobile-hud-padding', '10px');
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    document.documentElement.style.setProperty('--mobile-hud-padding', '10px');
  }
});

if (window.innerWidth <= 700) {
  const hudElement = document.getElementById('hud');
  if (hudElement) {
    hudElement.style.pointerEvents = 'none';
  }
}

window.dispatchEvent(new Event('resize'));

window.addEventListener('load', () => {
  if (window.innerWidth <= 700) {
    document.body.style.userSelect = 'none';
  }
});

if (window.innerWidth <= 700) {
  document.body.style.userSelect = 'none';
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    document.body.style.userSelect = 'none';
  } else {
    document.body.style.userSelect = 'auto';
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerdown', () => {
  if (window.innerWidth <= 700) {
    document.body.style.userSelect = 'none';
  }
}, { passive: true });

window.addEventListener('pointerup', () => {
  if (window.innerWidth <= 700) {
    document.body.style.userSelect = 'none';
  }
}, { passive: true });

window.addEventListener('keydown', (event) => {
  if (window.innerWidth <= 700 && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
    event.preventDefault();
  }
});

window.addEventListener('blur', () => {
  resetJoystick();
  Object.keys(keys).forEach((key) => { keys[key] = false; });
});

window.addEventListener('pointercancel', cleanupPointer);
window.addEventListener('touchcancel', cleanupPointer);

const mobileVisible = () => window.innerWidth <= 700;
window.addEventListener('resize', () => {
  const visible = mobileVisible();
  if (mobileControls) mobileControls.style.display = visible ? 'flex' : 'none';
  drawControls = visible ? () => {} : function drawControls() {
    const panelX = Math.max(18, canvas.width - 300);
    const panelY = Math.min(canvas.height - 158, canvas.height - 150);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(panelX, panelY, 260, 120);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(panelX, panelY, 260, 120);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '15px Arial';
    ctx.fillText('Controls', panelX + 24, panelY + 26);
    ctx.font = '13px Arial';
    ctx.fillText('WASD / Arrows = move', panelX + 24, panelY + 52);
    ctx.fillText('F = strike / attack', panelX + 24, panelY + 74);
    ctx.fillText('H = medkit', panelX + 24, panelY + 96);
    ctx.fillText('E = talk/job', panelX + 24, panelY + 118);
  };
});

window.dispatchEvent(new Event('resize'));

const boundButtons = [...document.querySelectorAll('[data-control]')];
boundButtons.forEach((button) => {
  button.addEventListener('touchstart', (event) => {
    event.preventDefault();
    handleTouchButtonPress(button.dataset.control);
  }, { passive: false });
});

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('.touch-button')) {
    handleTouchButtonPress(event.target.closest('.touch-button').dataset.control);
  }
}, { passive: false });

window.addEventListener('touchstart', (event) => {
  if (event.target.closest('#joystickBase')) {
    const touch = event.touches[0];
    if (touch) setJoystickFromPointer(touch.clientX, touch.clientY);
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (event.target.closest('#joystickBase')) {
    const touch = event.touches[0];
    if (touch) setJoystickFromPointer(touch.clientX, touch.clientY);
  }
}, { passive: false });

window.addEventListener('touchend', () => resetJoystick(), { passive: true });
window.addEventListener('touchcancel', () => resetJoystick(), { passive: true });

if (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) {
  document.body.classList.add('touch-device');
}
window.addEventListener('resize', () => {
  document.body.classList.toggle('touch-device', navigator.maxTouchPoints > 0 || 'ontouchstart' in window);
});

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  const mobileControlsVisible = document.getElementById('mobileControls');
  if (mobileControlsVisible) {
    mobileControlsVisible.style.display = 'flex';
  }
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    const mobileControlsVisible = document.getElementById('mobileControls');
    if (mobileControlsVisible) {
      mobileControlsVisible.style.display = 'flex';
    }
  }
});

window.addEventListener('touchmove', (event) => {
  if (window.innerWidth <= 700 && event.target.closest('#mobileControls')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('pointerdown', (event) => {
  if (window.innerWidth <= 700 && event.target.closest('#mobileControls')) {
    event.preventDefault();
  }
}, { passive: false });

if (window.innerWidth <= 700) {
  document.querySelectorAll('.touch-button').forEach((button) => {
    button.style.marginBottom = '0';
  });
}

window.addEventListener('resize', () => {
  document.querySelectorAll('.touch-button').forEach((button) => {
    button.style.marginBottom = window.innerWidth <= 700 ? '0' : '';
  });
});

window.dispatchEvent(new Event('resize'));

const appReady = () => {
  resizeCanvas();
  updateHud();
  updateFactionRankState();
};

window.addEventListener('load', appReady);
window.addEventListener('resize', appReady);
appReady();

if (window.innerWidth <= 700) {
  const topbar = document.querySelector('.topbar');
  if (topbar) topbar.style.gap = '8px';
}

window.addEventListener('resize', () => {
  const topbar = document.querySelector('.topbar');
  if (topbar && window.innerWidth <= 700) {
    topbar.style.gap = '8px';
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('.touch-button')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchstart', (event) => {
  if (event.target.closest('#joystickBase')) {
    setJoystickFromPointer(event.touches[0].clientX, event.touches[0].clientY);
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (event.target.closest('#joystickBase')) {
    setJoystickFromPointer(event.touches[0].clientX, event.touches[0].clientY);
  }
}, { passive: false });

window.addEventListener('pointerleave', () => {
  resetJoystick();
});

window.addEventListener('orientationchange', () => {
  resizeCanvas();
  resetJoystick();
});

window.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    resizeCanvas();
  }
});

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
}

const touchInputFallback = () => {
  if (!touchInput.active) {
    touchInput.x = 0;
    touchInput.y = 0;
  }
};
setInterval(touchInputFallback, 80);

window.addEventListener('touchend', () => {
  touchInput.x = 0;
  touchInput.y = 0;
}, { passive: true });

window.addEventListener('pointerup', () => {
  touchInput.x = 0;
  touchInput.y = 0;
}, { passive: true });

window.addEventListener('keyup', (event) => {
  if (event.key.toLowerCase() === 'e') {
    keys.e = false;
  }
});

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && window.innerWidth <= 700) {
    canvas.focus();
  }
}, { passive: true });

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'e') {
    keys['e'] = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key.toLowerCase() === 'e') {
    keys['e'] = false;
    keys.interactLock = false;
  }
});

window.dispatchEvent(new Event('resize'));

const finalMobileUi = document.getElementById('mobileControls');
if (finalMobileUi) {
  finalMobileUi.style.display = window.innerWidth <= 700 ? 'flex' : 'none';
}

window.addEventListener('resize', () => {
  if (finalMobileUi) {
    finalMobileUi.style.display = window.innerWidth <= 700 ? 'flex' : 'none';
  }
});

window.dispatchEvent(new Event('resize'));

requestAnimationFrame(gameLoop);

window.addEventListener('load', () => {
  requestAnimationFrame(gameLoop);
});

window.addEventListener('beforeunload', () => {
  resetJoystick();
});

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('#joystickBase')) {
    joystickState.active = true;
    joystickState.pointerId = event.pointerId;
    setJoystickFromPointer(event.clientX, event.clientY);
  }
}, { passive: false });

window.addEventListener('pointermove', (event) => {
  if (joystickState.active && event.pointerId === joystickState.pointerId) {
    setJoystickFromPointer(event.clientX, event.clientY);
  }
}, { passive: false });

window.addEventListener('pointerup', () => {
  resetJoystick();
}, { passive: true });

window.addEventListener('pointercancel', () => {
  resetJoystick();
}, { passive: true });

const finalizeJoysticks = () => {
  if (joystickBase) {
    joystickBase.style.touchAction = 'none';
  }
};

window.addEventListener('load', finalizeJoysticks);
window.addEventListener('resize', finalizeJoysticks);
finalizeJoysticks();

if (window.innerWidth <= 700) {
  window.addEventListener('touchmove', (event) => {
    if (!event.target.closest('#joystickBase')) {
      return;
    }
    event.preventDefault();
  }, { passive: false });
}

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('.touch-button')) {
    event.preventDefault();
    handleTouchButtonPress(event.target.closest('.touch-button').dataset.control);
  }
}, { passive: false });

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  document.body.style.overflow = 'hidden';
}

const userButtonPress = [...document.querySelectorAll('.touch-button')];
userButtonPress.forEach((button) => {
  button.addEventListener('mousedown', (event) => event.preventDefault());
});

window.dispatchEvent(new Event('resize'));

const finalTouchSetup = () => {
  if (window.innerWidth <= 700) {
    const controls = document.getElementById('mobileControls');
    if (controls) controls.style.display = 'flex';
  }
};
window.addEventListener('resize', finalTouchSetup);
window.addEventListener('load', finalTouchSetup);
finalTouchSetup();

window.dispatchEvent(new Event('resize'));

const hideCanvasControlsOnMobile = () => {
  if (window.innerWidth <= 700) {
    drawControls = () => {};
  } else {
    drawControls = function drawControls() {
      const panelX = Math.max(18, canvas.width - 300);
      const panelY = Math.min(canvas.height - 158, canvas.height - 150);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.fillRect(panelX, panelY, 260, 120);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.strokeRect(panelX, panelY, 260, 120);
      ctx.fillStyle = '#f8fafc';
      ctx.font = '15px Arial';
      ctx.fillText('Controls', panelX + 24, panelY + 26);
      ctx.font = '13px Arial';
      ctx.fillText('WASD / Arrows = move', panelX + 24, panelY + 52);
      ctx.fillText('F = strike / attack', panelX + 24, panelY + 74);
      ctx.fillText('H = medkit', panelX + 24, panelY + 96);
      ctx.fillText('E = talk/job', panelX + 24, panelY + 118);
    };
  }
};

window.addEventListener('resize', hideCanvasControlsOnMobile);
window.addEventListener('load', hideCanvasControlsOnMobile);
hideCanvasControlsOnMobile();

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  drawControls = () => {};
}

window.dispatchEvent(new Event('resize'));

if (typeof module !== 'undefined') {
  module.exports = {};
}

window.dispatchEvent(new Event('resize'));

window.addEventListener('load', () => {
  resizeCanvas();
  drawControls = window.innerWidth <= 700 ? () => {} : function drawControls() {
    const panelX = Math.max(18, canvas.width - 300);
    const panelY = Math.min(canvas.height - 158, canvas.height - 150);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(panelX, panelY, 260, 120);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.strokeRect(panelX, panelY, 260, 120);
    ctx.fillStyle = '#f8fafc';
    ctx.font = '15px Arial';
    ctx.fillText('Controls', panelX + 24, panelY + 26);
    ctx.font = '13px Arial';
    ctx.fillText('WASD / Arrows = move', panelX + 24, panelY + 52);
    ctx.fillText('F = strike / attack', panelX + 24, panelY + 74);
    ctx.fillText('H = medkit', panelX + 24, panelY + 96);
    ctx.fillText('E = talk/job', panelX + 24, panelY + 118);
  };
  drawControls();
});

window.addEventListener('resize', () => {
  resizeCanvas();
  if (window.innerWidth <= 700) {
    drawControls = () => {};
  }
});

const userReadyState = () => {
  resizeCanvas();
  updateHud();
  renderJobBoard();
  renderFactionPanel();
};

window.addEventListener('load', userReadyState);
window.addEventListener('resize', userReadyState);
userReadyState();

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  const insetWrapper = document.getElementById('mobileControls');
  if (insetWrapper) {
    insetWrapper.style.bottom = '12px';
  }
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    const insetWrapper = document.getElementById('mobileControls');
    if (insetWrapper) {
      insetWrapper.style.bottom = '12px';
    }
  }
});

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  document.querySelectorAll('.touch-button').forEach((button) => {
    button.style.pointerEvents = 'auto';
  });
}

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  const flow = document.getElementById('mobileControls');
  if (flow) flow.style.pointerEvents = 'none';
}

window.dispatchEvent(new Event('resize'));

const registerButton = (button) => {
  if (!button) return;
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    button.classList.add('pressed');
    handleTouchButtonPress(button.dataset.control);
  });
  button.addEventListener('pointerup', () => button.classList.remove('pressed'));
  button.addEventListener('pointerleave', () => button.classList.remove('pressed'));
  button.addEventListener('pointercancel', () => button.classList.remove('pressed'));
};

controlButtons.forEach(registerButton);

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    const fixedPanel = document.getElementById('mobileControls');
    if (fixedPanel) {
      fixedPanel.style.display = 'flex';
      fixedPanel.style.pointerEvents = 'auto';
    }
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('touchstart', (event) => {
  if (event.target.closest('.touch-button')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (event.target.closest('.touch-button') || event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

const mobileReadyState = () => {
  if (window.innerWidth <= 700) {
    const fixedPanel = document.getElementById('mobileControls');
    if (fixedPanel) fixedPanel.style.display = 'flex';
  }
};

window.addEventListener('load', mobileReadyState);
window.addEventListener('resize', mobileReadyState);
mobileReadyState();

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('#mobileControls')) {
    event.preventDefault();
  }
}, { passive: false });

window.dispatchEvent(new Event('resize'));

const extraHold = { active: false };
window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('#joystickBase')) {
    extraHold.active = true;
  }
}, { passive: true });
window.addEventListener('pointerup', () => {
  extraHold.active = false;
  resetJoystick();
}, { passive: true });

window.dispatchEvent(new Event('resize'));

window.addEventListener('touchstart', (event) => {
  if (event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchend', () => {
  resetJoystick();
}, { passive: true });

window.dispatchEvent(new Event('resize'));

const finalButtonHandlers = [...document.querySelectorAll('.touch-button')];
finalButtonHandlers.forEach((button) => {
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    handleTouchButtonPress(button.dataset.control);
  });
  button.addEventListener('touchstart', (event) => {
    event.preventDefault();
    handleTouchButtonPress(button.dataset.control);
  }, { passive: false });
});

window.addEventListener('resize', () => {
  joystickBase.style.width = window.innerWidth <= 700 ? '126px' : '128px';
  joystickBase.style.height = window.innerWidth <= 700 ? '126px' : '128px';
});

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  joystickBase.style.width = '110px';
  joystickBase.style.height = '110px';
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    joystickBase.style.width = '110px';
    joystickBase.style.height = '110px';
  } else {
    joystickBase.style.width = '128px';
    joystickBase.style.height = '128px';
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerdown', (event) => {
  if (window.innerWidth <= 700 && event.pointerType === 'touch' && event.target.closest('.touch-button')) {
    event.preventDefault();
  }
}, { passive: false });

const defaultDrawControlsFn = function drawControls() {
  const panelX = Math.max(18, canvas.width - 300);
  const panelY = Math.min(canvas.height - 158, canvas.height - 150);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(panelX, panelY, 260, 120);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.strokeRect(panelX, panelY, 260, 120);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '15px Arial';
  ctx.fillText('Controls', panelX + 24, panelY + 26);
  ctx.font = '13px Arial';
  ctx.fillText('WASD / Arrows = move', panelX + 24, panelY + 52);
  ctx.fillText('F = strike / attack', panelX + 24, panelY + 74);
  ctx.fillText('H = medkit', panelX + 24, panelY + 96);
  ctx.fillText('E = talk/job', panelX + 24, panelY + 118);
};

if (window.innerWidth <= 700) {
  drawControls = () => {};
} else {
  drawControls = defaultDrawControlsFn;
}

window.addEventListener('resize', () => {
  drawControls = window.innerWidth <= 700 ? () => {} : defaultDrawControlsFn;
});

window.dispatchEvent(new Event('resize'));

const currentControls = document.getElementById('mobileControls');
if (currentControls) {
  currentControls.style.display = window.innerWidth <= 700 ? 'flex' : 'none';
}

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  document.body.style.background = '#0b1220';
}

window.dispatchEvent(new Event('resize'));

const weirdCheck = () => {
  if (window.innerWidth <= 700) {
    return;
  }
};
weirdCheck();

const finalDestroy = () => {
  resetJoystick();
};
window.addEventListener('beforeunload', finalDestroy);

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  const layout = document.getElementById('mobileControls');
  if (layout) {
    layout.style.display = 'flex';
  }
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    const layout = document.getElementById('mobileControls');
    if (layout) {
      layout.style.display = 'flex';
    }
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerup', () => {
  touchInput.x = 0;
  touchInput.y = 0;
}, { passive: true });

window.addEventListener('pointercancel', () => {
  touchInput.x = 0;
  touchInput.y = 0;
}, { passive: true });

window.dispatchEvent(new Event('resize'));

const base = document.getElementById('joystickBase');
if (base) {
  base.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    setJoystickFromPointer(event.clientX, event.clientY);
    joystickState.active = true;
    joystickState.pointerId = event.pointerId;
  }, { passive: false });
}

window.dispatchEvent(new Event('resize'));

const setAction = (control) => handleTouchButtonPress(control);
const touchActionButtons = document.querySelectorAll('[data-control]');
touchActionButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    setAction(button.dataset.control);
  });
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('touchstart', (event) => {
  if (event.target.closest('#joystickBase')) {
    event.preventDefault();
    joystickState.active = true;
    const touch = event.touches[0];
    if (touch) setJoystickFromPointer(touch.clientX, touch.clientY);
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (joystickState.active && event.target.closest('#joystickBase')) {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) setJoystickFromPointer(touch.clientX, touch.clientY);
  }
}, { passive: false });

window.dispatchEvent(new Event('resize'));

const finalCleanup = () => {
  resetJoystick();
  touchInput.x = 0;
  touchInput.y = 0;
};

window.addEventListener('blur', finalCleanup);
window.addEventListener('visibilitychange', () => {
  if (document.hidden) finalCleanup();
});

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  const hud = document.getElementById('hud');
  if (hud) hud.style.padding = '8px 12px 4px';
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    const hud = document.getElementById('hud');
    if (hud) hud.style.padding = '8px 12px 4px';
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('#gameCanvas')) {
    event.preventDefault();
  }
}, { passive: false });

window.dispatchEvent(new Event('resize'));

const resetIfNoTouch = () => {
  if (window.innerWidth > 700) {
    resetJoystick();
  }
};
window.addEventListener('resize', resetIfNoTouch);

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('#mobileControls')) {
    event.preventDefault();
  }
}, { passive: false });

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  drawControls = () => {};
}

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  document.body.style.position = 'relative';
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    document.body.style.position = 'relative';
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('load', () => {
  if (window.innerWidth <= 700) {
    const controlPanel = document.getElementById('mobileControls');
    if (controlPanel) controlPanel.style.display = 'flex';
  }
});

window.dispatchEvent(new Event('resize'));

const finalUiSetup = () => {
  const mobileControlsVisible = document.getElementById('mobileControls');
  if (mobileControlsVisible) {
    mobileControlsVisible.style.display = window.innerWidth <= 700 ? 'flex' : 'none';
  }
};
window.addEventListener('resize', finalUiSetup);
window.addEventListener('load', finalUiSetup);
finalUiSetup();

window.dispatchEvent(new Event('resize'));

window.addEventListener('touchstart', (event) => {
  if (window.innerWidth <= 700 && event.target.closest('#mobileControls')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (window.innerWidth <= 700 && event.target.closest('#mobileControls')) {
    event.preventDefault();
  }
}, { passive: false });

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  canvas.setAttribute('aria-label', 'Game viewport');
}

window.dispatchEvent(new Event('resize'));

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    canvas.setAttribute('aria-label', 'Game viewport');
  }
});

window.dispatchEvent(new Event('resize'));

requestAnimationFrame(gameLoop);

window.dispatchEvent(new Event('resize'));

resizeCanvas();
updateHud();
renderJobBoard();
renderFactionPanel();
objectiveEl.textContent = `Objective: Reach the ${zoneQuests[0].name} district.`;

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('.touch-button')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

window.dispatchEvent(new Event('resize'));

window.addEventListener('touchstart', (event) => {
  if (event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

window.dispatchEvent(new Event('resize'));

const finalPointerGuard = () => {
  touchInput.x = 0;
  touchInput.y = 0;
};
window.addEventListener('pointerup', finalPointerGuard, { passive: true });
window.addEventListener('pointercancel', finalPointerGuard, { passive: true });

window.dispatchEvent(new Event('resize'));

window.addEventListener('load', () => {
  resizeCanvas();
  updateHud();
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('load', () => {
  if (window.innerWidth <= 700) {
    document.querySelectorAll('.touch-button').forEach((button) => {
      button.style.width = '100%';
    });
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('load', () => {
  const root = document.getElementById('mobileControls');
  if (root && window.innerWidth <= 700) {
    root.style.display = 'flex';
  }
});

window.dispatchEvent(new Event('resize'));

requestAnimationFrame(gameLoop);

window.addEventListener('load', () => {
  resizeCanvas();
  requestAnimationFrame(gameLoop);
});

window.addEventListener('orientationchange', () => {
  resizeCanvas();
  resetJoystick();
});

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  drawControls = () => {};
}

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  const mobileRoot = document.getElementById('mobileControls');
  if (mobileRoot) {
    mobileRoot.style.pointerEvents = 'auto';
  }
}

window.addEventListener('resize', () => {
  const mobileRoot = document.getElementById('mobileControls');
  if (mobileRoot && window.innerWidth <= 700) {
    mobileRoot.style.pointerEvents = 'auto';
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('load', () => {
  if (window.innerWidth <= 700) {
    drawControls = () => {};
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && event.target.closest('.touch-button')) {
    event.preventDefault();
  }
}, { passive: false });

window.dispatchEvent(new Event('resize'));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') event.preventDefault();
});

window.dispatchEvent(new Event('resize'));

const finalGameInit = () => {
  resizeCanvas();
  updateHud();
  renderJobBoard();
  renderFactionPanel();
};
window.addEventListener('load', finalGameInit);
window.addEventListener('resize', finalGameInit);
finalGameInit();

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  document.body.style.overflow = 'hidden';
}

window.dispatchEvent(new Event('resize'));

window.addEventListener('click', (event) => {
  if (event.target.closest('.touch-button')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchstart', (event) => {
  if (event.target.closest('.touch-button')) {
    event.preventDefault();
  }
}, { passive: false });

window.dispatchEvent(new Event('resize'));

window.addEventListener('contextmenu', (event) => {
  if (event.target.closest('.touch-button') || event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    drawControls = () => {};
  } else {
    drawControls = defaultDrawControlsFn;
  }
});

window.dispatchEvent(new Event('resize'));

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  document.body.style.background = '#0b1220';
}

window.dispatchEvent(new Event('resize'));

const ensureUnique = () => {
  if (window.innerWidth <= 700) {
    const menu = document.getElementById('mobileControls');
    if (menu) {
      menu.style.display = 'flex';
      menu.style.zIndex = '30';
    }
  }
};
window.addEventListener('resize', ensureUnique);
window.addEventListener('load', ensureUnique);
ensureUnique();

window.dispatchEvent(new Event('resize'));

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    const menu = document.getElementById('mobileControls');
    if (menu) {
      menu.style.display = 'flex';
    }
  }
});

window.dispatchEvent(new Event('resize'));

const minifyHud = () => {
  if (window.innerWidth <= 700) {
    const stats = document.querySelectorAll('.stats div');
    stats.forEach((stat) => {
      stat.style.minWidth = '72px';
      stat.style.padding = '6px 10px';
    });
  }
};
window.addEventListener('resize', minifyHud);
window.addEventListener('load', minifyHud);
minifyHud();

window.dispatchEvent(new Event('resize'));

const lastStep = () => {
  if (window.innerWidth <= 700) {
    drawControls = () => {};
  }
};
window.addEventListener('resize', lastStep);
lastStep();

window.dispatchEvent(new Event('resize'));

renderJobBoard();
renderFactionPanel();

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  document.body.style.touchAction = 'none';
  document.body.style.overscrollBehavior = 'none';
}

window.addEventListener('resize', () => {
  if (window.innerWidth <= 700) {
    document.body.style.touchAction = 'none';
    document.body.style.overscrollBehavior = 'none';
  }
});

projectReady();

function projectReady() {
  resizeCanvas();
  renderJobBoard();
  renderFactionPanel();
  updateHud();
}

window.dispatchEvent(new Event('resize'));

const applyMobileUI = () => {
  if (window.innerWidth <= 700) {
    const controls = document.getElementById('mobileControls');
    if (controls) controls.style.display = 'flex';
    drawControls = () => {};
  } else {
    const controls = document.getElementById('mobileControls');
    if (controls) controls.style.display = 'none';
    drawControls = defaultDrawControlsFn;
  }
};
window.addEventListener('resize', applyMobileUI);
window.addEventListener('load', applyMobileUI);
applyMobileUI();

window.dispatchEvent(new Event('resize'));

if (typeof window !== 'undefined') {
  window.requestAnimationFrame(gameLoop);
}

if (window.innerWidth <= 700) {
  const mobileMenu = document.getElementById('mobileControls');
  if (mobileMenu) {
    mobileMenu.style.display = 'flex';
  }
}

window.dispatchEvent(new Event('resize'));

window.addEventListener('touchstart', (event) => {
  if (event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

window.dispatchEvent(new Event('resize'));

const final = () => {
  resizeCanvas();
  updateHud();
  renderJobBoard();
  renderFactionPanel();
};
window.addEventListener('load', final);
window.addEventListener('resize', final);
final();

window.dispatchEvent(new Event('resize'));

window.requestAnimationFrame(gameLoop);

if (window.innerWidth <= 700) {
  const mobileMenu = document.getElementById('mobileControls');
  if (mobileMenu) mobileMenu.style.display = 'flex';
}

window.addEventListener('resize', () => {
  const mobileMenu = document.getElementById('mobileControls');
  if (mobileMenu) mobileMenu.style.display = window.innerWidth <= 700 ? 'flex' : 'none';
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('touchstart', (event) => {
  if (event.target.closest('.touch-button') || event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  if (event.target.closest('.touch-button') || event.target.closest('#joystickBase')) {
    event.preventDefault();
  }
}, { passive: false });

window.dispatchEvent(new Event('resize'));

if (window.innerWidth <= 700) {
  const mobileMenu = document.getElementById('mobileControls');
  if (mobileMenu) mobileMenu.style.display = 'flex';
}

window.dispatchEvent(new Event('resize'));

window.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') {
    event.preventDefault();
  }
}, { passive: false });

if (window.innerWidth <= 700) {
  const controls = document.getElementById('mobileControls');
  if (controls) {
    controls.style.display = 'flex';
    controls.style.pointerEvents = 'auto';
  }
}

window.addEventListener('resize', () => {
  const controls = document.getElementById('mobileControls');
  if (controls) {
    controls.style.display = window.innerWidth <= 700 ? 'flex' : 'none';
    controls.style.pointerEvents = 'auto';
  }
});

window.dispatchEvent(new Event('resize'));

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
  }
});
