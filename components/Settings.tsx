import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { auth, database } from '@/config.firebase.js';

interface ProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  institution: string;
}

interface SettingsProps {
  userId: string;
}

const Settings: React.FC<SettingsProps> = ({ userId }) => {
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [editingPasswordEnabled, setPasswordEditingEnabled] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    institution: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userDocRef = doc(database, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data() as ProfileData;
          setProfileData(userData);
        } else {
          console.error('User document not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [userId]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleEnableEdit = () => {
    setEditingEnabled(!editingEnabled);
  };

  const handlePasswordEnableEdit = () => {
    setPasswordEditingEnabled(!editingPasswordEnabled);
  };

  const handleChangePassword = async () => {
    try {
      if (password === confirmPassword) {
        const user = auth.currentUser;
        if (user) {
          // Update the password
          await updatePassword(user, password);
          console.log('Password updated successfully');
        } else {
          console.error('No user is signed in');
        }
      } else {
        console.error('New password and confirm password do not match');
      }
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const userDocRef = doc(database, 'users', userId);
      const updatedProfileData = {
        'firstName': profileData.firstName,
        'lastName': profileData.lastName,
        'phoneNumber': profileData.phoneNumber,
        'email': profileData.email,
        'institution': profileData.institution,
      };
      await updateDoc(userDocRef, updatedProfileData);
      setEditingEnabled(false);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
        <h1 className="text-3xl text-gray-800 font-semibold mb-8">Settings</h1>

        <div className="max-w-4xl mx-auto text-gray-800 bg-gray-200 px-4 py-8 rounded">
            <h3 className="text-xl font-semibold mb-8">Edit Profile:</h3>
            <div className="grid grid-cols-2 gap-y-4">
                <div>
                <label className="block mb-2 w-32">
                    First Name:
                    <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    className={`input-field border border-gray-800 ${editingEnabled ? '' : 'cursor-not-allowed bg-gray-300'}`}
                    disabled={!editingEnabled}
                    />
                </label>
                </div>
                <div>
                <label className="block mb-2 w-32">
                    Last Name:
                    <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className={`input-field border border-gray-800 ${editingEnabled ? '' : 'cursor-not-allowed bg-gray-300'}`}
                    disabled={!editingEnabled}
                    />
                </label>
                </div>
                <div>
                <label className="block mb-2 w-32">
                    Phone Number:
                    <input
                    type="text"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleInputChange}
                    className={`input-field border border-gray-800 ${editingEnabled ? '' : 'cursor-not-allowed bg-gray-300'}`}
                    disabled={!editingEnabled}
                    />
                </label>
                </div>
                <div>
                <label className="block mb-2 w-32">
                    Email:
                    <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className={`input-field border border-gray-800 ${editingEnabled ? '' : 'cursor-not-allowed bg-gray-300'}`}
                    disabled={!editingEnabled}
                    />
                </label>
                </div>
                <div>
                <label className="block mb-2 w-32">
                    Institution:
                    <input
                    type="text"
                    name="institution"
                    value={profileData.institution}
                    onChange={handleInputChange}
                    className={`input-field border border-gray-800 ${editingEnabled ? '' : 'cursor-not-allowed bg-gray-300'}`}
                    disabled={!editingEnabled}
                    />
                </label>
                </div>
            </div>
            <div className='flex flex-row'>
            <button
                onClick={handleEnableEdit}
                className="button bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 mr-2"
            >
                {editingEnabled ? 'Disable Edit' : 'Enable edit'}
            </button>
            <button
                disabled={!editingEnabled}
                onClick={handleSaveChanges}
                className="button bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 ml-2"
            >
                Save Changes
            </button>
            </div>
        </div>

        <div className="max-w-4xl mx-auto text-gray-800 bg-gray-200 px-4 py-8 rounded mt-8">
            <h3 className="text-xl font-semibold mb-8">Change Password:</h3>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                  <label className="block mb-2 w-32">
                      New Password:
                      <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      onChange={handlePasswordInputChange}
                      className={`input-field border border-gray-800 ${editingPasswordEnabled ? '' : 'cursor-not-allowed bg-gray-300'}`}
                      disabled={!editingPasswordEnabled}
                      />
                  </label>
                  <button
                    onClick={togglePasswordVisibility}
                    className="text-sm text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
              </div>
              <div>
                  <label className="block mb-2 w-32">
                      Confirm Password:
                      <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      onChange={handlePasswordInputChange}
                      className={`input-field border border-gray-800 ${editingPasswordEnabled ? '' : 'cursor-not-allowed bg-gray-300'}`}
                      disabled={!editingPasswordEnabled}
                      />
                  </label>
              </div>
            </div>
            <div className='flex flex-row'>
            <button
                onClick={handlePasswordEnableEdit}
                className="button bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 mr-2"
            >
                {editingPasswordEnabled ? 'Disable Edit' : 'Enable edit'}
            </button>
            <button
                disabled={!editingPasswordEnabled}
                onClick={handleChangePassword}
                className="button bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 ml-2"
            >
                Save Changes
            </button>
            </div>
        </div>
    </div>
  );
};

export default Settings;
