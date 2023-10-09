const ship = (len) => {
	let length = len;
	let parts = [];
	let hits = 0;
	const isSunk = () => (length == hits ? true : false);
	const hit = () => {
		hits++;
	};
	const getHits = () => hits;

	return {
		length,
		parts,
		getHits,
		isSunk,
		hit,
	};
};

const gameBoard = () => {
	//  prettier-ignore
	let gameBoard = [
		['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
        ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
		['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
	    ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
		['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
	    ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
		['_', '_', '_', '_', '_', '_', '_', '_', '_', '_']
	];

	let ships = [];
	const receiveAttacks = (coordinates) => {
		let board = gameBoard.slice();
		let [x, y] = coordinates;
		if (board[x][y] == 's') {
			board[x][y] = 'h';
		} else board[x][y] = 'm';

		return board;
	};

	const hasOverlappingNeighbors = (coordinates) => {
		let [x, y] = coordinates;
		let offsets = [
			[0, -1],
			[0, 1],
			[1, 0],
			[0, 1],
			[1, -1],
			[1, 1],
			[-1, -1],
			[-1, 1],
		];
		let x$, y$;
		offsets.forEach((element) => {
			x$ = x + element[0];
			y$ = y + element[1];
			if (
				x$ <= 9 &&
				x$ >= 0 &&
				y$ <= 9 &&
				y$ >= 0 &&
				gameBoard[x$][y$] == 's'
			) {
				return 1;
			}
		});
		return 0;
	};

	const isOverlapped = (coordinates, length, direction) => {
		let [x, y] = coordinates;
		if (direction == 0) {
			for (let i = y; i < y + length; i++) {
				if (gameBoard[x][i] == 's' || hasOverlappingNeighbors([x, i])) {
					return 1;
				}
			}
			return 0;
		}
		if (direction == 1) {
			for (let i = x; i < x + length; i++) {
				if (gameBoard[i][y] == 's' || hasOverlappingNeighbors([x, i])) {
					return 1;
				}
			}
			return 0;
		}
	};

	const placeShips = (coordinates, length, direction) => {
		let [x, y] = coordinates;
		let board = gameBoard.slice();
		if (!isOverlapped(coordinates, length, direction)) {
			if (direction == 0) {
				for (let i = y; i < y + length; i++) {
					board[x][i] = 's';
				}
			}
			if (direction == 1) {
				for (let i = x; i < x + length; i++) {
					board[i][y] = 's';
				}
			}
		}
		return board;
	};

	const setBoard = (board) => {
		gameBoard = board;
	};

	const addShips = (shipCollection) => {
		shipCollection.forEach((element) => {
			ships.push(element);
		});
	};

	// reports if whether all the ships are sunk
	const reportStatus = () => {
		for (let ship of ships) {
			if (!ship.isSunk()) return false;
		}
		return true;
	};

	return { reportStatus, receiveAttacks, placeShips, setBoard, addShips };
};

const Player = () => {
	//not needed for now

	return {};
};

const Bot = () => {
	const getBoard = () => botOcean;

	const makeMove = (board) => {
		let x, y;
		do {
			x = Math.floor(Math.random() * 10);
			y = Math.floor(Math.random() * 10);
		} while (board[x][y] == 'h' || board[x][y] == 'm');

		return [x, y];
	};

	return {
		makeMove,
	};
};

const game = () => {
	let turn = 0;
	let gameOver = false;
	let player = Player();
	let bot = Bot();
	let move, winner;

	let playerOcean = gameBoard();
	let botOcean = gameBoard();
	//Milton Bradley version of rules for ships
	let carrier = ship(5);
	let battleship1 = ship(4);
	let battleship2 = ship(4);
	let cruiser1 = ship(3);
	let cruiser2 = ship(3);
	let cruiser3 = ship(3);
	let submarine1 = ship(3);
	let submarine2 = ship(3);
	let submarine3 = ship(3);
	let submarine4 = ship(3);
	let destroyer1 = ship(2);
	let destroyer2 = ship(2);
	let destroyer3 = ship(2);
	let destroyer4 = ship(2);
	let destroyer5 = ship(2);

	playerOcean.addShips([
		carrier,
		battleship1,
		battleship2,
		cruiser1,
		cruiser2,
		cruiser3,
		submarine1,
		submarine2,
		submarine3,
		submarine4,
		destroyer1,
		destroyer2,
		destroyer3,
		destroyer4,
		destroyer5,
	]);
	botOcean.addShips([
		carrier,
		battleship1,
		battleship2,
		cruiser1,
		cruiser2,
		cruiser3,
		submarine1,
		submarine2,
		submarine3,
		submarine4,
		destroyer1,
		destroyer2,
		destroyer3,
		destroyer4,
		destroyer5,
	]);

	//main game loop
	//ships aren't actually being hit even tho the hits are marked
	while (!gameOver) {
		if (turn == 0) {
			//player's turn
			//move
			botOcean = botOcean.receiveAttacks(move);
			turn = 1;

			if (botOcean.reportStatus()) {
				gameOver = true;
				winner = 'player';
			}
		} else if (turn == 1) {
			//bot's turn
			playerOcean = playerOcean.receiveAttacks(bot.makeMove(playerOcean));
			turn = 0;
			if (botOcean.reportStatus()) {
				gameOver = true;
				winner = 'bot';
			}
		}
	}
};

module.exports = { ship, gameBoard, Player, Bot };
