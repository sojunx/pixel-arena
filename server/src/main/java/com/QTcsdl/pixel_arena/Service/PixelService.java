package com.QTcsdl.pixel_arena.Service;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.QTcsdl.pixel_arena.Model.Pixel;
import com.QTcsdl.pixel_arena.Model.PixelHistory;
import com.QTcsdl.pixel_arena.Model.PixelId;
import com.QTcsdl.pixel_arena.Model.UserLog;
import com.QTcsdl.pixel_arena.Repository.PixelHistoryRepository;
import com.QTcsdl.pixel_arena.Repository.PixelRepository;
import com.QTcsdl.pixel_arena.Repository.UserLogRepository;
import com.QTcsdl.pixel_arena.dto.PixelRequest;
import com.QTcsdl.pixel_arena.exception.CooldownException;

@Service
public class PixelService {

    @Autowired
    private PixelRepository pixelRepository;

    @Autowired
    private UserLogRepository userLogRepository;

    @Autowired
    private PixelHistoryRepository pixelHistoryRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private static final long COOLDOWN_SECONDS = 5;

    // Giả lập độ trễ xử lý (3 giây) để con người kịp nhìn thấy lỗi
    private void simulateProcessingDelay() {
        try {
            Thread.sleep(3000); 
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Processing interrupted", e);
        }
    }

    // Kiểm tra cooldown - Ném exception nếu chưa đủ thời gian
    private void checkCooldown(String userId) {
        UserLog userLog = userLogRepository.findById(userId).orElse(null);
        
        if (userLog != null && userLog.getLastPaintedAt() != null) {
            Duration duration = Duration.between(userLog.getLastPaintedAt(), LocalDateTime.now());
            long secondsPassed = duration.getSeconds();
            
            if (secondsPassed < COOLDOWN_SECONDS) {
                long remainingSeconds = COOLDOWN_SECONDS - secondsPassed;
                throw new CooldownException(remainingSeconds);
            }
        }
    }

    // Cập nhật thời gian tô màu cuối cùng của user
    private void updateUserLog(String userId) {
        UserLog userLog = userLogRepository.findById(userId)
                .orElse(new UserLog(userId, null));
        userLog.setLastPaintedAt(LocalDateTime.now());
        userLogRepository.save(userLog);
    }

    // Lưu lịch sử thay đổi
    private void saveHistory(int x, int y, String oldColor, String newColor, String changedBy) {
        PixelHistory history = new PixelHistory();
        history.setX(x);
        history.setY(y);
        history.setOldColor(oldColor);
        history.setNewColor(newColor);
        history.setChangedBy(changedBy);
        pixelHistoryRepository.save(history);
    }

    // Gửi thông báo real-time qua WebSocket
    private void broadcastPixelUpdate(Pixel pixel) {
        messagingTemplate.convertAndSend("/topic/pixel-update", pixel);
    }

    //CÁCH 1: KHÔNG KHÓA (Gây lỗi Race Condition)
    @Transactional
    public Pixel paintNoLock(PixelRequest request) {
        // Bước 1: Kiểm tra cooldown
        checkCooldown(request.getUpdatedBy());

        // Bước 2: Đọc dữ liệu lên
        Pixel pixel = pixelRepository.findById(new PixelId(request.getX(), request.getY()))
                .orElseThrow(() -> new RuntimeException("Pixel not found"));

        String oldColor = pixel.getColor();

        // Bước 3: NGỦ 3 GIÂY (Trong lúc này, người khác cũng đọc được dữ liệu cũ)
        simulateProcessingDelay();

        // Bước 4: Ghi đè dữ liệu mới
        pixel.setColor(request.getColor());
        pixel.setUpdatedBy(request.getUpdatedBy());
        Pixel savedPixel = pixelRepository.save(pixel);

        // Bước 5: Lưu lịch sử
        saveHistory(request.getX(), request.getY(), oldColor, request.getColor(), request.getUpdatedBy());

        // Bước 6: Cập nhật user log
        updateUserLog(request.getUpdatedBy());

        // Bước 7: Broadcast qua WebSocket
        broadcastPixelUpdate(savedPixel);

        return savedPixel;
    }

    //CÁCH 2: KHÓA BI QUAN (Pessimistic Lock - An toàn tuyệt đối)
    @Transactional
    public Pixel paintPessimistic(PixelRequest request) {
        // Bước 1: Kiểm tra cooldown
        checkCooldown(request.getUpdatedBy());

        // Bước 2: Đọc và KHÓA ngay lập tức. Người đến sau phải đứng chờ ở dòng này.
        Pixel pixel = pixelRepository.findPixelForUpdate(request.getX(), request.getY())
                .orElseThrow(() -> new RuntimeException("Pixel not found"));

        String oldColor = pixel.getColor();

        // Bước 3: Vẫn ngủ 3 giây (để chứng minh người sau phải chờ đủ 3s mới được chạy)
        simulateProcessingDelay();

        // Bước 4: Ghi dữ liệu
        pixel.setColor(request.getColor());
        pixel.setUpdatedBy(request.getUpdatedBy());
        Pixel savedPixel = pixelRepository.save(pixel);

        // Bước 5: Lưu lịch sử
        saveHistory(request.getX(), request.getY(), oldColor, request.getColor(), request.getUpdatedBy());

        // Bước 6: Cập nhật user log
        updateUserLog(request.getUpdatedBy());

        // Bước 7: Broadcast qua WebSocket
        broadcastPixelUpdate(savedPixel);

        return savedPixel;
    }

    //CÁCH 3: KHÓA LẠC QUAN (Optimistic Lock - Nhanh nhưng kén chọn)
    @Transactional
    public Pixel paintOptimistic(PixelRequest request) {
        // Bước 1: Kiểm tra cooldown
        checkCooldown(request.getUpdatedBy());

        // Bước 2: Đọc dữ liệu (kèm version)
        Pixel pixel = pixelRepository.findById(new PixelId(request.getX(), request.getY()))
                .orElseThrow(() -> new RuntimeException("Pixel not found"));

        String oldColor = pixel.getColor();

        // Bước 3: Ngủ 3 giây
        simulateProcessingDelay();

        // Bước 4: Ghi dữ liệu
        // Nếu version trong DB khác version lúc đọc -> Spring tự ném lỗi ObjectOptimisticLockingFailureException
        pixel.setColor(request.getColor());
        pixel.setUpdatedBy(request.getUpdatedBy());
        Pixel savedPixel = pixelRepository.save(pixel);

        // Bước 5: Lưu lịch sử
        saveHistory(request.getX(), request.getY(), oldColor, request.getColor(), request.getUpdatedBy());

        // Bước 6: Cập nhật user log
        updateUserLog(request.getUpdatedBy());

        // Bước 7: Broadcast qua WebSocket
        broadcastPixelUpdate(savedPixel);

        return savedPixel;
    }
}
