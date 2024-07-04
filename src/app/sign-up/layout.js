import { Bakbak_One } from "next/font/google";

import Navbar from "@/app/components/Navbar";

const bakbakOne = Bakbak_One({ subsets: ["latin"], weight: "400" });


export default function SignUpLayout({ children }) {
  return (
    <div className="flex">
        <Navbar signup={true} />
        {children}
    </div>
  );
}
