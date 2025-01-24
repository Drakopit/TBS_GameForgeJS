import { GameObject } from '../GameForgeJS/Root/GameObject.js';
import { Vector2D } from '../GameForgeJS/Math/Vector2D.js';
import { Draw } from '../GameForgeJS/Graphic/Draw.js';
import { Sprite } from '../GameForgeJS/Graphic/Sprite.js';
import { Input } from '../GameForgeJS/Input/Input.js';
import { KeyCode } from '../GameForgeJS/Input/KeyCode.js';

// Machine
import { MACHINE_WORLD } from "../Enums/machine_state.js";

// Sprite positions enum
const SPRITE_POSITIONS = Object.freeze({
    DOWN: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 3
});

export class Kocytos extends GameObject {
    constructor(screen, x, y) {
        super();
        this.name = "Kocytos";
        this.Tag = "Ally";
        this.position = new Vector2D(x, y);
        this.size = new Vector2D(32, 32);
        this.speed = 200;

        this.draw = new Draw(screen);
        this.sprite = new Sprite(screen);
        this.sprite.size = this.size;
        this.sprite_sheet_file_name = "../Assets/Sprite Sheet/actor1_rpgmakervxace_char.png";
        this.sprite_picture_file_name = "../Assets/Portrait/actor1_rpgmakervxace_portrait.png";
        this.spritePositions = SPRITE_POSITIONS.DOWN;
        this.sprite.frameCount = 3;
        this.sprite.updatesPerFrame = 6;

        // TBS (Turn-Based Strategy) RPG
        // Set max_move to an appropriate value
        this.max_move = 3;

        // Information to save and restore the player state
        this.levelData = {
            x: this.position.x,
            y: this.position.y,
            name: this.name,
            Tag: this.Tag,
            max_move: this.max_move,
            size: this.size,
        }

        // State
        this.game_state = MACHINE_WORLD.FREE; 
    }

    OnStart() {
        // Atributos básicos
        this.health = 470; this.maxHealth = this.health;
        this.mana = 190; this.maxMana = this.mana;
        this.stamina = 100; this.maxStamina = this.stamina;

        // Atributos principais
        this.attack = 10;
        this.defense = 7;
        this.magic = 10;

        // Atributos secundários
        this.strength = 10;       // Influencia ataque físico
        this.intelligence = 10;  // Influencia magia
        this.agility = 10;       // Influencia esquiva e velocidade
        this.dexterity = 10;     // Influencia precisão e ataques críticos

        // Pontos disponíveis para distribuição
        this.statPoints = 10;
    }

    OnUpdate() {
        super.OnUpdate();
    }
    
    OnFixedUpdate(deltaTime) {
        this.HandleInput(deltaTime);
    }

    HandleInput(deltaTime) {
        this.isMoving = false;
        if (this.game_state != MACHINE_WORLD.BATTLE) {
            if (Input.GetKey(KeyCode.A)) {
                this.spritePositions = SPRITE_POSITIONS.LEFT;
                this.position.x -= this.speed * deltaTime;
                this.isMoving = true;
            } else if (Input.GetKey(KeyCode.D)) {
                this.spritePositions = SPRITE_POSITIONS.RIGHT;
                this.position.x += this.speed * deltaTime;
                this.isMoving = true;
            }
            if (Input.GetKey(KeyCode.W)) {
                this.spritePositions = SPRITE_POSITIONS.UP;
                this.position.y -= this.speed * deltaTime;
                this.isMoving = true;
            } else if (Input.GetKey(KeyCode.S)) {
                this.spritePositions = SPRITE_POSITIONS.DOWN;
                this.position.y += this.speed * deltaTime;
                this.isMoving = true;
            }  
        }
    }

    OnGUI() {
        this.draw.Color = "white";
        const posX = this.position.x.toFixed(0);
        const posY = this.position.y.toFixed(0);
        this.draw.DrawText(`x: ${posX}, y: ${posY}`, 16, 620);
    }

    OnDrawn() {
        this.sprite.Animation(this.sprite_sheet_file_name, this.position, "horizontal", this.spritePositions);
    }
}