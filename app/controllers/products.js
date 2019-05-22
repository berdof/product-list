import Controller from '@ember/controller';
import {observer, computed} from '@ember/object';

export default Controller.extend({
  isAddModalVisible: false,
  actions: {
    showAddModal() {
      this.set('isAddModalVisible', !this.isAddModalVisible);
    }
  }
});
