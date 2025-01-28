import { Character } from "../Character.js";
import { HeavyAttack } from "./HeavyAttack.js";

export class Warrior extends Character {
    constructor(name) {
        super(
            name,
            { constitution: 3, strength: 4, intelligence: 0, agility: 1, luck: 1 },
            { cons: 5, str_a: 1.5, str_d: 1.2, int_a: 0.5, int_d: 0.25, agi: 1, luc: 0.1 }
        );
        // Skills list
        this.physic_skills.push(new HeavyAttack());
    }
}
