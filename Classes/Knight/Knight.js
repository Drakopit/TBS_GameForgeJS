import { Character } from "../Character.js";

export class Knight extends Character {
    constructor(name) {
        super(
            name,
            { constitution: 4, strength: 3, intelligence: 0, agility: 1, luck: 0 },
            { cons: 2.5, str_a: 1.3, str_d: 1.8, int_a: 0.4, int_d: 0.4, agi: 0.8, luc: 0.1 }
        );
    }
}
