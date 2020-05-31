import { ShellComponent } from '../shell-component'

export type Component = { lazyComponent: Promise<typeof ShellComponent>; args: any[] }
