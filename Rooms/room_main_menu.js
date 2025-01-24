import { Level } from '../GameForgeJS/Template/Level.js';
import { Screen } from '../GameForgeJS/Window/Screen.js';
import { Draw } from '../GameForgeJS/Graphic/Draw.js';
import { Sprite } from '../GameForgeJS/Graphic/Sprite.js';
import { Input } from '../GameForgeJS/Input/Input.js';
import { KeyCode } from '../GameForgeJS/Input/KeyCode.js';
import { Vector2D } from '../GameForgeJS/Math/Vector2D.js';
import { Song } from '../GameForgeJS/Audio/Song.js';
import { ParticleSystem } from '../GameForgeJS/Particle/ParticleSystem.js';

export class MainMenu extends Level {
    constructor() {
        super();
        this.caption = "Main Menu";
        this.LEVEL_HANDLER = this;
    }

    OnStart() {
        super.OnStart();
        console.log("Main Menu Level Started");
        this.TelaId = "MainMenu";
        this.screen = new Screen(this.TelaId, 640, 480);
        // Draw
        this.draw = new Draw(this.screen);
        this.draw.FontSize = "45px";
        // Sprite
        this.sprite = new Sprite(this.screen);
        // Background
        this.background = "../Assets/Title Background/book_rpgmakervxace_tittle.png";
        // Background Music
        this.background_music = new Song();
        this.background_music.initializeAudioContext();
        this.background_music.Play("../Assets/BGM/theme2_rpgmakervxace_bgm.ogg", true);
        // Cursor sound
        this.cursor_sound = new Song();
        this.cursor_sound.initializeAudioContext();
        // Choose sound
        this.choose_sound = new Song();
        this.choose_sound.initializeAudioContext();
        // Menu options
        this.options = new Array("New Game", "Continue", "Settings", "Exit");
        this.currentSelected = 0; // Item selecionado do menu
         // Particle system
         this.particleSystem = new ParticleSystem();
    }

    OnUpdate() {
        if (Input.GetKeyUp(KeyCode.W)) {
            this.currentSelected--;
            if (this.currentSelected < 0) {
                this.currentSelected = (this.options.length - 1);
            }
            this.cursor_sound.Play("../Assets/SE/cursor2_rpgmakervxace_se.ogg", false);
            this.particleSystem.Emit(320, 240);
        } else if (Input.GetKeyUp(KeyCode.S)) {
            this.currentSelected++;
            if (this.currentSelected > (this.options.length - 1)) {
                this.currentSelected = 0;
            }
            this.cursor_sound.Play("../Assets/SE/cursor2_rpgmakervxace_se.ogg", false);
            this.particleSystem.Emit(320, 240);
        }

        if (Input.GetKeyUp(KeyCode.E) && this.currentSelected == 0) {
            this.choose_sound.Play("../Assets/SE/decision2_rpgmakervxace_se.ogg", false);
            this.background_music.Stop();
            this.Next = true;
        }

        // Update Particle System
        this.particleSystem.OnUpdate();
    }

    OnGUI() {
        this.sprite.Stretched(this.background, new Vector2D(0, 0), new Vector2D(this.screen.Width, this.screen.Height));
        for (let i = 0; i <= 3; i++) {
            if (i == this.currentSelected) {
                this.draw.Color = "gray";
            } else {
                this.draw.Color = "white";
            }
            this.draw.DrawText(this.options[i], 32, 64 + i * 64);
        }
        super.OnGUI();
    }

    OnDrawn() {
        // Draw Particle System
        this.particleSystem.OnDrawn();
        super.OnDrawn();
    }
}