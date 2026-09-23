import logo from "/logo.png";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link>
      <div className="flex items-end">
        <img src={logo} alt="Logo" className=" w-50 h-42 object-contain" />
        {/* <p className="text-4xl -ml-2 font-extrabold">Demon's Cave</p> */}
      </div>
    </Link>
  );
};

export default Logo;
