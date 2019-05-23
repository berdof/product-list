import Component from '@ember/component';

export default Component.extend({
  products: [],
  productToEdit: {},
  productToDelete: {},
  isEditModalVisible: false,
  isDeleting: false,
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

    removeProduct: async function ({id}) {
      this.set('isDeleting', true);
      const product = await this.store.findRecord('product', id, {backgroundReload: false});
      await this.removePhoto(product.photo);
      product.destroyRecord();
      this.set('isDeleting', false);
      $('#deleteModal').modal('hide');
    }
  }
});
