import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {getAuth} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Snackbar from 'react-native-snackbar';
import uuid from 'react-native-uuid';

const GameScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [gameCode, setGameCode] = useState('');

  useEffect(() => {
    const user = getAuth().currentUser;
    if (user) {
      setName(user.displayName || 'User');
    }
  }, []);

  const handleCreateGame = async () => {
    const newGameCode = uuid.v4().slice(0, 10);

    await firestore()
      .collection('games')
      .doc(newGameCode)
      .set({
        playerX: name,
        playerO: null,
        board: Array(9).fill(null),
        isXNext: true,
        gameOver: false,
        winner: null,
      });

    navigation.navigate('HomeScreen', {
      gameCode: newGameCode,
      playerSymbol: 'X',
      playerName: name,
      isCreator: true,
    });
  };

  const handleJoinGame = async () => {
    if (!gameCode) {
      Snackbar.show({text: 'Enter game code', duration: Snackbar.LENGTH_SHORT});
      return;
    }

    const doc = await firestore().collection('games').doc(gameCode).get();

    if (!doc.exists) {
      Snackbar.show({text: 'Game not found', duration: Snackbar.LENGTH_SHORT});
      return;
    }

    const gameData = doc.data();

    if (gameData.playerO) {
      Snackbar.show({
        text: 'Game is already full',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }

    await firestore().collection('games').doc(gameCode).update({
      playerO: name,
    });

    navigation.navigate('HomeScreen', {
      gameCode: gameCode,
      playerSymbol: 'O',
      playerName: name,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require('../assets/logo.png')} />
      </View>
      <Text style={{fontSize: 8, color: '#fff'}}>{name}</Text>
      <TextInput
        placeholder="Enter code to join or create a game"
        value={gameCode}
        onChangeText={setGameCode}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateGame}>
        <Text style={styles.buttonText}>Create Game</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleJoinGame}>
        <Text style={styles.buttonText}>Join Game</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 34,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    borderWidth: 1,
    borderColor: '',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    width: '100%',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
