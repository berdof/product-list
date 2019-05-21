import Component from '@ember/component';

export default Component.extend({
  products: [],
  productToEdit: {},
  productToDelete: {},
  isEditModalVisible: false,
  actions: {
    showUpdateModal(product) {
      this.set('productToEdit', {
        ...product.toJSON(),
        id: product.get('id')
      });
      setTimeout(() => this.set('isEditModalVisible', !this.isEditModalVisible))
    },

    showRemoveModal(product) {
      this.set('productToDelete', product);
      $('#deleteModal').modal('show');
    },

    removeProduct({id}) {
      this.store
        .findRecord('product', id, {backgroundReload: false})
        .then((product) => product.destroyRecord());
      $('#deleteModal').modal('hide');
    }
  }
});
