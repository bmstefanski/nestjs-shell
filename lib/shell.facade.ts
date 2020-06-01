import { Injectable } from '@nestjs/common'
import { ShellComponent } from './shell-component'
import { bootstrapShell } from './shell.bootstraper'
import { ShellRegistry } from './shell.registry'
import { BootstrapOptions } from './type/bootstrap-options.type'

@Injectable()
export class ShellFacade {
  public async bootstrap(options: BootstrapOptions): Promise<void> {
    await bootstrapShell(options)
  }

  public registerComponents(...components: ShellComponent[]): void {
    components.forEach((component) => ShellRegistry.registerComponent(component))
  }
}
