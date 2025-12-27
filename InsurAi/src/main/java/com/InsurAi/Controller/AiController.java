package com.InsurAi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;               // <= IMPORTANT
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.InsurAi.Dto.AiRequest;                         // <= DTO request
import com.InsurAi.Dto.AiResponse;                       // <= DTO response
import com.InsurAi.Service.AiService;                    // <= service layer

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/message")
    public ResponseEntity<AiResponse> process(@RequestBody AiRequest request) {
        AiResponse response = aiService.processRequest(request.getMessage(), request.getEmail());
        return ResponseEntity.ok(response);
    }
}
