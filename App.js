// App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useState } from 'react';
import TaskInput from './TaskInput';
import TaskItem from './TaskItem';

export default function App() {
  const [task, setTask] = useState('');
  const [deadline, setDeadline] = useState('');
  const [editing, setEditing] = useState(null);
  const [tasks, setTasks] = useState([]);

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
    }
  };

  const deleteTask = (key) => {
    setTasks(tasks.filter(task => task.key !== key));
  };

  const editTask = (key, value, deadlineValue) => {
    setTask(value);
    setDeadline(deadlineValue);
    setEditing(key);
  };

  const toggleTaskCompletion = (key) => {
    const updatedTasks = tasks.map((t) =>
      t.key === key ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My To-Do List</Text>

      <TaskInput
        task={task}
        setTask={setTask}
        addTask={addTask}
        editing={editing}
        deadline={deadline}
        setDeadline={setDeadline}
      />

      <Text style={styles.sectionTitle}>Active Tasks</Text>
      <FlatList
        data={incompleteTasks}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            editTask={editTask}
            deleteTask={deleteTask}
            toggleTaskCompletion={toggleTaskCompletion}
          />
        )}
        keyExtractor={(item) => item.key}
      />

      <Text style={styles.sectionTitle}>Finished Tasks</Text>
      <FlatList
        data={completedTasks}
        renderItem={({ item }) => (
          <TaskItem
            item={item}
            editTask={editTask}
            deleteTask={deleteTask}
            toggleTaskCompletion={toggleTaskCompletion}
          />
        )}
        keyExtractor={(item) => item.key}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7F6',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A148C',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A148C',
    marginVertical: 10,
  },
});
