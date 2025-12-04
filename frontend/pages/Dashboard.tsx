import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Note } from '../types';
import { FileText, Users, Tag, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState({
    totalNotes: 0,
    sharedNotes: 0,
    groups: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesData, sharedData, groupsData] = await Promise.all([
          api.getNotes({ limit: 5 }),
          api.getSharedNotes(),
          api.getGroups(),
        ]);

        setRecentNotes(notesData.notes || []);
        setStats({
          totalNotes: notesData.pagination?.total || 0,
          sharedNotes: sharedData.notes?.length || 0,
          groups: groupsData.groups?.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.username}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your notes, collaborate with teams, and stay organized.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/notes"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Notes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalNotes}</p>
              </div>
            </div>
          </Link>

          <Link
            to="/shared"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shared Notes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.sharedNotes}</p>
              </div>
            </div>
          </Link>

          <Link
            to="/groups"
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Groups</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.groups}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Notes</h2>
              <Link
                to="/notes"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentNotes.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No notes yet. <Link to="/notes" className="text-primary-600 hover:underline">Create your first note</Link>
              </p>
            ) : (
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <Link
                    key={note.id}
                    to={`/notes/${note.id}`}
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white">{note.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {note.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

