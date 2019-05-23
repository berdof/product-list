import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';

export default Route.extend(RealtimeRouteMixin, {
  model() {
    return this.store.query('product', {});
  },
  beforeModel() {
    if (!this.controllerFor('application').get('session.isAuthenticated')) {
      this.transitionTo('auth');
    }
  },
  actions: {
    queryParamsDidChange: function ({searchQuery = ''}) {
      if (this.controller) {
        this.store.query('product', {}).then(data => {
          this.controller.set('model', data.filter((product) => {
            if (product.get('title').toLowerCase().trim().indexOf(searchQuery.toLowerCase().trim()) !== -1) {
              return product;
            }
          }));
        });
      }
    }
  }
})
