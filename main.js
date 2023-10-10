const ship = (len, ntn) => {
	let length = len;
	let notation = ntn;
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
		notation,
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

	let ships = {};
	let shipNotations = [
		'c',
		'b1',
		'b2',
		'c1',
		'c2',
		'c3',
		's1',
		's2',
		's3',
		's4',
		'd1',
		'd2',
		'd3',
		'd4',
		'd5',
	];

	const hitShip = (ship) => {
		ships[ship].hit();
	};

	const receiveAttacks = (coordinates) => {
		let board = gameBoard.slice();
		let [x, y] = coordinates;

		if (shipNotations.includes(board[x][y])) {
			board[x][y] = 'h';
			hitShip(board[x][y]);
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
				if (gameBoard[x][i] != '_' || hasOverlappingNeighbors([x, i])) {
					return 1;
				}
			}
			return 0;
		}
		if (direction == 1) {
			for (let i = x; i < x + length; i++) {
				if (gameBoard[i][y] != '_' || hasOverlappingNeighbors([x, i])) {
					return 1;
				}
			}
			return 0;
		}
	};

	const placeShips = (coordinates, length, direction, ship) => {
		let [x, y] = coordinates;
		let board = gameBoard.slice();
		if (!isOverlapped(coordinates, length, direction)) {
			if (direction == 0) {
				for (let i = y; i < y + length; i++) {
					board[x][i] = ship;
				}
			}
			if (direction == 1) {
				for (let i = x; i < x + length; i++) {
					board[i][y] = ship;
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
			ships[element.notation] = element;
		});
	};

	// reports if whether all the ships are sunk
	const reportStatus = () => {
		for (let ship in ships) {
			if (!ships[ship].isSunk()) return false;
		}
		return true;
	};

	const getBoard = () => gameBoard;

	return {
		reportStatus,
		receiveAttacks,
		placeShips,
		setBoard,
		getBoard,
		addShips,
	};
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

const Infos = (() => {
	let move = [];
	let start = false;
	const getMove = () => move;
	const setMove = (mv) => {
		move = mv;
	};
	const getStart = () => {
		return start;
	};

	const initialize = () => {
		start = !start;
		game = makeGame();
		game.gameLoop();
	};
	return { getMove, setMove, getStart, initialize };
})();

const makeGame = () => {
	let turn = 0;
	let gameOver = false;
	let player = Player();
	let bot = Bot();
	let winner, move;

	let playerOcean = gameBoard();
	let botOcean = gameBoard();
	//Milton Bradley version of rules for ships
	let carrier = ship(5, 'c');
	let battleship1 = ship(4, 'b1');
	let battleship2 = ship(4, 'b2');
	let cruiser1 = ship(3, 'c1');
	let cruiser2 = ship(3, 'c2');
	let cruiser3 = ship(3, 'c3');
	let submarine1 = ship(3, 's1');
	let submarine2 = ship(3, 's2');
	let submarine3 = ship(3, 's3');
	let submarine4 = ship(3, 's4');
	let destroyer1 = ship(2, 'd1');
	let destroyer2 = ship(2, 'd2');
	let destroyer3 = ship(2, 'd3');
	let destroyer4 = ship(2, 'd4');
	let destroyer5 = ship(2, 'd5');

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
	const gameLoop = () => {
		if (!gameOver) {
			if (turn == 0) {
				//player's turn
				move = Infos.getMove();
				if (move != null) {
					alert(move);
					botOcean.setBoard(botOcean.receiveAttacks(move));
					Infos.setMove(null);
				}
				turn = 1;
				alert('calling');
				DOM.disableOcean();
				if (botOcean.reportStatus()) {
					gameOver = true;
					winner = 'player';
				}
			} else if (turn == 1) {
				//bot's turn
				playerOcean.setBoard(
					playerOcean.receiveAttacks(
						bot.makeMove(playerOcean.getBoard())
					)
				);
				turn = 0;

				if (botOcean.reportStatus()) {
					gameOver = true;
					winner = 'bot';
				}
			}
		}
	};

	const getGameStatus = () => gameOver;
	return { gameLoop, getGameStatus };
};

const DOM = (function () {
	//normal variables
	let cellId, x, y, xy;

	//DOM elements
	const ocean1 = document.querySelector('.ocean1');
	const ocean2 = document.querySelector('.ocean2');
	const oceanCells = document.querySelectorAll('.ocean-cell');

	oceanCells.forEach((element) => {
		if (element.parentNode.className == 'ocean2')
			element.addEventListener('click', () => {
				cellId = element.getAttribute('id');
				xy = parseInt(cellId.substring(5, 7));
				xy$ = parseInt(cellId.substring(5, 8));
				xy--;
				if (xy$ != 100) {
					if (xy <= 9) {
						x = 0;
						y = xy;
					} else {
						x = Math.floor(xy / 10);
						y = xy % 10;
					}
				} else {
					x = 9;
					y = 9;
				}
				Infos.setMove([x, y]);
				markMove([x, y]);
				if (!Infos.getStart()) Infos.initialize();
				if (!game.getGameStatus) game.gameLoop();
			});
	});

	const markMove = (coordinates) => {
		let [x, y] = coordinates,
			node;
		let str = (x * 10 + y + 1).toString();
		if (x == 0) str = '0' + (y + 1).toString();
		if (x == 0 && y == 9) str = '10';
		node = document.getElementById(`2cell${str}`);
		node.style.pointerEvents = 'none';
		node.style.borderColor = 'red';
	};

	const disableOcean = () => {
		ocean2.style.borderColor = 'blue';
		ocean2.style.backgroundColor = 'blue';
		ocean2.disabled = true;
		alert('here');
	};

	return { markMove, disableOcean };
})();

//module.exports = { ship, gameBoard, Player, Bot };
