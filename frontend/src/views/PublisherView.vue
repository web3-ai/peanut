<template>
  <div class="flex mt-10 flex-col relative h-[calc(100vh-4rem)] px-10">
    <div class="flex mb-3">
      <button class="btn btn-white" @click="goBack">Cancel</button>
      <div class="grow"></div>
      <button class="btn btn-blue" @click="addFilesToNFTStorage" v-if="previewURL.length>0">Submit</button>
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
        <input type="text" name="title" id="title" class="block w-full border-0 pt-2.5 text-lg font-medium placeholder-gray-500 focus:ring-0 outline-none" placeholder="Title" v-model="title" />
        <div class="my-3"></div>
        <label for="description" class="sr-only">Description</label>
        <textarea rows="3" name="description" id="description" class="block w-full border-0 py-0 resize-none placeholder-gray-500 outline-none focus:ring-0 sm:text-sm" placeholder="Write a description..." v-model="description" />
      </div>

    </div>
    

    
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store/store'
import { web3_client } from '../lens/ipfs'
import { createPost } from '../lens/publications/post'
import { v4 as uuidv4 } from 'uuid'
import { NFTStorage } from 'nft.storage'

// eslint-disable-next-line
const buffer = require('buffer/').Buffer


export default defineComponent({
  name: 'PublisherView',
  setup() {
    onMounted(()=>{
      if(store.address==null){
        alert('Please login first.')
        window.location.href = '/'
      } else if(store.defaultProfile==null){
        alert('Please create a profile first.')
        window.location.href = '/'
      }
    })
    const router = useRouter()
    const allFiles =ref<any[]>([])
    const previewURL = ref<string[]>([])
    const imgIdx = ref<number>(0)
    const title = ref<string|undefined>(undefined)
    const description = ref<string|undefined>(undefined)
    
    return { allFiles, previewURL, router, ...toRefs(store), imgIdx, title, description }
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

      for (let i = 0; i < droppedFiles.length; i++) {
        if (this.allFiles.length < 10) {
          if(this.supportedImageTypes.includes(droppedFiles[i].type)) {
            this.allFiles.push(this.renameFile(droppedFiles[i]))
            this.previewURL.push(URL.createObjectURL(droppedFiles[i]))
          } else {
            alert('Only support .png, .jpg or .jpeg file.')
          }
        }
      }
    },
    removeFile(id:number) {
      this.allFiles.splice(id, 1)
      this.previewURL.splice(id, 1)
    },
    async submitoWeb3Storage(){
      let fileUrls:any[] = []
      if (this.allFiles.length > 0) {
        const client = web3_client()
        const cid = await client.put(this.allFiles)
        console.log('stored files with cid:', cid)
        this.allFiles.forEach((file:any)=>{
          const fileUrl = 'https://' + cid + '.ipfs.w3s.link/' + file.name
          fileUrls.push({item: fileUrl, type: file.type, altTag: null, cover: null})
        })
      } else {
        alert('Please add at least 1 image.')
        return
      }
      console.log(fileUrls)

      // construct publication content json 
      const client_metadata = web3_client()
      const postJSON = {
        version: '2.0.0',
        metadata_id: uuidv4(),
        description: this.description,
        content: '',
        mainContentFocus: 'IMAGE',
        locale: 'en',
        external_url: null,
        image: fileUrls[0].item,
        imageMimeType: fileUrls[0].type,
        name: this.title,
        attributes: [],
        media: fileUrls,
        appId: 'peanut37',
      }
      console.log(postJSON)

      const blob = new Blob([JSON.stringify(postJSON)], { type: 'application/json' })
      const metadataFile = [
        new File([blob], 'metadata.json')
      ]
      const metadataCID = await client_metadata.put(metadataFile)
      const metadataURI = 'ipfs://' + metadataCID + '/metadata.json'
      console.log(metadataURI)
      const post_result_data = createPost(metadataURI)
      console.log(post_result_data)
    },
    // async submitToNFTStorage(){

    //   var reader = new FileReader();
    //   reader.readAsArrayBuffer(this.allFiles[0]);
    //   reader.onloadend = async ()=>{
    //     const buf = buffer.from(reader.result)
    //     const data = new Blob([buf])
    //     // @ts-ignore
    //     const nft_storage_client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGE3NzMyOEVDMmM0OTBCNUVGNzFiNmY0QjEwZDc5MTRmNjAwMzgyNEQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDczOTYwNTk4NiwibmFtZSI6InBlYW51dCJ9.Vw7bcATOBjPo2ge1UD_lgD9OhCs6QctKRzQ_V-seaoM' })
    //     const cid = await nft_storage_client.storeBlob(data)
    //     console.log(cid)
    //   }
    // },
    async addFilesToNFTStorage() {
      // eslint-disable-next-line
      const that = this
      this.loading = true
      return Promise.all([].map.call(this.allFiles, function (file) {
          return new Promise(function (resolve, reject) {
              var reader = new FileReader();
              reader.readAsArrayBuffer(file);
              reader.onloadend = async ()=>{
                const nft_storage_client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGE3NzMyOEVDMmM0OTBCNUVGNzFiNmY0QjEwZDc5MTRmNjAwMzgyNEQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDczOTYwNTk4NiwibmFtZSI6InBlYW51dCJ9.Vw7bcATOBjPo2ge1UD_lgD9OhCs6QctKRzQ_V-seaoM' })
                let buf = buffer.from(reader.result)
                const data = new Blob([buf])
                const cid = await nft_storage_client.storeBlob(data)
                // @ts-ignore
                resolve({ item: 'ipfs://'+cid, type: file.type, altTag:null, cover:null });
              }
          });
      })).then(function (results) {
          console.log(results)
          const postJSON = {
            version: '2.0.0',
            metadata_id: uuidv4(),
            description: that.description,
            content: that.title + ' ' + that.description,
            mainContentFocus: 'IMAGE',
            locale: 'en',
            external_url: null,
            // @ts-ignore
            image: results[0].item,
            // @ts-ignore
            imageMimeType: results[0].type,
            name: that.title,
            attributes: [],
            media: results,
            // @ts-ignore
            tags: that.title.split(' ').slice(0, 5), 
            appId: 'peanut37',
          }
          console.log(postJSON)

          const metadata_blob = new Blob([JSON.stringify(postJSON)], { type: 'application/json' })
          const nft_storage_client = new NFTStorage({ token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGE3NzMyOEVDMmM0OTBCNUVGNzFiNmY0QjEwZDc5MTRmNjAwMzgyNEQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDczOTYwNTk4NiwibmFtZSI6InBlYW51dCJ9.Vw7bcATOBjPo2ge1UD_lgD9OhCs6QctKRzQ_V-seaoM' })
          const metadataCID = nft_storage_client.storeBlob(metadata_blob)

          console.log(metadataCID)
          metadataCID.then((metadataCID:string)=>{
            console.log(metadataCID)
            const metadataURI = 'ipfs://' + metadataCID
            createPost(metadataURI).then((internalPublicationId)=>{
              console.log(internalPublicationId)
              that.loading = false
              // post image to server for embedding
              // @ts-ignore
              const imageCID = results[0].item.split('//')[1]
              const url = 'https://oeog73oa9k.execute-api.us-west-2.amazonaws.com/1/add-publication' + '?publicationId=' + internalPublicationId + '&imageUrl=https://ipfs.io/ipfs/' + imageCID
              console.log(url)
              fetch(url, { mode: 'cors'}).then(function(response) {
                console.log('add publication to server succeeded!')
                return response.json()
              }).then(function(data) {
                console.log(data.status)
                window.location.href = '/p/' + internalPublicationId
              });
            })
          })
          
          
          // const metadataURI = 'ipfs://' + metadataCID
          // console.log(metadataURI)
          // const post_result_data = createPost(metadataURI)
          // console.log(post_result_data)

      });
    },
    // submitToIPFS() {
    //   console.log('submit files to IPFS')
    //   this.addFiles(this.allFiles)
    // },
    // async convertToBuffer(reader:any){
    //   return Buffer.from(reader)
    // },
    // async addFiles(files:any[]) {
    //   return Promise.all([].map.call(files, function (file) {
    //       return new Promise(function (resolve, reject) {
    //           var reader = new FileReader();
    //           reader.readAsArrayBuffer(file);
    //           reader.onloadend = async ()=>{
    //             let buf = buffer.from(reader.result)
    //             let ipfs_res = await ipfs_client.add(buf)
    //             resolve({ result: ipfs_res, file: file });
    //           }
    //       });
    //   })).then(function (results) {
    //       console.log(results)
    //   });
    // },
    renameFile(originalFile:any) {
      console.log(originalFile)
      this.imgIdx += 1
      return new File([originalFile], this.imgIdx.toString(), {
          type: originalFile.type,
          lastModified: originalFile.lastModified,
      })
    }
  },
  components: {
  },
});
</script>