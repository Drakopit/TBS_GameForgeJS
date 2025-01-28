import { Base } from "../GameForgeJS/Root/Base.js";

export class MapBattle extends Base {
    constructor(screen, pos = undefined, size = undefined, cell = undefined, map_def = undefined) {
        super();
        this.screen = screen;

        // Position definition
        this.posX = pos?.x ?? screen.Position.x;
        this.posY = pos?.y ?? screen.Position.y;

        // Size definition
        this.width = size?.width ?? Math.floor(screen.Width / 32);
        this.height = size?.height ?? Math.floor(screen.Height / 32);

        // Cell size definition
        this.cellSizeX = cell?.x ?? 32;
        this.cellSizeY = cell?.y ?? 32;

        // Map initialization
        this.map = map_def ?? Array.from({ length: this.height }, () => Array(this.width).fill(0));
    }

    OnStart() {
        // Reinitialize map with 0 if needed (optional)
        // for (let y = 0; y < this.height; y++) {
        //     for (let x = 0; x < this.width; x++) {
        //         this.map[y][x] = 0;
        //     }
        // }
    }
}
