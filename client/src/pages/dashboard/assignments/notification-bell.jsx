import { useNavigate,Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import useAlertStore from '@/store/useAlertStore';
import { Bell } from 'lucide-react';

const NotificationBell = () => {
    const [notificationCount, setNotificationCount] = useState(0);
    const [prevCount, setPrevCount] = useState(0);
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const {  fetchRecentAlerts,  recentAlerts } = useAlertStore();

    // Load notification sound
    useEffect(() => {
        audioRef.current = new Audio("/warning.mp3");
        audioRef.current.volume = 0.3; // Adjust volume as needed
    }, []);


    useEffect(() => {

        // Fetch  recentAlerts when component mounts

      fetchRecentAlerts()
    }, [])

    // Update notification count when  recentAlerts change
    useEffect(() => {
        if ( recentAlerts) {
            const newCount =  recentAlerts.length;

            // Play sound if count increased
            if (newCount > prevCount) {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            }

            setPrevCount(newCount);
            setNotificationCount(newCount);
        }
    }, [ ]);

    const handleNotificationClick = () => {
        // Reset count when notifications are viewed
        if (notificationCount > 0) {
            setNotificationCount(0);
            setPrevCount(0);

            // Optionally mark notifications as read on the server
            // This would depend on your alert store implementation
            // markNotificationsAsRead();
            setNotificationCount(0);
        }

        // navigate('/dashboard/recentAlerts');
    };

    return (
        <div className="relative">
            <button
                onClick={handleNotificationClick}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                aria-label="Notifications"
            >
                <Link to="/dashboard/alerts" className="flex items-center justify-center">
                <Bell className="h-5 w-5" />
                </Link>
                {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                )}
            </button>
        </div>
    );
};


export default NotificationBell;