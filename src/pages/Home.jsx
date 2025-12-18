import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
    const { token } = useAuth();
    return (
        <>
            <h1>Your logged in</h1>

            {!token && <LoginForm />}

            
        </>
    );
};