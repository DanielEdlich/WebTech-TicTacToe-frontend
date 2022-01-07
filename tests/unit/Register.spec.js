import { mount } from '@vue/test-utils'
import Register from '@/views/register'

describe('Testing Register.vue', () => {
  it('renders page title', () => {
    // when
    const wrapper = mount(Register)
    // then
    expect(wrapper.text()).toMatch('Register')
  })
  it('check if form is rendered', () => {
    // when
    const wrapper = mount(Register)
    // then
    const createForm = wrapper.find('#userscreateform')
    expect(createForm.exists()).toBeTruthy()
  })
  it('check if Button is rendered', () => {
    // when
    const wrapper = mount(Register)
    // then
    const button = wrapper.find('#RegisterButton')
    expect(button.exists()).toBeTruthy()
  })
  it('check if alert does not show by default', () => {
    // when
    const wrapper = mount(Register)
    // then
    const alert = wrapper.find('#Alert')
    expect(alert.exists()).toBeFalsy()
  })
})
