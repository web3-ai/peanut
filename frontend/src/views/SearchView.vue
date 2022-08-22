<template>
	<div class="w-screen relative mt-10">
		<div class="text-center font-bold text-xl text-gray-500 mb-10">Found {{searchResultsPublicationList.length}} results for "{{query}}"</div>
		<div class="px-20 mt-10 grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6" v-if="defaultProfile !== null">
        <div class="rounded-md relative cursor-pointer group" :class="{ 'hidden': blockPublications.includes(publication.id) }" v-for="(publication, index) in searchResultsPublicationList" v-bind:key="publication.id">
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
import { defineComponent, toRefs } from 'vue'
import { store } from '../store/store'
import { useRouter } from 'vue-router'

export default defineComponent({
	props: {
		query: String
	},
	setup() {
		const router = useRouter()
		const goToDetail = (id:number) => {
			store.currentPublication = store.publicationList[id]
			// window.location.href = '/p/' + store.currentPublication.profileId +'/' + store.currentPublication.publicationId;
			router.push({path: '/p/' + store.currentPublication.profileId +'/' + store.currentPublication.publicationId})
		}
		const goToProfile = (id:number) => {
      router.push({path: '/u/' + store.publicationList[id].profileId})
    }
		return { ...toRefs(store), goToDetail, goToProfile }
	},
	methods : {
	},
	components: {
		
	},
});
</script>
