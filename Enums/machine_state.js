export const MACHINE_WORLD = Object.freeze({
    BATTLE: 0,  // Battle world
    FREE: 1,    // Free world
});

export const MACHINE_TURN = Object.freeze({
    PLAYER: 0,  // Player turn
    ENEMY: 1,   // Enemy turn
});

export const MACHINE_BATTLE = Object.freeze({
    IDLE: 1,    // choise time
    MOVE: 2,    // Move action
    ATTACK: 3,  // Attack action
    DEFEND: 4,  // Defend action
    ITEM: 5,    // Item action
    RUN: 6,     // Run action
    PASS: 7,    // Pass action
});