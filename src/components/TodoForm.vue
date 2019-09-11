<template>
  <v-app>
    <div>
      <v-toolbar dark color="indigo">
          <v-toolbar-title>
              My Todo
          </v-toolbar-title>
      </v-toolbar>
      <v-text-field v-model="input.name" label="title"></v-text-field>
      <v-text-field v-model="input.description" label="description"></v-text-field>
      <v-btn fab dark color="indigo" v-on:click="createTodo">
          <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-card
      class="mx-auto"
      max-width="600"
      >
        <v-list-item-content v-for='(todo, index) in todos' :key='index'>
          <!-- <span>{{ todo }}</span> -->
          <v-card-title>{{ todo.name }}</v-card-title>
          <v-card-text>{{ todo.description }}</v-card-text>
          <v-card-actions>
          <v-btn outlined v-on:click="deleteTodo(todo.id)">Delete</v-btn>
          </v-card-actions>
        </v-list-item-content>
      </v-card>
    </div>
    <amplify-sign-out></amplify-sign-out>
  </v-app>
</template>

<script>
import {API, graphqlOperation} from 'aws-amplify'
import * as mutations from '@/graphql/mutations'
import * as queries from '@/graphql/queries'

export default {
  name: 'todo',
  data: function () {
    return {
      input: {
        name: '',
        description: ''
      },
      todos: [],
      model: 1
    }
  },
  computed: {
    reversedTodos: function(){
      return this.todos
    }
  },
  created: async function () {
    await this.listTodos()
  },
  methods: {
    createTodo: async function () {
      if (this.input.name !== '' || this.input.description !== '') {
        await API.graphql(graphqlOperation(mutations.createTodo, {input: this.input}))
          .catch(err => console.error(err))
        await this.listTodos()
      } else {
        console.info('input empty')
      }
    },
    listTodos: async function () {
      const res = await API.graphql(graphqlOperation(queries.listTodos))
        .catch(err => console.error(err))
      this.todos = res.data.listTodos.items
    },
    deleteTodo: async function (id) {
      await API.graphql(graphqlOperation(mutations.deleteTodo, {input: { id:id }}))
        .catch(err => console.error(err))
      await this.listTodos()
    },
  }
}
</script>
<style scoped>
</style>
