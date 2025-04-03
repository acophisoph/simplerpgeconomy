// ======================================================
// MAIN GAME FILE (Initialization, Loop, Drawing)
// ======================================================

// --- Global Variables & DOM References ---
const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('gameContainer');
const timeDisplay = document.getElementById('timeDisplay'); const fastForwardBtn = document.getElementById('fastForwardBtn');
const statusMessage = document.createElement('div'); const dayNightOverlay = document.getElementById('dayNightOverlay');
const seasonIndicator = document.getElementById('seasonIndicator');

// Game State
let lastTime = 0; window.gameTime = 0; let timeScale = 1; const timeScales = [1, 2, 5, 10];
let currentTimeScaleIndex = 0; let gameRunning = false; let currentDay = 1; let currentSeason = 'Spring';

// Input & Entities
const keysPressed = {}; const npcElements = {}; const buildingElements = {};
let particleEmitter = null;


// --- Initialization ---
function init() { console.log("Game initializing..."); statusMessage.textContent = "Loading assets..."; /* Style status message */ statusMessage.style.position = 'absolute'; statusMessage.style.top = '45%'; statusMessage.style.left = '50%'; statusMessage.style.transform = 'translate(-50%, -50%)'; statusMessage.style.zIndex = '300'; statusMessage.style.fontSize = '20px'; statusMessage.style.color = 'black'; statusMessage.style.backgroundColor = 'rgba(220, 220, 220, 0.9)'; statusMessage.style.padding = '15px 25px'; statusMessage.style.border = '1px solid #999'; statusMessage.style.borderRadius = '5px'; document.body.appendChild(statusMessage); preloadAssets(setupGame); }

function setupGame() {
    statusMessage.textContent = "Setting up game world..."; console.log("Assets ready. Setting up game state.");
    canvas.width = MAP_WIDTH; canvas.height = MAP_HEIGHT; // Set fixed canvas size
    console.log(`Canvas set to fixed size: ${canvas.width}x${canvas.height}`);
    particleEmitter = new ParticleEmitter(MAP_WIDTH, MAP_HEIGHT); // Use fixed size

    // Create NPCs & Buildings (Uses updated sprite sizes and map dimensions)
    if (typeof OCCUPATIONS !== 'undefined' && Object.keys(OCCUPATIONS).length > 0) { let i = 0; Object.entries(OCCUPATIONS).forEach(([id, occData]) => { const name = `${occData.name} ${i % 3 + 1}`; const workLoc = occData.workLocation || { x: getRandomInt(50, MAP_WIDTH - 50), y: getRandomInt(50, MAP_HEIGHT - 50) }; if (!occData.workLocation) console.warn(`Occupation ${id} missing workLocation, using random within ${MAP_WIDTH}x${MAP_HEIGHT}.`); const npc = new Npc(name, id, workLoc.x, workLoc.y); if (!npc.occupation) return; const npcEl = document.createElement('div'); npcEl.id = `npc-${npc.id}`; npcEl.classList.add('npc'); npcEl.style.position = 'absolute'; npcEl.title = `${npc.name} (${npc.occupation.name})`; npcEl.style.width = `${NPC_SPRITE_SIZE.width}px`; npcEl.style.height = `${NPC_SPRITE_SIZE.height}px`; gameContainer.appendChild(npcEl); npcElements[npc.id] = npcEl; const buildingSpritePath = BUILDING_SPRITES[id]; const buildingEl = document.createElement('div'); buildingEl.id = `building-${npc.id}`; buildingEl.classList.add('building'); buildingEl.style.position = 'absolute'; const buildingWidth = BUILDING_SPRITE_SIZE.width; const buildingHeight = BUILDING_SPRITE_SIZE.height; buildingEl.style.left = `${workLoc.x - buildingWidth / 2}px`; buildingEl.style.top = `${workLoc.y - buildingHeight / 2}px`; buildingEl.style.width = `${buildingWidth}px`; buildingEl.style.height = `${buildingHeight}px`; buildingEl.title = `${npc.occupation.name}'s Workplace`; if (USE_SPRITES && buildingSpritePath && loadedBuildingSprites[buildingSpritePath]?.complete && loadedBuildingSprites[buildingSpritePath]?.naturalHeight !== 0) { buildingEl.style.backgroundImage = `url('${ASSET_BASE_PATH + buildingSpritePath}')`; buildingEl.style.backgroundColor = 'transparent'; buildingEl.style.border = 'none'; buildingEl.textContent = ''; } else { buildingEl.textContent = occData.name.substring(0,3); } gameContainer.appendChild(buildingEl); buildingElements[npc.id] = buildingEl; i++; }); console.log(`Created ${npcs.length} NPCs and associated buildings.`); } else { console.error("CRITICAL: OCCUPATIONS data missing!"); statusMessage.textContent = "Error: Game data missing!"; return; }

    player.init();
    updateSeasonDisplay();

    // Input Listeners
    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
    gameContainer.addEventListener('click', handleGameClick); fastForwardBtn.addEventListener('click', cycleTimeScale);
    // Remove resize handler as map is fixed size
    // window.removeEventListener('resize', handleResize);

    lastTime = performance.now(); gameRunning = true;
    requestAnimationFrame(gameLoop);
    statusMessage.remove(); console.log("Game setup complete. Loop started.");
}

// --- Game Loop ---
function gameLoop(timestamp) {
    if (!gameRunning) { requestAnimationFrame(gameLoop); return; }
    const realDeltaTime = Math.min((timestamp - lastTime) / 1000, 0.1); lastTime = timestamp;
    const gameDeltaTime = realDeltaTime * timeScale * GAME_SECONDS_PER_REAL_SECOND;
    window.gameTime += gameDeltaTime;

    timeDisplay.textContent = formatGameTime(window.gameTime);
    const newDay = getGameDay(window.gameTime);
    if (newDay !== currentDay) { currentDay = newDay; updateSeasonDisplay(); console.log(`Day: ${currentDay}, Season: ${currentSeason}`); }

    handleInput(realDeltaTime); // Player movement uses real time
    update(realDeltaTime, timeScale); // Game logic update passes REAL delta and timescale

    draw(window.gameTime);
    requestAnimationFrame(gameLoop);
}

// --- Input Handling --- (Keep as before)
function handleKeyDown(e) { const key = e.key.toLowerCase(); keysPressed[key] = true; if (key === 'enter' || key === ' ') { e.preventDefault(); player.interact(); } if (key === 'escape') { if (npcInteractionPanel.style.display !== 'none') { closeNpcInteractionPanel(); } } }
function handleKeyUp(e) { keysPressed[e.key.toLowerCase()] = false; }
function handleInput(realDeltaTime) { let dx = 0; let dy = 0; if (keysPressed['w'] || keysPressed['arrowup']) dy -= 1; if (keysPressed['s'] || keysPressed['arrowdown']) dy += 1; if (keysPressed['a'] || keysPressed['arrowleft']) dx -= 1; if (keysPressed['d'] || keysPressed['arrowright']) dx += 1; if (dx !== 0 && dy !== 0) { const magnitude = Math.sqrt(2); dx /= magnitude; dy /= magnitude; } if (dx !== 0 || dy !== 0) { player.move(dx, dy, realDeltaTime); } }
function handleGameClick(event) { player.interact(); }

/** Cycles time scale */
function cycleTimeScale() { currentTimeScaleIndex = (currentTimeScaleIndex + 1) % timeScales.length; timeScale = timeScales[currentTimeScaleIndex]; fastForwardBtn.textContent = `Fast Forward (${timeScale}x)`; console.log(`Time scale set to ${timeScale}x`); }

/** Updates season display and particle emitter */
function updateSeasonDisplay() {
    const newSeason = getCurrentSeason(currentDay);
    if (newSeason !== currentSeason) {
        console.log(`Season changed to ${newSeason}`);
        currentSeason = newSeason;
        if (particleEmitter) { const particleType = PARTICLE_SETTINGS.seasonMap[currentSeason] || 'none'; particleEmitter.setType(particleType); }
    }
    seasonIndicator.textContent = `Season: ${currentSeason}`;
    if (particleEmitter && particleEmitter.currentType === 'none') { const particleType = PARTICLE_SETTINGS.seasonMap[currentSeason] || 'none'; particleEmitter.setType(particleType); }
}

// --- Update Logic ---
/** Updates game state. Takes REAL delta time and current timeScale */
function update(realDeltaTime, currentTimeScale) {
    // Update NPCs (pass real time delta for movement, timescale for internal logic)
    npcs.forEach(npc => npc.update(realDeltaTime, currentTimeScale));
    // Update Particle System (uses REAL delta time for smooth visuals)
    if (particleEmitter) { particleEmitter.update(realDeltaTime); }
}

// --- Drawing Logic ---
function draw(currentGameTime) {
    // 1. Clear Canvas & Draw Background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (USE_SPRITES && loadedBackground?.complete && loadedBackground?.naturalHeight !== 0) { ctx.drawImage(loadedBackground, 0, 0, canvas.width, canvas.height); }
    else { ctx.fillStyle = '#1a241a'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    // 2. Draw Particles (Canvas)
    if (particleEmitter) { particleEmitter.draw(ctx); }
    // 3. Update Day/Night Overlay (DOM)
    updateDayNightOverlay(currentGameTime);
    // 4. Update NPC visuals (DOM)
    npcs.forEach(npc => { const element = npcElements[npc.id]; if (element) { npc.draw(element); } });
    // 5. Update Player visual (DOM)
    player.draw();
}

/** Updates day/night overlay style */
function updateDayNightOverlay(currentGameTime) { const hour = getGameHour(currentGameTime); let overlayColor = 'rgba(0, 0, 0, 0)'; let opacity = 0; if (hour < 5 || hour >= 21) { overlayColor = 'rgba(10, 0, 40, 0.6)'; opacity = 0.6; } else if (hour < 7) { opacity = 0.6 - ((hour - 5) / 2) * 0.4; overlayColor = `rgba(50, 20, 60, ${opacity})`; } else if (hour < 18) { opacity = 0; } else if (hour < 21) { opacity = ((hour - 18) / 3) * 0.5; overlayColor = `rgba(40, 10, 10, ${opacity})`; } dayNightOverlay.style.backgroundColor = overlayColor; }

// --- Start ---
init();