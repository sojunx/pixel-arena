package com.QTcsdl.pixel_arena.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PixelUpdateMessage {
    private int x;
    private int y;
    private String color;
    private String updatedBy;
}
