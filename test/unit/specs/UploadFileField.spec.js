import Vue from 'vue'
import UploadFileField from '@/components/UploadFileField'

describe('UploadFileField.vue', () => {
  it('should render <input type="file">', () => {
    const Constructor = Vue.extend(UploadFileField)
    const vm = new Constructor().$mount()

    expect(vm.$el.querySelector('input[type=file]')).toBeTruthy()
  })
})
