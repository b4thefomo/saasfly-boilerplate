import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../Button.vue'

describe('Button component', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })
    
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).toContain('items-center')
    expect(wrapper.classes()).toContain('bg-primary')
    expect(wrapper.attributes('type')).toBe('button')
  })
  
  it('renders with different variants', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'outline'
      },
      slots: {
        default: 'Outline Button'
      }
    })
    
    expect(wrapper.text()).toBe('Outline Button')
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('bg-background')
  })
  
  it('shows loading state when loading prop is true', async () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      },
      slots: {
        default: 'Loading Button'
      }
    })
    
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.classes()).toContain('pointer-events-none')
    expect(wrapper.text()).toContain('Loading Button')
  })
  
  it('is disabled when disabled prop is set', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled Button'
      }
    })
    
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('opacity-50')
    expect(wrapper.classes()).toContain('pointer-events-none')
  })
  
  it('emits click event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click Button'
      }
    })
    
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
