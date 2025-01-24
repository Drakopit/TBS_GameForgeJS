// Constants and Enums
const BattleState = {
    IDLE: 'IDLE',
    MOVING: 'MOVING',
    ATTACKING: 'ATTACKING',
    END_TURN: 'END_TURN',
  };
  
  const TileType = {
    WALKABLE: 'WALKABLE',
    BLOCKED: 'BLOCKED',
  };
  
  const Directions = [
    { x: 0, y: -1 }, // Up
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 },  // Right
  ];
  
  // Global Variables
  let battleState = BattleState.IDLE;
  let selectedUnit = null;
  let cursorPosition = { x: 0, y: 0 };
  let movementRange = [];
  let attackRange = [];
  
  // Map and Units Initialization
  const map = initializeMap(10, 10);
  const units = initializeUnits();
  
  function initializeMap(width, height) {
    return Array.from({ length: height }, (_, y) => (
      Array.from({ length: width }, (_, x) => ({
        x,
        y,
        type: TileType.WALKABLE,
      }))
    ));
  }
  
  function initializeUnits() {
    return [
      { id: 1, x: 1, y: 1, movement: 3, attackRange: 1 },
      { id: 2, x: 3, y: 3, movement: 2, attackRange: 2 },
    ];
  }
  
  // Game Loop
  function onStart() {
    console.log('Game started.');
    renderMap();
    renderUnits();
  }
  
  function onUpdate() {
    handleCursor();
    if (battleState === BattleState.MOVING) {
      drawMovementRange(selectedUnit);
    }
    if (battleState === BattleState.ATTACKING) {
      drawAttackRange(selectedUnit);
    }
  }
  
  // Input Handling
  function handleCursor() {
    // Example: Move cursor with keyboard input
    if (isKeyPressed('ArrowUp')) cursorPosition.y--;
    if (isKeyPressed('ArrowDown')) cursorPosition.y++;
    if (isKeyPressed('ArrowLeft')) cursorPosition.x--;
    if (isKeyPressed('ArrowRight')) cursorPosition.x++;
    cursorPosition = clampPosition(cursorPosition, map);
    renderCursor(cursorPosition);
  }
  
  function clampPosition(position, map) {
    return {
      x: Math.max(0, Math.min(map[0].length - 1, position.x)),
      y: Math.max(0, Math.min(map.length - 1, position.y)),
    };
  }
  
  // Unit and Range Management
  function selectUnitAtPosition(position) {
    selectedUnit = units.find(unit => unit.x === position.x && unit.y === position.y);
    if (selectedUnit) {
      battleState = BattleState.MOVING;
      calculateMovementRange(selectedUnit);
    }
  }
  
  function calculateMovementRange(unit) {
    movementRange = []; // Clear previous range
    const visited = new Set();
  
    function dfs(x, y, steps) {
      if (steps > unit.movement || visited.has(`${x},${y}`)) return;
      visited.add(`${x},${y}`);
      movementRange.push({ x, y });
  
      for (const dir of Directions) {
        const nx = x + dir.x;
        const ny = y + dir.y;
        if (isWalkable(nx, ny)) dfs(nx, ny, steps + 1);
      }
    }
  
    dfs(unit.x, unit.y, 0);
  }
  
  function isWalkable(x, y) {
    return map[y] && map[y][x] && map[y][x].type === TileType.WALKABLE;
  }
  
  function drawMovementRange(unit) {
    movementRange.forEach(tile => highlightTile(tile, 'blue'));
  }
  
  function drawAttackRange(unit) {
    attackRange = calculateAttackRange(unit);
    attackRange.forEach(tile => highlightTile(tile, 'red'));
  }
  
  function calculateAttackRange(unit) {
    const range = [];
    for (let dx = -unit.attackRange; dx <= unit.attackRange; dx++) {
      for (let dy = -unit.attackRange; dy <= unit.attackRange; dy++) {
        const x = unit.x + dx;
        const y = unit.y + dy;
        if (Math.abs(dx) + Math.abs(dy) <= unit.attackRange && isValidTile(x, y)) {
          range.push({ x, y });
        }
      }
    }
    return range;
  }
  
  function isValidTile(x, y) {
    return map[y] && map[y][x];
  }
  
  // Rendering Functions
  function renderMap() {
    map.forEach(row => row.forEach(tile => drawTile(tile)));
  }
  
  function renderUnits() {
    units.forEach(unit => drawUnit(unit));
  }
  
  function renderCursor(position) {
    highlightTile(position, 'yellow');
  }
  
  function highlightTile(tile, color) {
    console.log(`Highlighting tile at (${tile.x}, ${tile.y}) with color ${color}`);
  }
  
  function drawTile(tile) {
    console.log(`Drawing tile at (${tile.x}, ${tile.y})`);
  }
  
  function drawUnit(unit) {
    console.log(`Drawing unit ${unit.id} at (${unit.x}, ${unit.y})`);
  }
  
  // Utility Functions
  function isKeyPressed(key) {
    // Placeholder for key input handling
    return false;
  }
  
  // Start Game
  onStart();
  