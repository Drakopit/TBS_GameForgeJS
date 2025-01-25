import { Base } from "../GameForgeJS/Root/Base.js";
import { Song } from "../GameForgeJS/Audio/Song.js";
import { Input } from "../GameForgeJS/Input/Input.js";
import { KeyCode } from "../GameForgeJS/Input/KeyCode.js";

export class MenuBattle extends Base {
    constructor(draw, x, y, width, height, options) {
        super();
        this.posX = x;
        this.posY = y;
        this.width = width;
        this.height = height;
        this.options = options;
        this.menu_options_cursor = 0;
        this.draw = draw;
        this.choosed_option = null;
    }

    OnStart() {
        // Cursor sound
        this.cursor_sound = new Song();
        this.cursor_sound.initializeAudioContext();
        
		// Choose sound
        this.choose_sound = new Song();
        this.choose_sound.initializeAudioContext();
    }

    OnUpdate() {
        if (Input.GetKeyUp(KeyCode.W)) {
            this.menu_options_cursor--;
            if (this.menu_options_cursor < 0) {
                this.menu_options_cursor = 0;
            }
            this.cursor_sound.Play("../Assets/SE/cursor2_rpgmakervxace_se.ogg", false);
        } else if (Input.GetKeyUp(KeyCode.S)) {
            this.menu_options_cursor++;
            if (this.menu_options_cursor > (this.options.length - 1)) {
                this.menu_options_cursor = this.options.length - 1;
            }
            this.cursor_sound.Play("../Assets/SE/cursor2_rpgmakervxace_se.ogg", false);
        }

        if (Input.GetKeyDown(KeyCode.E)) {
            this.choose_sound.Play("../Assets/SE/decision2_rpgmakervxace_se.ogg", false);
            if (this.menu_options_cursor >= 0 && this.menu_options_cursor <= this.options.length - 1) {
                this.choosed_option = this.menu_options_cursor;
            }
        }
    }

    OnDrawn() {
		// Show Message Box
		this.ShowMsgBox();

        // Draw the options
        for (let i = 0; i <= this.options.length - 1; i++) {
            i == this.menu_options_cursor ? this.draw.Color = "gray" : this.draw.Color = "white";
            this.draw.DrawText(this.options[i], this.posX + 8, this.posY + 16 + i * 16);
        };
        super.OnDrawn();
    }

    ShowMsgBox() {
        // The menu box
        this.draw.Color = "white";
        this.draw.DrawRect(this.posX - 1, this.posY - 1, this.width, this.height);
        this.draw.Color = "rgb(155, 155, 155, 0.5)";
        this.draw.DrawRect(this.posX, this.posY, this.width - 2, this.height - 2);
        this.draw.Color = "white";
    }
}