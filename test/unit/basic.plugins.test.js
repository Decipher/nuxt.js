import { getPort, loadFixture, Nuxt } from '../utils'

let port
const url = route => 'http://localhost:' + port + route

let nuxt = null

describe('with-config', () => {
  beforeAll(async () => {
    const config = await loadFixture('basic')
    nuxt = new Nuxt(config)
    port = await getPort()
    await nuxt.server.listen(port, 'localhost')
  })

  test('/', async () => {
    const window = await nuxt.server.renderAndGetWindow(url('/'))
    expect(window.__test_plugin).toBe(true)
  })

  test('inject fails if value is undefined', async () => {
    // inject('injectedProperty', undefined)
    await expect(nuxt.renderRoute('/?injectValue=undefined')).rejects.toThrowError('inject(key, value) has no value provided')
  })

  test('inject succeeds if value is defined but evaluates to false', async () => {
    // inject('injectedProperty', null)
    await expect(nuxt.renderRoute('/?injectValue=null')).resolves.not.toThrowError()
    // inject('injectedProperty', false)
    await expect(nuxt.renderRoute('/?injectValue=false')).resolves.not.toThrowError()
    // inject('injectedProperty', 0)
    await expect(nuxt.renderRoute('/?injectValue=0')).resolves.not.toThrowError()
    // inject('injectedProperty', '')
    await expect(nuxt.renderRoute('/?injectValue=empty')).resolves.not.toThrowError()
  })

  // Close server and ask nuxt to stop listening to file changes
  afterAll(async () => {
    await nuxt.close()
  })
})
