<template>
  <div class="w-screen relative">
    <div class="px-20 mt-10 grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6" v-if="defaultProfile !== null">
        <div class="rounded-md relative cursor-pointer group" :class="{ 'hidden': blockPublications.includes(publication.id) }" v-for="(publication, index) in followingPublicationList" v-bind:key="publication.id">
          <img :src="'https://ipfs.io/ipfs/' + publication.metadata.image.split('//')[1]" alt="" class="w-full aspect-4/3 object-cover rounded-md" @click="goToDetail(index)">
          <div class="absolute top-0 hidden group-hover:block w-full aspect-4/3 bg-gradient-to-t from-gray-900/50" @click="goToDetail(index)">
            <div class="absolute bottom-3 px-4 text-white">{{publication.metadata.name}}</div>
          </div>
          <div class="flex flex-row items-center h-6 mt-2">
            <img :src="publication.profile.picture.original.url" alt="" class="rounded-full h-6 w-6" @click="goToProfile(publication.profile.id)">
            <span class="ml-2 text-sm xl:text-base" @click="goToProfile(publication.profile.id)">{{publication.profile.handle}}</span>
            <div class="grow"></div>
            <img src="../assets/icons/heart.svg" alt="" class="w-4 fill-current text-red-100" v-if="likedPublicationIds.includes(publication.id)">
            <img src="../assets/icons/heart-outline.svg" alt="" class="w-4 fill-current text-red-100" v-else>
            <!-- <span class="text-sm ml-0.5" v-if="likedPublicationIds.includes(publication.id)">{{publicationList[0].likes}}</span> -->
            <img src="../assets/icons/collection-outline.svg" alt="" class="w-4 fill-gray-100 ml-2">
            <span class="text-sm ml-0.5">{{publication.stats.totalAmountOfCollects}}</span>
          </div>
        </div>
      </div>
      <div class="w-screen" v-else>
        <img class="w-full" src="@/assets/intro.png" />
      </div>
      <div class="fixed overflow-hidden top-0 z-20">
        <router-view />
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, onUnmounted } from 'vue'
import { store } from '../store/store'
import { useRouter } from 'vue-router'
import { following } from '../lens/follow/following'
import { getPublications } from '../lens/publications/get-publications';

export default defineComponent({
  setup() {
    const router = useRouter()

    const getFollowingPublications = (address:string)=>{
      following(address).then((data)=>{
        console.log('Then of following: ', data)
        /* 
          The publication retrieving logic can be optimized, save the state, no need to refresh in certain minutes
        */ 
        store.followingPublicationList = []
        store.followedAccounts.map((address)=>{
          getPublications(address).then((data)=>{
            console.log('getPublications for: ', address)
            data.publications.items.map((item:any)=>{
              store.followingPublicationList.push(item)
            })
          })
        })
      })
    }

    if (store.address!==null && store.requestNewHomeFeed){
      // @ts-ignore
      getFollowingPublications(store.address)
      store.requestNewHomeFeed = false
    }
    // onUnmounted(()=>{
    //   store.followingPublicationList = []
    // })

    return { ...toRefs(store), router }
  },
  methods : {
    goToDetail (idx:number) {
      store.currentPublication = store.followingPublicationList[idx]
      store.currentProfile = store.followingPublicationList[idx].profile
      this.router.push({path: '/p/' + store.currentPublication.id})
    },
    goToProfile (profileId:number) {
      this.router.push({path: '/u/' + profileId})
    }
  },
  components: {
  },
});
</script>