import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const StatisticsScreen = ({route}) => {
  const {playerName} = route.params;
  const [summary, setSummary] = useState({
    total: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    opponents: {},
  });

  useEffect(() => {
    const fetchStats = async () => {
      const snapshot = await firestore()
        .collection('gameHistory')
        .where('playerX', '==', playerName)
        .get();

      const snapshot2 = await firestore()
        .collection('gameHistory')
        .where('playerO', '==', playerName)
        .get();

      const games = [...snapshot.docs, ...snapshot2.docs];
      const data = {
        total: games.length,
        wins: 0,
        losses: 0,
        draws: 0,
        opponents: {},
      };

      games.forEach(doc => {
        const game = doc.data();
        const isX = game.playerX === playerName;
        const opponent = isX ? game.playerO : game.playerX;
        const winSymbol = isX ? 'X' : 'O';

        if (!data.opponents[opponent]) {
          data.opponents[opponent] = {played: 0, won: 0, lost: 0, draw: 0};
        }

        data.opponents[opponent].played += 1;

        if (game.winner === 'draw') {
          data.draws += 1;
          data.opponents[opponent].draw += 1;
        } else if (game.winner === winSymbol) {
          data.wins += 1;
          data.opponents[opponent].won += 1;
        } else {
          data.losses += 1;
          data.opponents[opponent].lost += 1;
        }
      });

      setSummary(data);
    };

    fetchStats();
  }, [playerName]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Player: {playerName}</Text>
      <Text>Total Games: {summary.total}</Text>
      <Text>Wins: {summary.wins}</Text>
      <Text>Losses: {summary.losses}</Text>
      <Text>Draws: {summary.draws}</Text>

      <Text style={styles.subHeader}>Stats vs Opponents</Text>
      <FlatList
        data={Object.entries(summary.opponents)}
        keyExtractor={([opponent]) => opponent}
        renderItem={({item}) => {
          const [opponent, stats] = item;
          return (
            <View style={styles.opponentCard}>
              <Text>Opponent: {opponent}</Text>
              <Text>Games: {stats.played}</Text>
              <Text>Wins: {stats.won}</Text>
              <Text>Losses: {stats.lost}</Text>
              <Text>Draws: {stats.draw}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default StatisticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 20
    },
  header: {
    fontSize: 22, 
    fontWeight: 'bold',
    marginBottom: 10
    },
  subHeader: {
    marginTop: 20, 
    fontSize: 18, 
    fontWeight: 'bold'
    },
  opponentCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 6,
    borderRadius: 10,
  },
});
