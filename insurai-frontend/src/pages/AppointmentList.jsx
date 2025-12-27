export default function AppointmentList({ appointments }) {
    if (!appointments || appointments.length === 0)
      return <p>No upcoming appointments</p>;
  
    return (
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            {appt.date} at {appt.time} with {appt.user.name} ({appt.user.email})
          </li>
        ))}
      </ul>
    );
  }
  