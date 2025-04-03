// ======================================================
// UTILITY FUNCTIONS
// ======================================================
function calculateDistance(pos1, pos2) { if (!pos1 || !pos2) return Infinity; const dx = pos1.x - pos2.x; const dy = pos1.y - pos2.y; return Math.sqrt(dx * dx + dy * dy); }
function getRandomInt(min, max) { min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min + 1)) + min; }
function getRandomFloat(min, max) { return Math.random() * (max - min) + min; }
function clamp(value, min, max) { return Math.max(min, Math.min(value, max)); }
function formatGold(amount) { return Math.floor(amount); }
function formatGameTime(totalGameSeconds) { const secondsPerMinute = 60; const secondsPerHour = 60 * secondsPerMinute; const secondsPerDay = 24 * secondsPerHour; const day = Math.floor(totalGameSeconds / secondsPerDay) + 1; const remainingSeconds = totalGameSeconds % secondsPerDay; const hour = Math.floor(remainingSeconds / secondsPerHour); const minute = Math.floor((remainingSeconds % secondsPerHour) / secondsPerMinute); const hh = String(hour).padStart(2, '0'); const mm = String(minute).padStart(2, '0'); return `Day ${day}, ${hh}:${mm}`; }
function getGameHour(totalGameSeconds) { const secondsPerHour = 3600; const secondsPerDay = 24 * secondsPerHour; const remainingSeconds = totalGameSeconds % secondsPerDay; return Math.floor(remainingSeconds / secondsPerHour); }
function getGameDay(totalGameSeconds) { const secondsPerDay = 24 * 60 * 60; return Math.floor(totalGameSeconds / secondsPerDay) + 1; }
function getCurrentSeason(gameDay) { const dayInYear = (gameDay - 1) % (SEASONS.length * GAME_DAYS_PER_SEASON); const seasonIndex = Math.floor(dayInYear / GAME_DAYS_PER_SEASON); return SEASONS[seasonIndex % SEASONS.length]; }
function getRandomDialogue(dialogueArray) { if (!Array.isArray(dialogueArray) || dialogueArray.length === 0) { return "..."; } return dialogueArray[getRandomInt(0, dialogueArray.length - 1)]; }