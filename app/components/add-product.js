import Component from '@ember/component';

export default Component.extend({
  title: '11',
  description: '22',
  photo: '33',
  actions: {
    addProduct() {
      const newProduct = this.store.createRecord('product', {
        title: this.get('title'),
        description: this.get('description'),
        photo: this.get('photo'),
      });
      newProduct.save();
      $('#addProductModal').modal('toggle');
    }
  }
});
