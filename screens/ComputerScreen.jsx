import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ComputerScreen = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningCombo, setWinningCombo] = useState([]);

  useEffect(() => {
    const result = checkWinner(board);
    if (result) {
      setWinner(result.winner);
      setWinningCombo(result.combo || []);
    } else if (!isPlayerTurn) {
      const timer = setTimeout(() => makeComputerMove(), 300);
      return () => clearTimeout(timer);
    }
  }, [board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningCombo([]);
  };

  const handlePress = (index) => {
    if (board[index] || !isPlayerTurn || winner) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const makeComputerMove = () => {
    const bestMove = minimax([...board], true);
    const newBoard = [...board];
    newBoard[bestMove.index] = 'O';
    setBoard(newBoard);
    setIsPlayerTurn(true);
  };

  const checkWinner = (board) => {
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], combo: pattern };
      }
    }
    return board.includes(null) ? null : { winner: 'draw' };
  };

  const minimax = (newBoard, isMaximizing) => {
    const result = checkWinner(newBoard);
    if (result?.winner === 'O') return { score: 1 };
    if (result?.winner === 'X') return { score: -1 };
    if (result?.winner === 'draw') return { score: 0 };

    const player = isMaximizing ? 'O' : 'X';
    let best = isMaximizing ? { score: -Infinity } : { score: Infinity };

    for (let i = 0; i < newBoard.length; i++) {
      if (!newBoard[i]) {
        newBoard[i] = player;
        const sim = minimax(newBoard, !isMaximizing);
        newBoard[i] = null;
        sim.index = i;

        if (isMaximizing && sim.score > best.score) best = sim;
        if (!isMaximizing && sim.score < best.score) best = sim;
      }
    }

    return best;
  };

  const renderCell = (i) => {
    const isWinningCell = winningCombo.includes(i);
    return (
      <TouchableOpacity
        key={i}
        onPress={() => handlePress(i)}
        style={[
          styles.cell,
          isWinningCell && styles.winningCell
        ]}
      >
        <Text style={[styles.cellText, isWinningCell && styles.winningCellText]}>
          {board[i]}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderResult = () => {
    if (!winner) return null;
    if (winner === 'draw') return "It's a Draw!";
    return winner === 'O' ? 'You lose😔' : 'You Win!';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>

      <View style={styles.board}>
        {board.map((_, i) => renderCell(i))}
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>Play Again</Text>
      </TouchableOpacity>

      <Text style={styles.resultText}>{renderResult()}</Text>
    </View>
  );
};

export default ComputerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  board: {
    width: 330,
    height: 330,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 65,
    fontWeight: 'bold',
    color: '#fa8072',
  },
  winningCell: {
    backgroundColor: '#0066b2',
  },
  winningCellText: {
    color: '#fa8072',
  },
  resetButton: {
    marginTop: 30,
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetText: {
    color: '#fff',
    fontSize: 18,
  },
  resultText: {
    fontSize: 22,
    marginTop: 20,
    fontWeight: '600',
    color: '#000',
  },
});
