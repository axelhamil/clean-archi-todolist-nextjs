import { injectable } from "inversify";

import { List } from "@/src/domains/list/list.entity";
import { eventBus } from "@/src/shared/events";

@injectable()
export class ListRepoMock {
  private _lists: List[] = [];

  async create(list: List): Promise<List> {
    const newList = {
      ...list,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this._lists.push(newList);
    eventBus.dispatch(newList.id);
    return newList;
  }

  async findAll(userId: string): Promise<List[]> {
    return this._lists.filter((list) => list.userId === userId);
  }
}
