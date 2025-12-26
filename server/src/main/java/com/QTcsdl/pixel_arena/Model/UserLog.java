package com.QTcsdl.pixel_arena.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "UserLog")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserLog {

    @Id
    @Column(name = "userId", nullable = false, length = 50)
    private String userId;

    @Column(name = "lastPaintedAt")
    private LocalDateTime lastPaintedAt;
}
