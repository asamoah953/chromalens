import { createContext, useContext, useState, useEffect } from "react";

const StoreContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem("admin_token"));
  const [visits, setVisits] = useState(0);

  // Initialize app data from Backend
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch products
        const prodRes = await fetch(`${API_URL}/products`);
        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(data);
        }

        // Track and fetch visits
        const visitsRes = await fetch(`${API_URL}/visits/track`, { method: "POST" });
        if (visitsRes.ok) {
          const data = await visitsRes.json();
          setVisits(data.count);
        }
      } catch (err) {
        console.error("Error fetching data from server", err);
      }
    };
    
    fetchInitialData();
  }, []);

  // Sync token to state auth
  useEffect(() => {
    if (token) {
      setIsAdminAuth(true);
      localStorage.setItem("admin_token", token);
    } else {
      setIsAdminAuth(false);
      localStorage.removeItem("admin_token");
    }
  }, [token]);

  // Auth Functions
  const loginAdmin = async (password) => {
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });
      
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logoutAdmin = () => {
    setToken(null);
  };

  // Product Functions
  const addProduct = async (productData) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: productData // Sending native FormData directly
      });
      if (res.ok) {
        const newProd = await res.json();
        setProducts(prev => [newProd, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: productData // FormData
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => (p._id === id ? updated : p)));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(product => product._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <StoreContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, isAdminAuth, loginAdmin, logoutAdmin, visits }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
