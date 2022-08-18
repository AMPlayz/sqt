import Tetris from "../common/Tetris.js";

const grid_columns = Tetris.field_width;
const grid_rows = Tetris.field_height;

const MiniGrid_columns = Tetris.field_width;
const MiniGrid_rows = Tetris.field_height / 2.5;

let game = Tetris.new_game();

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

document.documentElement.style.setProperty("--MiniGrid-rows", MiniGrid_rows);
document.documentElement.style.setProperty("--MiniGrid-columns", MiniGrid_columns);

const grid = document.getElementById("grid");
const holdGrid = document.getElementById("holdGrid");
const nextGrid = document.getElementById("nextGrid");
// This is where I define my mini grid ^^

const range = (n) => Array.from({"length": n}, (ignore, k) => k);

const cells = range(grid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    grid.append(row);
    return rows;
});

const MiniCellsHold = range(MiniGrid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(MiniGrid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    holdGrid.append(row);
    return rows;
});

const MiniCellsNext = range(MiniGrid_rows).map(function () {
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(MiniGrid_columns).map(function () {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);

        return cell;
    });

    nextGrid.append(row);
    return rows;
});

const update_grid = function () {
    MiniCellsNext.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const MiniCell = MiniCellsNext[line_index][column_index];
            MiniCell.className = "cell";
        });
    });

    MiniCellsHold.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const MiniCell = MiniCellsHold[line_index][column_index];
            MiniCell.className = "cell";
        });
    });

    game.field.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const cell = cells[line_index][column_index];
            cell.className = `cell ${block}`;
        });
    });

    try {
        if (game.held_tetromino.grid !== null) {
            game.held_tetromino.grid.forEach(function (line, line_index) {
                line.forEach(function (block, column_index) {
                const MiniCell = MiniCellsHold[line_index + 3][column_index + 3];
                    MiniCell.className =  `cell ${block}`;
                });
            });
        }
    } catch (ignore) {}

    Tetris.tetromino_coordiates(game.current_tetromino, game.position).forEach(
        function (coord) {
            try {
                const cell = cells[coord[1]][coord[0]];
                cell.className = (
                    `cell current ${game.current_tetromino.block_type}`
                );
            } catch (ignore) {

            }
        }
    );

    game.next_tetromino.grid.forEach(function (line, line_index) {
        line.forEach(function (block, column_index) {
            const MiniCell = MiniCellsNext[line_index+3][column_index+3];
            MiniCell.className = `cell ${block}`;
        });
    });
};

// Don't allow the player to hold down the rotate key.
let key_locked = false;

document.body.onkeyup = function () {
    key_locked = false;
};

document.body.onkeydown = function (event) {
    if (!key_locked && event.key === "ArrowUp") {
        key_locked = true;
        game = Tetris.rotate_ccw(game);
    }
    if (event.key === "ArrowDown") {
        game = Tetris.soft_drop(game);
    }
    if (event.key === "ArrowLeft") {
        game = Tetris.left(game);
    }
    if (event.key === "ArrowRight") {
        game = Tetris.right(game);
    }
    if (event.key === " ") {
        game = Tetris.hard_drop(game);
    }
    if (event.key === "c") {
        game = Tetris.hold(game);
    }
    update_grid();
};

const timer_function = function () {
    game = Tetris.next_turn(game);
    update_grid();
    setTimeout(timer_function, 500);
};

setTimeout(timer_function, 500);

update_grid();
