import React, { useState, useEffect } from 'react';
import { skillService } from '../services/skills';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Header from '../components/common/Header';
import SkillCard from '../components/skills/SkillCard';
import SkillCategories from '../components/skills/SkillCategories';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [skillsData, categoriesData] = await Promise.all([
          skillService.getAllSkills({
            sort: sortBy,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            search: searchQuery || undefined
          }),
          skillService.getCategories()
        ]);

        setSkills(skillsData.skills || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Failed to fetch skills data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [searchQuery, selectedCategory, sortBy]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const searchResults = await skillService.searchSkills(query, {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          sort: sortBy
        });
        setSkills(searchResults.skills || []);
      } catch (error) {
        console.error('Search failed:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Browse Skills
            </h1>
            <p className="text-gray-600">
              Discover new skills to learn or find skills you can teach
            </p>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <SkillCategories
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="md:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="name">Alphabetical</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <SkillCard key={skill._id || skill.id} skill={skill} />
            ))}
          </div>

          {/* Empty State */}
          {skills.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No skills found</div>
              <p className="text-gray-600">
                Try adjusting your search criteria or browse different categories
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Skills;