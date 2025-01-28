export class Character {
    static MULTIPLIERS = {};

    constructor(name, baseStats = {}, multipliers = {}) {
        this.name = name;

        // Base stats
        this.constitution = baseStats.constitution || 1;
        this.strength = baseStats.strength || 1;
        this.intelligence = baseStats.intelligence || 1;
        this.agility = baseStats.agility || 1;
        this.luck = baseStats.luck || 1;

        // Multipliers
        this.multipliers = {
            cons: multipliers.cons   || 10, // Default multiplier for health
            str_a: multipliers.str_a || 1.5,
            str_d: multipliers.str_d || 1.2,
            int_a: multipliers.int_a || 0.5,
            int_d: multipliers.int_d || 0.25,
            agi: multipliers.agi || 1,
            luc: multipliers.luc || 0.1,
            ...multipliers
        };

        // Miscellaneous stats
        this.currentExp = 0;
        this.nextLevel = 100;
        this.gold = 100;
        this.actionPoints = 6;
        this.movePoints = 3;
        this.skillPoints = 0;
        this.physic_skills = [];
        this.magic_skills = [];

        // Derived stats
        this.updateStats();
    }

    // Calculate a derived stat with optional base value
    static calculateStat(attribute, multiplier, base = 0) {
        return Math.ceil(attribute * multiplier + base);
    }

    // Update derived stats
    updateStats() {
        // Ensure minimum starting values for all stats
        this.max_health = Math.max(
            Character.calculateStat(this.constitution, this.multipliers.cons, 50),
            50
        );
        this.health = this.max_health; // Reset health to max when stats are updated

        this.attack = Math.max(
            Character.calculateStat(this.strength, this.multipliers.str_a, 5),
            5
        );
        this.magicAttack = Math.max(
            Character.calculateStat(this.intelligence, this.multipliers.int_a, 5),
            5
        );
        this.defense = Math.max(
            Character.calculateStat(this.strength, this.multipliers.str_d, 1),
            0
        );
        this.magicDefense = Math.max(
            Character.calculateStat(this.intelligence, this.multipliers.int_d, 1),
            0
        );
        this.criticalChance = Math.max(
            Character.calculateStat(this.luck, this.multipliers.luc, 1),
            1
        );
        this.dodgeChance = Math.max(
            Character.calculateStat(this.agility, this.multipliers.agi, 1),
            1
        );
    }

    // Add experience and handle leveling up
    addExperience(exp) {
        this.currentExp += exp;
        while (this.currentExp >= this.nextLevel) {
            this.currentExp -= this.nextLevel;
            this.levelUp();
        }
    }

    // Handle leveling up
    levelUp() {
        this.skillPoints += 5; // Reward skill points on level-up
        this.nextLevel = Math.floor(this.nextLevel * 1.2); // Increase the next level's requirement
        this.constitution += 2; // Boost stats for better growth
        this.strength += 2;
        this.intelligence += 1;
        this.agility += 1;
        this.luck += 1;
        this.updateStats(); // Recalculate derived stats
    }
}
