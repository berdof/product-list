import Ember from 'ember';
import Component from '@ember/component';
import {computed, observer} from '@ember/object';

export default Component.extend({
  productId: null,
  title: '',
  description: '',
  photo: '',
  fileToUpload: null,
  fileToUploadBase64: null,
  isShowButtonVisible: false,
  isModalVisible: false,
  isSaving: false,
  firebaseApp: Ember.inject.service(),

  fileToUploadBase64Change: function () {
    if (this.get('fileToUpload')) {
      const reader = new FileReader();
      reader.readAsDataURL(this.get('fileToUpload'));
      reader.addEventListener("load", () => {
        console.log('reader.result', reader.result)
        this.set('fileToUploadBase64', reader.result)
      }, false);
    }

    if (this.get('action') === 'update') {
      this.set('fileToUploadBase64', this.get('photo'));
    }
  }.observes('photo', 'action', 'fileToUpload'),//.on('init'),

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
    return newProduct.save();
  },

  async updateProduct() {
    const product = await this.store
      .findRecord('product', this.get('productId'), {backgroundReload: false});

    product.setProperties({
      title: this.get('title'),
      description: this.get('description'),
      photo: this.get('photo')
    });

    return product.save()
  },

  async uploadImage(file) {
    const storage = await this.firebaseApp.storage();

    this.set('isFileUploading', true);

    const task = storage
      .ref()
      .child(`images/${file.name}`)
      .put(file, {
        contentType: file.type
      });

    await task
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
        this.set('isFileUploading', false);
        this.set('photo', url);
      })
  },

  actions: {
    async onSave() {
      this.set('isSaving', true);

      if (this.get('fileToUpload')) {
        await this.uploadImage(this.get('fileToUpload'))
      }

      if (this.action === 'add') {
        this.createProduct();
      } else if (this.action === 'update') {
        this.updateProduct();
      } else {
        throw Error(`Unknown @action name: ${this.action}`);
      }
      this.set('isModalVisible', !this.isModalVisible);
      this.set('isSaving', false);
    },

    onAddImage: function (file = []) {
      this.set('fileToUpload', file[0]);
      this.set('test', this.get('action'));
      /*const reader = new FileReader();
      reader.readAsDataURL(file.blob);
      reader.addEventListener("load", () => this.set('fileToUploadBase64', reader.result), false);*/
    },//.bind(this),

    onRemoveImage() {
      this.setProperties({
        fileToUpload: null,
        fileToUploadBase64: null
      });
    }
  }
});
