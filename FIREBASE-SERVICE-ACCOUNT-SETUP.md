# Firebase Service Account Setup

To run admin scripts that write to Firebase, you need a service account key.

## Steps to Get Your Service Account Key:

1. **Go to Firebase Console**:
   - https://console.firebase.google.com/project/apex-gas-9920e/settings/serviceaccounts/adminsdk

2. **Generate New Private Key**:
   - Click "Generate new private key"
   - Click "Generate key"
   - A JSON file will download

3. **Save the File**:
   - Rename it to: `serviceAccountKey.json`
   - Place it in your project root: `/home/mykemet/Desktop/Projects/Apex_gas/serviceAccountKey.json`

4. **IMPORTANT Security**:
   - Add to `.gitignore`: `serviceAccountKey.json`
   - Never commit this file to GitHub
   - Keep it secure

## Alternative: Use Client-Side Firebase

For now, let's create a client-side version that uses your existing Firebase config: