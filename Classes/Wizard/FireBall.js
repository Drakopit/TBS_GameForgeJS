import { MagicSkills } from "../MagicSkills.js";

const COST = 4;
const DAMAGE = 4;
const LEVEL = 5;
const RANGE = 5;
const AREA = [
    0, 1, 0,
    1, 1, 1,
    0, 1, 0
];

export class FireBall extends MagicSkills {
    constructor() {
        // Call the parent class (PhysicSkills) constructor with appropriate parameters
        super('', 'Heavy Attack', RANGE, AREA, LEVEL, DAMAGE, COST); // Passing area, level, and skillAttack to the super constructor
    }
}