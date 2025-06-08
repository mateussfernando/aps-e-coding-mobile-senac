import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Alert, Share
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const moods = [
  { emoji: '😊', label: 'Feliz' },
  { emoji: '😐', label: 'Neutro' },
  { emoji: '😞', label: 'Triste' },
];

export default function App() {
  const [history, setHistory] = useState([]);

  const saveMood = async (mood) => {
    const entry = {
      mood,
      date: new Date().toLocaleString(),
    };
    const updatedHistory = [entry, ...history];
    setHistory(updatedHistory);
    await AsyncStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    Alert.alert('Humor registrado!', `Você se sente ${mood.label}`);
  };

  const loadHistory = async () => {
    const stored = await AsyncStorage.getItem('moodHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const shareLastMood = async () => {
    if (history.length === 0) {
      Alert.alert('Nenhum humor registrado ainda!');
      return;
    }

    const last = history[0];
    try {
      await Share.share({
        message: `Hoje estou me sentindo ${last.mood.emoji} ${last.mood.label} — registrado no app MoodLogger`,
      });
    } catch (error) {
      Alert.alert('Erro ao compartilhar', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Como você está se sentindo?</Text>

      <View style={styles.moodOptions}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.emoji}
            style={styles.moodButton}
            onPress={() => saveMood(mood)}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={shareLastMood}>
        <Text style={styles.shareText}>📤 Compartilhar último humor</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>📅 Histórico recente</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text style={styles.historyText}>{item.date}</Text>
            <Text style={styles.historyMood}>{item.mood.emoji} {item.mood.label}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ marginTop: 10, color: '#999' }}>Nenhum registro ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  moodButton: {
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 40,
  },
  moodLabel: {
    marginTop: 5,
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  shareText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  historyItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyText: {
    fontSize: 14,
    color: '#555',
  },
  historyMood: {
    fontSize: 18,
  },
});
