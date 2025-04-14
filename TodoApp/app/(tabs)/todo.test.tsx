import { Provider } from 'react-redux';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import TodoScreen from './todo';
import { Store, UnknownAction } from '@reduxjs/toolkit';

const mockStore = configureStore([]);
const initialState = { todos: [] };

describe('TodoScreen Additional Tests', () => {
    let store: Store<unknown, UnknownAction, unknown> | MockStoreEnhanced<unknown, {}>;

    beforeEach(() => {
        store = mockStore(initialState);
    });

    it('should have an input element for task name', () => {
        const { getByPlaceholderText } = render(
            <Provider store={store}>
                <TodoScreen />
            </Provider>
        );

        const input = getByPlaceholderText('Add a new task');
        expect(input).toBeTruthy();
    });

    it('should display the main screen title', () => {
        const { getByText } = render(
            <Provider store={store}>
                <TodoScreen />
            </Provider>
        );

        const title = getByText('To-Do List');
        expect(title).toBeTruthy();
    });

    it('should have an input field for task deadline', () => {
        const { getByPlaceholderText } = render(
            <Provider store={store}>
                <TodoScreen />
            </Provider>
        );

        const deadlineInput = getByPlaceholderText('Enter deadline');
        expect(deadlineInput).toBeTruthy();
    });

    it('should add a new task to the list when the add button is pressed', () => {
        const { getByPlaceholderText, getByText, queryByText } = render(
            <Provider store={store}>
                <TodoScreen />
            </Provider>
        );

        const input = getByPlaceholderText('Add a new task');
        const addButton = getByText('Add');

        fireEvent.changeText(input, 'New Task');
        const mockStore = configureStore([]);
        const initialState = { todos: [] };

        describe('TodoScreen Additional Tests', () => {
            let store: Store<unknown, UnknownAction, unknown> | MockStoreEnhanced<unknown, {}>;

            beforeEach(() => {
                store = mockStore(initialState);
            });

            it('should have an input element for task name', () => {
                const { getByPlaceholderText } = render(
                    <Provider store={store}>
                        <TodoScreen />
                    </Provider>
                );

                const input = getByPlaceholderText('Add a new task');
                expect(input).toBeTruthy();
            });

            it('should display the main screen title', () => {
                const { getByText } = render(
                    <Provider store={store}>
                        <TodoScreen />
                    </Provider>
                );

                const title = getByText('To-Do List');
                expect(title).toBeTruthy();
            });

            it('should have an input field for task deadline', () => {
                const { getByPlaceholderText } = render(
                    <Provider store={store}>
                        <TodoScreen />
                    </Provider>
                );

                const deadlineInput = getByPlaceholderText('Enter deadline');
                expect(deadlineInput).toBeTruthy();
            });

            it('should add a new task to the list when the add button is pressed', () => {
                const { getByPlaceholderText, getByText, queryByText } = render(
                    <Provider store={store}>
                        <TodoScreen />
                    </Provider>
                );

                const input = getByPlaceholderText('Add a new task');
                const addButton = getByText('Add');

                fireEvent.changeText(input, 'New Task');
                fireEvent.press(addButton);

                const newTask = queryByText('New Task');
                expect(newTask).toBeTruthy();
            });

            it('should delete a task when the delete button is pressed', () => {
                const task = { id: '1', text: 'Test Task' };
                store = mockStore({ todos: [task] });

                const { getByText, queryByText } = render(
                    <Provider store={store}>
                        <TodoScreen />
                    </Provider>
                );

                const deleteButton = getByText('Delete');
                fireEvent.press(deleteButton);

                const deletedTask = queryByText('Test Task');
                expect(deletedTask).toBeNull();
            });

            it('should mark a task as completed when the complete button is pressed', () => {
                const task = { id: '1', text: 'Test Task', completed: false };
                store = mockStore({ todos: [task] });

                const { getByText } = render(
                    <Provider store={store}>
                        <TodoScreen />
                    </Provider>
                );

                const completeButton = getByText('Complete');
                fireEvent.press(completeButton);

                const updatedTask = (store as MockStoreEnhanced<unknown, {}>).getActions().find(action => action.type === 'todos/completeTask');
                expect(updatedTask).toEqual(expect.objectContaining({ id: '1' }));
            });
        });


    });
});
