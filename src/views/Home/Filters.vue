<template>
  <div class="q-px-md" style="max-width: 370px">
    <q-item-label header class="text-h5">Filtros</q-item-label>
    <q-list dense padding class="rounded-borders q-ml-md">
      <q-item
        v-for="filter in this.filters"
        :key="filter.label"
        clickable
        v-ripple
        :active="link === filter.label"
        @click="handleSelect(filter)"
        active-class="my-menu-link"
      >
        <q-item-section avatar>
          <q-badge rounded :class="filter.color.bg"/>
        </q-item-section>
        <q-item-section :class="filter.color.text">{{ filter.label }}</q-item-section>
        <q-item-section avatar>
          <q-item-label :class="filter.color.text"> {{ filter.amount }} </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>

const SUMMARY = {
  all: 20,
  new: 5,
  progress: 4,
  completed: 7,
  canceled: 4
}

const LABELS = {
  all: 'Todos',
  new: 'Novo',
  progress: 'Em andamento',
  completed: 'Finalizado',
  canceled: 'Cancelado'
}

const COLORS = {
  all: { text: 'text-grey', bg: 'bg-grey' },
  new: { text: 'text-blue', bg: 'bg-blue' },
  progress: { text: 'text-orange', bg: 'bg-orange' },
  completed: { text: 'text-green', bg: 'bg-green' },
  canceled: { text: 'text-red', bg: 'bg-red' }
}

export default {
  name: 'Filters',
  data () {
    return {
      link: 'inbox',
      summary: SUMMARY,
      hasError: false,
      filters: [
        { label: null, amount: null }
      ]
    }
  },
  methods: {
    applyFiltersStructure (summary) {
      return Object.keys(summary).reduce((acc, cur) => {
        const currentFilter = {
          label: LABELS[cur],
          color: COLORS[cur],
          amount: summary[cur]
        }

        if (cur === 'all') {
          currentFilter.active = true
          currentFilter.type = cur
        } else {
          currentFilter.type = cur
        }

        return [...acc, currentFilter]
      }, [])
    },
    handleSelect ({ type, label }) {
      this.link = label
      if (type) {
        this.$emit('select', type)
      }
    }
  },
  created () {
    try {
      this.filters = this.applyFiltersStructure(SUMMARY)
    } catch (error) {
      this.hasError = !!error
      this.filters = this.applyFiltersStructure(SUMMARY)
    }
  }
}
</script>

<style scoped lang="scss">

.my-menu-link {
  color: white;
  background: lightgrey;
}

li {
  list-style-type: none;
}

</style>
