import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, RefreshControl, Modal, Pressable, TextInput, Image } from 'react-native';
import { useState, useEffect } from 'react';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'tasks';

export default function App() {
  const [task, setTask] = useState('');
  const [deadline, setDeadline] = useState('');
  const [editing, setEditing] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getPHDate = () => {
      const options = { 
        timeZone: 'Asia/Manila', 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const now = new Date().toLocaleDateString('en-PH', options);
      setCurrentDate(now);
    };

    getPHDate();
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
      if (tasksJson) {
        setTasks(JSON.parse(tasksJson));
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  };

  const addTask = (taskValue, deadlineValue) => {
    if (taskValue.length > 0) {
      if (editing !== null) {
        const updatedTasks = tasks.map((t) =>
          t.key === editing ? { ...t, value: taskValue, deadline: deadlineValue } : t
        );
        setTasks(updatedTasks);
        setEditing(null);
      } else {
        setTasks([...tasks, { key: `${tasks.length}`, value: taskValue, deadline: deadlineValue, completed: false }]);
      }
      setTask('');
      setDeadline('');
      setModalVisible(false);
    }
  };

  const toggleTaskCompletion = (key) => {
    const updatedTasks = tasks.map((t) =>
      t.key === key ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  const editTask = (key, value, deadline) => {
    setTask(value);
    setDeadline(deadline);
    setEditing(key);
    setModalVisible(true);
  };

  const deleteTask = (key) => {
    const updatedTasks = tasks.filter((t) => t.key !== key);
    setTasks(updatedTasks);
  };

  const refreshTasks = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filterTasks = (tasks) => {
    return tasks.filter((task) =>
      task.value.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const incompleteTasks = filterTasks(tasks.filter(task => !task.completed));
  const completedTasks = filterTasks(tasks.filter(task => task.completed));

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeMessage}>Hello, you can do it!</Text>
      <Text style={styles.dateText}>{currentDate}</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search tasks..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {incompleteTasks.length === 0 && searchQuery !== '' && (
        <Text style={styles.noTasksText}>No tasks found</Text>
      )}
      <Text style={styles.title}>Your To-Dos</Text>
      <Text style={styles.sectionTitle}>Active Tasks</Text>
      <FlatList
        data={incompleteTasks}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            toggleTaskCompletion={toggleTaskCompletion}
            editTask={editTask}
            deleteTask={deleteTask}
          />
        )}
        keyExtractor={(item) => item.key}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshTasks}
          />
        }
      />
      <Text style={styles.sectionTitle}>Finished Tasks</Text>
      <FlatList
        data={completedTasks}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            toggleTaskCompletion={toggleTaskCompletion}
            editTask={editTask}
            deleteTask={deleteTask}
          />
        )}
        keyExtractor={(item) => item.key}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Pressable
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <AntDesign name="close" size={24} color="black" />
            </Pressable>
            <View style={styles.taskInputContainer}>
              <TaskInput
                task={task}
                setTask={setTask}
                addTask={addTask}
                editing={editing}
                deadline={deadline}
                setDeadline={setDeadline}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Pressable
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="pluscircle" size={64} color="#6A1B9A" />
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7F6',
    padding: 20,
    paddingTop: 60,
  },
  welcomeMessage: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 5,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#4A148C',
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 10,
    textAlign: 'left',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A148C',
    marginVertical: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    elevation: 5, // Added shadow for floating effect
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  taskInputContainer: {
    marginTop: 40,
  },
  searchInput: {
    borderColor: '#D1C4E9',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noTasksText: {
    fontSize: 18,
    color: '#9E9E9E',
    textAlign: 'center',
    marginVertical: 20,
  },
  taskCard: { // Example card style for tasks
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  deadlineText: { // Example style for deadlines
    color: '#F44336', // Red color for deadlines
    fontSize: 14,
  },
});
