import { Global, Module } from '@nestjs/common'
import { ShellFacade } from './shell.facade'

@Global()
@Module({ providers: [ShellFacade], exports: [ShellFacade] })
export class ShellModule {}
