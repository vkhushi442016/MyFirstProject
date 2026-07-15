import { initializeApp } from 'firebase/app'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useStore from './common/store/store';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDTkVVBT1cvgIpygypnu2r77ZhDw0bsQ7M",
    authDomain: "mpeducationportal-356e8.firebaseapp.com",
    projectId: "mpeducationportal-356e8",
    storageBucket: "mpeducationportal-356e8.firebasestorage.app",
    messagingSenderId: "911492167900",
    appId: "1:911492167900:web:b4f26018aab57b10cc5c19",
    measurementId: "G-SHK5NSV972"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const LoginWithGoogle = () => {
    const navigate = useNavigate();
    const login = useStore((state) => state.login);

    const handleLogin = async () => {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const token = await user.getIdToken();

        fetch('http://localhost:5008/api/auth/firebase-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        }).then((res) => res.json())
            .then(data => {
                const username = user.displayName;
                console.log("Backend response:", data);
                login({
                    // username: user.displayName,    //this username is coming from google firebase
                    username: data.user.username,
                    token: token,
                    role: data.user.roles[0],
                    staff_id: data.user.staff_id,
                    dise_code: data.user.dise_code || null
                });

                const roles = data.user?.roles;

                if (roles == "admin") {
                    toast.success("Login Successful");
                    navigate('/')
                } else if (roles == "principal") {
                    toast.success("Login Successful");
                    navigate('/principal/dashboard')
                } else if (roles == "teacher") {
                    toast.success("You are a teacher")
                    console.log("You are a teacher.")
                    navigate('/staff/dashboard')
                } else {
                    console.log("You are not registered");
                }
            })
    }

    return (
        <div className="flex justify-center items-center gap-4">
            {/* Text */}
            <span className="text-gray-700 font-semibold text-normal">
                Login with Google
            </span>

            {/* Button */}
            <button
                onClick={handleLogin}
                className="cursor-pointer flex items-center gap-3 px-3 py-3 bg-white border border-gray-300 rounded-full shadow hover:shadow-md hover:bg-gray-50 transition-all duration-200"
            >
                {/* Circular Google logo */}
                <div className="flex items-center justify-center bg-gray-100 rounded-full ">
                    <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google logo"
                        className="w-5 h-5"
                    />
                </div>
            </button>
        </div>
    )
}


export default LoginWithGoogle
