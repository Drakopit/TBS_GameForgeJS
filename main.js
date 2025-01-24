import { Engine, LevelHandler } from "./GameForgeJS/Root/Engine.js";
import { MainMenu } from "./Rooms/room_main_menu.js";
import { FieldAon } from "./Rooms/room_fieldaon.js";
import { Battle } from "./Rooms/room_battle.js";

/**
 * @author Patrick Faustino Camello
 * @description Initialize the Game.
 * @summary Everything is on Game Class.
 * And Game class initialize, entire game
 * with all assets
 */
try {
    // Initialize the Engine
    // Engine is a singleton class
    // that contains all the game
    // and all the levels
    LevelHandler.addLevel(new MainMenu());
    LevelHandler.addLevel(new FieldAon());
    LevelHandler.addLevel(new Battle());
    
    Engine.OnStart();
    console.dir(Engine);
} catch(exception) {
    console.error(`Exception: ${exception}`);
}