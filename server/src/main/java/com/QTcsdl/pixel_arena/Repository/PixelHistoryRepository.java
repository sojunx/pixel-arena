package com.QTcsdl.pixel_arena.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.QTcsdl.pixel_arena.Model.PixelHistory;

@Repository
public interface PixelHistoryRepository extends JpaRepository<PixelHistory, Long> {
}
