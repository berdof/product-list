import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  searchQuery: '',
  queryParams: {
    searchQuery: {
      refreshModel: true
    }
  },
  session: service(),

  actions: {
    logout() {
      this.get('session').invalidate();
      window.location = '/';
    },
  }
});
