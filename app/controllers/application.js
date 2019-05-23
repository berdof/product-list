import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import firebase from 'firebase/app';

export default Controller.extend({
  searchQuery: '',
  queryParams: {
    searchQuery: {
      refreshModel: true
    }
  },
  session: service(),
  firebaseApp: service(),

  actions: {
    async login() {
      const provider = new firebase.auth.GoogleAuthProvider();
      const auth = await this.get('firebaseApp').auth();
      await auth.signInWithPopup(provider);
      this.transitionToRoute('products');
    },
    logout() {
      this.get('session').invalidate();
      window.location = '/';
    },
  }
});
