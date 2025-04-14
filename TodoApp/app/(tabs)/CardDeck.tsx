import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

const CardDeck = () => {
    const [cards, setCards] = useState([1, 2, 3, 4, 5]); 

   
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotate = useSharedValue(0);

    const onSwipeComplete = () => {
        
        setCards((prevCards) => {
            const updatedCards = [...prevCards];
            const firstCard = updatedCards.shift();
            if (firstCard !== undefined) {
                updatedCards.push(firstCard);
            }
            return updatedCards;
        });

      
        translateX.value = 0;
        translateY.value = 0;
        rotate.value = 0;
    };

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx: any) => {
            ctx.startX = translateX.value;
            ctx.startY = translateY.value;
        },
        onActive: (event, ctx) => {
            translateX.value = ctx.startX + event.translationX;
            translateY.value = ctx.startY + event.translationY;
            rotate.value = (event.translationX / width) * 25; 
        },
        onEnd: (event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                
                translateX.value = withSpring(event.translationX > 0 ? width : -width, {}, () => {
                    runOnJS(onSwipeComplete)();
                });
                translateY.value = withSpring(event.translationY);
            } else {
                
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                rotate.value = withSpring(0);
            }
        },
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${rotate.value}deg` },
        ],
    }));

    return (
        <GestureHandlerRootView style={styles.container}>
            {cards
                .slice(0)
                .reverse()
                .map((card, index) => {
                    const isTopCard = index === cards.length - 1;
                    return (
                        <PanGestureHandler
                            key={card}
                            onGestureEvent={isTopCard ? gestureHandler : undefined}
                        >
                            <Animated.View
                                style={[
                                    styles.card,
                                    isTopCard ? animatedStyle : undefined, // Анімація лише для верхньої картки
                                    { zIndex: isTopCard ? 1 : 0 },
                                ]}
                            >
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardNumber}>{card}</Text>
                                    <Text style={styles.cardSuit}>♥</Text>
                                </View>
                            </Animated.View>
                        </PanGestureHandler>
                    );
                })}
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    card: {
        position: 'absolute',
        width: width * 0.8,
        height: height * 0.6,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#000',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    cardNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
    },
    cardSuit: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'red', // Червоний колір для масті
    },
    cardBack: {
        backgroundColor: 'red', // Червоний фон для зворотної сторони карти
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    cardText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default CardDeck;