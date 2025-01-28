//#region State (Gerenciamento de turno)
class GameContext {
    constructor() {
        this.state = null;
    }

    setState(state) {
        this.state = state;
        console.log('Game state updated:', this.state);
    }

    executeTurn() {
        if (this.state) {
            this.state.handle(this.);
        }
    }
}

class PlayerTurnState {
    handle(context) {
        console.log('Executing player turn...');
        context.setState(new EnemyTurnState());
    }
}

class EnemyTurnState {
    handle(context) {
        console.log('Executing enemy turn...');
        context.setState(new PlayerTurnState());
    }
}

const gameContext = new GameContext();
gameContext.setState(new PlayerTurnState());
gameContext.executeTurn();
gameContext.executeTurn();
//#endregion

//#region Command (Ações de movimento)
class MoveCommand {
    constructor(unit, newPosition) {
        this.unit = unit;
        this.newPosition = newPosition;
        this.prevPosition = { ...unit.position };        
    }

    execute() {
        console.log(`Moving unit ${this.unit.id} from (${this.prevPosition.x}, ${this.prevPosition.y}) to (${this.newPosition.x}, ${this.newPosition.y})`);
        this.unit.position = this.newPosition;
    }

    undo() {
        console.log(`Undoing move of unit ${this.unit.id} from (${this.prevPosition.x}, ${this.prevPosition.y}) to (${this.newPosition.x}, ${this.newPosition.y})`);
        this.unit.position = this.prevPosition;
    }
}

const unit = { name: "Knight", position: { x: 0, y: 0 } };
const moveCommand = new MoveCommand(unit, { x: 2, y: 3 });

moveCommand.execute(); // Move the unit to (2, 3)
moveCommand.undo(); // Move the unit back to (0, 0)
//#endregion

//#region Observer (Atualização de UI no Fim do Turno)
class TurnManager {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    notify() {
        this.observers.forEach(observer => observer.update());
    }

    endTurn() {
        this.notify();
    }
}

class UI {
    update() {
        console.log("UI updated");
    }
}

const turnManager = new TurnManager();
const ui = new UI();
turnManager.subscribe(ui);
turnManager.endTurn();
//#endregion

//#region Factory (Criação de Entidades)
class UnitFactory {
    createUnit(type) {
        switch (type) {
            case "Warrior":
                return new Warrior();
            case "Archer":
                return new Archer();
            case "Mage":
                return new Mage();
            break;
            case "Knight":
                return new Knight();
            break;
            case "Wizard":
                return new Wizard();
            break;
            case "Healer":
                return new Healer();
            break;
            case "Assassin":
                return new Assassin();
            break;
            default:
                throw new Error("Invalid unit type");
        }
    }
}

const unitFactory = new UnitFactory();
const warrior = unitFactory.createUnit("Warrior");
console.log(warrior.skills["Havy Attack"]);
//#endregion

class Novice {
    constructor(health, attack, defense) {
        this.health = health;
        this.attack = attack;
        this.defense = defense;
    }
}


class Warrior extends Novice {
    constructor() {
        super(100, 10, 10);

        this.skills = ['Havy Attack', 'Defensive Stance'];
    }
}

