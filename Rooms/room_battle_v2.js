import { Level } from "../GameForgeJS/Template/Level.js";
import { Screen } from "../GameForgeJS/Window/Screen.js";
import { Draw } from "../GameForgeJS/Graphic/Draw.js";
import { Kocytos } from "../Objects/Kocytos.js";
import { Store } from "../GameForgeJS/Root/Store.js";
import { MACHINE_WORLD, MACHINE_BATTLE, MACHINE_TURN } from "../Enums/machine_state.js";
import { Vegas } from "../Objects/Enemies/Vegas.js";
import { MenuBattle } from "../Battle/menu_battle.js";
import { Input } from "../GameForgeJS/Input/Input.js";
import { KeyCode } from "../GameForgeJS/Input/KeyCode.js";
import { MapBattle } from "../Battle/map_battle.js";
import { CursorBattle } from "../Battle/cursor_battle.js";

// Enum for sprite positions
const SPRITE_POSITIONS = Object.freeze({
	DOWN: 0,
	LEFT: 1,
	RIGHT: 2,
	UP: 3
});

// Enum for different types of cells in the map
const TYPE_CELL = Object.freeze({
	WALKABLE: 0,
	ALLY: 1,
	ENEMY: 2,
	OBSTACLE: 3
});

export class Battle extends Level {
	constructor() {
		super();
		this.caption = "Battle Test";
		this.LEVEL_HANDLER = this;

		// Initialize state machines
		this.current_world_state = MACHINE_WORLD.BATTLE;
		this.current_battle_state = MACHINE_BATTLE.IDLE;
	}

	OnStart() {
		super.OnStart();
		console.log("Battle Test Level Started");

		// Initialize screen and drawing utilities
		this.TelaId = "BattleTest";
		this.screen = new Screen(this.TelaId, 640, 480);
		this.draw = new Draw(this.screen);

		// Initialize battle map and cursor
		this.tbs_map = new MapBattle(this.screen);
		this.tbs_map.OnStart();
		this.tbs_cursor = new CursorBattle("../Assets/Battle Resources/battle_cursor.png", 0, 0);

		// Initialize players and enemies
		this.InitializePlayers();
		this.InitializeEnemies();

		// Determine who starts the battle
		this.current_turn_state = this.GetFirstTurn();
		this.turn_counter = 1;

		// Set cursor to initial position based on turn
		let current = this.CheckTurnToPlaceCursor();
		this.tbs_cursor.SetPostion(current.x, current.y);

		// Initialize battle menu
		let options = ["Attack", "Defend", "Move", "Item", "Pass", "Run"];
		let menu_size = { x: 100, y: 80, w: 64, h: 104 };
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
		const turns = Object.keys(MACHINE_TURN);
		return MACHINE_TURN[turns[Math.floor(Math.random() * turns.length)]];
	}

	InitializePlayers() {
		let store = new Store();
		let player_temp = store.RestoreState('player');
		const player = new Kocytos(this.screen, 50, 100);
		Object.assign(player, {
			name: player_temp.name,
			Tag: player_temp.Tag,
			max_move: player_temp.max_move,
			size: player_temp.size,
			game_state: this.current_world_state,
			spritePositions: SPRITE_POSITIONS.RIGHT,
			levelData: { x: player_temp.x, y: player_temp.y }
		});
		this.AddEntity(player);
	}

	InitializeEnemies() {
		const enemy = new Vegas(this.screen, 700, 100);
		enemy.spritePositions = SPRITE_POSITIONS.LEFT;
		this.AddEntity(enemy);
	}

	OnUpdate() {
		super.OnUpdate();
		if (this.current_turn_state == MACHINE_TURN.PLAYER) {
			this.HandlePlayerTurn();
		} else {
			this.GetActionEnemy();
		}
	}

	HandlePlayerTurn() {
		switch (this.current_battle_state) {
			case MACHINE_BATTLE.IDLE:
				this.battle_menu.OnUpdate();
				this.current_battle_state = this.battle_menu.choosed_option;
				console.log(this.current_battle_state);
				break;
			case MACHINE_BATTLE.ATTACK:
				// Handle attack logic
				break;
			case MACHINE_BATTLE.DEFEND:
				// Handle defend logic
				break;
			case MACHINE_BATTLE.MOVE:
				this.HandleCursor();
				break;
			case MACHINE_BATTLE.ITEM:
				// Handle item logic
				break;
			case MACHINE_BATTLE.PASS:
				this.PerformPass();
				break;
			case MACHINE_BATTLE.RUN:
				this.HandleRun();
				break;
		}
	}

	HandleRun() {
		if (this.CheckRunChance()) {
			console.log("Player successfully ran away!");
			this.screen.Clear();
			this.LevelHandler.LoadLevel("PreviousLevelName"); // Replace with actual implementation
		} else {
			console.log("Failed to run away!");
			this.PerformPass();
		}
	}

	PerformPass() {
		this.current_battle_state = MACHINE_BATTLE.IDLE;
		this.current_turn_state = this.current_turn_state == MACHINE_TURN.PLAYER ? MACHINE_TURN.ENEMY : MACHINE_TURN.PLAYER;
		this.turn_counter++;
	}

	CheckRunChance() {
		let player = this.GetEntityByName("Kocytos");
		let enemy = this.GetEntityByName("Vegas");
		return player.agility >= Math.ceil(Math.random() * enemy.agility);
	}

	GetActionEnemy() {
		const actions = [MACHINE_BATTLE.ATTACK, MACHINE_BATTLE.DEFEND, MACHINE_BATTLE.PASS];
		this.current_battle_state = actions[Math.floor(Math.random() * actions.length)];

		switch (this.current_battle_state) {
			case MACHINE_BATTLE.ATTACK:
				console.log("Enemy attacks!");
				break;
			case MACHINE_BATTLE.DEFEND:
				console.log("Enemy defends!");
				break;
			case MACHINE_BATTLE.PASS:
				console.log("Enemy passes!");
				this.PerformPass();
				break;
		}
	}

	OnFixedUpdate(deltaTime) {
		super.OnFixedUpdate(deltaTime);
	}

	OnGUI() {
		this.ShowFPS(this.draw, 750, 20);
		this.draw.Color = "white";
		this.draw.DrawText(`Turn Counter: ${this.turn_counter}`, 16, 16);
		super.OnGUI();
	}

	OnDrawn() {
		console.log("Current Battle: " + this.current_battle_state);
		this.screen.Refresh();
		if (this.current_battle_state == MACHINE_BATTLE.IDLE) {
			this.battle_menu.OnDrawn();
		} else if (this.current_battle_state == MACHINE_BATTLE.MOVE) {
			this.draw.DrawSprite(this.tbs_cursor.spr, this.tbs_cursor.x, this.tbs_cursor.y);
			let player = this.GetEntityByName("Kocytos");
			this.DrawMovementRange(player);
		}
		super.OnDrawn();
	}

	HandleCursor() {
		let dir = {
			negative_x: -1, positive_x: 1,
			negative_y: -1, positive_y: 1,
		};
		if (Input.GetKey(KeyCode.A)) {
			this.tbs_cursor.SetPostion(this.tbs_cursor.x + dir.negative_x * this.tbs_map.cellSizeX, this.tbs_cursor.y);
		} else if (Input.GetKey(KeyCode.D)) {
			this.tbs_cursor.SetPostion(this.tbs_cursor.x + dir.positive_x * this.tbs_map.cellSizeX, this.tbs_cursor.y);
		} else if (Input.GetKey(KeyCode.W)) {
			this.tbs_cursor.SetPostion(this.tbs_cursor.x, this.tbs_cursor.y + dir.negative_y * this.tbs_map.cellSizeY);
		} else if (Input.GetKey(KeyCode.S)) {
			this.tbs_cursor.SetPostion(this.tbs_cursor.x, this.tbs_cursor.y + dir.positive_y * this.tbs_map.cellSizeY);
		}

		if (Input.GetKeyUp(KeyCode.E)) {
			this.CheckAvailable();
		}
	}

	SelectUnit(position) {
		let selectedUnit = this.entities.find((entity) => entity.position.x === position.x && entity.position.y === position.y);
		if (selectedUnit) {
			this.current_turn_state = MACHINE_BATTLE.MOVE;
			this.CalculateMovementRange(selectedUnit);
		}
	}

	CalculateMovementRange(unit) {
		let movementRange = [];
		const visited = new Set();

		const DFS = (x, y, steps) => {
			if (steps > unit.max_move || visited.has(`${x},${y}`)) return;
			visited.add(`${x},${y}`);
			movementRange.push({ x, y });

			for (const dir of Directions) {
				const nx = x + dir.x;
				const ny = y + dir.y;
				if (this.isWalkable(nx, ny)) DFS(nx, ny, steps + 1);
			}
		};

		DFS(unit.x, unit.y, 0);
	}

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

	isWalkable(x, y) {
		return map[y] && map[y][x] && map[y][x].type === TYPE_CELL.WALKABLE;
	}

	isValidTile(x, y) {
		return map[y] && map[y][x];
	}

	isPossibleMove() {
		let pos = this.tbs_cursor.GetPosition();
		return this.tbs_map.map[pos.x / this.tbs_map.cellSizeX][pos.y / this.tbs_map.cellSizeY] === TYPE_CELL.WALKABLE;
	}

	isPossibleAttack(type) {
		let pos = this.tbs_cursor.GetPosition();
		return this.tbs_map.map[pos.x / this.tbs_map.cellSizeX][pos.y / this.tbs_map.cellSizeY] === type;
	}

	DrawCell(x, y, size, color) {
		this.draw.Color = color;
		this.draw.DrawRect(x, y, size, size);
		this.draw.Color = "white";
	}

	DrawMovementRange(object) {
		const startX = object.position.x - object.max_move * 32;
		const startY = object.position.y - object.max_move * 32;
		const endX = object.position.x + object.max_move * 32;
		const endY = object.position.y + object.max_move * 32;

		for (let i = startX; i <= endX; i += 32) {
			for (let j = startY; j <= endY; j += 32) {
				const dist = Math.abs(object.position.x - i) + Math.abs(object.position.y - j);
				if (dist <= object.max_move * 32) {
					this.DrawCell(i, j, 32, "rgba(0, 160, 0, 0.5)");
				}
			}
		}
	}
}
