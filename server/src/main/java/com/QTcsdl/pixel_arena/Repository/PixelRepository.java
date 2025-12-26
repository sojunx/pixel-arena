package com.QTcsdl.pixel_arena.Repository;

import java.util.Optional;
import com.QTcsdl.pixel_arena.Model.Pixel;
import com.QTcsdl.pixel_arena.Model.PixelId;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PixelRepository extends JpaRepository<Pixel, PixelId> {

    //hàm này dùng cho chế độ Pessimistic Lock
    //Khi gọi hàm dòng dữ liệu sẽ bị khóa
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Pixel p WHERE p.x = :x AND p.y = :y")
    Optional<Pixel> findPixelForUpdate(@Param("x") int x, @Param("y") int y);
}
