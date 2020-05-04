# RPM-Senior-Design

All test and development has been on IOS since that is what our group had available so there is no guarantee that this works on Android.

to begin run,
`npm install`

cd into the `react-native-rpm-peer-to-peer` folder and run

`npm install; yarn link`

Even if you use npm install use yarn here because the linking process is different for both. yarn will create a symlink in the node modules folder.

cd back to the root and run

`yarn link "react-native-rpm-peer-to-peer"`

add to the deps of the main project

`"react-native-rpm-peer-to-peer": "1.0.0"`

It is important do this step after `npm install` in the main folder because after adding it to the dependancies npm install wont work because it will look for the p2p package in the npm repositories

Linking will probably be the part with the most issues. With updated libraries there shouldnt be an need for linking but two libraries
`"react-native-vector-icons"`
`"react-native-randombytes"`
Look on the repositories pages for alternative methods but manually linking with
`npx react-native link XYZ`

You might need to remove duplicated font imports from the Build Phases/Copy Bundle Resources
cd to ios and run `pod install`
cd to root
run IOS simulator "npx react-native run-ios"

To run the server, clone from `https://github.com/majodu/rpm-bodycam-server` 

`npm install`

and then

`nodemon server.js -w server.js`
