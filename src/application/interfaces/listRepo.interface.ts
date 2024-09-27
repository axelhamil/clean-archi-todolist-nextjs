import { List } from "@/src/domains/list/list.entity";

export interface IListRepo {
  create(list: List): Promise<List>;
  findAll(userId: string): Promise<List[]>;
}
