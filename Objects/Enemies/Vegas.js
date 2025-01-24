import { Enemy } from './Enemy.js';
import { Vector2D } from '../../GameForgeJS/Math/Vector2D.js';
import { Draw } from '../../GameForgeJS/Graphic/Draw.js';
import { Sprite } from '../../GameForgeJS/Graphic/Sprite.js';

// Sprite positions enum
const SPRITE_POSITIONS = Object.freeze({
    DOWN: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 3
});

export class Vegas extends Enemy {
    constructor(screen, x, y) {
        super();
        this.name = "Vegas";
        this.Tag = "Enemy";
        this.position = new Vector2D(x, y);
        this.size = new Vector2D(32, 32);
        this.speed = 200;

        this.draw = new Draw(screen);
        this.sprite = new Sprite(screen);
        this.sprite.size = this.size;
        this.sprite_sheet_file_name = "../../Assets/Sprite Sheet/evil_rpgmakervxace_enemies.png";
        this.sprite_picture_file_name = "../../Assets/Portrait/actor1_rpgmakervxace_portrait.png";
        this.spritePositions = SPRITE_POSITIONS.DOWN;
        this.sprite.frameCount = 3;
        this.sprite.updatesPerFrame = 6;

        // TBS (Turn-Based Strategy) RPG
        // Set max_move to an appropriate value
        this.max_move = 3;
    }

    OnStart() {
        // Status
        this.level = 1;
        this.Health = 470; this.MaxHealth = this.Health;
        this.Mana = 190; this.MaxMana = this.Mana;
        this.Stamina = 100; this.MaxStamina = this.Stamina;

        this.Attack = 10;
        this.Defense = 7;
        this.Magic = 10; 
    }

    OnDrawn() {
        this.sprite.Animation(this.sprite_sheet_file_name, this.position, "horizontal", this.spritePositions);
    }
}