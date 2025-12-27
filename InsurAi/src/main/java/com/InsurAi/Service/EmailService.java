package com.InsurAi.Service;

import com.InsurAi.Entity.Notification;
import com.InsurAi.Repository.NotificationRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final NotificationRepository notificationRepository;

    public EmailService(JavaMailSender mailSender, NotificationRepository notificationRepository) {
        this.mailSender = mailSender;
        this.notificationRepository = notificationRepository;
    }

    @Async
    public void sendSimpleEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    @Async
    public void sendBookingEmail(String to, String subject, String body,
                                 String agentEmail, LocalDate date, LocalTime time) {

        Notification notification = Notification.builder()
                .userEmail(to)
                .agentEmail(agentEmail)
                .reason(subject)
                .message(body)
                .date(date)
                .time(time)
                .status(Notification.Status.PENDING)
                .build();

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);

            notification.setStatus(Notification.Status.SENT);
            System.out.println("✅ Email sent to: " + to);
        } catch (Exception e) {
            notification.setStatus(Notification.Status.FAILED);
            notification.setMessage(body + "\n\nError: " + e.getMessage());
            System.err.println("❌ Failed to send email to " + to + ": " + e.getMessage());
        }

        // Always persist notification, even if email fails
        notificationRepository.save(notification);
    }
}
