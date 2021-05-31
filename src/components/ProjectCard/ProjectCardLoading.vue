<template>
  <div class="q-pa-md" style="max-width: 600px">
    <q-list>
      <template>
        <div class="q-pa-md">
          <q-card style="max-width: 600px">
            <q-item class="bg-blue-grey-1">
              <q-item-section avatar>
                <q-skeleton type="QAvatar" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" width="50%"  />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" width="30%" />
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-skeleton type="circle" width="20px" height="20px"/>
              </q-item-section>
            </q-item>
            <q-item v-for="item in this.ITEMS" :key="item">
              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" width="80%"  />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" width="50%" />
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
        <div class="q-pa-md" v-for="item in this.ITEMS" :key="item">
          <q-card style="max-width: 600px">
            <q-item class="bg-blue-grey-1">
              <q-item-section avatar>
                <q-skeleton type="QAvatar" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" width="50%"  />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" width="30%" />
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-skeleton type="circle" width="20px" height="20px"/>
              </q-item-section>
            </q-item>
          </q-card>
        </div>
      </template>
    </q-list>
  </div>
</template>

<script>

export default {
  props: {
    project: Array
  },
  data () {
    return {
      ITEMS: [1, 2, 3]
    }
  },
  created () {
    console.log(this.project)
  }
}
</script>

<style lang="scss" scoped>
.card-section {
  background: $grey-1;
  margin-bottom: -20px;
}
</style>
