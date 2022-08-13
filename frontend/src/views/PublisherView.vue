<template>
  <div class="flex flex-col relative h-[calc(100vh-4rem)] px-10">
    <div class="flex mb-3">
      <button class="btn btn-white" @click="goBack">Cancel</button>
      <div class="grow"></div>
      <button class="btn btn-blue" @click="submitToIPFS" v-if="previewURL.length>0">Submit</button>
      <button class="btn btn-not-allowed" v-else>Submit</button>

    </div>
    
    <div class="text-center text-2xl text-gray-700 font-bold">Upload your design, inspire the world✨</div>
    <div class="flex w-4/6 mx-auto mt-10 border-dashed border-4 border-gray-200 rounded-2xl items-center" :class="[previewURL.length>0?'h-2/6':'h-4/6']" @drop="onDrop($event)" @dragenter.prevent @dragover.prevent v-if="previewURL.length==0">
      <div class="text-center w-full font-bold text-gray-500 text-lg" @drop.prevent.stop @drop="onDrop($event)" @dragenter.prevent @dragover.prevent>
        Drag and drop up to 10 images <br />or <span class="text-blue-500">Browse</span> to choose a file.
      </div>
    </div>
    <div class="w-[calc(100vw-5rem)] mt-6" v-if="previewURL.length>0">
      <div class="grid grid-cols-5 gap-4 w-4/6 mx-auto">
        <div class="relative w-full aspect-4/3 group" v-for="(url, index) in previewURL" :key="url">
          <img :src="url" alt="" class="w-full aspect-4/3 object-cover rounded-md">
          <div class="absolute top-0 hidden group-hover:block w-full aspect-4/3 bg-gradient-to-b from-gray-900/50 rounded-md">
            <img src="@/assets/icons/close.svg" alt="delete selected image" class="absolute top-1 right-1 w-6 cursor-pointer" title="delete" @click="removeFile(index)">
          </div>
        </div>
        <div class="flex bg-gray-100 rounded-md text-gray-400 items-center w-full aspect-4/3" @drop.prevent.stop @drop="onDrop($event)" @dragenter.prevent @dragover.prevent v-if="previewURL.length<10">
          <span class="w-full text-center">+ add more</span>
        </div>
      </div>

      <div class="w-4/6 mt-10 mx-auto rounded-lg overflow-hidden focus:ring-0">
        <label for="title" class="sr-only">Title</label>
        <input type="text" name="title" id="title" class="block w-full border-0 pt-2.5 text-lg font-medium placeholder-gray-500 focus:ring-0 outline-none" placeholder="Title" />
        <div class="my-3"></div>
        <label for="description" class="sr-only">Description</label>
        <textarea rows="3" name="description" id="description" class="block w-full border-0 py-0 resize-none placeholder-gray-500 outline-none focus:ring-0 sm:text-sm" placeholder="Write a description..." />
      </div>

    </div>
    

    
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store/store'


export default defineComponent({
  name: 'PublisherView',
  setup() {
    
    const router = useRouter()
    const allFiles =ref<any[]>([])
    const previewURL = ref<string[]>([])
    
    return { allFiles, previewURL, router }
  },
  methods: {
    goBack(){
      this.allFiles.splice(0, this.allFiles.length)
      this.previewURL.splice(0, this.previewURL.length)
			this.router.push({path: '/'})
		},
    onDrop (event:any) {
      event.preventDefault()
      const droppedFiles = event.dataTransfer.files
      // console.log(droppedFiles.length)
      // console.log(droppedFiles[0])
      // Object.entries(droppedFiles).forEach((f:any)=>{
      //   this.allFiles.push(f)
      // })
      for (let i = 0; i < droppedFiles.length; i++) {
        if (this.allFiles.length < 10) {
          this.allFiles.push(droppedFiles[i])
          this.previewURL.push(URL.createObjectURL(droppedFiles[i]))
        }
      }
      console.log(this.previewURL)
    },
    removeFile(id:number) {
      this.allFiles.splice(id, 1)
      this.previewURL.splice(id, 1)
    },
    submitToIPFS() {
      console.log('submit files to IPFS')
    }
  },
  components: {
  },
});
</script>