package com.QTcsdl.pixel_arena.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.QTcsdl.pixel_arena.Model.Pixel;
import com.QTcsdl.pixel_arena.Model.PixelHistory;
import com.QTcsdl.pixel_arena.Repository.PixelHistoryRepository;
import com.QTcsdl.pixel_arena.Repository.PixelRepository;
import com.QTcsdl.pixel_arena.Service.PixelService;
import com.QTcsdl.pixel_arena.dto.PixelRequest;
import com.QTcsdl.pixel_arena.exception.CooldownException;


@RestController
@RequestMapping("/api/pixels")
@CrossOrigin(origins = "*") //cho phép tất cả các domain truy cập API
public class PixelController {

    @Autowired
    private PixelRepository pixelRepository;

    @Autowired
    private PixelHistoryRepository pixelHistoryRepository;

    @Autowired
    private PixelService pixelService;

    @GetMapping
    public List<Pixel> getAllPixels(){
        return pixelRepository.findAll(); // Trả về TẤT CẢ pixels (10,000 pixels cho lưới 100x100)
    }

    // Lấy lịch sử của tất cả pixel (giới hạn 100 bản ghi gần nhất)
    @GetMapping("/history")
    public List<PixelHistory> getPixelHistory() {
        return pixelHistoryRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getChangedAt().compareTo(a.getChangedAt()))
                .limit(100)
                .toList();
    }

    // Lấy lịch sử của một pixel cụ thể
    @GetMapping("/history/{x}/{y}")
    public List<PixelHistory> getPixelHistoryByCoordinates(@PathVariable int x, @PathVariable int y) {
        return pixelHistoryRepository.findAll()
                .stream()
                .filter(h -> h.getX() == x && h.getY() == y)
                .sorted((a, b) -> b.getChangedAt().compareTo(a.getChangedAt()))
                .toList();
    }

    // API TÔ MÀU CHÍNH
    @PostMapping("/paint")
    public Pixel paintPixel(@RequestBody PixelRequest request) {
        return switch (request.getMode()) {
            case "PESSIMISTIC" -> {
                System.out.println("Dang chay che do: PESSIMISTIC LOCK");
                yield pixelService.paintPessimistic(request);
            }
            case "OPTIMISTIC" -> {
                System.out.println("Dang chay che do: OPTIMISTIC LOCK");
                yield pixelService.paintOptimistic(request);
            }
            default -> {
                System.out.println("Dang chay che do: NO LOCK (Se co loi)");
                yield pixelService.paintNoLock(request);
            }
        };
    }

    // Xử lý ngoại lệ Optimistic Lock Failure
    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<Map<String, Object>> handleOptimisticLockingFailure(OptimisticLockingFailureException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "CONFLICT");
        response.put("message", "Ô này vừa bị người khác tô màu. Vui lòng thử lại!");
        response.put("status", 409);
        
        System.out.println("Optimistic Lock Failure: " + ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    // Xử lý ngoại lệ Cooldown
    @ExceptionHandler(CooldownException.class)
    public ResponseEntity<Map<String, Object>> handleCooldown(CooldownException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "COOLDOWN");
        response.put("message", ex.getMessage());
        response.put("remainingSeconds", ex.getRemainingSeconds());
        response.put("status", 429);
        
        System.out.println("Cooldown: " + ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(response);
    }

    // Xử lý ngoại lệ chung
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "INTERNAL_ERROR");
        response.put("message", ex.getMessage());
        response.put("status", 500);
        
        System.err.println("Error: " + ex.getMessage());
        System.err.println("Error type: " + ex.getClass().getName());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
