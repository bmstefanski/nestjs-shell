import { ShellRegistry } from './shell.registry'
import { EmptyTestCommandComponent } from './__stubs__/empty-test.command-component'
import { removeProperty } from './__stubs__/remove-property'

describe('ShellRegistry', () => {
  /* tslint:disable no-string-literal */
  beforeEach(() => {
    ShellRegistry['commands'] = {}
    ShellRegistry['components'] = {}
  })

  describe('registerComponent', () => {
    it('should be pushed to components container', () => {
      const component = new EmptyTestCommandComponent()

      ShellRegistry.registerComponent(component)
      const results = ShellRegistry.getImmutableComponents()

      expect(results).toStrictEqual({ EmptyTestCommandComponent: {} })
    })

    it('should throw an error if passed falsy argument as a component', () => {
      expect(() => ShellRegistry.registerComponent(null)).toThrowError(
        `Component you're trying to register has falsy value (probably null or undefined)`,
      )
    })
  })

  describe('getComponent', () => {
    it('should return component object with same name as specified', () => {
      const component = new EmptyTestCommandComponent()

      ShellRegistry.registerComponent(component)
      const results = ShellRegistry.getComponent('EmptyTestCommandComponent')

      expect(results).toStrictEqual(new EmptyTestCommandComponent())
    })

    it('should throw an error if passed falsy argument as a componentClassName', () => {
      const component = new EmptyTestCommandComponent()

      ShellRegistry.registerComponent(component)
      const results = ShellRegistry.getComponent('')

      expect(results).toBeFalsy()
    })

    it('should return undefined if passed class name does not match any component', () => {
      const results = ShellRegistry.getComponent('SomeCommandComponent')
      expect(results).toBeUndefined()
    })
  })

  describe('registerCommand', () => {
    it('should be pushed to commands container', () => {
      const command = { name: 'test', prefix: '.', handler: async (input) => {} }

      ShellRegistry.registerCommand(command)
      const results = ShellRegistry.getImmutableCommands()

      expect(results).toStrictEqual({ [command.prefix + command.name]: removeProperty(command, 'handler') })
    })

    it('should throw an error if passed falsy argument as a command', () => {
      expect(() => ShellRegistry.registerCommand(null)).toThrowError(
        `Cannot register command because its value or name is falsy (it may be empty command name in @ShellCommand decorator)`,
      )
    })

    it('should throw an error if command name are falsy', () => {
      const command = { name: '', prefix: '', handler: async (input) => {} }
      expect(() => ShellRegistry.registerCommand(command)).toThrowError(
        `Cannot register command because its value or name is falsy (it may be empty command name in @ShellCommand decorator)`,
      )
    })
  })

  describe('findCommand', () => {
    it('should return command with same prefix and name as specified', () => {
      const command = { name: 'test', prefix: '.', handler: async (input) => {} }

      ShellRegistry.registerCommand(command)
      const results = ShellRegistry.findCommand('.test')

      expect(results).toStrictEqual(command)
    })

    it('should return undefined if there is no command with such prefix and name', () => {
      const results = ShellRegistry.findCommand('.test')
      expect(results).toBeUndefined()
    })
  })

  describe('getImmutableComponents', () => {
    it('should return deep copy of components container', () => {
      const container: any = ShellRegistry.getImmutableComponents()

      container['hello-test'] = 'hello'

      expect(ShellRegistry.getImmutableComponents()).not.toStrictEqual({ ['hello-test']: 'hello' })
    })
  })

  describe('getImmutableCommands', () => {
    it('should return deep copy of commands container', () => {
      const container: any = ShellRegistry.getImmutableCommands()

      container['hello-test'] = 'hello'

      expect(ShellRegistry.getImmutableCommands()).not.toStrictEqual({ ['hello-test']: 'hello' })
    })
  })
})
