import { Level } from "../GameForgeJS/Template/Level.js";
import { Screen } from "../GameForgeJS/Window/Screen.js";
import { Draw } from "../GameForgeJS/Graphic/Draw.js";
import { Kocytos } from "../Objects/Kocytos.js";
import { Store } from "../GameForgeJS/Root/Store.js";

// Machines State
import { MACHINE_WORLD, MACHINE_BATTLE, MACHINE_TURN } from "../Enums/machine_state.js";
import { Vegas } from "../Objects/Enemies/Vegas.js";
import { MenuBattle } from "../Battle/menu_battle.js";
import { Input } from "../GameForgeJS/Input/Input.js";
import { KeyCode } from "../GameForgeJS/Input/KeyCode.js";
import { MapBattle } from "../Battle/map_battle.js";
import { CursorBattle } from "../Battle/cursor_battle.js";

// Sprite positions enum
const SPRITE_POSITIONS = Object.freeze({
	DOWN: 0,
	LEFT: 1,
	RIGHT: 2,
	UP: 3
});

// Type of possible things in map
const TYPE_CELL = Object.freeze({
	WALKABLE: 0,
	ALLY: 1,
	ENEMY: 2,
	OBJSTACLE: 3
});

export class Battle extends Level {
	constructor() {
		super();
		this.caption = "Battle Test";
		this.LEVEL_HANDLER = this;

		// Start machines
		this.current_world_state = MACHINE_WORLD.BATTLE;
		this.current_battle_state = MACHINE_BATTLE.IDLE;
	}

	OnStart() {
		// Call the parent method implementation
		super.OnStart();

		// Warning battle room ready
		console.log("Battle Test Level Started");

		// Screen
		this.TelaId = "BattleTest";
		this.screen = new Screen(this.TelaId, 640, 480);

		// Create a Draw object
		this.draw = new Draw(this.screen);

		// Creating TBS map
		this.tbs_map = new MapBattle(this.screen);
		this.tbs_map.OnStart();

		// Initializing the cursor position
		this.tbs_cursor = new CursorBattle("../Assets/Battle Resources/battle_cursor.png", 0, 0);

		// Restore the player state
		this.InitializePlayers();

		// Get who starts the battle
		this.current_turn_state = this.GetFirstTurn();

		// Turn couter
		this.turn_counter = 1;

		// Generate enemies in fight
		this.InitializeEnemies();

		// Set cursor to position current turn. Based on which turn is.
		let current = this.CheckTurnToPlaceCursor();

		// Set the inicial cursor position
		this.tbs_cursor.SetPostion(current.x, current.y);

		// TODO: I've to pay atention to it
		// Choose menu window 
		let options = new Array("Attack", "Defend", "Move", "Item", "Pass", "Run");
		let menu_size = { x: 100, y: 80, w: 64, h: 104 }; // Menu size
		this.battle_menu = new MenuBattle(this.draw, menu_size.x, menu_size.y, menu_size.w, menu_size.h, options);
		this.battle_menu.OnStart();
	}

	CheckTurnToPlaceCursor() {
		if (this.current_turn_state == MACHINE_TURN.ENEMY) {
			return this.GetEntityByName("Vegas");
		}
		return this.GetEntityByName("Kocytos");
	}

	GetFirstTurn() {
		return MACHINE_TURN[Object.keys(MACHINE_TURN)[Math.floor(Math.random() * Object.keys(MACHINE_TURN).length)]]; // Random turn
	}

	InitializePlayers() {
		// Create a Store object
		let store = new Store();
		// Loading Player Informations
		let player_temp = store.RestoreState('player');
		// Setting Player
		const player = new Kocytos(this.screen, 50, 100);
		player.name = player_temp.name;
		player.Tag = player_temp.Tag;
		player.max_move = player_temp.max_move;
		player.size = player_temp.size;
		player.game_state = this.current_world_state;
		player.spritePositions = SPRITE_POSITIONS.RIGHT;
		// Saving the last position of the player
		player.levelData.x = player_temp.x;
		player.levelData.y = player_temp.y;
		// Add a player entity to the level
		this.AddEntity(player);
	}

	InitializeEnemies() {
		// Create a new enemy
		const enemy = new Vegas(this.screen, 700, 100);
		enemy.spritePositions = SPRITE_POSITIONS.LEFT;
		// Add an enemy entity to the level
		this.AddEntity(enemy);
	}

	OnUpdate() {
		super.OnUpdate();
		if (this.current_turn_state == MACHINE_TURN.PLAYER) {
			switch (this.current_battle_state) {
				case MACHINE_BATTLE.IDLE:
					this.battle_menu.OnUpdate();
					this.current_battle_state = this.battle_menu.choosed_option;
					console.log(this.current_battle_state);
					break;
				case MACHINE_BATTLE.ATTACK:

					break;
				case MACHINE_BATTLE.DEFEND:

					break;
				case MACHINE_BATTLE.MOVE:
					this.HandleCursor();
					break;
				case MACHINE_BATTLE.ITEM:
					// Code for inventary stay here
					break;
				case MACHINE_BATTLE.PASS:
					this.PerformPass();
					break;
				case MACHINE_BATTLE.RUN:
					if (this.CheckRunChance()) {
						console.log("Player successfully ran away!");
						this.screen.Clear();
						// Navigate back to the previous level or menu
						this.LevelHandler.LoadLevel("PreviousLevelName"); // Replace with actual implementation
					} else {
						console.log("Failed to run away!");
						this.PerformPass();
					}
					break;
			}
		} else {
			this.GetActionEnemy();
		}
	}

	PerformPass() {
		if (this.current_turn_state == MACHINE_TURN.PLAYER) {
			this.current_battle_state = MACHINE_BATTLE.IDLE;
			this.current_turn_state = MACHINE_TURN.ENEMY;
		} else {
			this.current_battle_state = MACHINE_BATTLE.IDLE;
			this.current_turn_state = MACHINE_TURN.PLAYER;
		}
		this.turn_counter++;
	}

	CheckRunChance() {
		let player = this.GetEntityByName("Kocytos");
		let enemy = this.GetEntityByName("Vegas");
		return player.agility >= Math.ceil(Math.random() * enemy.agility);
	}

	// Generic function to make enemy pass
	GetActionEnemy() {
		const actions = [MACHINE_BATTLE.ATTACK, MACHINE_BATTLE.DEFEND, MACHINE_BATTLE.PASS];
		this.current_battle_state = actions[Math.floor(Math.random() * actions.length)];

		switch (this.current_battle_state) {
			case MACHINE_BATTLE.ATTACK:
				// Perform attack logic here
				console.log("Enemy attacks!");
				break;
			case MACHINE_BATTLE.DEFEND:
				// Perform defend logic here
				console.log("Enemy defends!");
				break;
			case MACHINE_BATTLE.PASS:
				console.log("Enemy passes!");
				this.PerformPass();
				break;
		}
	}


	OnFixedUpdate(deltaTime) {
		// Update entities OnFixedUpdate
		super.OnFixedUpdate(deltaTime);
	}

	OnGUI() {
		// Draw FPS
		this.ShowFPS(this.draw, 750, 20);

		// Turn Counter
		this.draw.Color = "white";
		this.draw.DrawText(`Turn Couter: ${this.turn_counter}`, 16, 16);

		// Update entities OnGUI
		super.OnGUI();
	}

	OnDrawn() {
		console.log("Current Battle: " + this.current_battle_state);
		// Refresh screen
		this.screen.Refresh();
		if (this.current_battle_state == MACHINE_BATTLE.IDLE) {
			// Draw battle menu
			this.battle_menu.OnDrawn();
		} else if (this.current_battle_state == MACHINE_BATTLE.MOVE) {
			this.draw.DrawSprite(this.tbs_cursor.spr, this.tbs_cursor.x, this.tbs_cursor.y);
			let player = this.GetEntityByName("Kocytos");
			this.DrawMovementRange(player);
		};
		super.OnDrawn();
	}

	HandleCursor() {
		let dir = {
			negative_x: -1, positive_x: 1,
			negative_y: -1, positive_y: 1,
		}
		if (Input.GetKey(KeyCode.A)) {
			this.tbs_cursor.SetPostion(dir.negative_x * this.tbs_map.cellSizeX, this.tbs_cursor.y);
		} else if (Input.GetKey(KeyCode.D)) {
			this.tbs_cursor.SetPostion(dir.positive_x * this.tbs_map.cellSizeX, this.tbs_cursor.y);
		} else if (Input.GetKey(KeyCode.W)) {
			this.tbs_cursor.SetPostion(this.tbs_cursor.x, dir.negative_y * this.tbs_map.cellSizey);
		} else if (Input.GetKey(KeyCode.S)) {
			this.tbs_cursor.SetPostion(this.tbs_cursor.x, dir.positive_y * this.tbs_map.cellSizey);
		}

		if (Input.GetKeyUp(KeyCode.E)) {
			this.CheckAvailable();
		}
	}


	/**
	 * Selects a unit based on the given position and updates the current turn state.
	 * If a unit is found at the specified position, it sets the current turn state to MOVE
	 * and calculates the movement range for the selected unit.
	 *
	 * @param {Object} position - The position to select the unit from.
	 * @param {number} position.x - The x-coordinate of the position.
	 * @param {number} position.y - The y-coordinate of the position.
	 */
	SelectUnit(position) {
		let selectedUnit = this.entities.find((entity) => entity.position.x === position.x && entity.position.y === position.y);
		if (selectedUnit) {
			this.current_turn_state = MACHINE_BATTLE.MOVE;
			CalculateMovementRange(selectedUnit);
		}
	}

	/**
	 * Calculates the movement range of a unit using Depth-First Search (DFS) algorithm.
	 *
	 * @param {Object} unit - The unit for which to calculate the movement range.
	 * @param {number} unit.x - The x-coordinate of the unit.
	 * @param {number} unit.y - The y-coordinate of the unit.
	 * @param {number} unit.movement - The maximum number of steps the unit can move.
	 * @returns {void}
	 */
	CalculateMovementRange(unit) {
		let movementRange = []; // Clear previous range
		const visited = new Set();

		/**
		 * Depth-First Search (DFS) algorithm to determine the movement range of a unit.
		 *
		 * @param {number} x - The current x-coordinate.
		 * @param {number} y - The current y-coordinate.
		 * @param {number} steps - The number of steps taken so far.
		 * @returns {void}
		 */
		function DFS(x, y, steps) {
			if (steps > unit.max_move || visited.has(`${x},${y}`)) return;
			visited.add(`${x},${y}`);
			movementRange.push({ x, y });

			for (const dir of Directions) {
				const nx = x + dir.x;
				const ny = y + dir.y;
				if (this.isWalkable(nx, ny)) DFS(nx, ny, steps + 1);
			}
		}

		DFS(unit.x, unit.y, 0);
	}

	/**
	 * Calculates the attack range for a given unit.
	 *
	 * @param {Object} unit - The unit for which to calculate the attack range.
	 * @param {number} unit.x - The x-coordinate of the unit.
	 * @param {number} unit.y - The y-coordinate of the unit.
	 * @param {number} unit.attackRange - The attack range of the unit.
	 * @returns {Array<Object>} An array of objects representing the coordinates within the unit's attack range.
	 * Each object contains the properties:
	 *   - {number} x: The x-coordinate within the attack range.
	 *   - {number} y: The y-coordinate within the attack range.
	 */
	CalculateAttackRange(unit) {
		const range = [];
		for (let dx = -unit.attackRange; dx <= unit.attackRange; dx++) {
			for (let dy = -unit.attackRange; dy <= unit.attackRange; dy++) {
				const x = unit.x + dx;
				const y = unit.y + dy;
				if (Math.abs(dx) + Math.abs(dy) <= unit.attackRange && this.isValidTile(x, y)) {
					range.push({ x, y });
				}
			}
		}
		return range;
	}

	/**
	 * Checks if the tile at the given coordinates is walkable.
	 *
	 * @param {number} x - The x-coordinate of the tile.
	 * @param {number} y - The y-coordinate of the tile.
	 * @returns {boolean} - Returns true if the tile is walkable, otherwise false.
	 */
	isWalkable(x, y) {
		return map[y] && map[y][x] && map[y][x].type === TileType.WALKABLE;
	}

	/**
	 * Checks if the tile at the given coordinates is valid.
	 *
	 * @param {number} x - The x-coordinate of the tile.
	 * @param {number} y - The y-coordinate of the tile.
	 * @returns {boolean} - Returns true if the tile is valid, otherwise false.
	 */
	isValidTile(x, y) {
		return map[y] && map[y][x];
	}

	/**
	 * Determines if the current position of the cursor is a possible move.
	 *
	 * @returns {boolean} True if the current position is walkable, otherwise false.
	 */
	isPossibleMove() {
		let pos = this.tbs_cursor.GetPosition();
		if (this.tbs_map.map[pos.x / this.tbs_map.cellSizeX, pos.y / this.tbs_map.cellSizeY] == TYPE_CELL.WALKABLE) {
			return true;
		};
		// If possible return true
		return false;
	}

	/**
	 * Determines if the current position of the cursor is a possible attack.
	 *
	 * @param {number} type - The type of cell to check for attack possibility.
	 * @returns {boolean} True if the current position is of the specified type, otherwise false.
	 */
	isPossibleAttack(type) {
		let pos = this.tbs_cursor.GetPosition();
		if (this.tbs_map.map[pos.x / this.tbs_map.cellSizeX, pos.y / this.tbs_map.cellSizeY] == type) {
			return true;
		};
		// If possible return true
		return false;
	}

	/*
	* Draw a cell with a specific color
	* @param {number} x - The x position of the cell.
	* @param {number} y - The y position of the cell.
	* @param {number} size - The size of the cell.
	* @param {string} color - The color of the cell.
	* @returns {void} 
	*/
	DrawCell(x, y, size, color) {
		this.draw.Color = color;
		this.draw.DrawRect(x, y, size, size);
		this.draw.Color = "white";
	}

	/*
	* Draw the movement range of an object
	* @param {Object} object - The object to draw the movement range for.
	* @returns {void}
	* @example
	* this.DrawMovementRange(player);
	* @description
	* This function draws the movement range of an object.
	* It calculates the Manhattan distance from the object position
	* and draws a cell if the distance is less than or equal to the max_move.
	*/
	DrawMovementRange(object) {
		const startX = object.position.x - object.max_move * 32; // Multiply by cell size
		const startY = object.position.y - object.max_move * 32; // Multiply by cell size
		const endX = object.position.x + object.max_move * 32; // Multiply by cell size
		const endY = object.position.y + object.max_move * 32; // Multiply by cell size

		for (let i = startX; i <= endX; i += 32) {
			for (let j = startY - 32; j <= endY; j += 32) {
				// Calculate the distance from the object position
				const dist = Math.abs(object.position.x - i) + Math.abs(object.position.y - j);

				// If within movement range (Manhattan distance)
				if (dist <= object.max_move * 32) { // Multiply max_move by cell size
					this.DrawCell(i, j, 32, "rgba(0, 160, 0, 0.5)");
				}
			}
		}
	}
}