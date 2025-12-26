import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Toaster } from "sonner";
import { Navbar, UsernameDialog } from "@/components";
import { Sidebar } from "@/components/sidebar";
import { Canvas, HoverCanvas, PinCanvas, History } from "@/components/canvas";

const App = () => {
  return (
    <>
      <Toaster />
      <UsernameDialog />
      <div id="root-container">
        <Navbar />
        <main>
          <div id="wrapper">
            <History />

            <TransformWrapper
              initialScale={0.7}
              minScale={0.7}
              maxScale={10}
              wheel={{ step: 0.2 }}
              pinch={{ disabled: false }}
              doubleClick={{ disabled: false, step: 0.7 }}
              panning={{ disabled: false }}
              centerOnInit
            >
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
              >
                <div id="canvas-wrapper">
                  <Canvas />
                  <PinCanvas />
                  <HoverCanvas />
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>
          <Sidebar />
        </main>
      </div>
    </>
  );
};

export default App;
