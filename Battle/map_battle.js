import { Base } from "../GameForgeJS/Root/Base.js";

export class MapBattle extends Base {
    constructor(screen, pos_x = undefined, pos_y = undefined, width = undefined, height = undefined, cell_size_x = undefined, cell_size_y = undefined, map_def = undefined) {
        super();
        // Position definition
        if (!pos_x && !pos_y) {
            this.posX = screen.Position.x; this.posY = screen.Position.y;
        } else {
            this.posX = pos_x; this.posY = pos_y;    
        }
        // Size definition
        if (!width && !height) {
            this.width = Math.floor(this.screen.Width / 32); this.height = Math.floor(this.screen.Height / 32);
        } else {
            this.width = width; this.height = height;
        }
        // Cells size definition
        if (!cell_size_x && !cell_size_y) {
            this.cellSizeX = 32; this.cellSizeY = 32;
        } else {
            this.cellSizeX = cell_size_x; this.cellSizeY = cell_size_y;    
        }
        // Map
        if (!map_def) {
            this.map = map_def;
        } else {
            this.map = [];
        }
    }

    OnStart() {
        // Initializing map with 0
		for (let y = 0; y < this.map.height; y++) {
			this.map.map[y] = []; // Initialize row
			for (let x = 0; x < this.map.width; x++) {
				this.map.map[y][x] = 0; // Initialize each cell in the row to 0
			}
		}

        console.log("TBS Initialized: ", this.map);
    }
}