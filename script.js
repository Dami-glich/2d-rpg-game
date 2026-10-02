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
    { id: 'black_vipers_prospect', rankIndex: 0, rankName: 'Prospect', title: 'Street Hand-Off', description: 'Move contraband through the East Faction strip and make the first drop clean.', payment: 120, repReward: 12, requiredFactionRep: 0, unlockText: 'Requires 0 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'black_vipers_street_runner', rankIndex: 1, rankName: 'Street Runner', title: 'Courier Sweep', description: 'Run the alley routes and keep the crew supplied before dawn.', payment: 180, repReward: 18, requiredFactionRep: 50, unlockText: 'Requires 50 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'black_vipers_enforcer', rankIndex: 2, rankName: 'Enforcer', title: 'Boardwalk Check', description: 'Clear a rival crew from the river approach and collect the cut.', payment: 260, repReward: 25, requiredFactionRep: 120, unlockText: 'Requires 120 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'black_vipers_driver', rankIndex: 3, rankName: 'Driver', title: 'Midnight Chase', description: 'Transport a timed cargo load through the city roads and lose the tails.', payment: 330, repReward: 30, requiredFactionRep: 200, unlockText: 'Requires 200 faction rep', targetZone: { x: 900, y: 100, w: 1000, h: 550 } },
    { id: 'black_vipers_dealer', rankIndex: 4, rankName: 'Dealer', title: 'Market Takeover', description: 'Secure a distribution point and settle the local street market.', payment: 400, repReward: 36, requiredFactionRep: 300, unlockText: 'Requires 300 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'black_vipers_specialist', rankIndex: 5, rankName: 'Specialist', title: 'Signal Jam', description: 'Hack and disrupt a rival surveillance effort in the East Faction block.', payment: 510, repReward: 42, requiredFactionRep: 450, unlockText: 'Requires 450 faction rep', targetZone: { x: 1160, y: 200, w: 780, h: 300 } },
    { id: 'black_vipers_crew_leader', rankIndex: 6, rankName: 'Crew Leader', title: 'Warehouse Strike', description: 'Command the crew through a protection job and secure the warehouse haul.', payment: 620, repReward: 50, requiredFactionRep: 650, unlockText: 'Requires 650 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'black_vipers_senior_enforcer', rankIndex: 7, rankName: 'Senior Enforcer', title: 'Two-Block Sweep', description: 'Crush resistance in two active sectors and leave a warning behind.', payment: 760, repReward: 58, requiredFactionRep: 900, unlockText: 'Requires 900 faction rep', targetZone: { x: 80, y: 1120, w: 820, h: 380 } },
    { id: 'black_vipers_underboss', rankIndex: 8, rankName: 'Underboss', title: 'Power Play', description: 'Take control of a rival route and collect the supplier debt.', payment: 900, repReward: 70, requiredFactionRep: 1200, unlockText: 'Requires 1200 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'black_vipers_boss', rankIndex: 9, rankName: 'Boss', title: 'Citywide Dominance', description: 'Launch the final citywide push and lock the Viper empire in place.', payment: 1150, repReward: 90, requiredFactionRep: 1600, unlockText: 'Requires 1600 faction rep', targetZone: { x: 80, y: 1120, w: 820, h: 380 } },
  ],
  'Iron Wolves': [
    { id: 'iron_wolves_prospect', rankIndex: 0, rankName: 'Prospect', title: 'Backstreet Relay', description: 'Escort a small shipment from the river edge to the safe zone.', payment: 130, repReward: 12, requiredFactionRep: 0, unlockText: 'Requires 0 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'iron_wolves_street_runner', rankIndex: 1, rankName: 'Street Runner', title: 'Fence Run', description: 'Run a swift route to the market and secure the valuables before intercept.', payment: 190, repReward: 18, requiredFactionRep: 50, unlockText: 'Requires 50 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'iron_wolves_enforcer', rankIndex: 2, rankName: 'Enforcer', title: 'Riot Control', description: 'Break up a rival push along the riverfront and recover the payment.', payment: 270, repReward: 25, requiredFactionRep: 120, unlockText: 'Requires 120 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'iron_wolves_driver', rankIndex: 3, rankName: 'Driver', title: 'Night Route', description: 'Deliver the load through every crossroad and keep it from being flagged.', payment: 340, repReward: 31, requiredFactionRep: 200, unlockText: 'Requires 200 faction rep', targetZone: { x: 900, y: 100, w: 1000, h: 550 } },
    { id: 'iron_wolves_dealer', rankIndex: 4, rankName: 'Dealer', title: 'Warehouse Exchange', description: 'Lock down a stock transfer and secure the payout from the dealer circle.', payment: 410, repReward: 37, requiredFactionRep: 300, unlockText: 'Requires 300 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'iron_wolves_specialist', rankIndex: 5, rankName: 'Specialist', title: 'Signal Breach', description: 'Plant false signals and jam the rival grid in the East Faction sectors.', payment: 520, repReward: 44, requiredFactionRep: 450, unlockText: 'Requires 450 faction rep', targetZone: { x: 1160, y: 200, w: 780, h: 300 } },
    { id: 'iron_wolves_crew_leader', rankIndex: 6, rankName: 'Crew Leader', title: 'Frontline Hold', description: 'Command a raid and hold the route until the crew clears the stock.', payment: 630, repReward: 52, requiredFactionRep: 650, unlockText: 'Requires 650 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'iron_wolves_senior_enforcer', rankIndex: 7, rankName: 'Senior Enforcer', title: 'Southside Pressure', description: 'Push through the South Gang edge and keep the rival block collapsed.', payment: 780, repReward: 60, requiredFactionRep: 900, unlockText: 'Requires 900 faction rep', targetZone: { x: 80, y: 1120, w: 820, h: 380 } },
    { id: 'iron_wolves_underboss', rankIndex: 8, rankName: 'Underboss', title: 'Route Lock', description: 'Take over high-value transit and route each drop to the iron chain.', payment: 930, repReward: 72, requiredFactionRep: 1200, unlockText: 'Requires 1200 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'iron_wolves_boss', rankIndex: 9, rankName: 'Boss', title: 'Final Dominion', description: 'Finish the citywide takeover and seal the Wolf coalition under one brand.', payment: 1180, repReward: 92, requiredFactionRep: 1600, unlockText: 'Requires 1600 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
  ],
  'Crown Syndicate': [
    { id: 'crown_syndicate_associate', rankIndex: 0, rankName: 'Associate', title: 'Purse Run', description: 'Handle a quiet transfer through the river corridor and keep the ledger clean.', payment: 150, repReward: 12, requiredFactionRep: 0, unlockText: 'Requires 0 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'crown_syndicate_courier', rankIndex: 1, rankName: 'Courier', title: 'Glass Route', description: 'Deliver a priority package between syndicate fronts before sunset.', payment: 210, repReward: 18, requiredFactionRep: 50, unlockText: 'Requires 50 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'crown_syndicate_enforcer', rankIndex: 2, rankName: 'Enforcer', title: 'Harbor Pressure', description: 'Hold the harbor route against rival pressure and collect the recovered fees.', payment: 290, repReward: 26, requiredFactionRep: 120, unlockText: 'Requires 120 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'crown_syndicate_driver', rankIndex: 3, rankName: 'Driver', title: 'Gold Runner', description: 'Move the cash convoy through mixed routes without losing the escort.', payment: 350, repReward: 32, requiredFactionRep: 200, unlockText: 'Requires 200 faction rep', targetZone: { x: 900, y: 100, w: 1000, h: 550 } },
    { id: 'crown_syndicate_specialist', rankIndex: 4, rankName: 'Specialist', title: 'Quiet Entry', description: 'Slip in with a false manifest and secure the premium stash before dawn.', payment: 430, repReward: 38, requiredFactionRep: 300, unlockText: 'Requires 300 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'crown_syndicate_security_officer', rankIndex: 5, rankName: 'Security Officer', title: 'Vault Watch', description: 'Guard a high-value vault and stop the extraction attempt at the doors.', payment: 540, repReward: 45, requiredFactionRep: 450, unlockText: 'Requires 450 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'crown_syndicate_crew_leader', rankIndex: 6, rankName: 'Crew Leader', title: 'Prize Lift', description: 'Turn the collection team into a successful extraction and secure all payments.', payment: 660, repReward: 54, requiredFactionRep: 650, unlockText: 'Requires 650 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'crown_syndicate_captain', rankIndex: 7, rankName: 'Captain', title: 'Crown Sweep', description: 'Sweep the city block, clear the suspects, and dominate the syndicate lane.', payment: 800, repReward: 62, requiredFactionRep: 900, unlockText: 'Requires 900 faction rep', targetZone: { x: 80, y: 1120, w: 820, h: 380 } },
    { id: 'crown_syndicate_underboss', rankIndex: 8, rankName: 'Underboss', title: 'Golden Contract', description: 'Seal a major contract and force the remaining fronts to comply.', payment: 960, repReward: 74, requiredFactionRep: 1200, unlockText: 'Requires 1200 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'crown_syndicate_boss', rankIndex: 9, rankName: 'Boss', title: 'Empire Crown', description: 'Claim the city’s largest network and set the new Syndicate order in motion.', payment: 1200, repReward: 95, requiredFactionRep: 1600, unlockText: 'Requires 1600 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
  ],
  'Metro Police Department': [
    { id: 'mpd_recruit', rankIndex: 0, rankName: 'Police Recruit', title: 'Beat Patrol', description: 'Complete a pattern patrol near city hall and confirm local safety checks.', payment: 140, repReward: 12, requiredFactionRep: 0, unlockText: 'Requires 0 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_police_officer', rankIndex: 1, rankName: 'Police Officer', title: 'Hot Spot Scan', description: 'Respond to suspicious activity near the central district and file a clean review.', payment: 200, repReward: 19, requiredFactionRep: 50, unlockText: 'Requires 50 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_senior_officer', rankIndex: 2, rankName: 'Senior Officer', title: 'Evidence Run', description: 'Gather key evidence and secure the route during a rapid response.', payment: 280, repReward: 26, requiredFactionRep: 120, unlockText: 'Requires 120 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_patrol_officer', rankIndex: 3, rankName: 'Patrol Officer', title: 'District Sweep', description: 'Cover the city blocks and keep the route stable for the department watch.', payment: 360, repReward: 33, requiredFactionRep: 200, unlockText: 'Requires 200 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_traffic_officer', rankIndex: 4, rankName: 'Traffic Officer', title: 'Street Control', description: 'Regulate key intersections and keep movement safe during the evening rush.', payment: 440, repReward: 40, requiredFactionRep: 300, unlockText: 'Requires 300 faction rep', targetZone: { x: 500, y: 0, w: 120, h: 1600 } },
    { id: 'mpd_detective', rankIndex: 5, rankName: 'Detective', title: 'Case File Search', description: 'Trace the suspect pattern and collect intel before the next raid.', payment: 560, repReward: 48, requiredFactionRep: 450, unlockText: 'Requires 450 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_corporal', rankIndex: 6, rankName: 'Corporal', title: 'Night Detail', description: 'Lead a squad through a sustained check of the admin district routes.', payment: 680, repReward: 56, requiredFactionRep: 650, unlockText: 'Requires 650 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_sergeant', rankIndex: 7, rankName: 'Sergeant', title: 'Unit Response', description: 'Coordinate a high-pressure response against organized activity in the city core.', payment: 820, repReward: 64, requiredFactionRep: 900, unlockText: 'Requires 900 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'mpd_lieutenant', rankIndex: 8, rankName: 'Lieutenant', title: 'Operations Sweep', description: 'Run an organized enforcement action and secure the department’s district control.', payment: 980, repReward: 76, requiredFactionRep: 1200, unlockText: 'Requires 1200 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'mpd_captain', rankIndex: 9, rankName: 'Captain', title: 'City Lockdown', description: 'Lead the final citywide response and stabilize the capital district.', payment: 1220, repReward: 97, requiredFactionRep: 1600, unlockText: 'Requires 1600 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
  ],
  'City Highway Patrol': [
    { id: 'chp_cadet', rankIndex: 0, rankName: 'Cadet', title: 'Highway Check', description: 'Inspect road access and verify patrol markers along the east corridor.', payment: 135, repReward: 12, requiredFactionRep: 0, unlockText: 'Requires 0 faction rep', targetZone: { x: 500, y: 0, w: 120, h: 1600 } },
    { id: 'chp_patrol_officer', rankIndex: 1, rankName: 'Patrol Officer', title: 'Access Patrol', description: 'Monitor road traffic and flag any suspicious vehicle stops.', payment: 205, repReward: 19, requiredFactionRep: 50, unlockText: 'Requires 50 faction rep', targetZone: { x: 500, y: 0, w: 120, h: 1600 } },
    { id: 'chp_traffic_officer', rankIndex: 2, rankName: 'Traffic Officer', title: 'Lane Control', description: 'Secure the key interchange and coordinate safe movement through the route.', payment: 285, repReward: 27, requiredFactionRep: 120, unlockText: 'Requires 120 faction rep', targetZone: { x: 1100, y: 0, w: 120, h: 1600 } },
    { id: 'chp_highway_officer', rankIndex: 3, rankName: 'Highway Officer', title: 'Roadside Escort', description: 'Escort a security convoy and clear each road section to a safe checkpoint.', payment: 365, repReward: 34, requiredFactionRep: 200, unlockText: 'Requires 200 faction rep', targetZone: { x: 900, y: 100, w: 1000, h: 550 } },
    { id: 'chp_senior_patrol_officer', rankIndex: 4, rankName: 'Senior Patrol Officer', title: 'Interchange Watch', description: 'Establish a direct road watch and keep the crossroads open for emergency traffic.', payment: 450, repReward: 41, requiredFactionRep: 300, unlockText: 'Requires 300 faction rep', targetZone: { x: 500, y: 0, w: 120, h: 1600 } },
    { id: 'chp_motorcycle_officer', rankIndex: 5, rankName: 'Motorcycle Officer', title: 'Rapid Response', description: 'Cover a fast-moving pursuit and maintain road control during the chase.', payment: 570, repReward: 49, requiredFactionRep: 450, unlockText: 'Requires 450 faction rep', targetZone: { x: 1100, y: 0, w: 120, h: 1600 } },
    { id: 'chp_corporal', rankIndex: 6, rankName: 'Corporal', title: 'Blocker Detail', description: 'Lead the roadblock team and keep illegal traffic from passing the perimeter.', payment: 690, repReward: 57, requiredFactionRep: 650, unlockText: 'Requires 650 faction rep', targetZone: { x: 500, y: 0, w: 120, h: 1600 } },
    { id: 'chp_sergeant', rankIndex: 7, rankName: 'Sergeant', title: 'Highway Raid', description: 'Coordinate the highway assault on a blocked route and secure the corridor.', payment: 835, repReward: 66, requiredFactionRep: 900, unlockText: 'Requires 900 faction rep', targetZone: { x: 1100, y: 0, w: 120, h: 1600 } },
    { id: 'chp_lieutenant', rankIndex: 8, rankName: 'Lieutenant', title: 'Transport Shield', description: 'Secure the transport lanes and keep the highway network protected during the night cycle.', payment: 995, repReward: 78, requiredFactionRep: 1200, unlockText: 'Requires 1200 faction rep', targetZone: { x: 900, y: 100, w: 1000, h: 550 } },
    { id: 'chp_captain', rankIndex: 9, rankName: 'Captain', title: 'Regional Defense', description: 'Direct the final road defense plan and lock down the city’s access routes.', payment: 1240, repReward: 98, requiredFactionRep: 1600, unlockText: 'Requires 1600 faction rep', targetZone: { x: 500, y: 0, w: 120, h: 1600 } },
  ],
  'National Defense Force': [
    { id: 'ndf_recruit', rankIndex: 0, rankName: 'Recruit', title: 'Perimeter Walk', description: 'Inspect the outer edge and confirm the defense line is active and stable.', payment: 155, repReward: 12, requiredFactionRep: 0, unlockText: 'Requires 0 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'ndf_private', rankIndex: 1, rankName: 'Private', title: 'Field Sweep', description: 'Scan the river block and verify no unauthorized movement crosses the defense line.', payment: 215, repReward: 20, requiredFactionRep: 50, unlockText: 'Requires 50 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'ndf_private_first_class', rankIndex: 2, rankName: 'Private First Class', title: 'Signal Watch', description: 'Hold an observation point and relay critical intel across the east pass.', payment: 295, repReward: 27, requiredFactionRep: 120, unlockText: 'Requires 120 faction rep', targetZone: { x: 1160, y: 200, w: 780, h: 300 } },
    { id: 'ndf_specialist', rankIndex: 3, rankName: 'Specialist', title: 'Battery Relay', description: 'Maintain the power relay route and secure all equipment needed for the patrol line.', payment: 380, repReward: 35, requiredFactionRep: 200, unlockText: 'Requires 200 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'ndf_corporal', rankIndex: 4, rankName: 'Corporal', title: 'Line Breach', description: 'Repel staged incursions and hold the main defense path under the command structure.', payment: 470, repReward: 42, requiredFactionRep: 300, unlockText: 'Requires 300 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'ndf_sergeant', rankIndex: 5, rankName: 'Sergeant', title: 'Forward Watch', description: 'Lead the forward team across a critical area and establish a durable tactical position.', payment: 590, repReward: 50, requiredFactionRep: 450, unlockText: 'Requires 450 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'ndf_staff_sergeant', rankIndex: 6, rankName: 'Staff Sergeant', title: 'Outpost Defense', description: 'Fortify the outpost and direct the team through hostile movement near the river edge.', payment: 710, repReward: 58, requiredFactionRep: 650, unlockText: 'Requires 650 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'ndf_lieutenant', rankIndex: 7, rankName: 'Lieutenant', title: 'Tactical Sweep', description: 'Coordinate a tactical sweep through multiple sectors and secure each checkpoint.', payment: 860, repReward: 67, requiredFactionRep: 900, unlockText: 'Requires 900 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'ndf_captain', rankIndex: 8, rankName: 'Captain', title: 'Fortress Hold', description: 'Command the fortress line and prevent hostile penetration of the central command route.', payment: 1010, repReward: 80, requiredFactionRep: 1200, unlockText: 'Requires 1200 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'ndf_major', rankIndex: 9, rankName: 'Major', title: 'Final Security Mandate', description: 'Execute the final strategic defense plan and secure the city’s military perimeter.', payment: 1265, repReward: 100, requiredFactionRep: 1600, unlockText: 'Requires 1600 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
  ],
  'State Intelligence Service': [
    { id: 'sis_trainee', rankIndex: 0, rankName: 'Trainee', title: 'Background Scan', description: 'Review the city routes and map out suspicious patterns for the observer net.', payment: 160, repReward: 12, requiredFactionRep: 0, unlockText: 'Requires 0 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'sis_intelligence_analyst', rankIndex: 1, rankName: 'Intelligence Analyst', title: 'Pattern Review', description: 'Analyze traffic and communications data before the next action window.', payment: 220, repReward: 20, requiredFactionRep: 50, unlockText: 'Requires 50 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'sis_field_agent', rankIndex: 2, rankName: 'Field Agent', title: 'Shadow Run', description: 'Track movement in the river corridor and gather intel on the active cell.', payment: 300, repReward: 28, requiredFactionRep: 120, unlockText: 'Requires 120 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'sis_surveillance_agent', rankIndex: 3, rankName: 'Surveillance Agent', title: 'Watch Grid', description: 'Observe key intersections and build a clean picture of the activity pattern.', payment: 390, repReward: 36, requiredFactionRep: 200, unlockText: 'Requires 200 faction rep', targetZone: { x: 1160, y: 200, w: 780, h: 300 } },
    { id: 'sis_intelligence_officer', rankIndex: 4, rankName: 'Intelligence Officer', title: 'Intercept Brief', description: 'Intercept the key transmission and collect the data before it reaches the crowd.', payment: 480, repReward: 44, requiredFactionRep: 300, unlockText: 'Requires 300 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'sis_senior_agent', rankIndex: 5, rankName: 'Senior Agent', title: 'Dossier Pull', description: 'Recover the briefcase and confirm the target’s scheduled movement pattern.', payment: 600, repReward: 52, requiredFactionRep: 450, unlockText: 'Requires 450 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'sis_operations_lead', rankIndex: 6, rankName: 'Operations Lead', title: 'Counter Sweep', description: 'Direct the team against a compromised operation and secure the evidence trail.', payment: 720, repReward: 60, requiredFactionRep: 650, unlockText: 'Requires 650 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'sis_deputy_director', rankIndex: 7, rankName: 'Deputy Director', title: 'Priority Signal', description: 'Execute a high-risk surveillance lift and secure the citywide communications ledger.', payment: 880, repReward: 69, requiredFactionRep: 900, unlockText: 'Requires 900 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'sis_director', rankIndex: 8, rankName: 'Director', title: 'Blackout Run', description: 'Run the blackout operation and lock down the covert channels before the leak spreads.', payment: 1040, repReward: 82, requiredFactionRep: 1200, unlockText: 'Requires 1200 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'sis_chief_director', rankIndex: 9, rankName: 'Chief Director', title: 'Statewide Control', description: 'Command the final intelligence operation and bring all active fronts under monitoring.', payment: 1300, repReward: 102, requiredFactionRep: 1600, unlockText: 'Requires 1600 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
  ],
  'Central City Medical Center': [
    { id: 'ccmc_medical_intern', rankIndex: 0, rankName: 'Medical Intern', title: 'Supply Run', description: 'Carry supplies to emergency teams and keep the first-aid cycle moving.', payment: 145, repReward: 12, requiredFactionRep: 0, unlockText: 'Requires 0 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'ccmc_medical_assistant', rankIndex: 1, rankName: 'Medical Assistant', title: 'Ward Support', description: 'Assist the staff and move patients through the central care wing.', payment: 210, repReward: 20, requiredFactionRep: 50, unlockText: 'Requires 50 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'ccmc_nurse', rankIndex: 2, rankName: 'Nurse', title: 'Rapid Triage', description: 'Stabilize incoming patients and carry them into treatment before the queue breaks.', payment: 290, repReward: 28, requiredFactionRep: 120, unlockText: 'Requires 120 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'ccmc_paramedic', rankIndex: 3, rankName: 'Paramedic', title: 'Street Response', description: 'Move through the active city streets and keep emergency response ready at every block.', payment: 370, repReward: 35, requiredFactionRep: 200, unlockText: 'Requires 200 faction rep', targetZone: { x: 900, y: 100, w: 1000, h: 550 } },
    { id: 'ccmc_senior_nurse', rankIndex: 4, rankName: 'Senior Nurse', title: 'Recovery Cycle', description: 'Coordinate the ward recovery process and improve patient throughput.', payment: 455, repReward: 42, requiredFactionRep: 300, unlockText: 'Requires 300 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'ccmc_doctor', rankIndex: 5, rankName: 'Doctor', title: 'Trauma Case', description: 'Direct treatment for a severe trauma case and keep the emergency wing stable.', payment: 575, repReward: 50, requiredFactionRep: 450, unlockText: 'Requires 450 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'ccmc_emergency_doctor', rankIndex: 6, rankName: 'Emergency Doctor', title: 'Priority Surge', description: 'Handle a high-volume emergency surge and stabilize the treatment floor.', payment: 700, repReward: 58, requiredFactionRep: 650, unlockText: 'Requires 650 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'ccmc_surgeon', rankIndex: 7, rankName: 'Surgeon', title: 'Operating Rush', description: 'Lead the surgical response during a critical emergency and protect the team route.', payment: 850, repReward: 67, requiredFactionRep: 900, unlockText: 'Requires 900 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'ccmc_chief_surgeon', rankIndex: 8, rankName: 'Chief Surgeon', title: 'Citywide Trauma', description: 'Coordinate the medical response and stabilize the city during the emergency surge.', payment: 1015, repReward: 80, requiredFactionRep: 1200, unlockText: 'Requires 1200 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'ccmc_medical_director', rankIndex: 9, rankName: 'Medical Director', title: 'Recovery Command', description: 'Direct the final emergency care network and restore city health services.', payment: 1285, repReward: 102, requiredFactionRep: 1600, unlockText: 'Requires 1600 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
  ],
  'Riverside General Hospital': [
    { id: 'rgh_medical_intern', rankIndex: 0, rankName: 'Medical Intern', title: 'Supply Cart', description: 'Carry emergency stock and maintain the flow across the hospital wing.', payment: 148, repReward: 12, requiredFactionRep: 0, unlockText: 'Requires 0 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'rgh_medical_assistant', rankIndex: 1, rankName: 'Medical Assistant', title: 'Patient Check', description: 'Conduct patient intake and verify stabilization before the next transfer.', payment: 215, repReward: 20, requiredFactionRep: 50, unlockText: 'Requires 50 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'rgh_nurse', rankIndex: 2, rankName: 'Nurse', title: 'Acute Triage', description: 'Handle urgent patients and return the ward to a stable care pattern.', payment: 295, repReward: 28, requiredFactionRep: 120, unlockText: 'Requires 120 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'rgh_paramedic', rankIndex: 3, rankName: 'Paramedic', title: 'Street Lift', description: 'Recover patients from the city streets and move them into full treatment.', payment: 375, repReward: 35, requiredFactionRep: 200, unlockText: 'Requires 200 faction rep', targetZone: { x: 900, y: 100, w: 1000, h: 550 } },
    { id: 'rgh_senior_nurse', rankIndex: 4, rankName: 'Senior Nurse', title: 'Recovery Shift', description: 'Coordinate the high-demand recovery shift and keep the care floor stable.', payment: 460, repReward: 43, requiredFactionRep: 300, unlockText: 'Requires 300 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'rgh_doctor', rankIndex: 5, rankName: 'Doctor', title: 'Intensive Care', description: 'Keep a critical patient stable while the full treatment team prepares the room.', payment: 580, repReward: 51, requiredFactionRep: 450, unlockText: 'Requires 450 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'rgh_emergency_doctor', rankIndex: 6, rankName: 'Emergency Doctor', title: 'Night Surge', description: 'Handle a sudden emergency rush and maintain the treatment line across all units.', payment: 710, repReward: 59, requiredFactionRep: 650, unlockText: 'Requires 650 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'rgh_surgeon', rankIndex: 7, rankName: 'Surgeon', title: 'Critical Response', description: 'Lead a surgical intervention and protect the emergency process during the crisis.', payment: 860, repReward: 68, requiredFactionRep: 900, unlockText: 'Requires 900 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'rgh_chief_surgeon', rankIndex: 8, rankName: 'Chief Surgeon', title: 'Regional Recovery', description: 'Command the regional medical chain and coordinate all treatment priorities.', payment: 1030, repReward: 81, requiredFactionRep: 1200, unlockText: 'Requires 1200 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
    { id: 'rgh_medical_director', rankIndex: 9, rankName: 'Medical Director', title: 'Care Network', description: 'Lead the final city recovery plan and keep the hospital system fully operational.', payment: 1295, repReward: 103, requiredFactionRep: 1600, unlockText: 'Requires 1600 faction rep', targetZone: { x: 760, y: 1350, w: 330, h: 150 } },
  ],
  'Urban News Network': [
    { id: 'unn_news_intern', rankIndex: 0, rankName: 'News Intern', title: 'Street Notes', description: 'Collect local updates and assemble the first list of city changes.', payment: 150, repReward: 12, requiredFactionRep: 0, unlockText: 'Requires 0 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'unn_camera_assistant', rankIndex: 1, rankName: 'Camera Assistant', title: 'Field Footage', description: 'Capture footage from the active city route and prepare the raw segment.', payment: 220, repReward: 20, requiredFactionRep: 50, unlockText: 'Requires 50 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'unn_reporter', rankIndex: 2, rankName: 'Reporter', title: 'City Beat', description: 'Cover the main city developments and confirm which events matter most.', payment: 300, repReward: 28, requiredFactionRep: 120, unlockText: 'Requires 120 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'unn_news_photographer', rankIndex: 3, rankName: 'News Photographer', title: 'Photowall', description: 'Document the route, collect candid images, and secure the story line.', payment: 390, repReward: 35, requiredFactionRep: 200, unlockText: 'Requires 200 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'unn_field_reporter', rankIndex: 4, rankName: 'Field Reporter', title: 'Live Interview', description: 'Get key voices on the record and build the broader city story.', payment: 480, repReward: 43, requiredFactionRep: 300, unlockText: 'Requires 300 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'unn_investigative_journalist', rankIndex: 5, rankName: 'Investigative Journalist', title: 'Leak Review', description: 'Trace the source of a city leak and verify the official narrative.', payment: 605, repReward: 52, requiredFactionRep: 450, unlockText: 'Requires 450 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'unn_senior_reporter', rankIndex: 6, rankName: 'Senior Reporter', title: 'Headlines', description: 'Assemble the headline story and coordinate the crew around the big reveal.', payment: 725, repReward: 60, requiredFactionRep: 650, unlockText: 'Requires 650 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'unn_producer', rankIndex: 7, rankName: 'Producer', title: 'Broadcast Control', description: 'Oversee the segment timeline and keep the broadcast ready for release.', payment: 885, repReward: 69, requiredFactionRep: 900, unlockText: 'Requires 900 faction rep', targetZone: { x: 1040, y: 220, w: 930, h: 350 } },
    { id: 'unn_news_director', rankIndex: 8, rankName: 'News Director', title: 'Prime Time Push', description: 'Set the final coverage plan and lock in the top stories for the city feed.', payment: 1055, repReward: 82, requiredFactionRep: 1200, unlockText: 'Requires 1200 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
    { id: 'unn_editor_in_chief', rankIndex: 9, rankName: 'Editor-in-Chief', title: 'Front Page Rush', description: 'Write the final chapter and deliver the city’s defining narrative to the public.', payment: 1320, repReward: 104, requiredFactionRep: 1600, unlockText: 'Requires 1600 faction rep', targetZone: { x: 1180, y: 680, w: 860, h: 470 } },
  ],
  'City Government Administration': [
    { id: 'cga_administrative_intern', rankIndex: 0, rankName: 'Administrative Intern', title: 'Files Check', description: 'Organize the records and confirm the administrative route is active for the office.', payment: 155, repReward: 12, requiredFactionRep: 0, unlockText: 'Requires 0 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'cga_clerk', rankIndex: 1, rankName: 'Clerk', title: 'Routing Review', description: 'Verify the form chain and keep the public service office moving on time.', payment: 225, repReward: 20, requiredFactionRep: 50, unlockText: 'Requires 50 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'cga_administrative_assistant', rankIndex: 2, rankName: 'Administrative Assistant', title: 'Office Flow', description: 'Support staff across the city administration flow and keep the service queue stable.', payment: 305, repReward: 28, requiredFactionRep: 120, unlockText: 'Requires 120 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'cga_government_officer', rankIndex: 3, rankName: 'Government Officer', title: 'Public Check', description: 'Handle the compliance route and secure the next review cycle for the district.', payment: 395, repReward: 36, requiredFactionRep: 200, unlockText: 'Requires 200 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'cga_senior_officer', rankIndex: 4, rankName: 'Senior Officer', title: 'Program Review', description: 'Coordinate a city initiative review and confirm the route remains on schedule.', payment: 490, repReward: 44, requiredFactionRep: 300, unlockText: 'Requires 300 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'cga_department_analyst', rankIndex: 5, rankName: 'Department Analyst', title: 'Briefing Cycle', description: 'Collect datasets and prepare the official policy briefing for the administrative block.', payment: 610, repReward: 53, requiredFactionRep: 450, unlockText: 'Requires 450 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'cga_section_chief', rankIndex: 6, rankName: 'Section Chief', title: 'Service Seal', description: 'Lead the section and secure the service order against disruption in the district.', payment: 735, repReward: 61, requiredFactionRep: 650, unlockText: 'Requires 650 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'cga_deputy_director', rankIndex: 7, rankName: 'Deputy Director', title: 'Strategy Route', description: 'Execute the department plan and direct all operations toward city stability.', payment: 890, repReward: 70, requiredFactionRep: 900, unlockText: 'Requires 900 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'cga_director', rankIndex: 8, rankName: 'Director', title: 'City Briefing', description: 'Lead the final briefing and reframe the city administration priorities for the people.', payment: 1060, repReward: 83, requiredFactionRep: 1200, unlockText: 'Requires 1200 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
    { id: 'cga_commissioner', rankIndex: 9, rankName: 'Commissioner', title: 'Final Order', description: 'Start the final administration order and lock the public network into place for the city.', payment: 1335, repReward: 105, requiredFactionRep: 1600, unlockText: 'Requires 1600 faction rep', targetZone: { x: 160, y: 1290, w: 760, h: 280 } },
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
