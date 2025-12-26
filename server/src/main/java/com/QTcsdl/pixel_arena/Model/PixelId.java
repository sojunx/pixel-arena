package com.QTcsdl.pixel_arena.Model;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PixelId implements Serializable {
    private int x;
    private int y;
}
