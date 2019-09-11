<template>
  <div>
    <!-- <nav class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">TODO</p>
          <field label="Name">
            <input v-model="input.name"></input>
          </field>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <field label="Description">
            <input v-model="input.description"></input>
          </field>
        </div>
      </div>
    </nav>
    <ul id="todo">
      <li v-for="todo in todos">
        <span class="todo-wrapper">{{ todo.name }}</span>
      </li>
    </ul> -->
    <button class="button is-link" @click="createTodo">ADD</button>
  </div>
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
        name: 'test',
        description: 'todo'
      },
      todos: []
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
    }
  }
}
</script>
<style scoped>
.todo-wrapper {
  /* 適宜記述 */
}
</style>
