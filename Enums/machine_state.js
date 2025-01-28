export const MACHINE_WORLD = Object.freeze({
    BATTLE: 0,  // Battle world
    FREE: 1,    // Free world
});

export const MACHINE_TURN = Object.freeze({
    PLAYER: 0,  // Player turn
    ENEMY: 1,   // Enemy turn
});

export const MACHINE_BATTLE = Object.freeze({
    IDLE: -1,    // choise time
    ATTACK: 0,  // Attack action
    DEFEND: 1,  // Defend action
    MOVE: 2,    // Move action
    ITEM: 3,    // Item action
    PASS: 4,    // Pass action
    RUN: 5,     // Run action
});