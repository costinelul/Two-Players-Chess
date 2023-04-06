import { createBoard, squares } from "./board.js";
import { Pawn, Rook, Knight, Bishop, King } from "./pieces_classes.js";
import { showPromotionMenu } from "./promotionMenu.js";
export let pieceType;
export let currentTurn;
export let whiteTurn = true;
let pieceToMove;
let lastSquareClicked;
let pieceCHECKING = [];
const CHECK_HIGHLIGHT_DURATION = "700";

createBoard();
whitePiecesTurn();

function whitePiecesTurn() {
    removeAllEventListeners();
    const whitePieces = document.querySelectorAll("[piece-color=white]");
    whitePieces.forEach((piece) => {
        piece.addEventListener("click", handleClick);
    });
}

function blackPiecesTurn() {
    removeAllEventListeners();
    const blackPieces = document.querySelectorAll("[piece-color=black]");
    blackPieces.forEach((piece) => {
        piece.addEventListener("click", handleClick);
    });
}

function removeAllEventListeners() {
    squares.forEach((square) => {
        square.removeEventListener("click", handleClick);
    });
}
function handleClick(e) {
    pieceToMove = e.target;
    pieceType = pieceToMove.getAttribute("piece-type");
    const pieceClickedPosition = pieceToMove.getAttribute("data-id");
    removeAllHighlights();
    removePossibleMovesEventListener();
    getPossibleMoves(pieceClickedPosition, pieceType).forEach((possibleMove) => {
        squares[possibleMove].classList.add("highlight");
        squares[possibleMove].addEventListener("click", movePiece);
    });
}

function movePiece(newPosition) {
    const currentColorTurn = whiteTurn ? "white" : "black";
    const pieceCaptured = checkForCapture(newPosition.target);
    lastSquareClicked = newPosition.target;
    removeAllHighlights();
    removePossibleMovesEventListener();
    addNewPiece(newPosition.target);
    removeOldPiece(pieceToMove);
    if (isSelfCHECK()) {
        retakeTurn(pieceCaptured);
    } else {
        checkForPawnPromotion(newPosition.target);
        if (isEnemyCHECK()) {
            if (isCHECKMATE()) {
                showWinner(currentColorTurn);
                return;
            }
        }
        swapTurn();
    }
}
function showWinner(winnerColor) {
    console.log(`${winnerColor[0].toUpperCase() + winnerColor.slice(1)} wins!`);
    removeAllEventListeners();
}

function isCHECKMATE() {
    const currentColorTurn = whiteTurn ? "white" : "black";
    const enemyKing = whiteTurn ? document.querySelector("[piece-type=bk]") : document.querySelector("[piece-type=wk");
    const enemyKingType = enemyKing.getAttribute("piece-type");
    const enemyKingColor = whiteTurn ? "black" : "white";
    const allyPossibleMoves = getAllPiecesPossibleMoves(currentColorTurn);
    whiteTurn = !whiteTurn;
    const enemyKingPossibleMoves = getPossibleMoves(enemyKing.getAttribute("data-id"), enemyKingType);
    whiteTurn = !whiteTurn;
    const escapeCHECK = enemyKingPossibleMoves.filter((possibleMove) => !allyPossibleMoves.includes(possibleMove));

    // Check if another piece can stop the MATE
    if (escapeCHECK.length == 0) {
        if (pieceCHECKING.length == 1) {
            whiteTurn = !whiteTurn;
            const enemyPossibleMoves = getAllPiecesPossibleMoves(enemyKingColor);
            // exclude the king's moves
            for (let i = 0; i < enemyKingPossibleMoves.length; i++) {
                for (let j = 0; j < enemyPossibleMoves.length; j++) {
                    if (enemyKingPossibleMoves[i] == enemyPossibleMoves[j]) {
                        enemyPossibleMoves.splice(j, 1);
                        break;
                    }
                }
            }
            whiteTurn = !whiteTurn;

            //get the squares from CHECK path 
            let pieceCHECKINGmoves = [];
            const substraction = pieceCHECKING[0].getAttribute("data-id") - enemyKing.getAttribute("data-id");
            const direction = getDirection(substraction);

            let i = 1;
            while (pieceCHECKING[0].getAttribute("data-id") - direction * i != enemyKing.getAttribute("data-id")) {
                pieceCHECKINGmoves.push(pieceCHECKING[0].getAttribute("data-id") - direction * i);
                i++;
            }

            for (let i = 0; i < enemyPossibleMoves.length; i++) {
                // can pieceChecking be captured
                if (squares[enemyPossibleMoves[i]].getAttribute("piece-type") == pieceCHECKING[0].getAttribute("piece-type")) return false;
                // can block Check
                if (pieceCHECKINGmoves.includes(enemyPossibleMoves[i])) return false;
            }
        }
        return true;
    }

    // check if the king can capture to escape MATE
    let possibleCaptures = 0;
    let capturesFailed = 0;
    enemyKing.removeAttribute("piece-type");
    enemyKing.removeAttribute("contains-piece");
    enemyKing.removeAttribute("piece-color");

    escapeCHECK.forEach((move) => {
        if (squares[move].getAttribute("piece-color") == currentColorTurn) {
            possibleCaptures++;
            const pieceType = squares[move].getAttribute("piece-type");
            // simulate capture
            squares[move].setAttribute("piece-type", enemyKingType);
            squares[move].setAttribute("piece-color", enemyKingColor);
            const allyPossibleMoves = getAllPiecesPossibleMoves(currentColorTurn);

            for (let i = 0; i < allyPossibleMoves.length; i++) {
                if (squares[allyPossibleMoves[i]].getAttribute("piece-type") == enemyKingType) {
                    capturesFailed++;
                    squares[move].setAttribute("piece-type", pieceType);
                    squares[move].setAttribute("piece-color", currentColorTurn);
                    break;
                }
            }
            squares[move].setAttribute("piece-type", pieceType);
            squares[move].setAttribute("piece-color", currentColorTurn);
        }
    });
    enemyKing.setAttribute("piece-type", enemyKingType);
    enemyKing.setAttribute("contains-piece", "true");
    enemyKing.setAttribute("piece-color", enemyKingColor);
    if (possibleCaptures == capturesFailed && possibleCaptures != 0) return true;

    function getDirection(substraction) {
        for (let n = 7; n <= 9; n++) {
            if (substraction % n == 0 * substraction) return (n * substraction) / Math.abs(substraction);
        }
    }
}

function getAllPiecesPossibleMoves(piecesColor) {
    const pieces = document.querySelectorAll(`[piece-color=${piecesColor}]`);
    let possibleMoves = [];
    for (let i = 0; i < pieces.length; i++) {
        const piecesType = pieces[i].getAttribute("piece-type");
        getPossibleMoves(pieces[i].getAttribute("data-id"), piecesType).forEach((move) => {
            possibleMoves.push(move);
        });
    }
    return possibleMoves;
}

function highlightCHECK(enemyKing, allyPiece) {
    enemyKing.classList.add("CHECK");
    allyPiece.classList.add("CHECK");
    setTimeout(() => {
        enemyKing.classList.remove("CHECK");
        allyPiece.classList.remove("CHECK");
    }, CHECK_HIGHLIGHT_DURATION);
}

function isEnemyCHECK() {
    let isCheck = false;
    const currentColorTurn = whiteTurn ? "white" : "black";
    const enemyKing = whiteTurn ? "bk" : "wk";
    const allyPieces = document.querySelectorAll(`[piece-color=${currentColorTurn}]`);
    for (let i = 0; i < allyPieces.length; i++) {
        const allyPiecesType = allyPieces[i].getAttribute("piece-type");
        getPossibleMoves(allyPieces[i].getAttribute("data-id"), allyPiecesType).forEach((move) => {
            if (squares[move].getAttribute("piece-type") == enemyKing) {
                highlightCHECK(squares[move], allyPieces[i]);
                pieceCHECKING.push(allyPieces[i]);
                isCheck = true;
            }
        });
    }
    return isCheck;
}
function retakeTurn(pieceCaptured) {
    const currentColorTurn = whiteTurn ? "white" : "black";
    const enemyColor = whiteTurn ? "black" : "white";
    lastSquareClicked.removeAttribute("piece-type");
    lastSquareClicked.removeAttribute("piece-color");
    lastSquareClicked.removeAttribute("contains-piece");
    pieceToMove.setAttribute("contains-piece", "true");
    pieceToMove.setAttribute("piece-color", currentColorTurn);
    pieceToMove.setAttribute("piece-type", pieceType);
    pieceToMove.addEventListener("click", handleClick);
    if (pieceCaptured != undefined) {
        lastSquareClicked.setAttribute("contains-piece", "true");
        lastSquareClicked.setAttribute("piece-color", enemyColor);
        lastSquareClicked.setAttribute("piece-type", pieceCaptured);
    }
}

function checkForCapture(newPosition) {
    const enemyColor = whiteTurn ? "black" : "white";
    if (newPosition.getAttribute("piece-color") == enemyColor) {
        const enemyPieceType = newPosition.getAttribute("piece-type");
        newPosition.removeAttribute("contains-piece");
        newPosition.removeAttribute("piece-color");
        newPosition.removeAttribute("piece-type");
        return enemyPieceType;
    }
}
function isSelfCHECK() {
    let isCheck = false;
    const allyKing = whiteTurn ? "wk" : "bk";
    whiteTurn = !whiteTurn;
    const enemyColor = whiteTurn ? "white" : "black";
    const enemyPieces = document.querySelectorAll(`[piece-color=${enemyColor}]`);
    for (let i = 0; i < enemyPieces.length; i++) {
        const enemyPiecesType = enemyPieces[i].getAttribute("piece-type");
        const enemyPiecesPosition = enemyPieces[i].getAttribute("data-id");
        getPossibleMoves(enemyPiecesPosition, enemyPiecesType).forEach((move) => {
            if (squares[move].getAttribute("piece-type") == allyKing) {
                highlightCHECK(squares[move], enemyPieces[i]);
                isCheck = true;
            }
        });
    }
    whiteTurn = !whiteTurn;
    return isCheck;
}

function checkForPawnPromotion(newPosition) {
    if ((pieceType == "wp" && +newPosition.getAttribute("data-id") <= 7) || (pieceType == "bp" && +newPosition.getAttribute("data-id") >= 56)) {
        showPromotionMenu();
        const choices = document.querySelectorAll(".choice");
        choices.forEach((choice) => choice.addEventListener("click", promotePawn));
    }
}

function promotePawn(e) {
    lastSquareClicked.removeAttribute("piece-type");
    const promotionChosen = e.target;
    const promotedPieceType = promotionChosen.getAttribute("piece-type");
    lastSquareClicked.setAttribute("piece-type", promotedPieceType);
    const promotionMenu = document.querySelector(".promotion-menu");
    promotionMenu.remove();
    isEnemyCHECK();
}

function swapTurn() {
    whiteTurn = !whiteTurn;
    pieceCHECKING = [];
    if (whiteTurn) whitePiecesTurn();
    else blackPiecesTurn();
}

function addNewPiece(newPosition) {
    const currentColorTurn = whiteTurn ? "white" : "black";
    newPosition.setAttribute("contains-piece", "true");
    newPosition.setAttribute("piece-color", currentColorTurn);
    newPosition.setAttribute("piece-type", pieceType);
}

function removeOldPiece(pieceToRemove) {
    pieceToRemove.removeAttribute("piece-type");
    pieceToRemove.removeAttribute("contains-piece");
    pieceToRemove.removeAttribute("piece-color");
}

function removePossibleMovesEventListener() {
    squares.forEach((square) => {
        square.removeEventListener("click", movePiece);
    });
}

function removeAllHighlights() {
    squares.forEach((square) => {
        square.classList.remove("highlight");
    });
}

function getPossibleMoves(pieceClickedPosition, pieceType) {
    let pieceObject;
    switch (pieceType) {
        case "wp":
        case "bp":
            pieceObject = new Pawn(pieceClickedPosition);
            break;
        case "wr":
        case "br":
            pieceObject = new Rook(pieceClickedPosition);
            break;
        case "bh":
        case "wh":
            pieceObject = new Knight(pieceClickedPosition);
            break;
        case "wb":
        case "bb":
            pieceObject = new Bishop(pieceClickedPosition);
            break;
        case "wk":
        case "bk":
            pieceObject = new King(pieceClickedPosition);
            break;
        case "wq":
        case "bq":
            pieceObject = new Bishop(pieceClickedPosition);
            let possibleMoves = [];
            possibleMoves = pieceObject.possibleMoves();
            pieceObject = new Rook(pieceClickedPosition);
            pieceObject.possibleMoves().forEach((possibleMove) => {
                possibleMoves.push(possibleMove);
            });
            return possibleMoves;
        default:
            break;
    }
    return pieceObject.possibleMoves();
}
