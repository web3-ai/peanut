<template>
	<div class="flex flex-col bg-gray-900/75 w-screen h-screen">
		<div class="flex flex-row-reverse items-center h-8" @click="goBack">
			<img src="@/assets/icons/close.svg" alt="" class="h-6 mr-1 cursor-pointer">
		</div>
		<div class="flex flex-col bg-white h-full rounded-t-xl 2xl:flex-row overflow-y-scroll" ref="pubContainer" id="pubContainer" v-if="currentPublication!=null">
			<div class="mx-auto container p-10 flex flex-col 2xl:w-3/4">
				<div class="flex" id="publication-detail-header">
					<!-- current reaction: {{currentPublication.reaction}} -->
					<div class="flex h-12">
						<img :src="currentPublication.profile.picture.original.url" alt="avatar of the creator" class="rounded-full cursor-pointer" @click="goToProfile(currentPublication.profile.id)">
						<div class="flex flex-col ml-3">
							<span class="font-bold my-auto cursor-pointer" @click="goToProfile(currentPublication.profile.id)">{{currentPublication.profile.handle}}</span>
							<span v-if="!(defaultProfile==null || userIsAuthor)&&userIsFollowing!==null">
								<span v-if="userIsFollowing===false&&followInProgress===false" class="hover:text-red-500 cursor-pointer" @click="requestFollow">Follow</span>
								<span v-else-if="followInProgress===true" class="text-gray-500 italic">Request pending...</span>
								<span v-else>Following (<span class="hover:text-red-600 cursor-pointer" @click="requestUnfollow">unfollow</span>)</span>
							</span> <!-- Following logic here -->
							<span v-else>&nbsp;</span>
						</div>
					</div>
					<div class="grow">
					</div>
					
					<div class="min-w-fit" v-if="defaultProfile!==null">
						<button class="btn btn-not-allowed" v-if="collectInProgress">
							Collecting
						</button>
						<button class="btn btn-red" v-else-if="!userIsAuthor&&!currentPublication.hasCollectedByMe" @click="requestCollect(currentPublication.id)">
							Collect
						</button>
						<button class="btn btn-white" v-else-if="currentPublication.hasCollectedByMe&&!userIsAuthor">
							Collected
						</button>
						<button class="btn btn-white" v-else>
							Collect {{currentPublication.stats.totalAmountOfCollects}}
						</button>
						<button class="btn btn-red ml-10" @click="likeAPublications(currentPublication.id)" v-if="!likedPublicationIds.includes(currentPublication.id)">
							Like
						</button>
						<button class="btn btn-white ml-10" @click="unlikeAPublications(currentPublication.id)" v-else>
							Liked
						</button>
					</div>
				</div>
				<div class="flex flex-col mt-10" id="publication-detail-content">
					<div class="text-center text-2xl">{{currentPublication.metadata.name}}</div>
					<div v-for="media in currentPublication.metadata.media" :key="media">
						<img :src="'https://ipfs.io/ipfs/' + media.original.url.split('//')[1]" alt="" class="mt-10 rounded-md w-full" />
					</div>
					
					<div class="text-lg mt-10 px-10">{{currentPublication.metadata.description}}</div>
					<!-- Potentially more images -->
					<RelatedPublications></RelatedPublications>

				</div>
				

			</div>
			<!-- Comment is optional -->
			<!-- <div class="w-full 2xl:w-1/4 bg-blue-100">Comment</div> -->
			
		</div>		
	</div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onUpdated, onUnmounted, toRefs, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../store/store'
import RelatedPublications from '@/components/RelatedPublications.vue';
import { doesFollow } from '../lens/follow/does-follow'
import { follow } from '../lens/follow/follow'
import { unfollow } from '../lens/follow/unfollow'
import { getPublication } from '../lens/publications/get-publication'
import { collect } from '../lens/module/collect'
import { addReaction } from '@/lens/reaction/add-reaction';


export default defineComponent({
	setup() {
		const router = useRouter()
		const route = useRoute()
		// const profileId = computed(()=>route.params.profileId) as ComputedRef<string | number>
		const internalPublicationId = route.params.internalPublicationId
		const pubContainer = ref()
		const updateCurrentPublication = (internalPublicationId:any)=>{
			if (store.currentPublication === null){
				getPublication(internalPublicationId).then((data)=>{
					console.log('get publication')
					store.currentPublication = data.publication
					store.currentProfile = data.publication.profile
					store.userIsFollowing = store.currentProfile.isFollowedByMe
					store.userIsAuthor = store.currentProfile.id == store.defaultProfile.id
				})
			} else {
				store.userIsAuthor = store.currentPublication.profile.id == store.defaultProfile.id
			}
		}
		onBeforeMount(()=>{
			console.log('PublicationDetail mounted!')
			updateCurrentPublication(internalPublicationId)

		})
		onUpdated(()=>{
			console.log('view updated')
			console.log(pubContainer.value.scrollTop)
			pubContainer.value.scrollTop = 0
		})
		onUnmounted(()=>{
			console.log('onUnmounted publicationDetail.vue')
			store.currentPublication = null
			store.currentProfile = null
			store.userIsFollowing = null
			store.userIsAuthor = null
		})

		// @ts-ignore
		doesFollow(store.address, store.currentProfile.id).then((data)=>{
			console.log('Does the user follow the account?', data.doesFollow[0].follows)
			store.userIsFollowing = data.doesFollow[0].follows
		})

		return { ...toRefs(store), internalPublicationId, router, pubContainer }
	},
	methods: {
		async requestFollow(){
			this.followInProgress = true
			await follow(this.currentPublication.profile.id)
		},
		async requestUnfollow(){
			this.followInProgress = true
			await unfollow(this.currentPublication.profile.id)
		},
		async requestCollect(internalPublicationId:string){
			this.collectInProgress = true
			await collect(internalPublicationId)
			console.log('Finish collection')
			this.currentPublication.hasCollectedByMe = true
		},
		async like(internalPublicationId:string){
			await addReaction(internalPublicationId)
		},
		checkFollowingStatus(){
			// @ts-ignore
			doesFollow(this.address, this.currentPublication.profile.id).then((data)=>{
				console.log('Does the user follow the account?')
				store.userIsFollowing = data.doesFollow[0].follows
			})
		},
		goBack(){
			console.log(window.history.length, store.previousHistoryLength)
			if (window.history.length >= store.previousHistoryLength) {
				this.router.go(-1)
			} else {
				this.router.push({path: '/'})
			}			
		},
		goToProfile (profileId:number) {
			this.router.push({path: '/u/' + profileId})
		}
	},
	components: {
		RelatedPublications,
	},

	
})
</script>