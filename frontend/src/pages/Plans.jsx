import { useState, useEffect } from 'react';
import HolidayForm from '../components/HolidayForm'; 
import HolidayList from '../components/HolidayList'; 
import { useAuth } from '../context/AuthContext';
import { getHolidays } from '../services/holidayService';

const Holidays = () => {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState('');

  // Strategy Pattern: Different sorting strategies based on user selection
  const fetchHolidays = async (sort = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHolidays(sort);
      setHolidays(data);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setError('Failed to load holidays. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHolidays(sortType);
    }
  }, [user, sortType]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your holidays...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-700">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">Holiday Planner</h1>
        <p className="text-gray-600">Plan and organize your upcoming trips in one place</p>
      </div>
      
      <HolidayForm
        holidays={holidays}
        setHolidays={setHolidays}
        editingHoliday={editingHoliday}
        setEditingHoliday={setEditingHoliday}
      />
      
      <HolidayList 
        holidays={holidays} 
        setHolidays={setHolidays} 
        setEditingHoliday={setEditingHoliday}
        sortType={sortType}
        setSortType={setSortType}
      />
    </div>
  );
};

export default Holidays;
