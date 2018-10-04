<template>
  <div class="evaporate-file-input">
    <input :disabled="disabled" :accept="accept" type="file" ref="fileInput" @change="onFileChange" />
    <div class="evaporate-file-input-progress">
      {{ progressText }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'UploadFileField',
  data: () => ({
    progress: null,
    completed: false
  }),
  props: {
    backend: {
      type: Function
    },
    backendConfig: {
      type: Object
    },
    accept: {
      type: String
    },
    disabled: {
      type: Boolean,
      defualt: false
    }
  },
  computed: {
    progressText () {
      if (this.progress) {
        return `${(this.progress * 100).toFixed(2)}%`
      }
    }
  },
  methods: {
    onFileChange (event) {
      this.progress = 0;
      this.completed = false
      this.$emit('change', event)
    },
    getFiles () {
      return this.$refs.fileInput.files;
    },
    upload () {
      if (!this.backend) {
        console.warn('UploadFileField: backend not set.')
      }
      if (this.completed) {
        return
      }

      return this.backend({
        config: this.backendConfig,
        fileInput: this.$refs.fileInput,
        progress: (progress) => {
          this.progress = progress
          this.$emit('progress', progress)
        }
      }).then(complete => {
        this.$emit('complete', complete)
        this.completed = true
        return complete
      }).catch(err => {
        console.warn(err)
        this.$emit('error', err)
        return err
      })
    }
  }
}
</script>

<style scoped>
.evaporate-file-input {
  display: flex;
}

.evaporate-file-input-progress {
  flex: 1;
  max-width: 80px;
}
</style>