import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ShellModule } from './shell/shell.module'

@Module({
  imports: [ShellModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
