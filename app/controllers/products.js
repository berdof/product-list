import Ember from 'ember';
import Controller from '@ember/controller';

export default Controller.extend({
  isAddModalVisible: false,
  firebaseApp: Ember.inject.service(),
  actions: {
    removePhoto: async function(photo) {
      try {
        const storage = await this.firebaseApp.storage();
        await storage.refFromURL(photo).delete();
      } catch (error) {
        console.error(error);
      }
    },
    showAddModal() {
      this.set('isAddModalVisible', !this.isAddModalVisible);
    }
  }
});
