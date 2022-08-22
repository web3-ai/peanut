<template>
	<!-- Data model need to be redesigned -->
	<div class="w-screen relative">
		<div class="mx-auto w-full px-20 pt-10 flex flex-col 2xl:w-3/4">
			<div class="flex" id="publication-detail-header" v-if="currentProfile!=null">
				<div class="flex h-20">
					<img :src="currentProfile.picture.original.url" alt="avatar of the creator" class="rounded-full">
					
					<div class="flex ml-3 text-4xl font-bold items-center">
						<span>{{currentProfile.handle}}</span>
						<!-- Following logic here -->
					</div>
				</div>
				<div class="grow"></div>
				<div v-if="!(defaultProfile==null || userIsAuthor)">
					<button class="btn btn-red" v-if="userIsFollowing===false&&followInProgress===false" @click="requestFollow">
						Follow
					</button>
					<button class="btn btn-not-allowed" v-else-if="followInProgress===true">
						Pending
					</button>
					<button class="btn btn-white" v-else @click="requestUnfollow">
						Following
					</button>
					
				</div>
			</div>
		</div>
		<div class="inline-flex w-full px-20 mt-10 mb-6" v-if="currentProfile!==null">
			<div class="flex flex-col">
				<span class="text-lg font-bold">{{currentProfile.stats.totalFollowers}}</span>
				<span class="text-base text-gray-500">Follower</span>
			</div>
			<div class="flex flex-col ml-4">
				<span class="text-lg font-bold">{{currentProfile.stats.totalFollowing}}</span>
				<span class="text-base text-gray-500">Following</span>
			</div>
		</div>
		<div class="w-full px-20 my-6">
			<!-- Make these buttons really work -->
			<span class="mx-auto relative z-0 inline-flex shadow-sm rounded-md bg-red-100">
				<button autofocus type="button" class="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-0 focus:ring-red-500 focus:border-red-500 focus:bg-red-500 focus:text-gray-100 autofocus">Posts</button>
				<button type="button" class="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-0 focus:ring-red-500 focus:border-red-500 focus:bg-red-500 focus:text-gray-100">Likes</button>
			</span>
		</div>

		<div class="px-20 grid grid-cols-2 gap-8 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6" v-if="publicationsByCurrentProfile!==null">
			<div class="rounded-md relative cursor-pointer group" v-for="publication in publicationsByCurrentProfile" v-bind:key="publication.id">
				<img :src="'https://ipfs.io/ipfs/' + publication.metadata.image.split('//')[1]" alt="" class="w-full aspect-4/3 object-cover rounded-md" @click="goToDetail(publication)">
				<div class="absolute top-0 hidden group-hover:block w-full aspect-4/3 bg-gradient-to-t from-gray-900/25" @click="goToDetail(publication)">
					<div class="absolute bottom-3 left-4 text-white">{{publication.metadata.name}}</div>
				</div>
				<div class="flex flex-row items-center h-6 mt-2">
					<img :src="publication.profile.picture.original.url" alt="" class="rounded-full h-6 w-6">
					<span class="ml-2">{{publication.profile.handle}}</span>
					<div class="grow"></div>
					<img src="../assets/icons/heart.svg" alt="" class="w-4 fill-current text-red-100" v-if="likedPublicationIds.includes(publication.id)">
					<img src="../assets/icons/heart-outline.svg" alt="" class="w-4 fill-current text-red-100" v-else>
					<!-- <span class="text-sm ml-0.5">{{publicationList[0].likes}}</span> -->
					<img src="../assets/icons/collection-outline.svg" alt="" class="w-4 fill-gray-100 ml-2">
					<span class="text-sm ml-0.5">{{publicationList[0].collect}}</span>
				</div>
			</div>
		</div>
		
		
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, onDeactivated, onUnmounted, onMounted, onBeforeMount, onRenderTriggered } from 'vue'
import { store } from '../store/store'
import { useRouter, useRoute } from 'vue-router'
import { profile } from '../lens/profile/get-profile'
import { doesFollow } from '../lens/follow/does-follow'
import { follow } from '../lens/follow/follow'
import { unfollow } from '../lens/follow/unfollow'
import { getPublications } from '../lens/publications/get-publications'

export default defineComponent({
	setup() {
		const router = useRouter()
		const route = useRoute()
		const profileId = route.params.profileId
		
		
		/* 
			This solves the issue when user type the profile page in browser
			If user navigate to this page via other page, the profile data will be overrided
			When leave this page, the store.currentProfile should be set to null
		*/
		onMounted(()=>{
			if (store.currentProfile==null) {
				console.log(profileId)
				profile(profileId).then((data)=>{
					store.currentProfile = data.profile
					// If the user login, check if the user is following the author of this post
					store.userIsAuthor = store.currentProfile.id == store.defaultProfile.id
					if (store.address) {
						store.userIsFollowing = store.currentProfile.isFollowedByMe
					}	
				})
			} else {
				console.log('current profile is not null')
				console.log(store.currentProfile)
			}
			getPublications(profileId).then((data)=>{
				console.log('getPublications')
				console.log(data)
				store.publicationsByCurrentProfile = data.publications.items
			})

		})
		onUnmounted(()=>{
			console.log('onUnmounted, clear the store.currentProfile')
			store.currentProfile = null
			store.publicationsByCurrentProfile = null
		})
		
		return { ...toRefs(store), router }
	},
	methods : {
		async requestFollow(){
			this.followInProgress = true
			await follow(this.currentProfile.id)
		},
		async requestUnfollow(){
			this.followInProgress = true
			await unfollow(this.currentProfile.id)
		},
		goToDetail (publication:any) {
			this.currentPublication = publication
			this.router.push({path: '/p/' + publication.id})
		},
		checkFollowingStatus(){
			// @ts-ignore
			doesFollow(this.address, this.currentProfile.id).then((data)=>{
				console.log('Does the user follow the account?')
				store.userIsFollowing = data.doesFollow[0].follows
			})
		},
	},
	components: {
		
	},
});
</script>
