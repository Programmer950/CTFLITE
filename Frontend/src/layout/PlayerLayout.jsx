import Navbar from "../components/Navbar";

export default function PlayerLayout({ children }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}