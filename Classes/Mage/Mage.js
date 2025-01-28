import { Character } from "../Character.js";

export class Mage extends Character {
    constructor(name) {
        super(
            name,
            { constitution: 1, strength: 0, intelligence: 4, agility: 1, luck: 0 },
            { cons: 1, str_a: 0.5, str_d: 0.5, int_a: 2, int_d: 1.5, agi: 1, luc: 0.2 }
        );
    }
}
