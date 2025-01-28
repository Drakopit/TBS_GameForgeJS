import { Base } from "../GameForgeJS/Root/Base.js";
import { MACHINE_WORLD, MACHINE_BATTLE, MACHINE_TURN } from "../Enums/machine_state.js";
import { ManageTBSAction } from "./manage_tbs_action.js";
import { MenuBattle } from "./menu_battle.js";
import { CursorBattle } from "./cursor_battle.js";
import { Input } from "../GameForgeJS/Input/Input.js";
import { KeyCode } from "../GameForgeJS/Input/KeyCode.js";
import { Store } from "../GameForgeJS/Root/Store.js";
import { Kocytos } from "../Objects/Kocytos.js";
import { Vegas } from "../Objects/Enemies/Vegas.js";
import { GameObject } from "../GameForgeJS/Root/GameObject.js";
import { Vector2D } from "../GameForgeJS/Math/Vector2D.js";

const SPRITE_POSITIONS = Object.freeze({
	DOWN: 0,
	LEFT: 1,
	RIGHT: 2,
	UP: 3
});

const CELL_SIZE = 32;

export class ManageBattleActions extends Base {
    constructor(screen, draw, sprite) {
        super();
        this.screen = screen;
        this.draw = draw;
        this.sprite = sprite;
        this.entities = [];
        this.moving = false;
    }

    OnStart() {
        // TBS Actions
        this.manage_tbs_actions = new ManageTBSAction(this.screen, this.draw);
        this.manage_tbs_actions.OnStart();

        // Mini menu
        let options = ["Attack", "Defend", "Move", "Item", "Pass", "Run"];
        let menu_size = { x: 100, y: 80, w: 64, h: 104 };
        this.battle_menu = new MenuBattle(this.draw, menu_size.x, menu_size.y, menu_size.w, menu_size.h, options);
        this.battle_menu.OnStart();

        // Initialize battle map and cursor
        // TODO: In this moment I'll put in the middle of the screem with magic numbers
        this.tbs_cursor = new CursorBattle("../Assets/Battle Resources/battle_cursor.png", new Vector2D(CELL_SIZE, CELL_SIZE), new Vector2D(256, 256));

        // Turn counter
        this.turn_counter = 1;

        // Initialize players and enemies
		this.initPlayers();
		this.initEnemies();

		// Determine who starts the battle
		this.current_turn_state = this.firstTurn(MACHINE_TURN);
        // Initialize state machines
		this.current_world_state = MACHINE_WORLD.BATTLE;
		this.current_battle_state = MACHINE_BATTLE.IDLE;

    }

    OnUpdate() {
        this.handleUpdate();
        this.handlePlayerActions();
        this.handleEnemyActions();
    }

    OnDrawn() {
        this.ShowTurnCounter();
        this.handleDraw();
        this.entities.forEach(entity => entity.OnDrawn());    
    }

    ShowTurnCounter() {
        this.draw.Color = "white";
		this.draw.DrawText(`Turn Counter: ${this.turn_counter}`, 8, 16);
    }

    AddEntity(entity) {
        this.entities.push(entity);
    }
}

//#region Init
ManageBattleActions.prototype.initPlayers = function() {
    let store = new Store();
    let player_temp = store.RestoreState('player');
    const player = new Kocytos(this.screen, 64, 96);
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

ManageBattleActions.prototype.initEnemies = function() {
    const enemy = new Vegas(this.screen, 704, 96);
    enemy.spritePositions = SPRITE_POSITIONS.LEFT;
    this.AddEntity(enemy);
}
//#endregion

//#region Handles Ally
ManageBattleActions.prototype.handlePlayerActions = function() {
    switch (this.current_battle_state) {
        case MACHINE_BATTLE.IDLE:
            this.handleIdle();
        break;
        
        case MACHINE_BATTLE.ATTACK:
            this.handleAttack();
        break;
        
        case MACHINE_BATTLE.DEFEND:
            this.handleDefend();
        break;
        
        case MACHINE_BATTLE.MOVE:
            this.handleMove();
        break;
        
        case MACHINE_BATTLE.ITEM:
            this.handleItem();
        break;
        
        case MACHINE_BATTLE.PASS:
            this.handlePass();
        break;
        
        case MACHINE_BATTLE.RUN:
            this.handleRun();
        break;
    }
}

ManageBattleActions.prototype.handleIdle = function() {
    // Only shows menu when someone was choosed
    if (this.manage_tbs_actions.unit instanceof GameObject) {
        this.battle_menu.OnUpdate();
        if (this.battle_menu.choosed_option) {
            this.current_battle_state = this.battle_menu.choosed_option;
        }
    }
}

ManageBattleActions.prototype.handleMove = function() {
    this.manage_tbs_actions.CalculateMovementRange(this.manage_tbs_actions.unit);
}

// TODO: I've to check this method
ManageBattleActions.prototype.handleRun = function() {
    if (this.CheckRunChance()) {
        console.log("Player successfully ran away!");
        this.screen.Clear();
        this.LevelHandler.loadLevel("PreviousLevelName"); // Replace with actual implementation
    } else {
        console.log("Failed to run away!");
        this.PerformPass();
    }
}

ManageBattleActions.prototype.handlePass = function() {
    // Chekc who passed the turn
    this.current_turn_state = this.current_turn_state == MACHINE_TURN.PLAYER ? MACHINE_TURN.ENEMY : MACHINE_TURN.PLAYER;
    // Set to default menu battle position
    this.current_battle_state = MACHINE_BATTLE.IDLE;
    // Add more one turn
    this.turn_counter++;
}

ManageBattleActions.prototype.handleItem = function() {
    // Code goes here
}

ManageBattleActions.prototype.handleDefend = function() {
    // Code goes here
}

ManageBattleActions.prototype.handleAttack = function() {
    // Code goes here
}

ManageBattleActions.prototype.handleCursor = function() {
    /* S */if (Input.GetKeyUp(KeyCode.A)) {
        this.tbs_cursor.x -= CELL_SIZE;
    } else if (Input.GetKeyUp(KeyCode.D)) {
        this.tbs_cursor.x += CELL_SIZE;
    } else if (Input.GetKeyUp(KeyCode.W)) {
        this.tbs_cursor.y -= CELL_SIZE;
    } else if (Input.GetKeyUp(KeyCode.S)) {
        this.tbs_cursor.y += CELL_SIZE;
    }

    if (Input.GetKeyUp(KeyCode.E)) {
        switch (this.current_battle_state) {
            case MACHINE_BATTLE.IDLE:
                // Try select a unit to make something
                this.manage_tbs_actions.SelectUnit(this.tbs_cursor.GetPosition(), this.entities);
            break;
            case MACHINE_BATTLE.MOVE:
                if (this.moving === false) {
                    this.manage_tbs_actions.MoveToCell(this.tbs_cursor.GetPosition());
                    this.manage_tbs_actions.Walk();    
                }
            break;
            case MACHINE_BATTLE.ATTACK:
                console.log("attacking");
                // Code goes here
            break;
        }
    }
}

ManageBattleActions.prototype.handleUpdate = function() {
    // Cursor Always appear. Except when player is choosing
    if (!(this.manage_tbs_actions.unit instanceof GameObject) || this.current_battle_state == MACHINE_BATTLE.MOVE) {
        this.handleCursor();
    }
    
    if (this.current_turn_state == MACHINE_TURN.PLAYER) {
        this.handlePlayerActions();
    } else {
        this.handleEnemyActions();
    }
}
ManageBattleActions.prototype.handleDraw = function() {
    // State
    let state = ["ATTACK", "DEFEND", "MOVE", "ITEM", "PASS", "RUN"];
    console.log("Battle State: ", state[this.current_battle_state]);
    this.draw.DrawText(`Battle State: ${state[this.current_battle_state]}`, 128, 0);
    // Draws x and y cursosr position
    this.draw.DrawText(`Cursor Pos: ${this.tbs_cursor.x}, ${this.tbs_cursor.y}`, 128, 16);
    // It's the cursor sprite
    this.sprite.Stretched(this.tbs_cursor.sprite, this.tbs_cursor.GetPosition(), this.tbs_cursor.size);
    
    switch (this.current_battle_state) {
        case MACHINE_BATTLE.IDLE:
            if (this.manage_tbs_actions.unit instanceof GameObject) {
                this.battle_menu.OnDrawn();
            };
        break;
        case MACHINE_BATTLE.MOVE:
            // TODO: I've to see when show movement range
            this.manage_tbs_actions.DrawMovementRange(this.manage_tbs_actions.unit)
            // this.DrawMovementRange(player);
        break;
        case MACHINE_BATTLE.ATTACK:
            // Code goes here
        break;
        case MACHINE_BATTLE.DEFEND:
            // Code goes here
        break;
        case MACHINE_BATTLE.PASS:
            // Code goes here
        break;
        case MACHINE_BATTLE.RUN:
            // Code goes here
        break;
        case MACHINE_BATTLE.ITEM:
            // Code goes here
        break; 	
    }
}
//#endregion

//#region Handles Enemy
ManageBattleActions.prototype.handleEnemyActions = function() {
    switch (this.current_battle_state) {
        case MACHINE_BATTLE.ATTACK:
            this.handleEnemyAttack();
        break;
        case MACHINE_BATTLE.DEFEND:
            this.handleEnemyDefend();
        break;
        case MACHINE_BATTLE.PASS:
            this.handleEnemyPass();
        break;
    }
}

ManageBattleActions.prototype.handleEnemyIA = function() {
    const actions = [MACHINE_BATTLE.ATTACK, MACHINE_BATTLE.DEFEND, MACHINE_BATTLE.PASS];
    this.current_battle_state = actions[Math.floor(Math.random() * actions.length)];
}

ManageBattleActions.prototype.handleEnemyAttack = function() {
    // Code goes here
    console.log("Enemy attacks!");
    this.handlePass();
}

ManageBattleActions.prototype.handleEnemyDefend = function() {
    // Code goes here
    console.log("Enemy defends!");
    this.handlePass();
}

ManageBattleActions.prototype.handleEnemyPass = function() {
    // Code goes here
    console.log("Enemy passes!");
    this.handlePass();
}

//#endregion

//#region Actions
ManageBattleActions.prototype.runChance = function(entities) {
    let player = entities.find((entity) => entity.name == "Kocytos")
    let enemy = entities.find((entity) => entity.name == "Vegas");
    return player.agility >= Math.ceil(Math.random() * enemy.agility);
}

ManageBattleActions.prototype.firstTurn = function() {
    const turns = Object.keys(MACHINE_TURN);
    return MACHINE_TURN[turns[Math.floor(Math.random() * turns.length)]];
}
//#endregion