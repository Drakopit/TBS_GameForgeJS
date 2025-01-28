import { Base } from "../GameForgeJS/Root/Base.js";
import { MapBattle } from "./map_battle.js";
import { PriorityQueue } from "../GameForgeJS/Root/DataStructures.js";

const TYPE_CELL = Object.freeze({
	WALKABLE: 0,
	OBSTACLE: 1
});

const SPRITE_POSITIONS = Object.freeze({
	DOWN: 0,
	LEFT: 1,
	RIGHT: 2,
	UP: 3
});

export class ManageTBSAction extends Base {
	constructor(screen, draw) {
		super();
		this.screen = screen;
		this.draw = draw;
		this.map = new MapBattle(screen);
		this.GRID_WIDTH = this.map.width;
		this.GRID_HEIGHT = this.map.height;
		this.MOVE_SPEED = 0.05;
		this.path = [];
		this.moving = false;
		this.moveIndex = 0;
		this.Directions = [
			{ x: 0, y: -1 },
			{ x: 0, y: 1 },
			{ x: -1, y: 0 },
			{ x: 1, y: 0 }
		];
		this.selected = false;
		this.unit = null;
		this.cellSize = 32;
	}

	OnStart() {
		this.map.OnStart();
		this.cellSize = this.map.cellSizex || 32;
	}

	SelectUnit(position, entities) {
		this.unit = entities.find(
			entity => entity.position.x === position.x && entity.position.y === position.y
		);
		this.selected = !!this.unit;
		return { selected: this.selected, unit: this.unit };
	}

	MoveToCell(position) {
		if (!this.unit) return;
		if (this.isWalkable(position.x / this.cellSize, position.y / this.cellSize)) {
			console.log('MoveToCell', position);
			this.path = this.aStar(this.unit.x, this.unit.y, position.x, position.y);
			this.moving = this.path.length > 0;
			this.moveIndex = 0;
		}
	}

	aStar(startX, startY, goalX, goalY) {
		const openSet = new PriorityQueue();
		const closedSet = new Set();
		const cameFrom = {};
		const gScore = {};
		const fScore = {};

		const startKey = `${startX},${startY}`;
		const goalKey = `${goalX},${goalY}`;

		openSet.enqueue({ x: startX, y: startY }, 0);
		gScore[startKey] = 0;
		fScore[startKey] = this.Heuristic(startX, startY, goalX, goalY);

		while (!openSet.isEmpty()) {
			const current = openSet.dequeue().element;
			const currentKey = `${current.x},${current.y}`;

			if (currentKey === goalKey) {
				const path = [];
				let temp = current;
				while (cameFrom[`${temp.x},${temp.y}`]) {
					path.push(temp);
					temp = cameFrom[`${temp.x},${temp.y}`];
				}
				path.reverse();
				return path;
			}

			closedSet.add(currentKey);

			this.Directions.forEach(dir => {
				const neighbor = { x: current.x + dir.x, y: current.y + dir.y };
				const neighborKey = `${neighbor.x},${neighbor.y}`;

				if (!this.isValidPosition(neighbor.x, neighbor.y) || closedSet.has(neighborKey)) {
					return;
				}

				const tentativeGScore = gScore[currentKey] + 1;

				if (!openSet.has(neighbor) || tentativeGScore < gScore[neighborKey]) {
					cameFrom[neighborKey] = current;
					gScore[neighborKey] = tentativeGScore;
					fScore[neighborKey] = tentativeGScore + this.Heuristic(neighbor.x, neighbor.y, goalX, goalY);

					if (!openSet.has(neighbor)) {
						openSet.enqueue(neighbor, fScore[neighborKey]);
					}
				}
			});
		}

		return [];
	}

	Heuristic(x1, y1, x2, y2) {
		return Math.abs(x1 - x2) + Math.abs(y1 - y2);
	}

	isValidPosition(x, y) {
		return x >= 0 && x < this.GRID_WIDTH && y >= 0 && y < this.GRID_HEIGHT;
	}

	isWalkable(x, y) {
		return this.isValidTile(x, y) && this.map[y][x].type === TYPE_CELL.WALKABLE;
	}

	isValidTile(x, y) {
		return x >= 0 && x < this.GRID_WIDTH && y >= 0 && y < this.GRID_HEIGHT && this.map[y]?.[x];
	}

	Walk() {
		if (this.moving && this.path.length > 0) {
			const target = this.path[this.moveIndex];
			const dx = target.x * this.cellSize - this.unit.x * this.cellSize;
			const dy = target.y * this.cellSize - this.unit.y * this.cellSize;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < this.MOVE_SPEED) {
				this.unit.x = target.x;
				this.unit.y = target.y;
				this.moveIndex++;
				if (this.moveIndex >= this.path.length) {
					this.moving = false;
					this.path = [];
				}
			} else {
				this.unit.x += (dx / distance) * this.MOVE_SPEED;
				this.unit.y += (dy / distance) * this.MOVE_SPEED;
			}

			if (dx > 0) this.unit.spritePos = SPRITE_POSITIONS.RIGHT;
			else if (dx < 0) this.unit.spritePos = SPRITE_POSITIONS.LEFT;
			else if (dy > 0) this.unit.spritePos = SPRITE_POSITIONS.DOWN;
			else if (dy < 0) this.unit.spritePos = SPRITE_POSITIONS.UP;
		}
	}

    CalculateMovementRange(unit) {
		let movementRange = [];
		const visited = new Set();

		const DFS = (x, y, steps) => {
			if (steps > unit.max_move || visited.has(`${x},${y}`)) return;
			visited.add(`${x},${y}`);
			movementRange.push({ x, y });

			for (const dir of this.Directions) {
				const nx = x + dir.x;
				const ny = y + dir.y;
				if (this.isWalkable(nx, ny)) DFS(nx, ny, steps + 1);
			}
		};

		DFS(unit.x, unit.y, 0);
		return movementRange;
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

	DrawCell(x, y, size, color) {
		this.draw.Color = color;
		this.draw.DrawRect(x, y, size, size);
		this.draw.Color = "white";
	}

	DrawMovementRange(object) {
		const cellSize = this.cellSize; // Ensure cellSize is consistent
		const startX = object.position.x - object.max_move * cellSize;
		const startY = object.position.y - object.max_move * cellSize;
		const endX = object.position.x + object.max_move * cellSize;
		const endY = object.position.y + object.max_move * cellSize;

		for (let i = startX; i <= endX; i += cellSize) {
			for (let j = startY; j <= endY; j += cellSize) {
				const dist = Math.abs(object.position.x - i) + Math.abs(object.position.y - j);
				if (dist <= object.max_move * cellSize) {
					this.DrawCell(i, j, cellSize, "rgba(0, 160, 0, 0.5)");
				}
			}
		}
	}
}