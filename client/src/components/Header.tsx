import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <div className="px-1 py-4 flex justify-between items-center">
      <Link
        to="/"
        className="logo text-head text-xl font-semibold"
      >
        Chat App
      </Link>
      <nav className="items-center gap-8 hidden sm:flex">
        <Link to={"/"}>Home</Link>
        <Link to={"/create-room"}>Create Room</Link>
      </nav>
      {/* <Button
        variant={"ghost"}
        size={"icon"}
      >
        <Menu
          width={30}
          height={30}
        />
      </Button> */}
    </div>
  );
};

export default Header;
