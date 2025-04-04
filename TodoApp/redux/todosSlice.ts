import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
    id: string;
    title: string;
    status: 'active' | 'done';
    deadline?: number; // дедлайн у вигляді мітки часу (timestamp)
}

interface TodosState {
    items: Todo[];
}

const initialState: TodosState = {
    items: [],
};

const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<Todo>) => {
            state.items.push(action.payload);
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.items.find(t => t.id === action.payload);
            if (todo) {
                todo.status = todo.status === 'done' ? 'active' : 'done';
            }
        },
        deleteTodo: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(t => t.id !== action.payload);
        },
        removeExpiredTodos: (state) => {
            const now = Date.now();
            state.items = state.items.filter(t => !t.deadline || t.deadline > now);
        }
    },
});

export const { addTodo, toggleTodo, deleteTodo, removeExpiredTodos } = todosSlice.actions;

export const selectUncompletedCount = (state: { todos: TodosState }) =>
    state.todos.items.filter(t => t.status !== 'done').length;

export default todosSlice.reducer;
