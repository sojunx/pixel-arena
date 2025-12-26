package com.QTcsdl.pixel_arena.exception;

public class CooldownException extends RuntimeException {
    
    private final long remainingSeconds;
    
    public CooldownException(long remainingSeconds) {
        super("Bạn phải chờ " + remainingSeconds + " giây nữa mới có thể tô màu tiếp");
        this.remainingSeconds = remainingSeconds;
    }
    
    public long getRemainingSeconds() {
        return remainingSeconds;
    }
}
