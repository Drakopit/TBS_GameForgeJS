import { Character } from "../Character.js";

export class Archer extends Character {
    constructor(name) {
        super(
            name,
            { constitution: 2, strength: 1, intelligence: 0, agility: 3, luck: 1 },
            { cons: 1.5, str_a: 1.2, str_d: 1.0, int_a: 0.5, int_d: 0.3, agi: 1.8, luc: 0.15 }
        );
    }
}
