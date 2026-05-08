import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { BASE_URL, API_PATHS } from '../utils/apiPaths';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Axios instance with auth header
  const authAxios = useCallback(() => {
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
  }, [token]);

  const login = (userData, userToken) => {
    const normalizedUser = { ...userData, id: userData.id || userData._id };
    // Restore avatar from localStorage if it exists and not in userData
    if (!normalizedUser.avatar) {
      const storedAvatar = localStorage.getItem('userAvatar');
      if (storedAvatar) {
        normalizedUser.avatar = storedAvatar;
      }
    }
    setUser(normalizedUser);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    if (normalizedUser.avatar) {
      localStorage.setItem('userAvatar', normalizedUser.avatar);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setTransactions([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userAvatar');
  };

  const fetchTransactions = useCallback(
    async (type = null) => {
      if (!token) return;
      setLoading(true);
      try {
        const params = type ? { type } : {};
        const res = await authAxios().get(API_PATHS.TRANSACTIONS.GET_ALL, { params });
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error('Fetch transactions error:', err);
      } finally {
        setLoading(false);
      }
    },
    [token, authAxios]
  );

  const addTransaction = useCallback(
    async (data) => {
      const res = await authAxios().post(API_PATHS.TRANSACTIONS.ADD, data);
      return res.data;
    },
    [authAxios]
  );

  const deleteTransaction = useCallback(
    async (id) => {
      const res = await authAxios().delete(API_PATHS.TRANSACTIONS.DELETE(id));
      return res.data;
    },
    [authAxios]
  );

  const downloadCSV = useCallback(
    async (type = null) => {
      const params = type ? { type } : {};
      const res = await authAxios().get(API_PATHS.TRANSACTIONS.DOWNLOAD_CSV, {
        params,
        responseType: 'blob',
      });
      return res.data;
    },
    [authAxios]
  );

    const updateAvatar = useCallback(
      async (image) => {
        if (!token) throw new Error('Not authenticated');
        try {
          const res = await authAxios().post(API_PATHS.AUTH.UPDATE_AVATAR, { image });
          const updatedUser = res.data.user || {};
          const normalized = { ...updatedUser, id: updatedUser.id || updatedUser._id, avatar: updatedUser.profileImageUrl || updatedUser.avatar };
          setUser(normalized);
          localStorage.setItem('user', JSON.stringify(normalized));
          if (normalized.avatar) localStorage.setItem('userAvatar', normalized.avatar);
          return normalized;
        } catch (err) {
          console.error('Update avatar error:', err);
          throw err;
        }
      },
      [token, authAxios]
    );

  const getSummary = useCallback(async () => {
    const res = await authAxios().get(API_PATHS.TRANSACTIONS.SUMMARY);
    return res.data;
  }, [authAxios]);

  // Restore user from localStorage on first load
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const storedAvatar = localStorage.getItem('userAvatar');
        if (storedAvatar) {
          parsedUser.avatar = storedAvatar;
        }
        setUser(parsedUser);
      } catch {
        logout();
      }
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        transactions,
        loading,
        login,
        logout,
        updateAvatar,
        fetchTransactions,
        addTransaction,
        deleteTransaction,
        downloadCSV,
        getSummary,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export default UserContext;
