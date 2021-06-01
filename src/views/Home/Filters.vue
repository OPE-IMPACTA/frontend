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
          <q-badge rounded />
        </q-item-section>
        <q-item-section >{{ filter.label }}</q-item-section>
        <q-item-section avatar>
          <q-item-label > {{ filter.amount }} </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>

import services from '../../services'
import { STATUS } from 'src/utils/constant'

const SUMMARY = {
  all: 0,
  new: 0,
  progress: 0,
  completed: 0,
  canceled: 0
}

export default {
  name: 'Filters',
  data () {
    return {
      link: 'inbox',
      summary: SUMMARY,
      summary2: {},
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
          label: STATUS[cur].label,
          color: STATUS[cur],
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
  async created () {
    try {
      this.filters = this.applyFiltersStructure(this.summary)
      const { data } = await services.project.getSummary()
      this.filters = this.applyFiltersStructure(data.data)
    } catch (error) {
      this.hasError = !!error
      this.filters = this.applyFiltersStructure(this.summary)
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
