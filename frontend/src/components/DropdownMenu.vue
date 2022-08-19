<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton class="inline-flex justify-center h-10 w-10 rounded-full outline-0">
        <!-- <img src="@/assets/avatar.svg" alt="" class="w-10"> -->
        <div class="w-10 h-10 rounded-full gradient-blue" v-if="defaultProfile==null"></div>
        <img :src="defaultProfile.picture.original.url" alt="" class="w-10 h-10 rounded-full" v-else>
      </MenuButton>
    </div>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
        <!-- <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Edit</a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Duplicate</a>
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Archive</a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Move</a>
          </MenuItem>
        </div> -->
        <div class="py-1">
          <!-- <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Share</a>
          </MenuItem> -->
          <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']" @click="goToProfile">My Profile</a>
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']" @click="logout">Logout</a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
// import { ChevronDownIcon } from '@heroicons/vue/solid'
import { defineComponent, toRefs } from 'vue';
import { store } from '../store/store'
import { setAuthenticationToken, setRefreshToken } from '../lens/state';
import { useRouter } from 'vue-router'
// import { createProfile } from '../lens/profile/create-profile'

export default defineComponent({
  setup() {
    const router = useRouter()
    return { ...toRefs(store), router }
  },
  methods:{
    logout() {
      this.address = null
      this.defaultProfile = null
      setAuthenticationToken(null)
      setRefreshToken(null)
      this.router.push({path: '/'})
      localStorage.removeItem('address')
      localStorage.removeItem('authenticationToken')
      localStorage.removeItem('refreshToken')
    },
    goToProfile(){
      this.router.push({path: '/u/' + this.defaultProfile.id})
    }
  },
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
  },
});

</script>