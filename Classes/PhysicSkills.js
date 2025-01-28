export class PhysicSkills {
    constructor(spr, name, area, level, skillAttack, cost) {
        this.name = name;
        this.sprite = spr;
        this.level = level;
        this.area = area; // This should be an array of affected entities
        this.skillAttack = skillAttack; // Corrected variable name
        this.cost = cost;
    }

    calculateDamage(caster, affected) {
        // Calculate damage with a basic formula: Damage = (caster's strength * skill multiplier) - target's defense
        const damage = Math.floor(caster.strength * this.skillAttack) - affected.defense;
        return damage > 0 ? damage : 0;
    }

    takeDamage(caster) {
        // Loop through all affected entities and calculate damage
        this.area.forEach((affected) => {
            const damage = this.calculateDamage(caster, affected);
            affected.health -= damage;
        });
    }
}
