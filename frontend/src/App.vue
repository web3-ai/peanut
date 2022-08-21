<template>
  <div class="flex flex-col min-w-max w-screen relative">
    <LoadingGIF v-if="loading"></LoadingGIF>
    <div id="nav" class="flex h-16 items-center text-gray-600 px-10 z-10">
      <img src="@/assets/icon.svg" alt="logo" class="w-20">
      <router-link to="/" class="menu">Home</router-link>
      <router-link to="/popular" class="menu">Popular</router-link>
      <router-link to="/about" class="menu">Latest</router-link>
      <SearchBar></SearchBar>
      <div class="flex" v-if="address!=null">
        <div class="h-10 w-10 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 m-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        
        <router-link to="/publish" class="" v-if="defaultProfile!=null">
          <button class="btn btn-red mr-6">Publish</button>
        </router-link>
        <DropdownMenu class=""></DropdownMenu>
        
      </div>
      <div v-else>
        <button class="btn btn-blue" @click="login">
          Login
        </button>
      </div>
      
    </div>
    <div class="relative mb-10">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-gray-200" />
      </div>
    </div>
    <router-view/>

    <FooterComponent></FooterComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted, onBeforeUnmount } from 'vue';
import SearchBar from '@/components/SearchBar.vue'; 
import DropdownMenu from '@/components/DropdownMenu.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import LoadingGIF from '@/components/LoadingGIF.vue';
// import { provider } from './helpers/ethers.service'
import { store } from './store/store'
import { login } from './lens/authentication/login'
import { setAuthenticationToken } from './lens/state';
import { getDefaultProfile } from './lens/profile/get-default-profile'
import { explorePopular } from './lens/explore/explore-publications'
import { following } from './lens/follow/following'
import { getPublications } from './lens/publications/get-publications';

export default defineComponent({
  setup() {
    const getDProfile = (address:string)=>{
      getDefaultProfile(address).then((data) => {
        explorePopular([data.defaultProfile.id]).then((data)=>{
          console.log('explore publications')
        })
      })

    }
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

    console.log('App.vue mounted!')
    store.previousHistoryLength = window.history.length

    /*
    Retrieve previously connected account.
    To Improve:
      - set a time limit. Eg. after 30 min, user need to login again.
    */ 
    const preAddress:string|null = localStorage.getItem('address')
    console.log(preAddress)
    if(preAddress != null){
      // @ts-ignore
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts)=>{
        // console.log(accounts)
        if (accounts.length) {
          store.address = accounts[0]
          getDProfile(accounts[0])
          getFollowingPublications(accounts[0])
        }
      }).catch(console.error)
    }
    
    // @ts-ignore
    window.ethereum.on('accountsChanged', function (accounts) {
      console.log('Account changed')
      if (typeof accounts[0] == 'undefined'){
        console.log('wallet disconnected')
        disconnect()
      } else {
        store.address = accounts[0]
        localStorage.setItem('address', accounts[0])
        getDProfile(accounts[0])
        getFollowingPublications(accounts[0])
      }
    })
		// })

    const disconnect =()=>{
      store.address = null
      store.defaultProfile = null
      setAuthenticationToken(null)
      window.location.href = '/'
      localStorage.removeItem('address')
      localStorage.removeItem('authenticationToken')
      localStorage.removeItem('refreshToken')
    }

    onBeforeUnmount(()=>{
      //  remove event listener here.

      // Handle refresh logic, such that user will not need to sign in again.
      // @ts-ignore
      try {
        console.log('BeforeUnmount')
        console.log(store.address)
        localStorage.setItem('address', store.address==null?'':store.address)
      } catch (error) {
        console.log('localStorage is not supported')
        console.log(error)
      }
    })
    return { ...toRefs(store) }
  },
  methods: {
    async login() {
      await login()
      following(this.address)
      // const defaultProfile = getDefaultProfile(this.address)
      // console.log(defaultProfile)
    },
    
  },
  components: {
    SearchBar,
    DropdownMenu,
    FooterComponent,
    LoadingGIF,
  },
  
});
</script>