<template>
	<div class="grow mx-10">
		<label class="relative block">
			<span class="sr-only">Search</span>
			<span class="absolute inset-y-0 left-0 flex items-center pl-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="#cccccc" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
			</span>
			<input class="placeholder:text-slate-400 block bg-gray-100 w-full border-0 border-slate-300 rounded-full py-2 pl-9 pr-3 shadow-sm focus:outline-none sm:text-sm outline-none" v-model="query" @keyup.enter="search" placeholder="Search for inspiration" type="text" name="search"/>
		</label>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
	setup() {
		const query = ref<string>('')
		const router = useRouter()
		return { query, router }
	},
	methods: {
		search(){
			console.log(this.query)
			// const url = '/search?q='+this.query
			// alert(url)
			this.router.push({path:'/search', query:{q: this.query}})
			this.query = ''
		}
	}
})
</script>