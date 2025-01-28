import { Level } from "../GameForgeJS/Template/Level.js";
import { Screen } from "../GameForgeJS/Window/Screen.js";
import { Draw } from "../GameForgeJS/Graphic/Draw.js";
import { Kocytos } from "../Objects/Kocytos.js";
import { Input } from "../GameForgeJS/Input/Input.js";
import { Store } from "../GameForgeJS/Root/Store.js";

export class FieldAon extends Level {
    constructor() {
        super();
        this.caption = "Field Aon";
        this.LEVEL_HANDLER = this;
    }

    OnStart() {
        super.OnStart();
        console.log("FieldAon Level Started");
        this.TelaId = "FieldAon";
        this.screen = new Screen(this.TelaId, 640, 480);
        this.draw = new Draw(this.screen);
        
        // Create and add a player entity to the level
        const player = new Kocytos(this.screen, 50, 100); // Make sure Kocytos has a position and max_move
        player.CurrentLevel = this.LEVEL_HANDLER;
        player.Tag = "Player"; // Ensure the player tag is set
        this.AddEntity(player);
    }

    OnUpdate() {
        super.OnUpdate();
        if (Input.GetKeyUp("Space")) {
            let player = this.GetEntityByName("Kocytos");
            let save = player.levelData;
            if (save) {
                try {
                    let store = new Store();  // Creating store once to isolate potential issue
                    store.SaveState(save, "player");
                    this.LEVEL_HANDLER.Next = true;
                } catch (error) {
                    console.error("Error during SaveState:", error);
                    console.trace();
                }
            } else {
                console.error("Player not found");
            }
        }
    }    

    OnFixedUpdate(deltaTime) {
        // Update entities OnFixedUpdate
        super.OnFixedUpdate(deltaTime);
    }

    OnGUI() {
        // Draw FPS
        this.ShowFPS(this.draw, 750, 20);
        
        // Update entities OnGUI
        super.OnGUI();
    }

    OnDrawn() {
        // Refresh screen
        this.screen.Refresh();

        // Draw cell around the player position, like Fire Emblem Tactical RPG
        // const player = this.entities.find(e => e.Tag === "Player");
        // if (player) {
        //     this.DrawMovementRange(player); // Only draw if player exists
        // }
        
        super.OnDrawn();
    }

    // DrawCell(x, y, size, color) {
    //     this.draw.Color = color;
    //     this.draw.DrawRect(x, y, size, size);
    //     this.draw.Color = "white";
    // }

    // // Draw a cell around the player position, like Fire Emblem Tactical RPG
    // DrawMovementRange(object) {
    //     const startX = object.position.x - object.max_move * 32; // Multiply by cell size
    //     const startY = object.position.y - object.max_move * 32; // Multiply by cell size
    //     const endX = object.position.x + object.max_move * 32; // Multiply by cell size
    //     const endY = object.position.y + object.max_move * 32; // Multiply by cell size

    //     for (let i = startX; i <= endX; i += 32) {
    //         for (let j = startY - 32; j <= endY; j += 32) {
    //             // Calculate the distance from the object position
    //             const dist = Math.abs(object.position.x - i) + Math.abs(object.position.y - j);
                
    //             // If within movement range (Manhattan distance)
    //             if (dist <= object.max_move * 32) { // Multiply max_move by cell size
    //                 this.DrawCell(i, j, 32, "rgba(0, 160, 0, 0.5)");
    //             }
    //         }
    //     }
    // }
}