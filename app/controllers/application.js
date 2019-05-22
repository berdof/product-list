import EmberObject from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  searchQuery: '',
  queryParams: {
    searchQuery: {
      refreshModel: true
    }
  }
});
