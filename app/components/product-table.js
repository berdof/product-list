import Component from '@ember/component';

export default Component.extend({
  products: [],
  productToEdit: {},
  productToDelete: {},
  isEditModalVisible: false,
  isDeleting: false,
  firebaseApp: Ember.inject.service(),
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
      try {
        const storage = await this.firebaseApp.storage();
        await storage.refFromURL(product.photo).delete();
      } catch (error) {
        console.error(error);
      }

      product.destroyRecord();
      this.set('isDeleting', false);
      $('#deleteModal').modal('hide');
    }
  }
});
