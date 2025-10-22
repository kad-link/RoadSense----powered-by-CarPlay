import React from 'react'
import { useContext, useState, useEffect, createContext } from 'react'

const AuthContext = createContext();

const useAuth = ()=>{
    const context = useContext(AuthContext);
    return context;
}

const AuthProvider = ({children})=>{
    const [user,setUser] = useState("");
    const [token,setToken] = useState("");
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if(storedToken && storedUser){
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    },[])

    const login= (user,token)=>{
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
    }
    const logout= ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }
    
    const value= {
        user, token, login, logout, isAuthenticated: !!token
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export {AuthProvider, useAuth}