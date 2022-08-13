<template>
	<!-- Data model need to be redesigned -->
	<div class="w-screen relative">
		<div class="mx-auto container py-10 flex flex-col 2xl:w-3/4">
			<div class="flex" id="publication-detail-header">
				<div class="flex h-12">
					<img :src="currentPublication?.avatar" alt="avatar of the creator" class="rounded-full">
					
					<div class="flex ml-3 text-4xl font-bold items-center">
						<span>{{currentPublication?.author}}</span>
						<!-- Following logic here -->
					</div>
				</div>
				<div class="grow"></div>
				<div>
					<button class="btn btn-red">
						Follow
					</button>
				</div>
			</div>
		</div>

		<div class="w-full ml-20 my-6">
			<!-- Make these buttons really work -->
			<span class="mx-auto relative z-0 inline-flex shadow-sm rounded-md bg-red-100">
				<button type="button" class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">Posts</button>
				<button type="button" class="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">Likes</button>
			</span>
		</div>

		<div class="px-20 grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6">
			<div class="rounded-md relative cursor-pointer group" v-for="(publication, index) in publicationList" v-bind:key="publication.profileId+'/'+publication.publicationId">
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
		
		
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { store } from '../store/store'
import { useRouter } from 'vue-router'

export default defineComponent({
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
