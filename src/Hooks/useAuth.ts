import React, {useEffect,useState} from 'react'
import { onAuthStateChanged, User} from 'firebase/auth'
import {auth} from '../../firebase'
// const auth = getAuth()
// const auth = FIREBASE_GETAUTH;

export function useAuth(){
    // const [user, setUser] = useState<User>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [initialing, setinitializing] = useState(false)


    useEffect(() => {
      const unsubscribeFromAuthStateChanged = onAuthStateChanged( auth, user  => {
        console.log(user)
        if (user) {
          setUser(user);
        } else {
          setUser(null); // Set user to null when not authenticated
        }
        setLoading(false); 
      })
    
      
       return unsubscribeFromAuthStateChanged;
    }, [])

    return {
       user,
       loading
    }
}