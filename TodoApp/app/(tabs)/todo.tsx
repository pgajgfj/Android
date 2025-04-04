import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, deleteTodo, toggleTodo, selectUncompletedCount } from '../../redux/todosSlice';
import { RootState } from '../../redux/store';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import uuid from 'react-native-uuid';
import ProgressBar from '../../components/ProgressBar';

export default function TodoScreen() {
    const dispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.todos.items);
    const uncompletedCount = useSelector(selectUncompletedCount);
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    const handleAddTask = async () => {
        if (!title) return;

        const id = uuid.v4().toString();
        let deadlineTime: number | undefined;
        if (deadline) {
            deadlineTime = Date.now() + parseInt(deadline) * 1000;
            await scheduleNotification(id, title, deadlineTime);
        }

        dispatch(addTodo({ id, title, status: 'active', deadline: deadlineTime }));
        setTitle('');
        setDeadline('');
    };

    const handleDeleteTask = async (id: string) => {
        await Notifications.cancelScheduledNotificationAsync(id);
        dispatch(deleteTodo(id));
    };

    const handleToggleTask = (id: string) => {
        dispatch(toggleTodo(id));
    };

    const scheduleNotification = async (id: string, title: string, time: number) => {
        await Notifications.scheduleNotificationAsync({
            identifier: id,
            content: {
                title: 'To-Do Reminder',
                body: title,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: { type: 'date', date: time } as Notifications.NotificationTriggerInput, // Explicit cast
        });
    };

    const registerForPushNotificationsAsync = async () => {
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                Alert.alert('Permission required', 'Failed to get push token for notifications!');
                return;
            }
        } else {
            Alert.alert('Необхідно використовувати фізичний пристрій для сповіщень');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>To-Do List</Text>
            <TextInput
                placeholder="Task title"
                value={title}
                onChangeText={setTitle}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 5,
                }}
            />
            <TextInput
                placeholder="Deadline in seconds (optional)"
                value={deadline}
                onChangeText={setDeadline}
                keyboardType="numeric"
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 5,
                }}
            />
            <Button title="Add Task" onPress={handleAddTask} />


            <ProgressBar />

            <Text style={{ marginVertical: 15 }}>Uncompleted Tasks: {uncompletedCount}</Text>

            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            backgroundColor: '#f9f9f9',
                            padding: 15,
                            marginBottom: 10,
                            borderRadius: 5,
                            borderLeftWidth: 5,
                            borderLeftColor: item.status === 'done' ? 'green' : 'orange',
                        }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
                        <Text>Status: {item.status}</Text>
                        {item.deadline && (
                            <Text>
                                Deadline:{' '}
                                {new Date(item.deadline).toLocaleTimeString()}
                            </Text>
                        )}
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Button title="Toggle" onPress={() => handleToggleTask(item.id)} />
                            <View style={{ width: 10 }} />
                            <Button title="Delete" onPress={() => handleDeleteTask(item.id)} />
                        </View>
                    </View>
                )}
            />
        </View>
    );
}