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
		if (board[x][y] == 's') board[x][y] = 'h';
		else board[x][y] = 'm';

		return board;
	};

	//more to do here, current version ain't checking if the ships are moving out of the ocean
	//or if ships are overlapping
	const isOverlapped = (coordinates, length, direction) => {
		let [x, y] = coordinates;
		if (direction == 0) {
			for (let i = y; i < y + length; i++) {
				if (gameBoard[x][i] == 's') {
					return 1;
				}
			}
			return 0;
		}
		if (direction == 1) {
			for (let i = x; i < x + length; i++) {
				if (gameBoard[i][y] == 's') {
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

	const addShips = (ship) => {
		ships.push(ship);
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

module.exports = { ship, gameBoard };
