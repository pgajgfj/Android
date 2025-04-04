import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#f8f9fa' },
        headerTintColor: '#333',
        tabBarStyle: { backgroundColor: '#f8f9fa' },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#6c757d',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Головна' }} />
      <Tabs.Screen name="todo" options={{ title: 'To-Do' }} />
      <Tabs.Screen name="counter" options={{ title: 'Лічильник' }} />
      <Tabs.Screen name="CardDeck" options={{ title: 'Карточна Гра' }} />
    </Tabs>
  );
}