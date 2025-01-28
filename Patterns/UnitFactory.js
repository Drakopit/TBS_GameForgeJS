import { Warrior } from "../Classes/Warrior/Warrior.js";
import { Archer } from "../Classes/Archer/Archer.js";
import { Mage } from "../Classes/Mage/Mage.js";
import { Knight } from "../Classes/Knight/Knight.js";
import { Wizard} from "../Classes//Wizard/Wizard.js";
import { Healer } from "../Classes/Healer/Healer.js";
import { Assassin } from "../Classes/Assassin/Assassin.js";

export class UnitFactory {
    createUnit(type) {
        switch (type) {
            case "Warrior":
                return new Warrior("Name");
            case "Archer":
                return new Archer("Name");
            case "Mage":
                return new Mage("Name");
            break;
            case "Knight":
                return new Knight("Name");
            break;
            case "Wizard":
                return new Wizard("Name");
            break;
            case "Healer":
                return new Healer("Name");
            break;
            case "Assassin":
                return new Assassin("Name");
            break;
            default:
                throw new Error("Invalid unit type");
        }
    }
}

const unitFactory = new UnitFactory();
const unit = unitFactory.createUnit("Warrior");
console.log(unit);