import { whiteTurn } from "./game_logic.js";
import { squares } from "./board.js";

export class Pawn {
    constructor(currentPosition) {
        this.currentPosition = Number(currentPosition);
    }
    possibleMoves() {
        let possibleMoves = [];
        const position = this.currentPosition;
        if (whiteTurn) {
            if (position >= 48 && !squares[position - 16].hasAttribute("contains-piece")) {
                possibleMoves = [position - 8, position - 16];
            } else if (position >= 8 && !squares[position - 8].hasAttribute("contains-piece")) {
                possibleMoves = [position - 8];
            }
            if (position - 7 >= 0 && squares[position - 7].getAttribute("piece-color") == "black" && (position - 7) % 8 != 0) {
                possibleMoves.push(position - 7);
            }
            if (position - 9 >= 0 && squares[position - 9].getAttribute("piece-color") == "black" && (position - 9) % 8 != 7) {
                possibleMoves.push(position - 9);
            }
            return possibleMoves;
        }
        if (position <= 15 && !squares[position + 16].hasAttribute("contains-piece")) {
            possibleMoves = [position + 8, position + 16];
        } else if (position <= 55 && !squares[position + 8].hasAttribute("contains-piece")) {
            possibleMoves = [position + 8];
        }
        if (position + 7 < 64 && squares[position + 7].getAttribute("piece-color") == "white" && (position + 7) % 8 != 7) {
            possibleMoves.push(position + 7);
        }
        if (position + 9 < 64 && squares[position + 9].getAttribute("piece-color") == "white" && (position + 9) % 8 != 0) {
            possibleMoves.push(position + 9);
        }
        return possibleMoves;
    }
}

export class Rook {
    constructor(currentPosition) {
        this.currentPosition = Number(currentPosition);
    }
    possibleMoves() {
        let possibleMoves = [];
        const position = this.currentPosition;
        let i = 1;
        const enemyColor = whiteTurn ? "black" : "white";
        // up
        while (position - 8 * i >= 0 && !squares[position - 8 * i].hasAttribute("contains-piece")) {
            possibleMoves.push(position - 8 * i);
            i++;
        }
        if (position - 8 * i >= 0 && squares[position - 8 * i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(position - 8 * i);
        }
        i = 1;
        // down
        while (position + 8 * i <= 63 && !squares[position + 8 * i].hasAttribute("contains-piece")) {
            possibleMoves.push(position + 8 * i);
            i++;
        }
        if (position + 8 * i <= 63 && squares[position + 8 * i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(position + 8 * i);
        }
        i = 1;
        // right
        while ((position + i) % 8 != 0 && !squares[position + i].hasAttribute("contains-piece")) {
            possibleMoves.push(position + i);
            i++;
        }
        if ((position + i) % 8 != 0 && squares[position + i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(position + i);
        }
        i = 1;
        // left
        while (position - i > 0 && (position - i) % 8 != 7 && !squares[position - i].hasAttribute("contains-piece")) {
            possibleMoves.push(position - i);
            i++;
        }
        if (position - i > 0 && (position - i) % 8 != 7 && squares[position - i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(position - i);
        }

        return possibleMoves;
    }
}

export class Knight {
    constructor(currentPosition) {
        this.currentPosition = Number(currentPosition);
    }
    possibleMoves() {
        let possibleMoves = [];
        let allyPositions = [];
        const position = this.currentPosition;
        let allyColor = whiteTurn ? "white" : "black";
        const moveUp = position - 16;
        const moveDown = position + 16;
        const moveLeft = position - 2;
        const moveRight = position + 2;
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
        this.currentPosition = Number(currentPosition);
    }
    possibleMoves() {
        let possibleMoves = [];
        let i = 1;
        const position = this.currentPosition;
        const enemyColor = whiteTurn ? "black" : "white";

        while ((position - 9 * i) % 8 != 7 && position - 9 * i >= 0 && !squares[position - 9 * i].hasAttribute("contains-piece")) {
            possibleMoves.push(position - 9 * i);
            i++;
        }
        if ((position - 9 * i) % 8 != 7 && position - 9 * i >= 0 && squares[position - 9 * i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(position - 9 * i);
        }
        i = 1;
        while ((position - 7 * i) % 8 != 0 && position - 7 * i >= 0 && !squares[position - 7 * i].hasAttribute("contains-piece")) {
            possibleMoves.push(position - 7 * i);
            i++;
        }
        if ((position - 7 * i) % 8 != 0 && position - 7 * i >= 0 && squares[position - 7 * i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(position - 7 * i);
        }
        i = 1;
        while ((position + 9 * i) % 8 != 0 && position + 9 * i <= 63 && !squares[position + 9 * i].hasAttribute("contains-piece")) {
            possibleMoves.push(position + 9 * i);
            i++;
        }
        if ((position + 9 * i) % 8 != 0 && position + 9 * i <= 63 && squares[position + 9 * i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(position + 9 * i);
        }
        i = 1;
        while ((position + 7 * i) % 8 != 7 && position + 7 * i <= 63 && !squares[position + 7 * i].hasAttribute("contains-piece")) {
            possibleMoves.push(position + 7 * i);
            i++;
        }
        if ((position + 7 * i) % 8 != 7 && position + 7 * i <= 63 && squares[position + 7 * i].getAttribute("piece-color") == enemyColor) {
            possibleMoves.push(position + 7 * i);
        }
        return possibleMoves;
    }
}

export class King {
    constructor(currentPosition) {
        this.currentPosition = Number(currentPosition);
    }
    possibleMoves() {
        let possibleMoves = [];
        let allyPositions = [];
        const position = this.currentPosition;
        const allyColor = whiteTurn ? "white" : "black";
        if (position + 8 <= 63) updateMoves(8);
        if (position - 8 >= 0) updateMoves(-8);
        if (position + 1 <= 63 && (position + 1) % 8 != 0) updateMoves(1);
        if (position - 1 >= 0 && (position - 1) % 8 != 7) updateMoves(-1);
        if (position + 7 <= 63 && (position + 7) % 8 != 7) updateMoves(7);
        if (position - 7 >= 0 && (position - 7) % 8 != 0) updateMoves(-7);
        if (position + 9 <= 63 && (position + 9) % 8 != 0) updateMoves(9);
        if (position - 9 >= 0 && (position - 9) % 8 != 7) updateMoves(-9);

        function updateMoves(a) {
            possibleMoves.push(position + a);
        }

        for (let i = 0; i < possibleMoves.length; i++) {
            if (squares[possibleMoves[i]].getAttribute("piece-color") == allyColor) {
                allyPositions.push(possibleMoves[i]);
            }
        }
        return possibleMoves.filter((move) => !allyPositions.includes(move));
    }
}
