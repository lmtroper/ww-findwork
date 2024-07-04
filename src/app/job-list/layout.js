import Navbar from "../components/Navbar";

export default function SignUpLayout({ children }) {
  return (
    <div className="flex">
        <Navbar signup={false} />
        {children}
    </div>
  );
}
