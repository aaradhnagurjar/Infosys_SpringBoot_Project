package com.InsurAi.Dto;

import java.util.List;

public class AiResponse {
    private String responseText;
    private List<?> data;  // list of agents/policies/bookings if needed

    public AiResponse() {}

    public AiResponse(String responseText) {
        this.responseText = responseText;
    }

    public AiResponse(String responseText, List<?> data) {
        this.responseText = responseText;
        this.data = data;
    }

    public String getResponseText() { return responseText; }
    public void setResponseText(String responseText) { this.responseText = responseText; }

    public List<?> getData() { return data; }
    public void setData(List<?> data) { this.data = data; }
}
