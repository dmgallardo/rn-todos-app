import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {colors} from './colors';

interface Todo {
  title: string;
  completed: boolean;
}
export const SCREEN_WIDTH = Dimensions.get('window').width;

const App = () => {
  useLayoutEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const value = await AsyncStorage.getItem('@todos');
    if (value !== null) {
      setTodos(JSON.parse(value));
    }
  };
  const [todos, setTodos] = useState<Todo[]>([]);

  const [input, setInput] = useState('');

  useEffect(() => {
    updateAsyncStorage();
  }, [todos]);

  const updateAsyncStorage = async () => {
    const jsonValue = JSON.stringify(todos);
    await AsyncStorage.setItem('@todos', jsonValue);
  };
  const addTodo = async () => {
    try {
      const newTodos = [
        ...todos,
        {
          title: input,
          completed: false,
        },
      ];
      setTodos(newTodos);
      setInput('');
    } catch (e: any) {
      // saving error
      console.error(e.message);
    }
  };
  const toggleComplete = (index: number) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const handleDelete = (index: number) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
  };
  const isDisabled = useMemo(() => input === '', [input]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 30, color: colors.ocean[500]}}>OTT Todo App</Text>
      </View>
      <ScrollView>
        {todos.map((todo, key) => (
          <View
            key={todo.title}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 10,
              borderBottomWidth: 1,
              marginHorizontal: 25,
              marginBottom: 10,
              borderColor: colors.gray[500],
            }}>
            <Text
              style={{
                color: todo.completed ? colors.gray[900] : '#000',
                textDecorationLine: todo.completed ? 'line-through' : 'none',
              }}>
              {todo.title}
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {todo.completed && (
                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    backgroundColor: colors.orchid[25],
                    padding: 10,
                    borderRadius: 10,
                  }}
                  onPress={() => toggleComplete(key)}>
                  <Text style={{color: colors.orchid[500]}}>Activate</Text>
                </TouchableOpacity>
              )}
              {!todo.completed && (
                <TouchableOpacity
                  style={{
                    marginHorizontal: 10,
                    backgroundColor: colors.pine[25],
                    padding: 10,
                    borderRadius: 10,
                  }}
                  onPress={() => toggleComplete(key)}>
                  <Text style={{color: colors.pine[500]}}>Complete</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{
                  backgroundColor: colors.coral[25],
                  padding: 10,
                  borderRadius: 10,
                }}
                onPress={() => handleDelete(key)}>
                <Text style={{color: colors.coral[500]}}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          display: 'flex',
          paddingHorizontal: 20,
          marginVertical: 20,
          flexDirection: 'row',
        }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={{
            borderColor: colors.gray[500],
            borderWidth: 1,
            paddingVertical: 4,
            paddingHorizontal: 10,
            width: SCREEN_WIDTH * 0.6,
            borderRadius: 10,
            color: colors.gray[900],
          }}
        />
        <TouchableOpacity
          onPress={addTodo}
          disabled={isDisabled}
          style={{
            width: SCREEN_WIDTH * 0.25,
            marginLeft: 10,
            borderRadius: 10,
            padding: 10,
            backgroundColor: isDisabled ? colors.gray[100] : colors.pine[100],
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: colors.white}}>Add Todo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;
