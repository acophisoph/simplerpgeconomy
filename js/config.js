// ======================================================
// GAME CONFIGURATION & ASSET DEFINITIONS
// ======================================================

// --- Core Settings ---
const STARTING_PLAYER_GOLD = 100;
const STARTING_PLAYER_ITEMS = { 'bread': 5, 'wood': 10 };
const STARTING_NPC_GOLD = 50;
const INVENTORY_SLOTS = 30;
const GLOBAL_TIME_MULTIPLIER = 1; // Base time flow rate (unused directly now, logic uses timescale)

// --- Time & Cycles ---
const REAL_MINUTES_PER_GAME_DAY = 5;
const GAME_SECONDS_PER_REAL_SECOND = (24 * 60 * 60) / (REAL_MINUTES_PER_GAME_DAY * 60);
const GAME_DAYS_PER_SEASON = 7;
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];

// --- NPC Behavior Settings ---
const NPC_TRADE_DECISION_INTERVAL = 10 * 60; // Game Seconds
const NPC_CONSUME_NEED_INTERVAL = 20 * 60;   // Game Seconds
const NPC_MOVE_SPEED = 60; // Pixels per REAL second (Base visual speed)
const NPC_TRADE_DISTANCE = 50; // Increased range due to larger sprites
const NPC_WAIT_BEFORE_TRADE = 1.5 * 60; // Game Seconds

// --- Economy Settings ---
const PRICE_FLUCTUATION_FACTOR = 0.6;
const MIN_PRICE = 1;

// --- Visual Settings ---
const USE_SPRITES = true;
const PLAYER_SPRITE_SIZE = { width: 64, height: 64 };
const NPC_SPRITE_SIZE = { width: 64, height: 64 };
const BUILDING_SPRITE_SIZE = { width: 192, height: 192 };
const ITEM_ICON_SIZE = { width: 24, height: 24 };
const MAP_WIDTH = 1024;
const MAP_HEIGHT = 1024;

// ======================================================
// ASSET DEFINITIONS
// ======================================================
const ASSET_BASE_PATH = "assets/";
const BACKGROUND_IMAGE_SRC = "background.png"; // MUST BE 1024x1024
const CHAR_SPRITES = { 'player':"chars/player.png", 'farmer':"chars/farmer.png", 'lumberjack':"chars/lumberjack.png", 'miner':"chars/miner.png", 'blacksmith':"chars/blacksmith.png", 'carpenter':"chars/carpenter.png", 'miller':"chars/miller.png", 'baker':"chars/baker.png", 'hunter':"chars/hunter.png", 'tailor':"chars/tailor.png", 'herbalist':"chars/herbalist.png" }; // Expect 64x64
const ITEM_SPRITES = { 'wood':"items/wood.png", 'iron_ore':"items/iron_ore.png", 'coal':"items/coal.png", 'wheat':"items/wheat.png", 'wool':"items/wool.png", 'meat':"items/meat.png", 'leather':"items/leather.png", 'herbs':"items/herbs.png", 'seeds':"items/seeds.png", 'flour':"items/flour.png", 'iron_ingot':"items/iron_ingot.png", 'planks':"items/planks.png", 'bread':"items/bread.png", 'clothes':"items/clothes.png", 'basic_furniture':"items/furniture.png", 'axe':"items/axe.png", 'pickaxe':"items/pickaxe.png", 'hoe':"items/hoe.png", 'sickle':"items/sickle.png", 'nails':"items/nails.png", 'basic_potion':"items/potion.png" }; // Expect 24x24 or 32x32
const BUILDING_SPRITES = { 'farmer':"buildings/farmhouse.png", 'lumberjack':"buildings/lumbermill.png", 'miner':"buildings/mine_entrance.png", 'blacksmith':"buildings/blacksmith_shop.png", 'carpenter':"buildings/carpenter_shop.png", 'miller':"buildings/mill.png", 'baker':"buildings/bakery.png", 'hunter':"buildings/hunter_cabin.png", 'tailor':"buildings/tailor_shop.png", 'herbalist':"buildings/herbalist_hut.png" }; // Expect 192x192

// ======================================================
// DATA DEFINITIONS
// ======================================================
const ITEMS = { 'wood': { name: 'Wood', basePrice: 2, stackSize: 50 }, 'iron_ore': { name: 'Iron Ore', basePrice: 5, stackSize: 50 }, 'coal': { name: 'Coal', basePrice: 3, stackSize: 50 }, 'wheat': { name: 'Wheat', basePrice: 1, stackSize: 50 }, 'wool': { name: 'Wool', basePrice: 4, stackSize: 50 }, 'meat': { name: 'Meat', basePrice: 6, stackSize: 50 }, 'leather': { name: 'Leather', basePrice: 8, stackSize: 50 }, 'herbs': { name: 'Herbs', basePrice: 3, stackSize: 50 }, 'seeds': { name: 'Seeds', basePrice: 1, stackSize: 50 }, 'flour': { name: 'Flour', basePrice: 3, stackSize: 50 }, 'iron_ingot': { name: 'Iron Ingot', basePrice: 12, stackSize: 50 }, 'planks': { name: 'Planks', basePrice: 5, stackSize: 50 }, 'bread': { name: 'Bread', basePrice: 7, stackSize: 20 }, 'clothes': { name: 'Clothes', basePrice: 20, stackSize: 10 }, 'basic_furniture': { name: 'Basic Furniture', basePrice: 15, stackSize: 5 }, 'axe': { name: 'Axe', basePrice: 25, stackSize: 1, durability: 100 }, 'pickaxe': { name: 'Pickaxe', basePrice: 25, stackSize: 1, durability: 100 }, 'hoe': { name: 'Hoe', basePrice: 20, stackSize: 1, durability: 80 }, 'sickle': { name: 'Sickle', basePrice: 18, stackSize: 1, durability: 60 }, 'nails': { name: 'Nails', basePrice: 1, stackSize: 50 }, 'basic_potion': { name: 'Basic Potion', basePrice: 15, stackSize: 10 }};

// --- OCCUPATIONS (Raw data before time conversion) ---
const _OCCUPATIONS_DATA = {
    'farmer': { name: 'Farmer', productionTime: 15, workLocation: { x: 250, y: 300 }, needs: { 'hoe': 0.02, 'seeds': 1, 'bread': 0.1 }, produces: { 'wheat': 5, 'wool': 2 }, desiredStock: { 'hoe': 1, 'seeds': 20, 'bread': 5, 'wheat': 10, 'wool': 5 }, buyPrefs: ['hoe', 'seeds', 'bread', 'basic_potion', 'clothes'], sellPrefs: ['wheat', 'wool'], color: '#FFD700', dialogue: { greet: ["Busy day on the farm.", "Need somethin'?", "Sun's high, crops need tendin'."], buy: ["Ah, much needed. Thanks.", "This'll help.", "Good trade."], sell: ["Fresh off the fields!", "Take a look.", "Hope this serves ya well."], cancel: ["Alright then, back to work.", "Maybe next time.", "Fair enough."] } },
    'lumberjack': { name: 'Lumberjack', productionTime: 10, workLocation: { x: 150, y: 800 }, needs: { 'axe': 0.025, 'bread': 0.1 }, produces: { 'wood': 4 }, desiredStock: { 'axe': 1, 'bread': 5, 'wood': 10 }, buyPrefs: ['axe', 'bread', 'basic_potion', 'clothes'], sellPrefs: ['wood'], color: '#8B4513', dialogue: { greet: ["That tree won't chop itself.", "Need some timber?", "Watch out for falling... prices! Ha!"], buy: ["Good tool, this.", "Fuel for the fire.", "Appreciate it."], sell: ["Fine wood, sturdy.", "Straight from the forest.", "Need wood?"], cancel: ["Suit yourself.", "Tim-berrr! ... I mean, goodbye.", "Back to the woods."] } },
    'miner': { name: 'Miner', productionTime: 18, workLocation: { x: 450, y: 900 }, needs: { 'pickaxe': 0.03, 'bread': 0.1, 'coal': 0.05 }, produces: { 'iron_ore': 3, 'coal': 2 }, desiredStock: { 'pickaxe': 1, 'bread': 5, 'coal': 10, 'iron_ore': 5 }, buyPrefs: ['pickaxe', 'bread', 'basic_potion', 'clothes'], sellPrefs: ['iron_ore', 'coal'], color: '#708090', dialogue: { greet: ["Dark down there.", "Find anything good?", "Watch your step."], buy: ["Can always use more supplies.", "Thanks, friend.", "This'll keep me going."], sell: ["Fresh from the earth.", "Good quality ore.", "Need coal?"], cancel: ["Alright. Back to the mine.", "See ya around.", "Dusty work awaits."] } },
    'blacksmith': { name: 'Blacksmith', productionTime: 25, workLocation: { x: 700, y: 650 }, needs: { 'bread': 0.15, 'coal': 0.5 }, produces: {}, recipes: { 'iron_ingot': { needs: { 'iron_ore': 2, 'coal': 1 }, output: 1, time: 5 }, 'axe': { needs: { 'iron_ingot': 1, 'wood': 1 }, output: 1, time: 8 }, 'pickaxe': { needs: { 'iron_ingot': 1, 'wood': 1 }, output: 1, time: 8 }, 'hoe': { needs: { 'iron_ingot': 1, 'wood': 1 }, output: 1, time: 7 }, 'sickle': { needs: { 'iron_ingot': 1, 'wood': 1 }, output: 1, time: 6 }, 'nails': { needs: { 'iron_ingot': 0.1 }, output: 10, time: 3 } }, desiredStock: { 'iron_ore': 20, 'coal': 30, 'wood': 15, 'bread': 5, 'iron_ingot': 5, 'axe': 2, 'pickaxe': 2, 'hoe': 2, 'sickle': 2, 'nails': 50 }, buyPrefs: ['iron_ore', 'coal', 'wood', 'bread', 'basic_potion', 'clothes'], sellPrefs: ['axe', 'pickaxe', 'hoe', 'sickle', 'nails', 'iron_ingot'], color: '#A0522D', dialogue: { greet: ["The forge is hot today!", "Need somethin' made or mended?", "Clang, clang, clang!"], buy: ["Good materials make good tools.", "Just what I needed.", "Thanks."], sell: ["Strong steel!", "Made to last.", "Finest tools in town!"], cancel: ["No problem.", "Back to the anvil.", "Come back anytime."] } },
    'carpenter': { name: 'Carpenter', productionTime: 12, workLocation: { x: 850, y: 400 }, needs: { 'wood': 0.5, 'nails': 1, 'bread': 0.1 }, produces: {}, recipes: { 'planks': { needs: { 'wood': 1 }, output: 2, time: 3 }, 'basic_furniture': { needs: { 'planks': 4, 'nails': 10 }, output: 1, time: 10 } }, desiredStock: { 'wood': 30, 'nails': 100, 'bread': 5, 'planks': 10, 'basic_furniture': 3 }, buyPrefs: ['wood', 'nails', 'axe', 'bread', 'basic_potion', 'clothes'], sellPrefs: ['planks', 'basic_furniture'], color: '#DEB887', dialogue: { greet: ["Measure twice, cut once.", "What can I build for ya?", "Woodworking takes patience."], buy: ["Can always use more wood.", "Good quality nails.", "Thanks for the supplies."], sell: ["Sturdy planks.", "Need furniture?", "Built to last."], cancel: ["Alright then.", "Back to the workshop.", "Let me know if you change your mind."] } },
    'miller': { name: 'Miller', productionTime: 8, workLocation: { x: 350, y: 150 }, needs: { 'wheat': 2, 'bread': 0.08 }, produces: { 'flour': 3 }, desiredStock: { 'wheat': 20, 'bread': 4, 'flour': 10 }, buyPrefs: ['wheat', 'bread', 'basic_potion', 'clothes'], sellPrefs: ['flour'], color: '#F5F5DC', dialogue: { greet: ["The mill wheel turns.", "Need flour?", "Grinding away!"], buy: ["Good wheat makes good flour.", "Thanks for the grain.", "Appreciate it."], sell: ["Finest flour in town.", "Perfect for baking.", "Freshly milled."], cancel: ["Okay.", "Back to the grindstone.", "See you later."] } },
    'baker': { name: 'Baker', productionTime: 10, workLocation: { x: 550, y: 150 }, needs: { 'flour': 2, 'wood': 0.5 }, produces: { 'bread': 4 }, desiredStock: { 'flour': 15, 'wood': 10, 'bread': 5 }, buyPrefs: ['flour', 'wood', 'basic_potion', 'clothes'], sellPrefs: ['bread'], color: '#FFDEAD', dialogue: { greet: ["Smells good, eh?", "Fresh bread!", "What can I get for you?"], buy: ["Need this for the dough.", "Good flour!", "Thanks!"], sell: ["Hot from the oven!", "Best bread around!", "Get it while it's fresh!"], cancel: ["Alrighty.", "More baking to do!", "Maybe later!"] } },
    'hunter': { name: 'Hunter', productionTime: 20, workLocation: { x: 100, y: 500 }, needs: { 'sickle': 0.015, 'bread': 0.12 }, produces: { 'meat': 2, 'leather': 1 }, desiredStock: { 'sickle': 1, 'bread': 6, 'meat': 5, 'leather': 5 }, buyPrefs: ['sickle', 'bread', 'basic_potion', 'clothes', 'axe'], sellPrefs: ['meat', 'leather'], color: '#228B22', dialogue: { greet: ["The woods provide.", "Looking for hides or meat?", "Quiet now... tracking."], buy: ["A sharp tool is essential.", "Need supplies for the hunt.", "Thanks."], sell: ["Fresh catch.", "Good leather here.", "From the wild."], cancel: ["May your aim be true.", "Back to the trail.", "Good hunting."] } },
    'tailor': { name: 'Tailor', productionTime: 16, workLocation: { x: 750, y: 150 }, needs: { 'wool': 1, 'leather': 0.5, 'bread': 0.08 }, produces: {}, recipes: { 'clothes': { needs: { 'wool': 2, 'leather': 1 }, output: 1, time: 15 } }, desiredStock: { 'wool': 15, 'leather': 10, 'bread': 4, 'clothes': 3 }, buyPrefs: ['wool', 'leather', 'bread', 'basic_potion'], sellPrefs: ['clothes'], color: '#4682B4', dialogue: { greet: ["Needle and thread!", "Care for some new clothes?", "A stitch in time..."], buy: ["This wool looks warm.", "Good leather.", "Perfect material."], sell: ["Made to measure!", "Keep the cold out.", "Look sharp!"], cancel: ["Very well.", "Back to sewing.", "Come again!"] } },
    'herbalist': { name: 'Herbalist', productionTime: 13, workLocation: { x: 900, y: 850 }, needs: { 'sickle': 0.02, 'bread': 0.08 }, produces: { 'herbs': 4 }, recipes: { 'basic_potion': { needs: { 'herbs': 3 }, output: 1, time: 6 } }, desiredStock: { 'sickle': 1, 'bread': 4, 'herbs': 10, 'basic_potion': 5 }, buyPrefs: ['sickle', 'bread', 'clothes'], sellPrefs: ['herbs', 'basic_potion'], color: '#90EE90', dialogue: { greet: ["Nature's remedies.", "Looking for herbs or potions?", "The forest whispers secrets."], buy: ["A good sickle helps.", "Need this for my poultices.", "Thank you kindly."], sell: ["Potent herbs.", "A cure for what ails ya?", "Brewed with care."], cancel: ["May good health find you.", "Back to gathering.", "Nature calls."] } },
};

// Convert Occupation Times AFTER defining the structure fully
const OCCUPATIONS = {};
Object.entries(_OCCUPATIONS_DATA).forEach(([id, data]) => {
    OCCUPATIONS[id] = JSON.parse(JSON.stringify(data)); // Deep copy
    OCCUPATIONS[id].productionTime = (data.productionTime || 10) * GAME_SECONDS_PER_REAL_SECOND;
    if (data.recipes) {
        Object.values(OCCUPATIONS[id].recipes).forEach(recipe => {
            recipe.time = (recipe.time || 5) * GAME_SECONDS_PER_REAL_SECOND;
        });
    }
});

// --- NPC States ---
const NPC_STATE = { IDLE: 'Idle', WORKING: 'Working', NEED_RESOURCES: 'NeedResources', MOVING_TO_TRADE: 'MovingToTrade', WAITING_FOR_TRADE: 'WaitingForTrade', EXECUTING_TRADE: 'ExecutingTrade', MOVING_TO_WORK: 'MovingToWork'};

// --- Asset Loading Cache ---
const loadedCharSprites = {}; const loadedItemSprites = {}; const loadedBuildingSprites = {};
let loadedBackground = null; let assetsLoaded = false;

// --- Preload Function --- (Keep as before)
function preloadAssets(callback) { /* ... same preload logic ... */ if (!USE_SPRITES) { console.log("Sprite usage disabled. Skipping asset loading."); assetsLoaded = true; if (callback) callback(); return; } let totalAssets = 0; let loadedCount = 0; const assetsToLoad = []; function assetLoaded() { loadedCount++; if (loadedCount >= totalAssets) { assetsLoaded = true; console.log("All assets loaded."); if (callback) callback(); } } function assetError(path) { console.error(`Failed to load asset: ${path}`); loadedCount++; if (loadedCount >= totalAssets) { assetsLoaded = true; console.warn("Asset loading complete, but with errors."); if (callback) callback(); } } if (BACKGROUND_IMAGE_SRC) { assetsToLoad.push({ type: 'background', key: 'background', path: ASSET_BASE_PATH + BACKGROUND_IMAGE_SRC }); } Object.entries(CHAR_SPRITES).forEach(([key, path]) => assetsToLoad.push({ type: 'char', key: key, path: ASSET_BASE_PATH + path })); Object.entries(ITEM_SPRITES).forEach(([key, path]) => assetsToLoad.push({ type: 'item', key: key, path: ASSET_BASE_PATH + path })); const uniqueBuildingPaths = [...new Set(Object.values(BUILDING_SPRITES))]; uniqueBuildingPaths.forEach(path => assetsToLoad.push({ type: 'building', key: path, path: ASSET_BASE_PATH + path })); totalAssets = assetsToLoad.length; if (totalAssets === 0) { console.log("No assets defined for loading."); assetsLoaded = true; if (callback) callback(); return; } console.log(`Attempting to load ${totalAssets} assets...`); assetsToLoad.forEach(assetInfo => { const img = new Image(); img.onload = assetLoaded; img.onerror = () => assetError(assetInfo.path); img.src = assetInfo.path; switch (assetInfo.type) { case 'background': loadedBackground = img; break; case 'char': loadedCharSprites[assetInfo.key] = img; break; case 'item': loadedItemSprites[assetInfo.key] = img; break; case 'building': loadedBuildingSprites[assetInfo.key] = img; break; } }); }

// --- Particle System Configuration --- (Keep as before)
const PARTICLE_SETTINGS = { maxParticles: 200, types: { snow: { count: 80, color: ['#FFFFFF', '#DDDDFF', '#EEEEFF'], size: { min: 1, max: 3 }, speedY: { min: 15, max: 30 }, speedX: { min: -5, max: 5 }, life: { min: 5, max: 10 } }, leaves: { count: 50, color: ['#D4A017', '#B8860B', '#C1440E', '#8B4513'], size: { min: 3, max: 6 }, speedY: { min: 10, max: 25 }, speedX: { min: -10, max: 10 }, life: { min: 4, max: 8 }, rotation: { min: -0.1, max: 0.1 } }, rain: { count: 150, color: ['#AADDFF', '#87CEEB'], size: { min: 1, max: 2 }, height: {min: 5, max: 10}, speedY: { min: 150, max: 250 }, speedX: { min: -2, max: 2 }, life: { min: 0.5, max: 1.5 } }, none: { count: 0 } }, seasonMap: { 'Spring': 'none', 'Summer': 'none', 'Autumn': 'leaves', 'Winter': 'snow' } };