import { Injectable } from '@nestjs/common'
import { ShellCommandsRegistry } from './shell-commands.registry'
import { ShellComponent } from './shell-component'
import { bootstrapShell } from './shell.bootstraper'
import { BootstrapOptions } from './type/bootstrap-options.type'

@Injectable()
export class ShellFacade {
  public async bootstrap(options: BootstrapOptions): Promise<void> {
    await bootstrapShell(options)
  }

  public registerComponents(...components: ShellComponent[]): void {
    components.forEach((component) => ShellCommandsRegistry.registerComponent(component))
  }
}
