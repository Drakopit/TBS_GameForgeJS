import { Character } from "../Character.js";

export class Assassin extends Character {
    constructor(name) {
        super(
            name,
            { constitution: 2, strength: 2, intelligence: 0, agility: 4, luck: 1 },
            { cons: 1.5, str_a: 1.6, str_d: 0.8, int_a: 0.4, int_d: 0.4, agi: 2, luc: 0.2 }
        );
    }
}
