import FirestoreAdapter from 'emberfire/adapters/firestore';

export default FirestoreAdapter.extend({
  enablePersistence: true,
  persistenceSettings: { experimentalTabSynchronization: true }
});
