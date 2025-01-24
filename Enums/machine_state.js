export const MACHINE_WORLD = Object.freeze({
    BATTLE: 0,  // Battle world
    FREE: 1,    // Free world
});

export const MACHINE_TURN = Object.freeze({
    PLAYER: 0,  // Player turn
    ENEMY: 1,   // Enemy turn
});

export const MACHINE_BATTLE = Object.freeze({
    IDLE: 0,    // choise time
    MOVE: 1,    // Move action
    ATTACK: 2,  // Attack action
    DEFEND: 3,  // Defend action
    ITEM: 4,    // Item action
    RUN: 5,     // Run action
    PASS: 6,    // Pass action
});