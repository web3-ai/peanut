<template>
<div class="w-screen relative">
  <div class="px-20 grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6">
      <div class="rounded-md relative cursor-pointer group" v-for="(publication, index) in publicationList" v-bind:key="publication.profileId+'/'+publication.publicationId" @click="goToDetail(index)">
        <img :src="publication.imageuri" alt="" class="aspect-4/3 object-cover rounded-md">
        <div class="absolute top-0 hidden group-hover:block w-full aspect-4/3 bg-gradient-to-t from-gray-900/25">
          <div class="absolute bottom-3 left-4 text-white">{{publicationList[0].title}}</div>
        </div>
        <div class="flex flex-row items-center h-6 mt-2">
          <img :src="publicationList[0].avatar" alt="" class="rounded-full h-6 w-6">
          <span class="ml-2">{{publicationList[0].author}}</span>
          <div class="grow"></div>
          <img src="../assets/icons/heart-outline.svg" alt="" class="w-4 fill-current text-red-100">
          <span class="text-sm ml-0.5">{{publicationList[0].likes}}</span>
          <img src="../assets/icons/collection-outline.svg" alt="" class="w-4 fill-gray-100 ml-2">
          <span class="text-sm ml-0.5">{{publicationList[0].collect}}</span>
        </div>
      </div>
    </div>
    <div class="fixed overflow-hidden top-0 z-20">
      <router-view></router-view>
    </div>

</div>
  



</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { store } from '../store/store'
// import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    // const router = useRouter()
    const goToDetail = (id:number) => {
      store.currentPublication = store.publicationList[id]
      window.location.href = '/p/' + store.currentPublication.profileId +'/' + store.currentPublication.publicationId;
      // router.push({path: '/p/' + store.currentPublication.profileId +'/' + store.currentPublication.publicationId})
    }
    return { ...toRefs(store), goToDetail }
  },
  methods : {
  },
  components: {
    
  },
});
</script>
