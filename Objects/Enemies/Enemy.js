import { GameObject } from "../../GameForgeJS/Root/GameObject.js";

// Sprite positions enum
const SPRITE_POSITIONS = Object.freeze({
    DOWN: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 3
});

export class Enemy extends GameObject {
    constructor(screen, x, y) {
        super();
        this.Tag = "Enemy";

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

    OnUpdate() {
        super.OnUpdate();
    }
}