<template>
  <div id="demo">
    <h1>UploadField Demo</h1>

    <label>Select a backend:</label>
    <select v-model="selectedBackend">
      <option v-for="backend in backends" :key="backend">{{ backend }}</option>
    </select>

    <upload-file-field
        ref="evaporateFileInput"
        :backend="uploadBackend"
        @change="onFileChange"
        @progress="onProgressChange" />
    <p class="progress">{{ progressMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import UploadFileField from './components/UploadFileField'
import evaporate from './backends/evaporate'
import dummy from './backends/dummy'

const api = axios.create({
  baseURL: 'http://localhost:5000/'
})

export default {
  name: 'app',
  components: {
    UploadFileField
  },
  data: () => {
    return {
      progressMessage: '0%',
      backends: ['dummy', 'evaporate'],
      selectedBackend: 'dummy'
    }
  },
  methods: {
    uploadBackend (options) {
      if (this.selectedBackend === 'dummy') {
        return dummy(options)
      } else if (this.selectedBackend === 'evaporate') {
        return api.get('/config').then(response => response.data).then(config => {
          return evaporate(options, config)
        })
      } else {
        throw new Error('Invalid demo backend.')
      }
    },
    onFileChange () {
      const { evaporateFileInput } = this.$refs
      evaporateFileInput.upload()
    },
    onProgressChange (progress) {
      this.progressMessage = `${(progress * 100).toFixed(2)}%`
    }
  }
}
</script>

<style>
#demo {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

select {
  margin-bottom: 15px;
}

.progress {
  color: #696;
}
</style>
