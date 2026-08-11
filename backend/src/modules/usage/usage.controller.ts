import { Controller } from "@nestjs/common";
import { UsageService } from "./usage.service";


@Controller()
export class UsageController {
    constructor(private readonly usageService: UsageService) { }
}