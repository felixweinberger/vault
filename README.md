# Vault

*Multi-currency expense tracking that respects your privacy*

![Vault](screenshots/vault.png)

Vault is an offline-first, privacy-focused expense tracking app that allows you to track your expenses in multiple currencies with a few taps, without having to hand over your personal data in the process. Vault also allows you to import and export your expenses to Dropbox, providing a convenient backup mechanism.

I built this app as none of the options on the app store offered backup solutions using Dropbox and most of the apps required me to sign up for a new service that would then store my personal expense data.

## Tech Stack
Vault is built from the ground up in React Native, using Expo SDK as a framework for rapid development. Redux is used for state and data management, using Async Storage as the main data storage solution. The Dropbox API provides a way to backup user data to the cloud without requiring the user to hand over data to Vault at any time.

## Contributing
If you want to run or develop Vault on your local machine, follow the instructions for each platform below:

### iOS

1. Clone this repo with `git clone https://github.com/felixweinberger/vault`
2. Run `npm install` inside the `/client` folder
3. Ensure you have `cocoapods version 1.5.3` installed (needed for version 32 of ExpoKit)
4. `cd` into the `/client/ios` folder and run `pod install`
   1. You may need to install `git-lfs` first - run `brew install git-lfs` and then `git lfs install`
5. Run `npm start` in `/client`
6. Open the `/client/ios/vault.xcworkspace` file in XCode
7. For development, make sure the scheme (click on small logo top left -> "edit scheme") is set to "Debug"
8. Run the app in XCode with `⌘ + R`

#### Debugging

If you want to use React Native Debugger, you can run the following command to start RNDebugger with the correct port set:

```sh
open "rndebugger://set-debugger-loc?host=localhost&port=19001"
```

Within the iOS simulator then press `⌘ + D` and Click "Start Remote Debugging".

### Android

TBD
