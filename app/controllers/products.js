import Controller from '@ember/controller';

export default Controller.extend({
  isAddModalVisible: false,
  actions: {
    showAddModal() {
      this.set('isAddModalVisible', !this.isAddModalVisible);
    }
  }
});
