<template>
<div class="w-screen relative">
	<div class="text-center font-bold text-xl text-gray-600 mb-10">Search results for "{{query}}":</div>
	<div class="px-20 grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6">
			<div class="rounded-md relative cursor-pointer group" v-for="(publication, index) in searchResultList" v-bind:key="publication.profileId+'/'+publication.publicationId">
				<img :src="publication.imageuri" alt="" class="w-full aspect-4/3 object-cover rounded-md" @click="goToDetail(index)">
				<div class="absolute top-0 hidden group-hover:block w-full aspect-4/3 bg-gradient-to-t from-gray-900/25" @click="goToDetail(index)">
					<div class="absolute bottom-3 left-4 text-white">{{publicationList[0].title}}</div>
				</div>
				<div class="flex flex-row items-center h-6 mt-2">
					<img :src="publicationList[0].avatar" alt="" class="rounded-full h-6 w-6" @click="goToProfile(index)">
					<span class="ml-2" @click="goToProfile(index)">{{publicationList[0].author}}</span>
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
