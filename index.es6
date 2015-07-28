export default class Store {

  constructor(url) {
    this.url = url;
    if (!this.entities) {
      Object.defineProperty(this, 'entities', { value: {} });
    }
  }

  add(entity) {
    this.entities[entity.id] = entity;
  }

  get(id) {
    return this.entities[id];
  }

  getAll() {
    return Object.keys(this.entities).map((id) => this.entities[id]);
  }

  getWhere(filterFunction) {
    return this.getAll().filter(filterFunction);
  }

}
