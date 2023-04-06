const TOTAL_SQUARES = 64;
const blackPieces = ["br", "bh", "bb", "bk", "bq", "bb", "bh", "br"];
const whitePieces = ["wr", "wh", "wb", "wk", "wq", "wb", "wh", "wr"];
export const squares = [];

export const createBoard = () => {
    const board = document.createElement("div");
    board.classList.add("board");
    document.body.appendChild(board);
    let pattern = false;
    for (let i = 0; i < TOTAL_SQUARES; i++) {
        // Set board colored squares
        if (i % 8 == 0) pattern = !pattern;
        let square_color;
        const square = document.createElement("div");
        square.innerHTML = i;
        square.classList.add("square");
        square.setAttribute("data-id", i);
        squares.push(square);
        if (pattern) square_color = i % 2 == 0 ? "beige" : "brown";
        else square_color = i % 2 == 0 ? "brown" : "beige";
        square.classList.add(square_color);
        board.appendChild(square);
        // Set black pieces on the board
        if (i < 16) {
            square.setAttribute("contains-piece", "true");
            square.setAttribute("piece-color", "black");
            if (i < 8) square.setAttribute("piece-type", blackPieces[i]);
            else square.setAttribute("piece-type", "bp");
        }
        // Set white pieces on the board
        if (i > 47) {
            square.setAttribute("contains-piece", "true");
            square.setAttribute("piece-color", "white");
            if (i < 56) square.setAttribute("piece-type", "wp");
            else square.setAttribute("piece-type", whitePieces[i - 56]);
        }
    }
};
