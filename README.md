# Tasket

Tasket is a web app made to simplify organizing recurring tasks for a group of people fairly. It allows users to set up a group and will automatically rotate tasks within the group, to ensure that each member does their fair share from week to week.

## Deployment

Tasket is hosted with firebase, it specifically uses authentication and firestore, and it's set up to be hosted on firebase as well. Firebase is configured in the `view/src/Firebase.js` file. Once a firebase app has been selected with the firebase cli, Tasket can be deployed with the following command:

```
firebase deploy --only functions, hosting
```

## Organization

This is a monorepository with two sides to the app. Backend firebase functions code is stored in the `functions` directory, whereas the frontend React app is stored inside the `view` directory.

## Local Development

The react app can be run locally by running `yarn start` within the `view` directory. It requires access to a firebase app, as set up in the `view/src/Firebase.js` file.
