<template>
		<!-- Divider -->
		<div class="relative mt-10">
				<div class="absolute inset-0 flex items-center" aria-hidden="true">
						<div class="w-full border-t border-gray-300" />
				</div>
				<div class="relative flex justify-center">
						<span class="px-3 bg-white text-lg font-medium text-gray-300"> Related Posts </span>
				</div>
		</div>

		<div class="mt-10 grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6">
      <div class="rounded-md relative cursor-pointer group" v-for="(publication, index) in relatedPublicationList" v-bind:key="publication.profileId+'/'+publication.publicationId">
				<!-- <a :href="$router.resolve({name: 'publicationDetail', params: {profileId: publication.profileId, publicationId: publication.publicationId}})"></a> -->
				<!-- <router-link :to="'/p/'+publication.profileId+'/'+publication.publicationId"> -->
					<img :src="publication.imageuri" alt="" class="aspect-4/3 object-cover rounded-md" @click="goToDetail(index)">
					<div class="absolute top-0 hidden group-hover:block w-full aspect-4/3 bg-gradient-to-t from-gray-900/25" @click="goToDetail(index)">
						<div class="absolute bottom-3 left-4 text-white">{{publication.title}}</div>
					</div>
					<div class="flex flex-row items-center h-6 mt-2">
						<img :src="publication.avatar" alt="" class="rounded-full h-6 w-6" @click="goToProfile(index)">
						<span class="ml-2" @click="goToProfile(index)">{{publication.author}}</span>
						<div class="grow"></div>
						<img src="../assets/icons/heart-outline.svg" alt="" class="w-4 fill-current text-red-100">
						<span class="text-sm ml-0.5">{{publication.likes}}</span>
						<img src="../assets/icons/collection-outline.svg" alt="" class="w-4 fill-gray-100 ml-2">
						<span class="text-sm ml-0.5">{{publication.collect}}</span>
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
		const goToDetail = (id:number)=>{
			store.currentPublication = store.publicationList[id]
			window.location.href = '/p/' + store.currentPublication.profileId +'/' + store.currentPublication.publicationId;
		}
		const goToProfile = (id:number) => {
      router.push({path: '/u/' + store.publicationList[id].profileId})
    }
		return { ...toRefs(store), goToDetail, goToProfile }
	}
})

</script>