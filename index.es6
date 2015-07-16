import isofetch from 'isomorphic-fetch';
// This hack is needed because native fetch doesn't like being called with context
const fetch = isofetch;
export default class Store {

  constructor(url) {
    this.url = url;
    if (!this.entities) {
      Object.defineProperty(this, 'entities', { value: {} });
    }
    if (!this.includedStores) {
      Object.defineProperty(this, 'includedStores', { value: {} });
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

  fetch(id) {
    if (this.entities[id]) {
      return new Promise((resolve) => resolve(this.entities[id]));
    }
    return this.fetchAll().then(() => this.entities[id]);
  }

  fetchAll() {
    const excluded = Object.keys(this.entities).map(id => `exclude[]=${id}`).join('&');
    return fetch(`${this.url}?${excluded}`)
      .then(response => response.json())
      .then((response) => {
        for (const entity of response.data) {
          this.add(entity);
        }
        if (response.included) {
          this.addIncludedData(response.included);
        }
      })
      .then(() => this.entities);
  }

  addIncludedData(included) {
    included.forEach((entity) => {
      if (this.includedStores[entity.type]) {
        this.includedStores[entity.type].add(entity);
      }
    });
  }

  registerIncludedStore(store, relationshipName) {
    this.includedStores[relationshipName] = store;
  }

}
