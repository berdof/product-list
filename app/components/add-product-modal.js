import Ember from 'ember';
import Component from '@ember/component';
import {computed, observer} from '@ember/object';

export default Component.extend({
  productId: null,
  imageToDelete: null,
  title: '',
  description: '',
  photo: null,
  fileToUpload: null,
  fileToUploadBase64: null,
  isShowButtonVisible: false,
  isModalVisible: false,
  isSaving: false,
  firebaseApp: Ember.inject.service(),

  fileToUploadBase64Change: observer('photo', 'action', 'fileToUpload', function () {
    if (this.get('fileToUpload')) {
      const reader = new FileReader();
      reader.readAsDataURL(this.get('fileToUpload'));
      reader.addEventListener("load", () => {
        this.set('fileToUploadBase64', reader.result)
      }, false);
    } else {
      this.set('fileToUploadBase64', null)
    }

    if (this.get('action') === 'update') {
      this.set('fileToUploadBase64', this.get('photo'));
    }
  }),

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
    this.toggleModal();
  }),

  didInsertElement() {
    if (this.isModalVisible) {
      this.toggleModal('show')
    }
  },

  toggleModal(action = 'toggle') {
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

    if (this.get('imageToDelete')) {
      this.removePhoto(this.get('imageToDelete'));
      this.set('imageToDelete', null);
    }

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
      .child(`images/${file.name}${+new Date()}`)
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
      try {
        if (this.action === 'add') {
          await this.createProduct();
        } else if (this.action === 'update') {
          await this.updateProduct();
        } else {
          throw Error(`Unknown @action name: ${this.action}`);
        }
      } catch (err) {
        console.error(err);
      }
      this.setProperties({
        fileToUpload: null,
        fileToUploadBase64: null,
        isModalVisible: !this.isModalVisible,
        isSaving: false,
        photo: null,
        description: '',
        title: '',
      });
    },

    onAddImage: function (file = []) {
      this.set('fileToUpload', file[0]);
    },

    onRemoveImage() {
      this.setProperties({
        fileToUpload: null,
        fileToUploadBase64: null,
        photo: null,
        imageToDelete: this.get('photo')
      });
    }
  }
});
