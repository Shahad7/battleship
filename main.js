const ship = (len, ntn) => {
	let length = len;
	let notation = ntn;
	let hits = 0;
	const isSunk = () => (length <= getHits() ? true : false);
	const hit = () => {
		//alert('got hit');
		hits++;
	};
	const getHits = () => hits;

	return {
		length,
		notation,
		getHits,
		isSunk,
		hit,
	};
};

const gameBoard = (player) => {
	let gameBoard;
	if (player == 'human')
		gameBoard = [
			['c2', '_', 'c3', 'c3', 'c3', '_', 'd5', '_', 'd2', 'd2'],
			['c2', '_', '_', '_', '_', '_', 'd5', '_', '_', '_'],
			['c2', '_', '_', '_', '_', '_', '_', '_', '_', 'b1'],
			['_', '_', '_', 'b2', 'b2', 'b2', 'b2', '_', '_', 'b1'],
			['_', '_', '_', '_', '_', '_', '_', '_', '_', 'b1'],
			['_', '_', '_', '_', '_', '_', '_', '_', '_', 'b1'],
			['_', 'c1', 'c1', 'c1', '_', 'd1', 'd1', '_', '_', '_'],
			['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
			['_', '_', '_', '_', '_', '_', '_', '_', '_', 'd4'],
			['c', 'c', 'c', 'c', 'c', '_', 'd3', 'd3', '_', 'd4'],
		];
	else
		gameBoard = [
			['b2', '_', '_', 'c2', '_', '_', 'b1', 'b1', 'b1', 'b1'],
			['b2', '_', '_', 'c2', '_', '_', '_', '_', '_', '_'],
			['b2', '_', '_', 'c2', '_', '_', '_', '_', '_', '_'],
			['b2', '_', '_', '_', '_', '_', '_', 'd5', '_', '_'],
			['_', '_', 'd1', 'd1', '_', 'd2', '_', 'd5', '_', 'c1'],
			['_', '_', '_', '_', '_', 'd2', '_', '_', '_', 'c1'],
			['c3', 'c3', 'c3', '_', '_', '_', '_', '_', '_', 'c1'],
			['_', '_', '_', '_', '_', '_', '_', '_', '_', '_'],
			['d3', '_', '_', 'd4', '_', '_', '_', '_', '_', '_'],
			['d3', '_', '_', 'd4', '_', 'c', 'c', 'c', 'c', 'c'],
		];

	let ships = {};
	let shipNotations = [
		'c',
		'b1',
		'b2',
		'c1',
		'c2',
		'c3',
		'd1',
		'd2',
		'd3',
		'd4',
		'd5',
	];

	const hitShip = (ship) => {
		//alert(ship);
		ships[ship].hit();
	};

	const receiveAttacks = (coordinates) => {
		let board = gameBoard.slice();
		let [x, y] = coordinates;

		if (shipNotations.includes(board[x][y])) {
			hitShip(board[x][y]);
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
			if (!ships[ship].isSunk()) {
				//alert('remains');
				return false;
			}
		}
		alert('none');
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
		ships,
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
		//alert([x, y + 'bot']);
		return [x, y];
	};

	return {
		makeMove,
	};
};

const Infos = (() => {
	let move = [];
	const getMove = () => move;
	const setMove = (mv) => {
		move = mv;
	};

	return { getMove, setMove };
})();

const game = (() => {
	let turn = 0;
	let gameOver = false;
	let player = Player();
	let bot = Bot();
	let winner, move;

	let playerOcean = gameBoard('human');
	let botOcean = gameBoard('bot');
	//Milton Bradley version of rules for ships
	let carrier = ship(5, 'c');
	let battleship1 = ship(4, 'b1');
	let battleship2 = ship(4, 'b2');
	let cruiser1 = ship(3, 'c1');
	let cruiser2 = ship(3, 'c2');
	let cruiser3 = ship(3, 'c3');
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
					//alert(move);
					botOcean.setBoard(botOcean.receiveAttacks(move));
					Infos.setMove(null);
				}
				turn = 1;
				DOM.disableOcean();
				if (botOcean.reportStatus()) {
					gameOver = true;
					winner = 'player';
					alert('somebody won');
				}
				DOM.markMove(move, 'human');
				gameLoop();
			} else if (turn == 1) {
				//bot's turn
				move = bot.makeMove(playerOcean.getBoard());
				playerOcean.setBoard(playerOcean.receiveAttacks(move));
				turn = 0;
				DOM.enableOcean();
				DOM.markMove(move, 'bot');

				if (botOcean.reportStatus()) {
					gameOver = true;
					winner = 'bot';
				}
			}
		}
	};

	const getGameStatus = () => gameOver;
	return { gameLoop, getGameStatus, playerOcean, botOcean };
})();

/* istanbul ignore next */
const DOM = (function () {
	//normal variables
	let cellId, x, y, xy;
	let start = false;

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

				if (!game.getGameStatus()) game.gameLoop();
			});
	});
	//need one for bot too
	const markMove = (coordinates, player) => {
		let [x, y] = coordinates,
			node,
			str;
		//alert([x, y]);
		str = calcPos([x, y]);
		//alert(str);
		if (player == 'human') {
			node = document.getElementById(`2cell${str}`);
			if (game.botOcean.getBoard()[x][y] == 'h') {
				node.textContent = '❌';
				node.style.color = 'red';
			} else {
				node.textContent = '.';
				node.style.color = 'black';
			}
		} else {
			node = document.getElementById(`1cell${str}`);
			if (game.playerOcean.getBoard()[x][y] == 'h') {
				node.textContent = '❌';
				node.style.color = 'red';
			} else {
				node.textContent = '.';
				node.style.color = 'black';
			}
		}
		node.style.pointerEvents = 'none';
	};

	const calcPos = (coordinates) => {
		let [x, y] = coordinates;
		let str = (x * 10 + y + 1).toString();
		if (x == 0) str = '0' + (y + 1).toString();
		if (x == 0 && y == 9) str = '10';
		return str;
	};
	const disableOcean = () => {
		ocean2.style.pointerEvents = 'none';
		//alert('disabled');
	};

	const enableOcean = () => {
		ocean2.style.pointerEvents = 'auto';
		//alert('enabled');
	};

	//drag n drop api
	const drag = (e) => {
		e.dataTransfer.setData('id', e.target.id);
	};

	const drop = (e) => {
		e.preventDefault();
		let id = e.dataTransfer.getData('id');
		//console.log(e.target);
		e.target.appendChild(document.getElementById(id));
	};

	oceanCells.forEach((element) => {
		if (element.parentNode.className == 'ocean1')
			element.addEventListener('dragover', (e) => {
				e.preventDefault();
				//alert(e.target.id);
			});
		element.addEventListener('drop', (e) => {
			drop(e);
			e.preventDefault();
		});
	});

	const renderOcean = (player) => {
		let board, str, node, nodeId;
		let x, y;
		let ship, length, width, size;
		if (player == 'human') {
			board = game.playerOcean.getBoard();
			for (i in board)
				for (j in board) {
					x = parseInt(i);
					y = parseInt(j);
					str = calcPos([x, y]);
					nodeId = `1cell${str}`;
					node = document.getElementById(nodeId);

					if (
						board[x][y] != '_' &&
						(board[x][y - 1] == '_' || y == 0) &&
						(x == 0 || board[x - 1][y] == '_') &&
						(x == 9 ||
							board[x + 1][y] == '_' ||
							board[x][y + 1] == '_' ||
							y == 9)
					) {
						ship = document.createElement('div');
						ship.setAttribute('draggable', 'true');
						ship.setAttribute('id', 's' + nodeId);
						ship.addEventListener('dragstart', (e) => {
							drag(e);
						});
						ship.classList.add('ship');
						size = game.playerOcean.ships[board[x][y]].length;
						if (
							(y == 9 && board[x + 1][y] != '_') ||
							board[x][y + 1] == '_'
						) {
							width = 32;
							height = size * 32;
						} else {
							height = 32;
							width = size * 32;
						}
						ship.style.height = height + 'px';
						ship.style.minWidth = width + 'px';
						node.appendChild(ship);
					}
				}
		} else {
			board = game.botOcean.getBoard();
			for (x in board)
				for (y in board) {
					str = calcPos([parseInt(x), parseInt(y)]);
					node = document.getElementById(`2cell${str}`);
					if (board[x][y] != '_') node.style.backgroundColor = 'blue';
					//node.textContent = board[x][y];
				}
		}
	};
	renderOcean('human');
	//renderOcean('bot');

	return { markMove, disableOcean, enableOcean, renderOcean };
})();

module.exports = { ship, gameBoard, Player, Bot };
