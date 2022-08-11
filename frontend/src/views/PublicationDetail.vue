<template>
	<div class="flex flex-col bg-gray-900/75 w-screen h-screen">
		<div class="flex flex-row-reverse items-center h-8" @click="goBack">
			<img src="@/assets/icons/close.svg" alt="" class="h-6 mr-1 cursor-pointer">
		</div>
		<div class="flex flex-col bg-white h-full rounded-t-xl 2xl:flex-row overflow-y-scroll" id="publication-detail-page">
			<div class="mx-auto container p-10 flex flex-col 2xl:w-3/4">
				<div class="flex" id="publication-detail-header">
					<div class="flex h-12">
						<img :src="currentPublication?.avatar" alt="avatar of the creator" class="rounded-full">
						<div class="flex flex-col ml-3">
							<span>{{currentPublication?.author}}</span>
							<span>Follow</span> <!-- Following logic here -->
						</div>
					</div>
					<div class="grow"></div>
					<div>
						<button class="btn btn-red">
							Collect
						</button>
						<button class="btn btn-red ml-10">
							Like
						</button>
					</div>
				</div>
				<div class="flex flex-col mt-10" id="publication-detail-content">
					<div class="text-center text-2xl">{{currentPublication?.title}}</div>
					<img :src="currentPublication?.imageuri" alt="" class="mt-10">
					<img :src="currentPublication?.imageuri" alt="" class="mt-10">
					<div class="text-lg mt-10 px-10">{{currentPublication?.description}}</div>
					<!-- Potentially more images -->
					<RelatedPublications></RelatedPublications>

				</div>
				

			</div>
			<!-- Comment is optional -->
			<!-- <div class="w-full 2xl:w-1/4 bg-blue-100">Comment</div> -->
			
		</div>
		<!-- Publication detail {{profileId}}, {{publicationId}} -->
		
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, toRefs, ComputedRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../store/store'
import RelatedPublications from '@/components/RelatedPublications.vue';


export default defineComponent({
	setup() {
		const router = useRouter()
		const route = useRoute()
		const profileId = computed(()=>route.params.profileId) as ComputedRef<string | number>
		const publicationId = computed(()=>route.params.publicationId)
		const getPublication = (profileId:any, publicationId:any) => {
			if (store.currentPublication === null){
				store.currentPublication = store.publicationList[0]
			}
		}
		const goBack = ()=>{
			router.push({path: '/'})
		}
		onMounted(()=>{
			console.log('Mounted!')
			getPublication(profileId, publicationId)
			store.currentPublication = store.publicationList[0]
		})
		return { ...toRefs(store), profileId, publicationId, goBack }
	},
	components: {
		RelatedPublications,
	}
	// if currentPublication is null, get it from server
	
})



</script>