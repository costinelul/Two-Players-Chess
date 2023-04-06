import { whiteTurn } from "./game_logic.js";
import { squares } from "./board.js";

export class Pawn {
    constructor(currentPosition) {
        this.currentPosition = currentPosition;
    }
    possibleMoves() {
        let possibleMoves = [];
        if (whiteTurn) {
            if (this.currentPosition >= 48 && !squares[+this.currentPosition - 16].hasAttribute("contains-piece")) {
                possibleMoves = [+this.currentPosition - 8, +this.currentPosition - 16];
            } else if (this.currentPosition >= 8 && !squares[+this.currentPosition - 8].hasAttribute("contains-piece")) {
                possibleMoves = [+this.currentPosition - 8];
            }
            if (+this.currentPosition - 7 >= 0 && squares[+this.currentPosition - 7].getAttribute("piece-color") == "black" && (+this.currentPosition - 7) % 8 != 0) {
                possibleMoves.push(+this.currentPosition - 7);
            }
            if (+this.currentPosition - 9 >= 0 && squares[+this.currentPosition - 9].getAttribute("piece-color") == "black" && (+this.currentPosition - 9) % 8 != 7) {
                possibleMoves.push(+this.currentPosition - 9);
            }
            return possibleMoves;
        }
        if (this.currentPosition <= 15 && !squares[+this.currentPosition + 16].hasAttribute("contains-piece")) {
            possibleMoves = [+this.currentPosition + 8, +this.currentPosition + 16];
        } else if (this.currentPosition <= 55 && !squares[+this.currentPosition + 8].hasAttribute("contains-piece")) {
            possibleMoves = [+this.currentPosition + 8];
        }
        if (+this.currentPosition + 7 < 64 && squares[+this.currentPosition + 7].getAttribute("piece-color") == "white" && (+this.currentPosition + 7) % 8 != 7) {
            possibleMoves.push(+this.currentPosition + 7);
        }
        if (+this.currentPosition + 9 < 64 && squares[+this.currentPosition + 9].getAttribute("piece-color") == "white" && (+this.currentPosition + 9) % 8 != 0) {
            possibleMoves.push(+this.currentPosition + 9);
        }
        return possibleMoves;
    }
}

export class Rook {
    constructor(currentPosition) {
        this.currentPosition = currentPosition;
    }
    possibleMoves() {
        let possibleMoves = [];
        let i = 1;
        const enemyColor = whiteTurn ? "black" : "white";
        // up
        while (+this.currentPosition - 8 * i >= 0 && !squares[+this.currentPosition - 8 * i].hasAttribute("contains-piece")) {
            possibleMoves.push(+this.currentPosition - 8 * i);
            i++;
        }
        if (+this.currentPosition - 8 * i >= 0 && squares[+this.currentPosition - 8 * i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(+this.currentPosition - 8 * i);
        }
        i = 1;
        // down
        while (+this.currentPosition + 8 * i <= 63 && !squares[+this.currentPosition + 8 * i].hasAttribute("contains-piece")) {
            possibleMoves.push(+this.currentPosition + 8 * i);
            i++;
        }
        if (+this.currentPosition + 8 * i <= 63 && squares[+this.currentPosition + 8 * i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(+this.currentPosition + 8 * i);
        }
        i = 1;
        // right
        while ((+this.currentPosition + i) % 8 != 0 && !squares[+this.currentPosition + i].hasAttribute("contains-piece")) {
            possibleMoves.push(+this.currentPosition + i);
            i++;
        }
        if ((+this.currentPosition + i) % 8 != 0 && squares[+this.currentPosition + i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(+this.currentPosition + i);
        }
        i = 1;
        // left
        while (+this.currentPosition - i > 0 && (+this.currentPosition - i) % 8 != 7 && !squares[+this.currentPosition - i].hasAttribute("contains-piece")) {
            possibleMoves.push(+this.currentPosition - i);
            i++;
        }
        if (+this.currentPosition - i > 0 && (+this.currentPosition - i) % 8 != 7 && squares[+this.currentPosition - i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(+this.currentPosition - i);
        }

        return possibleMoves;
    }
}

export class Knight {
    constructor(currentPosition) {
        this.currentPosition = currentPosition;
    }
    possibleMoves() {
        let possibleMoves = [];
        let allyPositions = [];
        let allyColor = whiteTurn ? "white" : "black";
        const moveUp = +this.currentPosition - 16;
        const moveDown = +this.currentPosition + 16;
        const moveLeft = +this.currentPosition - 2;
        const moveRight = +this.currentPosition + 2;
        if (moveUp + 1 >= 0 && (moveUp + 1) % 8 != 0) possibleMoves.push(moveUp + 1);
        if (moveUp - 1 >= 0 && (moveUp - 1) % 8 != 7) possibleMoves.push(moveUp - 1);
        if (moveDown - 1 <= 63 && (moveDown - 1) % 8 != 7) possibleMoves.push(moveDown - 1);
        if (moveDown + 1 <= 63 && (moveDown + 1) % 8 != 0) possibleMoves.push(moveDown + 1);
        if (moveLeft - 8 >= 0 && (moveLeft - 8) % 8 < 6) possibleMoves.push(moveLeft - 8);
        if (moveLeft + 8 <= 63 && (moveLeft + 8) % 8 < 6) possibleMoves.push(moveLeft + 8);
        if (moveRight - 8 >= 0 && (moveRight - 8) % 8 > 1) possibleMoves.push(moveRight - 8);
        if (moveRight + 8 <= 63 && (moveRight + 8) % 8 > 1) possibleMoves.push(moveRight + 8);

        for (let i = 0; i < possibleMoves.length; i++) {
            if (squares[possibleMoves[i]].getAttribute("piece-color") == allyColor) {
                allyPositions.push(possibleMoves[i]);
            }
        }
        return possibleMoves.filter((move) => !allyPositions.includes(move));
    }
}

export class Bishop {
    constructor(currentPosition) {
        this.currentPosition = currentPosition;
    }
    possibleMoves() {
        let possibleMoves = [];
        let i = 1;
        const enemyColor = whiteTurn ? "black" : "white";
        // check all possibleMoves
        while ((+this.currentPosition - 9 * i) % 8 != 7 && +this.currentPosition - 9 * i >= 0 && !squares[+this.currentPosition - 9 * i].hasAttribute("contains-piece")) {
            possibleMoves.push(+this.currentPosition - 9 * i);
            i++;
        }
        if ((+this.currentPosition - 9 * i) % 8 != 7 && +this.currentPosition - 9 * i >= 0 && squares[+this.currentPosition - 9 * i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(+this.currentPosition - 9 * i);
        }
        i = 1;
        while ((+this.currentPosition - 7 * i) % 8 != 0 && +this.currentPosition - 7 * i >= 0 && !squares[+this.currentPosition - 7 * i].hasAttribute("contains-piece")) {
            possibleMoves.push(+this.currentPosition - 7 * i);
            i++;
        }
        if ((+this.currentPosition - 7 * i) % 8 != 0 && +this.currentPosition - 7 * i >= 0 && squares[+this.currentPosition - 7 * i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(+this.currentPosition - 7 * i);
        }
        i = 1;
        while ((+this.currentPosition + 9 * i) % 8 != 0 && +this.currentPosition + 9 * i <= 63 && !squares[+this.currentPosition + 9 * i].hasAttribute("contains-piece")) {
            possibleMoves.push(+this.currentPosition + 9 * i);
            i++;
        }
        if ((+this.currentPosition + 9 * i) % 8 != 0 && +this.currentPosition + 9 * i <= 63 && squares[+this.currentPosition + 9 * i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(+this.currentPosition + 9 * i);
        }
        i = 1;
        while ((+this.currentPosition + 7 * i) % 8 != 7 && +this.currentPosition + 7 * i <= 63 && !squares[+this.currentPosition + 7 * i].hasAttribute("contains-piece")) {
            possibleMoves.push(+this.currentPosition + 7 * i);
            i++;
        }
        if ((+this.currentPosition + 7 * i) % 8 != 7 && +this.currentPosition + 7 * i <= 63 && squares[+this.currentPosition + 7 * i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(+this.currentPosition + 7 * i);
        }
        return possibleMoves;
    }
}

export class King {
    constructor(currentPosition) {
        this.currentPosition = currentPosition;
    }
    possibleMoves() {
        let possibleMoves = [];
        let allyPositions = [];
        const allyColor = whiteTurn ? "white" : "black";
        if (+this.currentPosition - 8 >= 0) possibleMoves.push(+this.currentPosition - 8);
        if (+this.currentPosition + 8 <= 63) possibleMoves.push(+this.currentPosition + 8);
        if (+this.currentPosition + 1 <= 63 && (+this.currentPosition + 1) % 8 != 0) possibleMoves.push(+this.currentPosition + 1);
        if (+this.currentPosition - 1 >= 0 && (+this.currentPosition - 1) % 8 != 7) possibleMoves.push(+this.currentPosition - 1);
        if (+this.currentPosition - 7 >= 0 && (+this.currentPosition - 7) % 8 != 0) possibleMoves.push(+this.currentPosition - 7);
        if (+this.currentPosition - 9 >= 0 && (+this.currentPosition - 9) % 8 != 7) possibleMoves.push(+this.currentPosition - 9);
        if (+this.currentPosition + 9 <= 63 && (+this.currentPosition + 9) % 8 != 0) possibleMoves.push(+this.currentPosition + 9);
        if (+this.currentPosition + 7 <= 63 && (+this.currentPosition + 7) % 8 != 7) possibleMoves.push(+this.currentPosition + 7);

        for (let i = 0; i < possibleMoves.length; i++) {
            if (squares[possibleMoves[i]].getAttribute("piece-color") == allyColor) {
                allyPositions.push(possibleMoves[i]);
            }
        }
        return possibleMoves.filter((move) => !allyPositions.includes(move));
    }
}
