export class MagicSkills  {
    constructor(spr, name, range, area, level, skillAttack, cost) {
        this.name = name;
        this.sprite = spr;
        this.level = level;
        this.range = range ? range : 1; // If it's not defined. 1x1 is choosed.
        this.area = area; // This should be an array of affected entities
        this.skillAttack = skillAttack; // Corrected variable name
        this.cost = cost;
    }

    calculateDamage(caster, affected) {
        // Calculate damage with a basic formula: Damage = (caster's strength * skill multiplier) - target's defense
        const damage = Math.floor(caster.inteligence * this.skillAttack) - affected.defense;
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