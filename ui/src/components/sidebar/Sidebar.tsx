import ColorPicker from "./ColorPicker";
import ConcurrencyModes from "./ConcurrencyModes";
import DemoTool from "./DemoTool";
import Logs from "./Logs";

const Sidebar = () => {
  return (
    <div id="sidebar">
      <ColorPicker />
      <ConcurrencyModes />
      <DemoTool />
      <Logs />
    </div>
  );
};

export default Sidebar;
