import Component from '@ember/component';

export default Component.extend({
  products: [],
  productToEdit: {},
  isEditModalVisible: false,
  actions: {
    showUpdateModal(product) {
      this.set('productToEdit', {
        ...product.toJSON(),
        id: product.get('id')
      });
      setTimeout(() => this.set('isEditModalVisible', !this.isEditModalVisible))
    },
    removeProduct({id}) {
      this.store
        .findRecord('product', id, {backgroundReload: false})
        .then((product) => product.destroyRecord());
    }
  }
});
