import { whiteTurn } from "./game_logic.js";
const whitePieces = ["wr", "wb", "wh", "wq"];
const blackPieces = ["br", "bb", "bh", "bq"];

export function showPromotionMenu() {
    const promotionMenu = document.createElement("div");
    promotionMenu.classList.add("promotion-menu");
    document.body.appendChild(promotionMenu);
    const options = document.createElement("div");
    options.classList.add("options");
    promotionMenu.appendChild(options);
    for (let i = 0; i < 4; i++) {
        const choice = document.createElement("div");
        choice.classList.add("square");
        choice.classList.add("choice");
        if (i % 2 == 0) {
            choice.classList.add("brown");
        } else {
            choice.classList.add("beige");
        }
        if (whiteTurn) {
            choice.setAttribute("piece-type", whitePieces[i]);
        } else {
            choice.setAttribute(`piece-type`, blackPieces[i]);
        }
        options.appendChild(choice);
    }
}
