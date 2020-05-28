import { Module, OnApplicationBootstrap } from '@nestjs/common'
import { TestClass } from 'src/test-class'
import { ShellCommandsRegistry } from './shell-commands.registry'
import { ShellBootstraper } from './shell.bootstraper'

@Module({})
export class ShellModule implements OnApplicationBootstrap {
  public async onApplicationBootstrap(): Promise<void> {
    const shellBootstraper = new ShellBootstraper()

    ShellCommandsRegistry.registerComponent({
      componentFile: () => import('../test.shell-command'),
      args: [new TestClass('someProperty abc', 'someNextProperty def')],
    })
    await shellBootstraper.bootstrap()
  }
}
