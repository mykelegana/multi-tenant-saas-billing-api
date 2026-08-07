import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Stripe from "stripe";

@Injectable()
export class StripeService {
    constructor(@Inject('STRIPE_CLIENT') stripe: Stripe) { }
}