import { Vector2D } from "../GameForgeJS/Math/Vector2D.js";
import { Base } from "../GameForgeJS/Root/Base.js";

const DEFAULT_SIZE = new Vector2D(32, 32);

export class CursorBattle extends Base {
    constructor(spr, size, pos) {
        super();
        if (!spr) {
            this.sprite = "../Assets/Battle Resources/battle_cursor.png";
        } else {
            this.sprite = spr;
        }

        if (!size) {
            this.size = DEFAULT_SIZE;
        } else {
            this.size = size;
        }

        if (!pos) {
            this.x = 0;
			this.y = 0;
        } else {
            this.x = pos.x;
            this.y = pos.y;
        }
    }

    OnStart() {
        console.log("TBS Cursor Initialized: ", this);
    }

    SetPostion(pos_x, pos_y) {
        try {
            this.x = pos_x; this.y = pos_y;
        } catch (error) {
            throw new Error("You didn't passed x and/or y positions: " + error);
            
        }
    }

    GetPosition() {
        return new Vector2D(this.x, this.y);
    }
}