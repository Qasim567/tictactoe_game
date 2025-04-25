import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';

const HomeScreen = ({route, navigation}) => {
  const {gameCode, playerSymbol, playerName, isCreator} = route.params || {};

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState([]);
  const [resultMessage, setResultMessage] = useState('');
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('games')
      .doc(gameCode)
      .onSnapshot(doc => {
        const gameData = doc.data();
        if (gameData) {
          setBoard(gameData.board);
          setIsXNext(gameData.isXNext);
          setGameOver(gameData.gameOver);
          setPlayerX(gameData.playerX);
          setPlayerO(gameData.playerO);

          if (gameData.winner) {
            const result = calculateWinner(gameData.board);
            if (result) setWinningLine(result.line);
            setResultMessage(
              gameData.winner === playerSymbol ? 'You win😊' : 'You lose😔',
            );
          } else if (gameData.board.every(cell => cell !== null)) {
            setWinningLine([]);
            setResultMessage("It's a draw!");
          } else {
            setWinningLine([]);
            setResultMessage('');
          }
        }
      });

    return () => unsubscribe();
  }, [gameCode, playerSymbol]);

  useEffect(() => {
    if (isCreator) {
      Alert.alert(
        'Game Created!',
        `Share this code: ${gameCode}`,
        [
          {
            text: 'Copy Code',
            onPress: () => {
              Clipboard.setString(gameCode);
              Snackbar.show({
                text: 'Game code copied!',
                duration: Snackbar.LENGTH_SHORT,
              });
            },
          },
          {text: 'OK', style: 'cancel'},
        ],
        {cancelable: true},
      );
    }
  }, []);

  const handleMove = async index => {
    if (
      board[index] ||
      gameOver ||
      (isXNext && playerSymbol === 'O') ||
      (!isXNext && playerSymbol === 'X')
    )
      return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;

    const result = calculateWinner(newBoard);

    const updateData = {
      board: newBoard,
      isXNext: !isXNext,
    };

    if (result) {
      updateData.winner = result.winner;
      updateData.gameOver = true;

      await firestore().collection('gameHistory').add({
        gameId: gameCode,
        playerX,
        playerO,
        winner: result.winner,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    } else if (newBoard.every(cell => cell !== null)) {
      updateData.gameOver = true;

      await firestore().collection('gameHistory').add({
        gameId: gameCode,
        playerX,
        playerO,
        winner: 'draw',
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
    }

    await firestore().collection('games').doc(gameCode).update(updateData);

    if (result) {
      setWinningLine(result.line);
    }
  };

  const calculateWinner = board => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return {winner: board[a], line};
      }
    }

    return null;
  };

  const resetGame = async () => {
    const emptyBoard = Array(9).fill(null);

    const resetData = {
      board: emptyBoard,
      isXNext: true,
      gameOver: false,
      winner: null,
    };

    await firestore().collection('games').doc(gameCode).update(resetData);

    setBoard(emptyBoard);
    setIsXNext(true);
    setGameOver(false);
    setWinningLine([]);
    setResultMessage('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.playersContainer}>
        <View style={styles.playerColumn}>
          <Text style={styles.symboltxt}>X</Text>
          <Text style={styles.vsText}>{playerX || 'Player X'}</Text>
        </View>
        <View style={styles.playerColumn}>
          <Text style={styles.symboltxt}>O</Text>
          <Text style={styles.vsText}>{playerO || 'Player O'}</Text>
        </View>
      </View>

      <View style={styles.board}>
        {board.map((cell, index) => {
          const isWinningCell = winningLine.includes(index);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.cell, isWinningCell && styles.winningCell]}
              onPress={() => handleMove(index)}>
              <Text
                style={[
                  styles.cellText,
                  isWinningCell && styles.winningCellText,
                ]}>
                {cell}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.resultContainer}>
        {resultMessage ? (
          <Text style={styles.resultText}>{resultMessage}</Text>
        ) : null}
      </View>

      {gameOver && (
        <TouchableOpacity onPress={resetGame} style={styles.playAgainButton}>
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.playAgainButton}
        onPress={() => navigation.navigate('StatisticsScreen', {playerName})}>
        <Text style={styles.playAgainText}>Check Stats</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  playerColumn: {
    alignItems: 'center',
    flex: 1,
  },
  symboltxt: {
    fontSize: 40,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#E4D00A',
    elevation: 15,
  }, 
  vsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
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
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  winningCell: {
    backgroundColor: '#0066b2',
  },
  winningCellText: {
    color: '#fa8072',
  },
  playAgainButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    marginBottom: 40,
  },
  playAgainText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
