<template>
  <div class="evaporate-file-input">
    <input type="file" ref="fileInput" @change="onFileChange" />
  </div>
</template>

<script>

export default {
  name: 'UploadFileField',
  props: {
    backend: {
      type: Function
    }
  },
  methods: {
    onFileChange (event) {
      this.$emit('change', event)
    },
    upload () {
      if (!this.backend) {
        console.warn('UploadFileField: backend not set.')
      }
      this.backend({
        fileInput: this.$refs.fileInput,
        progress: (progress) => this.$emit('progress', progress)
      }).then(complete => {
        this.$emit('complete', complete)
      }).catch(err => {
        console.warn(err)
        this.$emit('error', err)
      })
    }
  }
}
</script>