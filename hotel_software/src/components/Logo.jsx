import logo from "/logo.jpg";
import { Link } from "react-router";

const Logo = () => {
  return (
    <Link to="/">
      <div className="flex items-end">
        <img src={logo} alt="Logo" className="mb-2 w-35 h-32 object-contain" />
        {/* <p className="text-4xl -ml-2 font-extrabold">Demon's Cave</p> */}
      </div>
    </Link>
  );
};

export default Logo;
