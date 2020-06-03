import { Command } from './command.type'

export { BootstrapOptions } from './bootstrap-options.type'
export { CommandDecoratorOptions } from './command-decorator.options.type'
export { Command } from './command.type'
export * from './pattern-parameter.type'
export { ShellComponent } from './shell-component'

export type ImmutableCommand = Pick<Command, Exclude<keyof Command, 'handler'>>
