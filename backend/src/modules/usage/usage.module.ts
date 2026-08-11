import { Global, Module } from "@nestjs/common";
import { UsageController } from "./usage.controller";
import { UsageService } from "./usage.service";


@Global()
@Module({
    exports: [UsageService],
    providers: [UsageService],
    controllers: [UsageController]
})
export class UsageModule { }
