import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';

export default Route.extend(RealtimeRouteMixin, {
  model() {
    // var newPost = this.store.createRecord('product', {
    //   // title: this.get('title'),
    //   // description: this.get('description'),
    //   // photo: this.get('photo'),
    //
    //   title: 'title2',
    //   description: 'description2',
    //   photo: 'photo2'
    // });
    //newPost.save();
    return this.store.query('product', {  });
  }
})
