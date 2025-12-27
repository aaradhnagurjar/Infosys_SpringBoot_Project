package com.InsurAi.Service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.json.JSONObject;

@Service
public class GeminiClient {

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    public String generateResponse(String message, String email) {

        String prompt = """
                You are an AI assistant for an insurance booking platform.
                Your job is to understand user requests and return a strict JSON response.

                Supported intents:
                - SHOW_AGENTS
                - SHOW_AGENT_SLOTS
                - SHOW_POLICIES
                - BOOK_APPOINTMENT
                - CANCEL_APPOINTMENT
                - GREETING

                Rules:
                - Do NOT return any explanation.
                - Respond ONLY in JSON format.
                - Use fields: intent, agentName, policyName, date, time, location, responseText

                Example:
                {
                  "intent": "BOOK_APPOINTMENT",
                  "agentName": "Priya",
                  "date": "2025-11-18",
                  "time": "10:00",
                  "responseText": "Booking appointment with Priya"
                }

                User Email: %s
                User Query: %s
                """.formatted(email, message);

        OkHttpClient client = new OkHttpClient();

        JSONObject requestBody = new JSONObject();
        requestBody.put("contents", new JSONObject[]{
                new JSONObject().put("parts", new JSONObject[]{
                        new JSONObject().put("text", prompt)
                })
        });

        Request request = new Request.Builder()
                .url("https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + apiKey)
                .post(RequestBody.create(
                        requestBody.toString(),
                        MediaType.parse("application/json")
                ))
                .build();



        try (Response response = client.newCall(request).execute()) {
            String raw = response.body().string();
            System.out.println("Gemini HTTP Code => " + response.code());
            System.out.println("Gemini RAW -> " + raw);
            return extractText(raw);

        } catch (Exception e) {
            e.printStackTrace();
            return "{ \"intent\": \"ERROR\", \"responseText\": \"Ai usage OverLoaded\"}";
        }
    }


    private String extractText(String rawResponse) {
        try {
            JSONObject json = new JSONObject(rawResponse);
            String text = json.getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text");

            // Remove markdown formatting if present
            text = text.replace("```json", "")
                       .replace("```", "")
                       .trim();

            return text;

        } catch (Exception e) {
            return "{\"intent\":\"ERROR\",\"responseText\":\"Error processing request\"}";
        }
    }


}
