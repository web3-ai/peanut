<template>
  <div class="flex flex-col min-w-max w-screen">
    <div id="nav" class="flex h-16 items-center text-gray-600 px-10 z-10">
      <img src="@/assets/icon.svg" alt="logo" class="w-20">
      <router-link to="/" class="menu">Home</router-link>
      <router-link to="/about" class="menu">New</router-link>
      <router-link to="/about" class="menu">Latest</router-link>
      <SearchBar></SearchBar>
      <div class="flex" v-if="loginStatus">
        <div class="h-10 w-10 mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 m-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <DropdownMenu class="mr-6"></DropdownMenu>
        <router-link to="/publish" class="">
          <button class="btn btn-red">Publish</button>
        </router-link>
        
      </div>
      <div v-else>
        <button class="btn btn-blue">
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
import { defineComponent, toRefs, onMounted } from 'vue';
import SearchBar from '@/components/SearchBar.vue'; 
import DropdownMenu from '@/components/DropdownMenu.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { store } from './store/store'

export default defineComponent({
  setup() {
    onMounted(()=>{
			console.log('App.vue mounted!')
      store.previousHistoryLength = window.history.length
		})
    return { ...toRefs(store) }
  },
  components: {
    SearchBar,
    DropdownMenu,
    FooterComponent,
  },
  
});
</script>