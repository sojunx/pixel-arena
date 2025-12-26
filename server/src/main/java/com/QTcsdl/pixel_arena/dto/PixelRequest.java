package com.QTcsdl.pixel_arena.dto;

import lombok.Data;

@Data
public class PixelRequest {

    private int x;
    private int y;
    private String color;
    private String updatedBy; // Tên người dùng (User A, User B)
    private String mode;      // Chế độ: "NONE", "PESSIMISTIC", "OPTIMISTIC"
}
