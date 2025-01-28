import { Character } from "../Character.js";

export class Healer extends Character {
    constructor(name) {
        super(
            name,
            { constitution: 2, strength: 0, intelligence: 3, agility: 1, luck: 0 },
            { cons: 1.5, str_a: 0.6, str_d: 0.6, int_a: 1.8, int_d: 1.6, agi: 1, luc: 0.1 }
        );
    }
}
