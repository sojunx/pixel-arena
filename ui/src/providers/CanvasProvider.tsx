import { CanvasContext } from "@/hooks";
import type { OverlayCanvas } from "@/lib/canvas";
import { http } from "@/lib/http";
import type { PixelCoord, PixelRecord } from "@/lib/types";
import type React from "react";
import { useEffect, useState, type RefObject } from "react";

const CanvasProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<PixelRecord[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [hoveredPos, setHoveredPos] = useState<PixelCoord | null>(null);
  const [selectedPos, setSelectedPos] = useState<PixelCoord | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);

        const res = await http.get("/pixels");
        if (res.status !== 200) throw new Error("failed to load data");

        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const onMouseClick = (
    event: React.MouseEvent<HTMLCanvasElement>,
    overlayRef: RefObject<OverlayCanvas | null>
  ) => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const pos = overlay.getPosition(event);

    if (pos) setSelectedPos(pos);
  };

  const onMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>,
    overlayRef: RefObject<OverlayCanvas | null>
  ) => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const pos = overlay.getPosition(event);

    if (pos) setHoveredPos(pos);
  };

  const onMouseLeave = () => setHoveredPos(null);

  const clearSelected = () => setSelectedPos(null);

  return (
    <CanvasContext.Provider
      value={{
        data,
        loading,
        hoveredPos,
        selectedPos,
        onMouseMove,
        onMouseClick,
        onMouseLeave,
        clearSelected,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export default CanvasProvider;
