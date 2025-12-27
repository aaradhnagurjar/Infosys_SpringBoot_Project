const Services = () => {
  const services = [
    {
      icon: "🚗",
      title: "Auto Insurance",
      description:
        "Comprehensive coverage for your vehicle with competitive rates and instant quotes.",
      features: [
        "Collision Coverage",
        "Comprehensive Coverage",
        "24/7 Roadside Assistance",
        "Rental Car Coverage",
      ],
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "🏠",
      title: "Home Insurance",
      description:
        "Protect your home and belongings with our comprehensive homeowners insurance.",
      features: [
        "Property Protection",
        "Personal Belongings",
        "Liability Coverage",
        "Emergency Repairs",
      ],
      color: "from-green-500 to-green-600",
    },
    {
      icon: "🏥",
      title: "Health Insurance",
      description:
        "Quality healthcare coverage that fits your needs and budget.",
      features: [
        "Doctor Visits",
        "Prescription Drugs",
        "Emergency Care",
        "Preventive Services",
      ],
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: "💼",
      title: "Business Insurance",
      description:
        "Comprehensive business protection for companies of all sizes.",
      features: [
        "General Liability",
        "Property Coverage",
        "Workers Compensation",
        "Cyber Security",
      ],
      color: "from-orange-500 to-orange-600",
    },
    {
      icon: "✈️",
      title: "Travel Insurance",
      description:
        "Stay protected during your travels with our comprehensive travel coverage.",
      features: [
        "Trip Cancellation",
        "Medical Emergency",
        "Lost Luggage",
        "24/7 Support",
      ],
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: "👥",
      title: "Life Insurance",
      description:
        "Secure your family's financial future with our life insurance policies.",
      features: [
        "Term Life",
        "Whole Life",
        "Flexible Premiums",
        "Family Protection",
      ],
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const process = [
    {
      step: "1",
      title: "Get Quote",
      description:
        "Answer a few simple questions to get an instant, personalized quote.",
      icon: "📝",
    },
    {
      step: "2",
      title: "Compare Plans",
      description:
        "Review different coverage options and choose what works best for you.",
      icon: "⚖️",
    },
    {
      step: "3",
      title: "Purchase Policy",
      description:
        "Complete your purchase securely online in just a few minutes.",
      icon: "💳",
    },
    {
      step: "4",
      title: "Stay Protected",
      description:
        "Manage your policy, file claims, and get support through our platform.",
      icon: "🛡️",
    },
  ];

  return (
    <div className="min-h-screen py-12">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Comprehensive insurance solutions powered by AI to protect what
            matters most to you.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <div
                  className={`bg-gradient-to-r ${service.color} p-6 text-white`}
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold">{service.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="mt-6 w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300">
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="px-4 sm:px-6 lg:px-8 bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Getting insured has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">
                      {step.step}
                    </span>
                  </div>
                  <div className="text-4xl">{step.icon}</div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform translate-x-8"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Protected?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who trust InsurAi for their
            insurance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Get Your Quote
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
              Speak with Agent
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
