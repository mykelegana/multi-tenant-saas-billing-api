import { Global, Module } from "@nestjs/common";
import { UsageService } from "./usage.service";
import { DatabaseModule } from "src/database/database.module";


@Global()
@Module({
    providers: [UsageService],
    imports: [DatabaseModule],
    exports: [UsageService],
})
export class UsageModule { }
