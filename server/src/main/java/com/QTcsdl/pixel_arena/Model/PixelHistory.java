package com.QTcsdl.pixel_arena.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "PixelHistory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PixelHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "x", nullable = false)
    private int x;

    @Column(name = "y", nullable = false)
    private int y;

    @Column(name = "oldColor", length = 20)
    private String oldColor;

    @Column(name = "newColor", length = 20, nullable = false)
    private String newColor;

    @Column(name = "changedBy", length = 50)
    private String changedBy;

    @Column(name = "changedAt")
    private LocalDateTime changedAt;

    @PrePersist
    public void prePersist() {
        changedAt = LocalDateTime.now();
    }
}
