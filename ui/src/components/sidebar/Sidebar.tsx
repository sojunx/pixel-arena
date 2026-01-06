import ColorPicker from "./ColorPicker";
import ConcurrencyModes from "./ConcurrencyModes";
import DemoTool from "./DemoTool";

const Sidebar = () => {
  return (
    <div id="sidebar">
      <ColorPicker />
      <ConcurrencyModes />
      <DemoTool />
    </div>
  );
};

export default Sidebar;
