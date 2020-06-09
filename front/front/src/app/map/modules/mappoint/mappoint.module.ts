import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

export class MappointModule {
  order: number;
  name: string;
  description: string;
  coordinate: number[];
  userId: string;
  mapVersion: number;
  path: string;

  constructor(
    order: number,
    coordinate: number[],
    name?: string,
    description?: string
  ) {
    this.order = order;
    this.name = name;
    this.description = description;
    this.coordinate = coordinate;
  }

  deserialize() {
    return Object.assign({}, this);
  }
}
