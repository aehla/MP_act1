// TaskItem.js
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';

export default function TaskItem({ item, editTask, deleteTask, toggleTaskCompletion }) {
  const [isChecked, setIsChecked] = useState(item.completed);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    toggleTaskCompletion(item.key);
  };

  return (
    <View style={[styles.taskContainer, item.completed && styles.completed]}>
      <TouchableWithoutFeedback onPress={handleToggle}>
        <View style={styles.checkbox}>
          {isChecked && <Text style={styles.checkboxText}>✔</Text>}
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.taskContent}>
        <Text style={[styles.task, item.completed && styles.completedText]}>{item.value}</Text>
        {item.deadline && <Text style={styles.deadline}>Deadline: {item.deadline}</Text>}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => editTask(item.key, item.value, item.deadline)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        {!item.completed && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.key)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F3E5F5',
    marginBottom: 10,
    borderRadius: 10,
  },
  completed: {
    backgroundColor: '#D1C4E9',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4A148C',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 18,
    color: '#4A148C',
  },
  taskContent: {
    flex: 1,
  },
  task: {
    fontSize: 16,
    color: '#4A148C',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  deadline: {
    fontSize: 14,
    color: '#6A1B9A',
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#AB47BC',
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
