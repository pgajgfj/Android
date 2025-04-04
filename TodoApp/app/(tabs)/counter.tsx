
import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { selectUncompletedCount } from '../../redux/todosSlice';

export default function CounterScreen() {
    const uncompleted = useSelector(selectUncompletedCount);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24 }}>Невиконаних завдань: {uncompleted}</Text>
        </View>
    );
}
