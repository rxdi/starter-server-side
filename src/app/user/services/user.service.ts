
import { Service, OnInit } from "@rxdi/core";
import { Inject } from "@rxdi/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CREATE_UNIQUE_HASH } from "../user.tokens";

@Service()
export class UserService implements OnInit {
    constructor(
        @Inject(CREATE_UNIQUE_HASH) private ipfsDownloadedFactory: { testKey: () => string },
        @Inject('testFactoryAsync') private testFactoryAsync: string,
        @Inject('testChainableFactoryFunction') private chainableFactory: Observable<number>

    ) {}

    OnInit() {
        console.log('UserService', this.ipfsDownloadedFactory.testKey(), this.testFactoryAsync);
        this.chainableFactory
            .pipe(
                map((res) => res)
            )
            .subscribe(value => console.log('Value chaining factory ', value));
    }
}