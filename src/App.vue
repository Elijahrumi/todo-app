<template>
  <v-container>

    <div class="mb-5">
      <h1>Your Todo List</h1>
    </div>
    <v-container class="p-5 mb-6">
      <v-row class="justify-start">
        <div>Completion Rate: {{ completionRate }} %</div>
      </v-row>
      <!-- <div>Average Time Spent: {{ formatTime(averageTimeSpent) }}</div> -->
      <v-row class="justify-start">
        <div>Average Time Spent: {{ averageTimeSpent.hours }} hours, {{ averageTimeSpent.minutes }} minutes, and {{
          averageTimeSpent.seconds }} seconds</div>

      </v-row>
    </v-container>
    <v-row>
      <v-col cols="10">
        <v-text-field v-model="newTodo" label="New Todo" @keyup.enter="addTodo"></v-text-field></v-col>
      <v-col cols="2">
        <v-btn @click="addTodo" color="primary" class="mt-3"><v-icon>mdi-plus</v-icon> Add Task</v-btn>
      </v-col>
    </v-row>
    <v-list>
      <v-list-item v-for="(todo, index) in todos" :key="index">
        <v-row>
          <v-col cols="10">
            <v-list-item-content>
              <v-list-item-title :class="{ 'task-completed': todo.complete }" style="font-weight: bold;">
                {{ todo.text }}
              </v-list-item-title>
              <p>{{ todo.complete ? 'Completed at ' + new Date(todo.completedAt).toLocaleString() : 'Created at: ' + new Date(todo.createdAt).toLocaleString() }}</p>
              <p>{{ todo.complete ? 'Time Spent: ' + todo.timeSpent + ' minutes' : '' }}</p>
            </v-list-item-content></v-col>
          <v-col cols="2">
            <v-list-item-action>
              <v-btn icon @click="toggleTodo(index)" color="secondary" style="margin: 20px;">
                <v-icon>{{ todo.complete ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>

              </v-btn>
              <v-btn icon @click="deleteTodo(index)" color="error">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action></v-col>
        </v-row>
        <v-divider></v-divider>
      </v-list-item>
    </v-list>

  </v-container>
</template>

<script>
export default {
  data() {
    return {
      newTodo: '',
      todos: []
    };
  },
  methods: {
    addTodo() {
      if (this.newTodo) {
        const newTask = {
          text: this.newTodo,
          complete: false,
          completedAt: null,
          timeSpent: null,
          createdAt: new Date().toISOString() // Add createdAt field with current time
        };
        this.todos.push(newTask);
        this.newTodo = '';
        this.saveTodos();
      }
    },
    toggleTodo(index) {
      const todo = this.todos[index];
      todo.complete = !todo.complete;
      todo.completedAt = todo.complete ? new Date().toISOString() : null;
      const completionTime = new Date(todo.completedAt);
      const creationTime = new Date(todo.createdAt); // Use createdAt field for task creation time
      const timeSpent = completionTime - creationTime;
      todo.timeSpent = Math.floor(((timeSpent / 1000) % 3600) / 60);


      this.saveTodos();
    },
    deleteTodo(index) {
      this.todos.splice(index, 1);
      this.saveTodos();
    },
    saveTodos() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    },
    loadTodos() {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        this.todos = JSON.parse(storedTodos);
      }
    },
    formatTime(milliseconds) {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      return `${hours} hours and ${minutes} minutes and ${totalSeconds} seconds`;
    }
  },
  computed: {
    completionRate() {
      const completedTasks = this.todos.filter(todo => todo.complete).length;
      return (completedTasks / this.todos.length) * 100;
    },
    averageTimeSpent() {
      const completedTasks = this.todos.filter(todo => todo.complete && todo.completedAt); // Filter tasks that are completed and have completion time
      if (completedTasks.length === 0) return { hours: 0, minutes: 0, seconds: 0 };

      const totalTimeSpentMilliseconds = completedTasks.reduce((total, task) => {
        const completionTime = new Date(task.completedAt);
        const creationTime = new Date(task.createdAt); // Use createdAt field for task creation time
        const timeSpent = completionTime - creationTime;

        return total + timeSpent;
      }, 0);

      // Convert milliseconds to seconds
      const totalTimeSpentSeconds = totalTimeSpentMilliseconds / 1000;

      // Calculate total time in hours, minutes, and seconds
      const totalHours = Math.floor(totalTimeSpentSeconds / 3600);
      const totalMinutes = Math.floor((totalTimeSpentSeconds % 3600) / 60);
      const totalSeconds = Math.floor(totalTimeSpentSeconds % 60);

      // Calculate average time
      const averageHours = Math.floor(totalHours / completedTasks.length);
      const averageMinutes = Math.floor(totalMinutes / completedTasks.length);
      const averageSeconds = Math.floor(totalSeconds / completedTasks.length);

      return { hours: averageHours, minutes: averageMinutes, seconds: averageSeconds };
    }


  },
  created() {
    this.loadTodos();
  }
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.task-completed {
  text-decoration: line-through;
}
</style>
