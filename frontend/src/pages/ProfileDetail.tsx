import React, { useEffect, useState } from 'react';
import { ProfileDetails } from "../types";
import { ApiService } from "../services/api";
import { useAuth } from "../context/AuthContext.tsx";

export const ProfileDetail: React.FC = () => {
    const apiService = new ApiService();
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState<ProfileDetails | null>(null);
    const [form, setForm] = useState<Partial<ProfileDetails>>({});
    const [loading, setLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await apiService.getProfileDetails();
                if (res.success) {
                    setProfile(res.data);
                    setForm(res.data);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await apiService.updateProfileDetails(form);
            if (res.success) {
                setProfile(res.data);
                setForm(res.data);
                setMessage('Profile updated successfully!');
                setMessageType('success');
            } else {
                setMessage('Failed to update profile');
                setMessageType('error');
            }
        } catch (err) {
            console.error(err);
            setMessage('Failed to update profile');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarLoading(true);
            try {
                const res = await apiService.uploadAvatar(file);
                if (res.success) {
                    setForm({ ...form, avatarUrl: res.data });
                    setProfile({ ...profile!, avatarUrl: res.data });
                    if (!user) return;
                    setUser({
                        email: user.email || '',
                        firstName: user.firstName || '',
                        middleName: user.middleName || '',
                        lastName: user.lastName || '',
                        avatarUrl: res.data,
                        bio: user.bio || '',
                    });
                }
            } catch (err) {
                console.error(err);
                setMessage('Failed to upload avatar');
            } finally {
                setAvatarLoading(false);
            }
        }
    };

    if (!profile) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
            <div className="flex flex-col items-center mb-6">
                <div className="relative">
                    <img
                        src={form.avatarUrl || "/images/default-avatar-profile.jpg"}
                        alt="Avatar"
                        className={`w-32 h-32 rounded-full border-4 border-gray-200 object-cover ${avatarLoading ? 'opacity-50' : ''}`}
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600">
                        <input type="file" className="hidden" onChange={handleAvatarChange} />
                        ✎
                    </label>
                </div>
                <h2 className="mt-4 text-2xl font-bold">{form.firstName} {form.lastName}</h2>
                <p className="text-gray-500">{form.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            name="firstName"
                            value={form.firstName || ''}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input
                            name="middleName"
                            value={form.middleName || ''}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            name="lastName"
                            value={form.lastName || ''}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            name="address"
                            value={form.address || ''}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        name="bio"
                        value={form.bio || ''}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>

                {message && (
                    <p
                        className={`mt-2 text-center ${
                            messageType === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {message}
                    </p>
                )}

            </form>
        </div>
    );
};
