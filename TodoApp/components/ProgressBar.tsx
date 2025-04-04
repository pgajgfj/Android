import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';

const ProgressBar = () => {
    const [progress, setProgress] = useState(0); // Локальний стан для відображення %
    const animatedProgress = useSharedValue(0); // Анімоване значення

    const handleNext = () => {
        const newProgress = progress === 100 ? 0 : progress + 25; // Збільшення на 25% або скидання
        setProgress(newProgress);
        animatedProgress.value = withTiming(newProgress, { duration: 500 }); // Плавна анімація
    };

    const animatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            animatedProgress.value,
            [0, 50, 100],
            ['#ff0000', '#ffff00', '#00ff00'] // Червоний -> Жовтий -> Зелений
        );

        return {
            width: `${animatedProgress.value}%`,
            backgroundColor,
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.progressBar}>
                <Animated.View style={[styles.progress, animatedStyle]} />
            </View>
            <Button title="Next" onPress={handleNext} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        alignItems: 'center',
    },
    progressBar: {
        width: '100%',
        height: 20,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progress: {
        height: '100%',
        borderRadius: 10,
    },
});

export default ProgressBar;