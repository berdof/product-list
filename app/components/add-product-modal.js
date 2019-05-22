import Ember from 'ember';
import Component from '@ember/component';
import {computed, observer} from '@ember/object';

export default Component.extend({
  productId: null,
  title: '',
  description: '',
  photo: '',
  isShowButtonVisible: false,
  isModalVisible: false,
  firebaseApp: Ember.inject.service(),
  componentName: computed('action', function () {
    return `${this.action}Modal`;
  }),
  componentId: computed('action', function () {
    return `#${this.componentName}`;
  }),
  modalTitle: computed('action', function () {
    return this.action === 'update' ? 'Update Product' : 'Add New Product';
  }),

  visibilityChange: observer('isModalVisible', function () {
    this.showModal();
  }),

  init(props) {
    this._super(...arguments);
    this.actions.uploadImage = this.actions.uploadImage.bind(this);
  },

  didInsertElement() {
    if (this.isModalVisible) {
      this.showModal('show')
    }
  },

  showModal(action = 'toggle') {
    $(this.componentId).modal(action);
  },

  createProduct() {
    const newProduct = this.store.createRecord('product', {
      title: this.get('title'),
      description: this.get('description'),
      photo: this.get('photo'),
    });
    newProduct.save();
  },
  updateProduct() {
    this.store
      .findRecord('product', this.get('productId'), {backgroundReload: false})
      .then((product) => {
        product.setProperties({
          title: this.get('title'),
          description: this.get('description'),
          photo: this.get('photo')
        });
        product.save()
      });
  },

  actions: {
    onSave() {
      if (this.action === 'add') {
        this.createProduct();
      } else if (this.action === 'update') {
        this.updateProduct();
      } else {
        throw Error(`Unknown @action name: ${this.action}`);
      }
      this.set('isModalVisible', !this.isModalVisible)
    },

    async uploadImage(file) {
      const storage = await this.firebaseApp.storage();

      this.set('isFileUploading', true);

      const task = storage
        .ref()
        .child(`images/${file.name}`)
        .put(file.blob, {
          contentType: file.type
        });

      task
        .then(snapshot => {
          return snapshot.ref.getDownloadURL();
        })
        .then(url => {
          this.set('isFileUploading', false);
          this.set('photo', url);
        })
    }
  }
});
