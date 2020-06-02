import { Injectable } from '@nestjs/common'
import { bootstrapShell } from './shell.bootstraper'
import { ShellRegistry } from './shell.registry'
import { BootstrapOptions, ImmutableCommand, ShellComponent } from './type'

@Injectable()
export class ShellFacade {
  public async bootstrap(options: BootstrapOptions): Promise<void> {
    await bootstrapShell(options)
  }

  public registerComponents(...components: ShellComponent[]): void {
    components.forEach((component) => ShellRegistry.registerComponent(component))
  }

  public getAllCommands(): ImmutableCommand[] {
    return ShellRegistry.getImmutableCommands()
  }
}
