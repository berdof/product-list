// app/models/article.js
import DS from 'ember-data';

const {attr, Model} = DS;

export default Model.extend({
  title: attr('string'),
  photo: attr('string'),
  description: attr('string'),
  created_at: attr('number')
});
