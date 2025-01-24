import { Base } from "../GameForgeJS/Root/Base.js";

export class CursorBattle extends Base {
    constructor(spr, pos_x, pos_y) {
        super();
        if (!spr) {
            this.sprite = "../Assets/Battle Resources/battle_cursor.png";
        } else {
            this.sprite = spr;
        }

        if (!pos_x && pos_y) {
            this.x = 0;
			this.y = 0;
        } else {
            this.x = pos_x;
            this.y = pos_y;
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
        return {
            x: this.x,
            y: this.y
        }
    }
}