import { Controller, Get } from '@nestjs/common';

@Controller()
export default class CoreController {
  @Get()
  getHello(): string {
    return 'Working';
  }
}
