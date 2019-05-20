import Component from '@ember/component';

export default Component.extend({
  actions: {
    removeProduct(id) {
      this.store
        .findRecord('product', id, {backgroundReload: false})
        .then((product) => product.destroyRecord());
    }
  }
});
