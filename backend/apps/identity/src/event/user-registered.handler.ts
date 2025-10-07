import {EventsHandler, IEventHandler} from "@nestjs/cqrs";
import {UserRegisteredEvent} from "./user-registered.event";
import {RepositoryService} from "@repository/repository.service";

@EventsHandler(UserRegisteredEvent)
export class UserRegisteredHandler implements IEventHandler<UserRegisteredEvent> {
    constructor(
        private readonly repository: RepositoryService,
    ) {}

    async handle(event: UserRegisteredEvent): Promise<void> {}
}