import { Character } from "../Character.js";

export class Wizard extends Character {
    constructor(name) {
        super(
            name,
            { constitution: 1, strength: 0, intelligence: 5, agility: 0, luck: 1 },
            { cons: 1, str_a: 0.4, str_d: 0.4, int_a: 2.5, int_d: 1.8, agi: 0.9, luc: 0.2 }
        );
    }
}
