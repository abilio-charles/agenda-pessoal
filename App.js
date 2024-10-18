import React, { useState, useEffect } from 'react';
import { ApplicationProvider, Layout, Text, Button, Input, List, ListItem, Toggle } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Lobster_400Regular } from '@expo-google-fonts/lobster';


SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Lobster_400Regular,
  });

  // Gerenciar o estado do tema (claro ou escuro)
  const [theme, setTheme] = useState('light');

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // Carregar compromissos salvos no AsyncStorage ao iniciar
  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    };
    loadTasks();
  }, []);

  // Esconder a tela de splash após as fontes serem carregadas
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Função para salvar compromissos no AsyncStorage
  const saveTasks = async (tasks) => {
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  };

  // Função para adicionar novo compromisso
  const addTask = () => {
    if (task.trim() === '') return;
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    setTask('');
    saveTasks(newTasks);
  };

  // Função para excluir compromisso da lista
  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Função para alternar entre o tema claro e escuro
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  // Função para renderizar cada item da lista de compromissos
  const renderTask = ({ item, index }) => (
    <ListItem
      title={item}
      accessoryRight={() => <Button size="tiny" onPress={() => removeTask(index)}>Excluir</Button>}
    />
  );

  // Não renderiza a UI enquanto as fontes estão carregando
  if (!fontsLoaded) {
    return null;
  }

  return (
    // Alterna o tema entre light e dark
    <ApplicationProvider {...eva} theme={theme === 'light' ? eva.light : eva.dark}>
      <Layout style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        
        {/* Título da Agenda com a fonte personalizada */}
        <Text style={{ fontFamily: 'Lobster_400Regular', fontSize: 36, textAlign: 'center', color: '#3366FF', marginBottom: 20, marginTop: 50 }}>
          Agenda Pessoal
        </Text>

        {/* Botão de alternância de tema */}
        <Toggle
          checked={theme === 'dark'}
          onChange={toggleTheme}
          style={{ marginBottom: 20 }}
        >
          {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
        </Toggle>

        {/* Campo de entrada de texto para adicionar compromissos */}
        <Input
          placeholder="Digite o compromisso"
          value={task}
          onChangeText={setTask}
          style={{ marginBottom: 20 }}
        />

        {/* Botão para adicionar compromissos */}
        <Button onPress={addTask}>Adicionar Compromisso</Button>

        {/* Lista de compromissos */}
        <List
          data={tasks}
          renderItem={renderTask}
          style={{ marginTop: 20 }}
        />
      </Layout>
    </ApplicationProvider>
  );
}
