import { Level } from "../GameForgeJS/Template/Level.js";
import { Screen } from "../GameForgeJS/Window/Screen.js";
import { Draw } from "../GameForgeJS/Graphic/Draw.js";
import { Sprite } from "../GameForgeJS/Graphic/Sprite.js";
import { ManageBattleActions } from "../Battle/manage_battle_actions.js";

export class Battle extends Level {
	constructor() {
		super();
		this.caption = "Battle Test";
		this.LEVEL_HANDLER = this;
	}

	OnStart() {
		super.OnStart();
		console.log("Battle Test Level Started");

		// Initialize screen and drawing utilities
		this.TelaId = "BattleTest";
		this.screen = new Screen(this.TelaId, 640, 480);
		this.draw = new Draw(this.screen);
		this.sprite = new Sprite(this.screen);

		// Manage battle Actions
		this.manage_battle_actions = new ManageBattleActions(this.screen, this.draw, this.sprite);
		this.manage_battle_actions.OnStart();
	}

	OnUpdate() {
		super.OnUpdate();
		this.manage_battle_actions.OnUpdate();
	}

	OnFixedUpdate(deltaTime) {
		super.OnFixedUpdate(deltaTime);
	}

	OnGUI() {
		this.ShowFPS(this.draw, 750, 20);
		this.manage_battle_actions.OnGUI();
		super.OnGUI();
	}

	OnDrawn() {
		this.screen.Refresh();
		this.manage_battle_actions.OnDrawn();
		super.OnDrawn();
	}
}
