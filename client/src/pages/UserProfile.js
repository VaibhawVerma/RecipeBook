import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import BackButton from '../components/BackButton';
import RecipeCardSkeleton from '../components/RecipeCardSkeleton';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userId } = useParams();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data } = await axios.get(`/api/users/${userId}`);
                setProfile(data);
            } catch (err) {
                console.error("Error fetching user profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    if (loading) {
        return <p className="text-center mt-8 text-gray-500">Loading profile...</p>;
    }

    if (!profile) {
        return <p className="text-center mt-8 text-red-500">Could not find user profile.</p>;
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <BackButton />
            {loading ? (
                <>
                    <div className="h-10 bg-gray-300 rounded w-1/2 mx-auto mb-4 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-8 animate-pulse"></div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {Array.from({ length: 4 }).map((_, index) => <RecipeCardSkeleton key={index} />)}
                    </div>
                </>
            ) : !profile ? (
                <p className="text-center mt-8 text-red-500">Could not find user profile
                </p>
            ) : (
                <>
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900">{profile.name}'s Recipes</h1>
                        <p className="mt-2 text-lg text-gray-600">Discover all the delicious creations by {profile.name}</p>
                    </div>
                    {profile.recipes.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-600">{profile.name} hasn't shared any recipes yet.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {profile.recipes.map(recipe => <RecipeCard key={recipe._id} recipe={recipe} />)}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserProfile;