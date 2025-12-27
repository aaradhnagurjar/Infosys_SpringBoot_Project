package com.InsurAi.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.InsurAi.Dto.AiResponse;
import org.json.JSONObject;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import com.InsurAi.Entity.Appointment;
import com.InsurAi.Entity.Availability;
import com.InsurAi.Entity.Policy;
import com.InsurAi.Entity.User;             // adjust path if different
import com.InsurAi.Repository.AvailabilityRepository;
import com.InsurAi.Repository.PolicyRepository;
import com.InsurAi.Repository.UserRepository;
import com.InsurAi.Service.GeminiClient;
import com.InsurAi.Service.AgentService;     // your db service
import com.InsurAi.Service.PolicyService;

@Service
public class AiService {

    @Autowired
    private GeminiClient geminiClient;

    @Autowired
    private AgentService agentService;       // required for SHOW_AGENTS
    
    @Autowired
    private PolicyService policyService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PolicyRepository policyRepository;
    
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private AvailabilityRepository availabilityRepository;

    public AiResponse processRequest(String message, String email) {

        String aiJson = geminiClient.generateResponse(message, email);
        System.out.println("AI RAW RESPONSE => " + aiJson);
        
        JSONObject parsed = new JSONObject(aiJson);
        String intent = parsed.optString("intent", "UNKNOWN");

        switch (intent) {
        case "SHOW_AGENT_SLOTS":
            String agentName = parsed.optString("agentName", "").trim();

            Optional<User> optionalAgent = userRepository.findByName(agentName);

            if (optionalAgent.isEmpty()) {
                return new AiResponse("No matching agent found for '" + agentName + "'. Please try another name.");
            }

            User agent = optionalAgent.get();


            LocalDate todays = LocalDate.now();
            List<Availability> slots = agentService.getAvailabilityForAgentAndDate(agent.getId(), todays);

            return new AiResponse("Here are " + agentName + "'s available time slots:", slots);

            case "SHOW_AGENTS":
                LocalDate today = LocalDate.now();
                List<User> availableAgents = agentService.getAvailableAgentsForDate(today);
                return new AiResponse("Here are the available agents for today:", availableAgents);
                




            case "SHOW_POLICIES":
                List<Policy> policies = policyService.getAllPolicies(); 
                return new AiResponse("Here are the available policies:", policies);

            case "BOOK_APPOINTMENT": {

                String policyName = parsed.optString("policyName", "").trim();
                String agentNamee = parsed.optString("agentName", "").trim();

                // STEP 1 — Ask for policy if missing
                if (policyName.isEmpty()) {
                    List<Policy> policiess = policyService.getAllPolicies();
                    return new AiResponse("Which policy would you like to book?", policiess);
                }

                Policy chosenPolicy = policyRepository.findByName(policyName)
                        .orElse(null);

                if (chosenPolicy == null) {
                    return new AiResponse("Policy not found. Please choose again.");
                }
                LocalDate todayee = LocalDate.now();
                // STEP 2 — Ask for agent name if missing
                if (agentNamee.isEmpty()) {
                    List<User> agents = agentService.getAvailableAgentsForDate(todayee);
                    return new AiResponse("Here are agents available for " + policyName + ". Please select one:", agents);
                }

                List<User> agentMatches = userRepository
                        .findByRoleAndNameContainingIgnoreCase(User.Role.AGENT, agentNamee);

                if (agentMatches.isEmpty()) {
                    return new AiResponse("No matching agent found. Try again or ask to show agents.");
                }

                User chosenAgent = agentMatches.get(0);

                // STEP 3 — fetch first available free slot

                List<Availability> freeSlots = agentService.getAvailabilityForAgentAndDate(chosenAgent.getId(), todayee);;

                if (freeSlots.isEmpty()) {
                    return new AiResponse("No available time slots today for " + chosenAgent.getName() + ".");
                }

                Availability selectedSlot = freeSlots.get(0); // pick first free slot automatically

                // STEP 4 — book appointment in DB
                User client = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                Appointment appointment = appointmentService.bookAppointment(
                        client,
                        chosenAgent,
                        selectedSlot.getDate(),
                        selectedSlot.getStartTime(),
                        chosenPolicy.getName()
                );

                // STEP 5 — update availability to booked
                selectedSlot.setBooked(true);
                availabilityRepository.save(selectedSlot);


                return new AiResponse(
                        "Appointment booked with " + chosenAgent.getName() +
                                " at " + selectedSlot.getStartTime() +
                                " for the policy " + chosenPolicy.getName()
                );
            }



            default:
                return new AiResponse(parsed.optString("responseText", "Sorry, I didn't understand that."));
        }
    }
}
