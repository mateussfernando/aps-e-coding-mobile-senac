import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, Image, Button, Alert, 
  ScrollView, TouchableOpacity, Switch, ActivityIndicator, FlatList, Modal 
} from 'react-native';

export default function App() {
  const [name, setName] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const items = [
    { id: '1', title: '🍕 Pizza' },
    { id: '2', title: '🍔 Hamburguer' },
    { id: '3', title: '🍣 Sushi' },
    { id: '4', title: '🥗 Salada' }
  ];

  const handleGreet = () => {
    Alert.alert('Olá!', `Seja bem-vindo(a), ${name || 'usuário'}!`);
  };

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Pronto!', 'A operação foi concluída.');
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mini Hub de Componentes</Text>

      <Image
        source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
        style={styles.image}
      />

      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={name}
        onChangeText={setName}
      />

      <Button title="Saudar" onPress={handleGreet} />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Modo escuro:</Text>
        <Switch
          value={isEnabled}
          onValueChange={toggleSwitch}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={simulateLoading}>
        <Text style={styles.buttonText}>Simular carregamento</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#007aff" style={styles.loading} />}

      <TouchableOpacity style={[styles.button, { backgroundColor: '#4a90e2' }]} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Abrir Modal</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Text style={styles.item}>{item.title}</Text>}
        style={styles.list}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}> Modal Aberto!</Text>
            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 100,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 20
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    width: '100%',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  label: {
    marginRight: 10
  },
  button: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    marginVertical: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  loading: {
    marginVertical: 10
  },
  list: {
    marginVertical: 20,
    width: '100%'
  },
  item: {
    fontSize: 16,
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10
  }
});
