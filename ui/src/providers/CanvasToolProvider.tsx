import { CanvasToolContext, useAuth, useCanvas, useLogger } from "@/hooks";
import { COLORS_PALETTE } from "@/lib/constants";
import { http } from "@/lib/http";
import type {
  AppError,
  ColorPalette,
  ConcurrencyMode,
  PixelCoord,
  PixelRequest,
  PixelUpdateMessage,
} from "@/lib/types";
import { useState } from "react";

const CanvasToolProvider = ({ children }: { children: React.ReactNode }) => {
  const { addLog } = useLogger();
  const { clearSelected } = useCanvas();
  const { currentUsername } = useAuth();
  const [currentColor, setCurrentColor] = useState<ColorPalette>(
    COLORS_PALETTE[0]
  );
  const [currentMode, setCurrentMode] =
    useState<ConcurrencyMode["value"]>("NONE");

  const changeColor = (color: ColorPalette) => setCurrentColor(color);
  const changeMode = (value: string) =>
    setCurrentMode(value as ConcurrencyMode["value"]);

  const handlePaint = async (currentPin: PixelCoord) => {
    if (!currentUsername) throw new Error("Username is required");

    const data: PixelRequest = {
      ...currentPin,
      updatedBy: currentUsername,
      color: currentColor.value,
      mode: currentMode,
    };

    console.log(data);

    try {
      addLog("PIXEL", `Request paint (${data.x}, ${data.y})`);
      const res = await http.post<PixelUpdateMessage>("/pixels/paint", data);

      if (res.status !== 200) throw new Error("Network error");

      addLog("PIXEL", `Painted (${data.x},${data.y}) color=${data.color}`);
      clearSelected();
      return res.data;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      addLog("ERROR", `Paint failed (${data.x},${data.y}) ${e?.message ?? ""}`);
      if (e?.response?.data) throw e.response.data as AppError;

      throw { message: "Network error" } as AppError;
    }
  };

  return (
    <CanvasToolContext.Provider
      value={{
        currentColor,
        currentMode,
        changeColor,
        changeMode,
        handlePaint,
      }}
    >
      {children}
    </CanvasToolContext.Provider>
  );
};

export default CanvasToolProvider;
